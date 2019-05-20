# 让 TypeScript 开发后端服务更"有型"

## TL;DR
- 用 [schemats](https://github.com/SweetIQ/schemats) 根据数据库表结构生成 ts 类型文件;
- 用 [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin) 直接在代码中写 sql 语句, 并且直连数据库, 用 explain 检测 sql 语句正确性;
- 用 [skm_ts](https://github.com/xialvjun/skm_ts) 根据 graphql 的 schema.gql 生成参数的 ts 类型文件;
> 没错, 我是在推我的两个库.

## 正文

开发后端服务, 在我看来, 主要有 4 点:

1. **数据结构**: 梳理业务逻辑, 提炼数据结构. 即数据库 DDL.
2. **事务脚本**: CRUD-first design is a “Transaction Script” approach(引用自 [1]). 通常来说是 model, 但只要你实在的理解这概念, 就能知道它只是一系列的函数, 每个函数完整的完成一个数据库事务.
3. **具体 API**: 往往一个事务脚本对应一个修改 api, 然后加上客户端需要的各种查询 api. 对于 graphql 而言, 就 mutation, query; restful 相对而言要复杂不少, 是 get, post, put, delete 等.
4. **(extra)各种定时或触发型的任务**: 定时关闭过期订单, 定时生成内容推荐 等, 可以做进后端系统中, 也可以做到系统外部.

然后, 实际开发中, 可以 *自底向上*(先设计数据结构, 后开发 API), 也有 *自上向下*(先设计 API, 后开发实现). 一般其实是双向进行; 另外, 实际业务也可能经常发生变动, 于是在这个过程中, 如果用 javascript 开发后端, 没有编译期校验, 非常容易出现增删字段, 或者改字段名时, 别的地方的代码忘记同步更改, 最终系统 bug 多多. 此时, 我们需要 TypeScript.

但是, 只有 TypeScript 是不够的. 维护那些类型, 使之始终匹配 **时常发生变化的数据结构和 API 接口** 会随着项目的进行, 变得越来越困难. 常常会在部署后发现 bug, 一查才发现是有个地方仍然用的以前的字段名, 当初改的时候没改全.

如果有工具能帮我们自动生成类型, 那 typescript 就能在编译阶段帮我们发现更多的错误. 于是, 我们有:
- [schemats](https://github.com/SweetIQ/schemats) 根据数据库表结构生成 ts 类型文件;
- [skm_ts](https://github.com/xialvjun/skm_ts) 根据 graphql 的 schema.gql 生成参数的 ts 类型文件;

--------

数据库是系统外部的东西, 接口也是系统对外的一面, 把这两个系统与外部的桥梁类型化, 剩下的只要系统内部类型不出错, 那大部分的 bug 都将在系统编译阶段被发现, 系统将变得非常健壮.

例如 schemats 帮我们根据生成了数据库表结构对应的 ts 类型, 如果我们再能根据此类型写出某些 typesafe sql builder 需要的对象, 再用那些对象做 sql 查询, 那基本可以保证自己的 sql 语句至少语法上是正确的, 不会有表名写错了, 字段名忘改了的情况出现.
> 至于那些并不 typesafe 的 sql builder, 例如 [knex](https://knexjs.org), [sqorn](https://github.com/sqorn/sqorn) 则可能会出现表名写错, 字段名忘改的情况, 但它们仍然是非常实用的库.

不过目前还没找到足够好的 typesafe sql builder, 有几个大家可以自己评估下: [type-sql](https://github.com/ggmod/type-sql), [@hediet/typed-sql](https://github.com/hediet/ts-typed-sql), [sqlizer 概念评估](https://github.com/jtheisen/sqlizer)

但其实我们可以有更简单, 更方便的方式----TypeScript Server Language Service Plugin----[ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin). 

**这个 plugin 能在我们编辑代码的阶段, 将我们代码中 sql 的参数替换为模拟参数 `null`, 生成完整的 sql 语句, 直接连接数据库 `explain` 此 sql, 以此判断 sql 语句是否有误**. 另外, 代码提示在理论上也是可以做的, 不过暂时由于个人时间精力的原因没做, 毕竟它要解决的一个最主要的问题是**放心问题**.

该 plugin 还提供了一个小工具, 可以帮助我们直接在代码里用 es6 模板字符串编写 sql 语句, 不用担心 sql 注入, 与此类似的库有好些个([slonik](https://github.com/gajus/slonik), [squid](https://github.com/andywer/squid)).

这种直接写 sql 语句的方式有最大的灵活性. 与此相比:
- orm 灵活性最差, 需要手动维护那些 model, 也就是说可能存在数据库表结构变了, 但 model 忘改的情况
- sql builder 灵活性较好, 一般也满足使用, 但遇到一些高级 sql 用法, 多少还是有些限制, 例如 窗口函数. 而且表结构变但代码没变的情况也有可能发生, 除非使用 [schemats](https://github.com/SweetIQ/schemats) + typesafe sql builder, 但目前没找到好的. 不过 sql builder 能有代码提示, 而在模板字符串中写 sql 就没有代码提示了.
- 模板字符串写 sql, 灵活性最高, 加上 [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin) 也足够安全. 但目前没有代码提示, 虽然理论上可以有.

## 总结
其实 TL;DR 就是总结. 我们使用 [schemats](https://github.com/SweetIQ/schemats) + [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin) + [skm_ts](https://github.com/xialvjun/skm_ts), 从数据结构, 到 SQL, 再到输出 API 接口, 整套流程都已经类型化, 能够在编译期校验, 如此, 我们就敢于放心大胆的重构, 迭代项目, 最终实现敏捷开发.


[1]: https://khalilstemmler.com/articles/typescript-domain-driven-design/ddd-vs-crud-design/
