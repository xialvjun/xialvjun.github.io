<!-- # 类型, 依赖与解耦 -->
# 依赖, 解耦与类型

依赖
业务依赖
库与代码包依赖
代码依赖


多余的依赖的实例就有 滴禹微前端 里把城市绑定在子应用上, 而不是直接绑定在页面上, 导致同一个子应用的所有页面都偶合起来了, 共用一个城市设定
不讲这个例子, 可以转换下, 讲 应用放在机器上, 再对机器设置权限啥的...


类型的变化最容易导致大变, 离职证明需要 人物, 公司, 时间, 这就是接口(字段少), 但如果还要加字段, 那就一大堆认得离职证明要重新开了, 说不定有的公司离职证明是系统自动开的, 系统开离职证明没做幂等, 导致不能二次开离职证明, 都是问题

<!-- 一个管理系统,
一开始只有一个用户, 知道这个用户名密码的人就可以登录进行操作.
后来为了记下操作记录, 变成多个用户.
再之后给用户加权限, 这个用户能做什么, 那个用户能做什么.
再再之后设置用户权限太繁琐, 就添加了角色, 用户与角色多对多(也有多对一), 角色与功能多对多.
此时就形成了 RBAC(role based access control).
那这个 RBAC 形成的过程中, 哪些算解耦哦?
一开始只有一个用户, 用户名密码直接写死在代码里, 这就把用户与代码耦合起来了.
变成多用户, 把用户名密码存到数据库的用户表里了, 此时新增一个用户, 修改用户的密码, 都不需要修改代码, 不需要重新部署, 重启服务器, 这算解耦. -->



贫血接口与充血接口

https://zhuanlan.zhihu.com/p/112991455
里氏替换原则
https://www.zhihu.com/question/437583966

鸭子类型

https://zhuanlan.zhihu.com/p/109334326


https://www.zhihu.com/question/20086718/answer/117656234
