# 应用状态的存储形式

这里，我把应用状态（主要是前端应用状态）的存储形式从两个维度来探讨：持久化、push or pull。于是得到四种存储形式：

1. 非持久的pull状态：
    内存里的普通 Object;
2. 非持久的push状态：
    内存里的 redux store, rxjs Observable, mobx 之类的东西;
3. 可持久的pull状态：
    cookie、通常来说的 localStorage/indexDB/websql/sessionStorage;
4. 可持久的push状态：
    location(路由)、监听了事件的各种 storage(甚至基于之上制作的各种 Observable DB. rxdb: https://github.com/pubkey/rxdb, ReactiveDB: https://github.com/teambition/ReactiveDB, 用于 Java/Swift/Nodejs 的 Realm)

这里有几个状态的存储形式比较特殊：
1. cookie 自带过时机制;
2. location 易丢失，但可以被轻松分享;
