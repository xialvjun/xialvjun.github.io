# 用 TypeScript 开发后端服务

## TL;DR
用 [schemats](https://github.com/SweetIQ/schemats) + [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin) + [skm_ts](https://github.com/xialvjun/skm_ts) + graphql 开发后端服务.

用 typescript 开发后端的益处不用说, 但是手动维护 数据结构 或者 接口参数 类型太麻烦了... 需要有工具自动根据表结构 和 schema.gql 定义的接口 生成类型 ts 文件.
另外 orm 不灵活, 而且需要与数据库表结构匹配, 手动维护起来麻烦, 又因为 orm 不只是类型, 所以也没法自动维护...麻烦. sql-builder 倒是挺灵活, 但大部分都是用字符串表示 表名字段名, 也没看到真正可用的 typesafe-sql-builder, 所以需要手动维护那些字符串表名字段名...麻烦. 需要一个工具能让我们既灵活, 又安全的操作数据库, 可以是一个 typesafe-sql-builder, 但没找到好的, 所以, 直接用 [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin) 直接在代码中写 sql 语句, 并且边编辑边直接在数据库上用 explain 检测 sql 语句正确性, 不用怕 表名字段名 错误了.

## 正文

开发后端服务, 在我看来, 主要有 4 点:

1. **数据结构**: 梳理业务逻辑, 提炼数据结构. 即数据库 DDL.
2. **事务脚本**: CRUD-first design is a “Transaction Script” approach(引用自 [1]). 通常来说是 model, 但只要你实在的理解这概念, 就能知道它只是一系列的函数, 每个函数完整的完成一个数据库事务.
3. **具体 API**: 往往一个事务脚本对应一个修改 api, 然后加上客户端需要的各种查询 api. 对于 graphql 而言, 就 mutation, query; restful 相对而言要复杂不少, 是 get, post, put, delete 等.
4. **(extra)各种定时或触发型的任务**: 定时关闭过期订单, 定时生成内容推荐 等, 可以做进后端系统中, 也可以做到系统外部.

然后, 实际开发中, 可以 *自底向上*(先设计数据结构, 后开发 API), 也有 *自上向下*(先设计 API, 后开发实现). 一般其实是双向进行; 另外, 实际业务也可能经常发生变动, 于是在这个过程中, 如果用 javascript 开发后端, 没有编译期校验, 非常容易出现增删字段, 或者改字段名时, 别的地方的代码忘记同步更改, 最终系统 bug 多多. 此时, 我们需要 TypeScript.

## 累了, 不想写了... 感觉 TL;DR 就足够了.
就是有了 typescript 还不够, 手动维护那些类型使其与 数据结构 或者 接口参数 都太麻烦了...需要

[1]: https://khalilstemmler.com/articles/typescript-domain-driven-design/ddd-vs-crud-design/
