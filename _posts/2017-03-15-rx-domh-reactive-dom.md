---
layout: post
title: 响应式 DOM
---

其实很久以前就看到过 [Binding.scala](https://github.com/ThoughtWorksInc/Binding.scala)，当时虽然自己也有学过 scala，但是因为自己已经会了 React，觉得 React 生态十分好，Binding.scala 想打败它几乎是一件不可能的事情，尤其 scala 还是非常难的一门语言，虽然 Binding.scala 并不要求完全掌握整个的 scala。但最终还是没有深入去看。

之后自己想了解 [rxjs](https://github.com/ReactiveX/rxjs)，受群友的推荐，可以先学学 [flyd](https://github.com/paldepind/flyd)，更简单易用。然后学会使用它，也在 github 搜索它时发现了 [react-flyd](https://github.com/theadam/react-flyd)。。。。

然后，我立即就被它的使用方式吸引了。。。

> 其实我并不在乎一个库是否保持更新，如果它完善的完成了它的功能，api 也足够好的话，不更新也没关系。呵，这有点类似当初 Go 语言没有包管理的哲学。

看下它的使用方式：

```scala
/** @jsx h */
import { render } from 'react-dom';
import { h } from 'react-flyd';
import { stream, scan, merge} from 'flyd';


function Counter() {
  const plus$ = stream();
  const minus$ = stream();

  const action$ = merge(
    plus$.map(() => 1),
    minus$.map(() => -1)
  );

  const count$ = scan((x, y) => x + y, 0, action$);

  return (
    <div>
      <div>
        <button id="plus" onClick={ stream(plus$) }>+</button>
        <button id="minus" onClick={ stream(minus$) }>-</button>
      </div>
      <div>
        Count: { count$ }
      </div>
    </div>
  );
}

render(<Counter />, document.getElementById('root'));
```

`plus$ 和 minus$` 其实都没必要看，无非就是把 click 事件转为响应的 stream。。。。

重点是 `count$`。我们可以看到 `count$` 是一个 `stream<number>` ，它竟然可以直接作为 jsx 的 children 部分，然后在渲染完后会发现 `count$` 的内容被包裹在一个 span 标签内。。。

其实看到这里，就很容易明白 react-flyd 到底做了什么。它 hack 进 jsx 的 h 语法，然后查看 children 里的元素，如果 children 里的 child 是一个 stream，就特殊处理它。

比如创建一个 reactive component，在 didMount 的时候 subscribe 这个 stream，在 willUnmount 时就 unsubscribe。。。。

非常简单，但行之有效的逻辑。这种逻辑给我们带来了 ---- **最小化更新单位**。

最小化更新单位出来了，那性能优化的极致就出现了。。。至少它带来了可能。

当然，`react-flyd` 也有许多逻辑不够正确，例如擅自给 count$ 加了个 span 包裹，会影响 DOM 结构，不过它这擅自给 count$ 加个 span 倒是让我有了点启发。。。

我不满它加了 span 包裹，于是自己 fork 了一份，修改的过程中发现了两种概念： self control component 和 parent control component...

因为 react 组件 render 方法只能返回 vnode/null，不得返回 string/number，于是，如果想不加 span 包裹的话，就必须得把 count$ 的父元素作为 reactive component。count$ 有新值时，得它的父元素，整个 div 都得刷新，这就是 parent control component。。。

如果一个 stream 的值是 vnode 的话，则可以作为 self control component，stream 有新值时，只刷新自己。

另外，它还有 bug 是 flyd 并非 lazy observable，它的这种使用，容易造成内存泄漏，具体情况这里不详说。

回到**最小化更新单位**，其实，如果我们再仔细想一下的话，这里的“最小化更新单位”真的可以就是单个 html 元素，而不是单个 react component，整个应用完全可以不需要一个 react component 就可以。

可以把上面的写成下面这样都是可以的。

```scala
var counter = (
  <div>
    <div>
      <button id="plus" onClick={ stream(plus$) }>+</button>
      <button id="minus" onClick={ stream(minus$) }>-</button>
    </div>
    <div>
      Count: { count$ }
    </div>
  </div>
)

render(counter, document.getElementById('root'));
```

然后，我们能不能再激进一点点呢？既然`“最小化更新单位”真的可以就是单个 html 元素`，那，我们能不能就真的让 stream 在有新值的时候直接修改真实 DOM，而不是创建 VDOM，然后 diff，然后修改呢。。。

当然可以。

[rx-domh](https://github.com/xialvjun/rx-domh)

