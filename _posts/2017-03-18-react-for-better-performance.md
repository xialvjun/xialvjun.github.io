---
layout: post
title: React 性能优化
---

先说结论，React 性能优化，重点在于： shouldComponentUpdate。

OK，现在先不管结论，让我们从根本原理上分析一下：

我们知道 React 是基于 VDOM 的，最小更新单位是 Component 的视图框架。

VDOM 意味着它在更新视图时，需要经历 `生成 VDOM -> diff VDOM -> update 真实 DOM 元素` 这三个步骤。

最小更新单位是 Component 是指 它只能是整个 Component 更新，而不能是 Component 内的某个元素单位更新。
换句话说，只要 Component 的 state 发生改变，那就是整个 Component 重新渲染，而不仅仅是需要使用到发生改变部位的 state 的元素会重新渲染。

> 这里我只说了 state ，没说 props ，逻辑很简单， props 是父组件传给你的，你的 props 改变了，不正是父组件重新渲染了吗。。。当然，这里暂时不考虑高阶组件，高阶组件仅仅是一些帮助工具。

想明白了这两者，其实，优化思路就出来了。

1. 减少 state 变更次数；
2. 把 component 拆得更小，让它们拥有更多的自己的 state ，从而在需要视图变化时，只是更改需要更改的 state ，让需要重新渲染的 Componnet 变小变少，自然，需要 重新生成和 diff 的 VDOM 也会更小更少；
3. 使用 shouldComponentUpdate 截断不该有的重新渲染；

方式一，可能有的人笑了，“不能变更 state 了，那我怎么改界面”。。。。。。直接修改真实 DOM 啊。的确，在 React 里修改真实 DOM 并不是一个好模式。
但是，如果有这样一个元素，它绑定了 ontouchmove 此类的事件，每秒会触发事件几十次，难道你要每秒重新渲染整个组件几十次？
就算你使用了 debounce/throttle ，那的确能提升性能，但它也会改变你想要的效果。。。
如果，这个事件仅仅只是改变一下元素的样式，并不会影响到 html 结构，那为什么不能直接修改真实 DOM 元素呢，而且性能更快。

方式二，整个页面就是一个 Component，所有的状态都在这一个 Component 里维护，以前的我，还有项目赶得紧的时候，我就喜欢这么干。方便啊，状态全都在一块了，可以很简单的使用这些状态进行各种组合，不是吗？
可是，如果页面里有个时钟呢？然后你把时钟的状态放在页面组件里，一秒、两秒、三秒、四秒。。。告诉我，你要每秒都重新渲染整个整个页面吗？

我们可以单独把时钟给分离出一个组件出来，它的状态在这个分离出来的小的组件内部。那么，就算它每秒都更新一次，那也仅仅是更新这个小的时钟组件，生成小的 VDOM，diff 小的 VDOM，update 小块的 HTML 元素。这种性能消耗完全可以忍受。其实，方式一的 ontouchmove 的例子，用分离小组件的方式也是一种方案。

方式三，这是 React 专门为优化而生的一个函数，可以用它来比较前后 props/state ，返回 bool 决定是否重新渲染。甚至还提供了个 PureComponent 来提供类似的功能（PureComponent 相当于帮我们写了 shouldComponentUpdate 并在里面做了层浅比较）。

> 这里有点需要注意的是，react 存储 previousProps/previousState 都只是存的引用，而并非深拷贝，所以，如果是通过直接修改，而并非是更换引用的方式（ new_ref = Object.assign({}, old_ref, some_modify) 或 new_ref = {...old_ref, some_modify}）或使用 Immutable.js，则 PureComponent 会导致组件不更新。例如，下面这个例子中，无论怎么点击 modify state 按钮，都只显示 1。

```scala
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {abc:{n:1}};
  }
  render() {
    return (
      <div>
        <Sub abc={this.state.abc}></Sub>
        <button onClick={e=>{
          this.state.abc.n+=1;
          console.log(this.state.abc);
          this.forceUpdate();
        }}>modify state</button>
      </div>
    );
  }
}

class Sub extends PureComponent {
  render() {
    return <div>{this.props.abc.n}</div>
  }
}
```

然后结合我们常用的跟 react 搭配的 redux 说说。

其实在我们使用 react-redux 时，官方文档有讲解两个概念：容器组件和展示组件。然后大家可能在很多博客里看到这样的说明：尽量在上层使用容器组件，然后从容器组件中获取数据，传给展示组件，不要到处使用 connect 函数。。。

这种说法是有道理的，但仅仅是在代码复用层面。展示组件本身的 propTypes 是固定的，可以尽情拿到别的项目里用。。。但如果是在性能层面，仔细想想会发现这种说法是完全错误的。

```scala
@connect(...)
class Container extends Component {
  render() {
    return (
      <div>
        <Presenter1 props={...} />
        <Presenter2 props={...} />
        <Presenter3 props={...} />
      </div>
    )
  }
}
```

我们要知道 react-redux 的原理。它是在 redux store 发生更新时，通知所有的 connect 组件即容器组件刷新。。。当然，容器组件刷新也意味着容器组件内部的展示组件刷新，所以单纯的把容器组件与展示组件区分开是没有意义的。。。重要的是，如何阻止不该刷新的组件刷新。自然是 shouldComponentUpdate。。。用 shouldComponentUpdate 我们一般不会进行深度比较。

试想下，如果仅仅只是 Presenter1 需要的数据改变了，但因为 connect 函数是在 Container 上的，所以 redux store 仅仅能通知 Container 去 rerender。。。然后 Presenter2 Presenter3 都要 rerender 一次，这不是浪费性能吗？ 

所以， shouldComponentUpdate 来了。

但是，如果我们的 shouldComponentUpdate 仅仅只是做了一层浅比较，就跟 PureComponent 一样，其实在上面的场景中是很容易起不到作用的。只要 Container 的 render 函数中，对从 store 中 select 得到的 props 做了变换，因为 map/filter 之类的变换都是产生新对象，所以仅仅一层浅比较只能得到每次都发现有改变，虽然事实上的内容并没有改变。。。

如果我们换种思路，不再使用容器组件的概念，具体哪个组件需要展示 store 内的哪些数据，就 connect 这个组件，那么，只要 select 函数不进行变换，而是在组件的 render 函数内对 store 的数据进行变换，那么简单的一层浅比较的 shouldComponentUpdate 也能有效的拦截无用渲染。。。

好吧，我承认，两个例子区别并不在是否有容器组件，而在于变换发生的位置：在组件的外部，那单纯的 PureComponent 似的 shouldComponentUpdate 就无法起作用；在组件内部那就相当 OK 啦。。。

其实也有另一种方法：变换一次之后，保留缓存，只要从 store 里取的东西本身不变，那变换出来的东西也一定不变。也就是说，我们只要简单的在 connect 函数里做些手脚就可以达到目的。

[reactjs/reselect](https://github.com/reactjs/reselect) 库可以简单实现这功能。虽然不是用它也可以简单实现缓存。

这样看来的话，可能还是第二个例子，不使用容器组件，哪里需要哪里 connect 可能来得代码更清晰些。也就是说，方式三 与 方式二 结合起来可能更好。
