# react 状态管理

很早以前，在网上 `render-props` 的概念还没有广泛传播，自己也没有了解到的时候，写了篇文章，[react 组件的可扩展性设计](http://xialvjun.github.io/2017/08/25/extensible-react-components/)，之后不久才知道自己的“高级逻辑扩展组件”被称为 `render-props`.

然后，前不久 react v16.3.2 推出的 `new context api` 把 `render-props` 的概念推广到一个高峰。之后又了解到 [jamiebuilds/unstated](https://github.com/jamiebuilds/unstated) [diegohaz/constate](https://github.com/diegohaz/constate) 这些库。

> 有了这些，如果不需要时间回溯，也不追求单 store 结构，基本就可以换掉 redux 了。

不过自己还是对 `react context api` 和上面的两个库的 api 感到不爽。于是自己撸了个 [xialvjun/create-react-context](https://github.com/xialvjun/create-react-context)。

之后开始担心 `render props callback hell` 问题，找到 [pedronauck/react-adopt](https://github.com/pedronauck/react-adopt)。

这里发现了 [renatorib/react-powerplug](https://github.com/renatorib/react-powerplug)，惊为天人。

然后，我开始思考 react 的状态。

state，props，context，store+hoc，state+render_props，store+render_props

> context api 其实它本身不存储状态，仅仅相当于生成了个随机字符串 random_context_name，然后 Provider 里 getChildContext = () => ({ [random_context_name]: this.props.value }), Consumer 里直接 this.context[random_context_name]。它本身不存储状态，状态都放在 React 组件里的概念似乎挺不错，但其实使用起来还是很麻烦。然后

random_context_name
