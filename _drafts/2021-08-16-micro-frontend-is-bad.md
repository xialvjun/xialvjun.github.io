# 微前端是技术负债吗？ in zhihu

抱歉，我知道提问不应该这么提，提问不应该带有自己的主观判断。但是我就是想表达一下自己的观点，同时也了解一下大家的观点。

在我看来，微前端就是技术负债。它的确有一些可能看得见的优点：

- 拆分应用，加速加载；
- 不同子应用使用不同的技术栈，从而整体项目可以渐进式迁移技术栈；
- 子应用有单独的 git 仓库，方便管理；
- 子应用隔离，单独上线，回归测试无需测试整个系统；

但是这些优点真的是优点吗？它真的存在吗？别的方式就没有这些优点吗？不见得。

- **拆分应用，加速加载**：这都是 延迟加载(lazyload) 的事儿，而现在 lazyload 早就是一个成熟的技术了，基本上所有的打包器都支持，通常都是基于路由的 lazyload，其实就是基于状态的组件层级的 lazyload，相比于微前端的子应用层级的 lazyload，粒度更细，使用更简单；
- **灵活的技术栈**：微前端能多技术栈共存，我不用微前端难道就不能多技术栈共存吗，我一个 react 项目里就不能有某一块儿使用 vue 去写吗，完全可以；
- **单独 git 仓库**：这让 git 仓库数量变多，真的方便管理，而不是让管理更麻烦？
- **子应用隔离**：子应用操作的并非真正的 window 对象，而是一个 window 对象的代理，对这个代理做的修改，其他子应用都不可见。可是我们为什么要修改 window 对象呢？定义全局对象？前端模块化 12 年就开始了吧，到现在快 10 年了。尽管现在网络上还有大量页面都并没有前端模块化，但能想到用 微前端 的公司基本上也没有什么页面不是前端模块化的吧，那还修改什么 window 对象啊，直接在模块里定义一个顶级变量不就是了吗。

许多采用微前端的，都说什么旧项目不好改。把旧项目改一下，把它变成新项目的一个组件，工作量真的很大吗？依我看，只要这个旧项目未来还会被要求修改需求两次以上，那把它变成新项目的一个组件，让它直接使用新项目的打包部署流程，都是值得的。不然，微前端就是纯粹放任项目腐烂了。
