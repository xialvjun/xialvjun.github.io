# react 状态管理

很早以前，在网上 `render-props` 的概念还没有广泛传播，自己也没有了解到的时候，写了篇文章，[react 组件的可扩展性设计](http://xialvjun.github.io/2017/08/25/extensible-react-components/)，之后不久才知道自己的“高级逻辑扩展组件”被称为 `render-props`。

然后，前不久 react v16.3.2 推出的 `react new context api` 把 `render-props` 的概念推广到一个高峰。之后又了解到 [jamiebuilds/unstated](https://github.com/jamiebuilds/unstated) [diegohaz/constate](https://github.com/diegohaz/constate) 这些库。

> 其实这时候有了这些，如果我们不需要时间回溯，也不追求单 store 结构，基本就可以换掉 redux 了。

不过自己还是对 `react new context api` 和上面的两个库的 api 感到不爽（其实是这个时候我还没理解到 `react new context api` 的真正目的），觉得没必要非要加个 `Provider` 的概念（其实 `Provider` 的概念是有必要的），于是自己撸了个 [xialvjun/create-react-context](https://github.com/xialvjun/create-react-context)。

> **`react new context api`**: 其实它本身不存储状态，仅仅相当于生成了个全局唯一字符串 `random_context_name`，然后 `Provider` 里 `getChildContext = () => ({ [random_context_name]: this.props.value })`, Consumer 里直接 `this.context[random_context_name]`，从而避免 `react legacy context api` 命名冲突。  
> **`Provider` 模式是必要的**: 如果是纯客户端代码，`Provider` 模式的确是没必要的，使用我的 [xialvjun/create-react-context](https://github.com/xialvjun/create-react-context) v1 或 v2 都蛮方便得，但是如果还需要做 `Server Side Rendering` 的话，`Provider` 模式就有必要了，毕竟 `es module` 里的全局状态可是不支持并发的。

`render-props` 多了，就会担心 `render props callback hell` 的问题，找到个 [pedronauck/react-adopt](https://github.com/pedronauck/react-adopt)，另外，后面找到的一个库 [renatorib/react-powerplug](https://github.com/renatorib/react-powerplug) 也可以解决 `render props callback hell` 的问题。不过他们对于有些场景还是不大适用，例如动态数量的 `render-props`，于是自己又撸了个 [xialvjun/react-compose](https://github.com/xialvjun/react-compose)，不过一般来说，当项目需要动态数量的 `render-props` 的时候，大概率算是设计错误了。

之后发现了 [renatorib/react-powerplug](https://github.com/renatorib/react-powerplug)，惊为天人，直接改变了自己对 jsx 的认知，把对 `state` 的定义从 `class extends React.Component` 上，简化到直接在 jsx 上 `<State initial={{ count: 0 }}>{({ state, setState }) => null}</State>`，写一点 jsx 相比写一个 `Component` 对于程序员而言，成本要小太多了。

然后，我开始思考 react 的状态。

state，props，context，store+hoc，state+render_props，store+render_props



random_context_name
