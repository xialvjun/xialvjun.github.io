# react 状态管理

很早以前，在网上 `render-props` 的概念还没有广泛传播，自己也没有了解到的时候，写了篇文章，[react 组件的可扩展性设计](http://xialvjun.github.io/2017/08/25/extensible-react-components/)，之后不久才知道自己的“高级逻辑扩展组件”被称为 `render-props`。

然后，前不久 react v16.3.2 推出的 `react new context api` 把 `render-props` 的概念推广到一个高峰。之后又了解到 [jamiebuilds/unstated](https://github.com/jamiebuilds/unstated) [diegohaz/constate](https://github.com/diegohaz/constate) 这些库。

> 其实这时候有了这些，如果我们不需要时间回溯，也不追求单 store 结构，基本就可以换掉 redux 了。

不过自己还是对 `react new context api` 和上面的两个库的 api 感到不爽（其实是这个时候我还没理解到 `react new context api` 的真正目的），觉得没必要非要加个 `Provider` 的概念（其实 `Provider` 的概念是有必要的），于是自己撸了个 [xialvjun/create-react-context](https://github.com/xialvjun/create-react-context)。

> **`react new context api`**: 其实它本身不存储状态，仅仅相当于生成了个全局唯一字符串 `random_context_name`，然后 `Provider` 里 `getChildContext = () => ({ [random_context_name]: this.props.value })`, Consumer 里直接 `this.context[random_context_name]`，从而避免 `react legacy context api` 命名冲突。  
> **`Provider` 模式是必要的**: 如果是纯客户端代码，`Provider` 模式的确是没必要的，使用我的 [xialvjun/create-react-context](https://github.com/xialvjun/create-react-context) v1 或 v2 都蛮方便得，但是如果还需要做 `Server Side Rendering` 的话，`Provider` 模式就有必要了，毕竟 `es module` 里的全局状态可是不支持并发的。

`render-props` 多了，就会担心 `render props callback hell` 的问题，找到个 [pedronauck/react-adopt](https://github.com/pedronauck/react-adopt)，另外，后面找到的一个库 [renatorib/react-powerplug](https://github.com/renatorib/react-powerplug) 也可以解决 `render props callback hell` 的问题。不过他们对于有些场景还是不大适用，例如动态数量的 `render-props`，于是自己又撸了个 [xialvjun/react-compose](https://github.com/xialvjun/react-compose)，不过一般来说，当项目需要动态数量的 `render-props` 的时候，大概率算是设计错误了。

之后发现了 [renatorib/react-powerplug](https://github.com/renatorib/react-powerplug)，惊为天人，直接改变了自己对 jsx 的认知，把对 `state` 的定义从 `class extends React.Component` 上，简化到直接在 jsx 上 `<State initial={{ count: 0 }}>{({ state, setState }) => null}</State>`，写一点 jsx 相比写一个 `Component` 对于程序员而言，成本要小太多了。

然后， react 的状态形式有(这里把动作也当成状态的一种):

- **state**: 组件内部状态;
- **props**: 父组件传给子组件的状态;
- **context**: `legacy context api`，祖辈组件的内部状态，子组件通过声明，直接以虫洞的方式获取状态;
- **context + render_prop**: `new context api`，仍然是祖辈组件的内部状态，子组件通过 render_prop 的形式，以 IOC(控制反转) 的方式直接使用祖辈的状态;

- **redux + hoc**: 一个带有状态的 `event_emitter`，把状态以 hoc 的形式注入组件中;
- **state + render_prop**: `<State>{({state, setState}) => null}</State>` 子组件直接使用自己所在的闭包所在的组件内的状态，以 IOC 的方式;
- **redux + render_prop**: [react-redux/issues/950](https://github.com/reduxjs/react-redux/issues/950#issuecomment-402625342) 也许不久后就会带来 `Consumer` 形式的在 react 中操作 store 的方式;

上面这些 react 的状态使用形式当然可以互相结合使用。

不过，比较激进点的话，个人觉得基本上一个 `state + render_props` 就足够了:

```jsx
const APP = () => <State>
  {global_state => <div>
    <h1>header h1</h1>
    <State>
      {half_global_state => <div>
        <h2>{half_global_state.header_title}</h2>
        <State>
          {accross_component_state => <div>
            <!-- ComponentA 里想使用 global_state, 但又不能把 ComponentA 写成一个闭包，怎么办呢？ -->
            <ComponentA state={accross_component_state} />
            <ComponentB state={accross_component_state} />
          </div>}
        </State>
      </div>}
    </State>
    <State>
      {another_half_global_state => <div>
        <h2>{another_half_global_state.header_title}</h2>
        <div>some_other_content</div>
      </div>}
    </State>
  </div>}
</State>

ReactDOM.render(APP(), document.querySelector('#root'));
```

对于上面的 *ComponentA 里想使用 global_state, 但又不能把 ComponentA 写成一个闭包* ，请先思考下，**真的不能把 ComponentA 写成一个闭包吗？** 

一般是能的，至于觉得整个应用就是一个 `APP函数，函数里有许多闭包`，这样的一个函数太大了，不适于维护，甚至完全就是错误的，不符合软件工程的，那为什么大家对于状态就喜欢单一 store，对于 view 就不喜欢了呢？

好吧，不喜欢一个函数太大，那就不喜欢吧。所以，我们可以在编辑器层面直接有 `Extract to a SFC`，事实上，目前 vscode 上就有类似的功能了: 选择代码块，右键，重构。当然，这样说到底就是把 `global_state` 作为属性传给 `ComponentA` ，不过因为我们大量使用 `render_prop` ，所以大部分的属性传递都由闭包直接帮我们完成了，需要我们手动传递的层数其实已经很少了，完全能够接受。

如果还是不能接受这样传递，当然可以 `global.global_state = global_state`，然后在 `ComponentA` 中直接 `global.global_state.state` 和 `global.global_state.setState`，当然，这种操作不能用于 `SSR` 中。

---- 

当然，我们也没必要全都是 `state + render_prop`，其他的那些方法也都有各自适宜的场景。上面说了那么多，目的也仅仅是想说明：**我们一直以来可能都低估了 `render_prop` 的作用了。**
