---
layout: post
title: GraphQL schema 设计
---

> 阅读本文需要对 GraphQL 有个简单了解，虽然 GraphQL 目前用的和真正理解的人大概也不多，不过这里只需要简单了解就够。

> 另外 [官网](http://graphql.org/) 和 [Apollo](http://dev.apollodata.com/) 有完善的教程，跟着一步步做，完全能够掌握。一般来说，明白了 [dataloader](https://github.com/facebook/dataloader) 这种东西，就能明白 GraphQL 后端实现其实也没多少难度。


我们初次了解到 GraphQL 应该都会被它的概念惊艳到吧：以图的形式表现数据间的关系，由客户端来决定返回的数据的结构。简直就是完美的接口形式了好吗？然后我们需要设计数据图，就是它需要的 schema。

大部分人的直觉应该就是*数据库的数据结构不正是 GraphQL 需要的 schema 吗*。

的确，这么想也没错，但是大家有没有考虑到权限的问题？

假如有个两个表：

persons表：

|id|name|age|sex|money|
|:-|:---|:--|:---|---:|
|1|张三|25|男|299|
|2|李四|25|男|123|
|3|王五|25|男|369|
|4|赵六|25|男|478|

friends表：

|person_id|friend_id|
|:--------|--------:|
|1|2|
|1|4|
|2|1|
|2|3|
|3|2|
|4|1|

那么，对应的 schema 设计成这样可不可以呢？

```gql
type Person {
  id: ID!
  name: String!
  age: Int!
  sex: String!
  money: Float!
  friends: [Person!]!
}
```

要说可以，当然也可以。但是需要注意的是，`money`这个字段相对来说比较敏感，一般来说，都只能是用户自己才可以知道自己钱包里有多少钱，但是自己可不可以知道自己朋友的钱包里有多少钱呢；另外，`friends`字段，自己是可以知道自己有多少个朋友和朋友的一些简单信息，但是，自己能知道朋友的朋友吗，这都是要看具体业务逻辑的。<span style="color:rgba(0,0,0,0);">啊，没有 friends 看我要死了。。。</span>

如果上面两个问题的答案是*否*，那我们就需要做一些事情来避免客户端越权了。比如，在`money friends`的`resolve`方法里做判定，判断发起这个请求的用户与当前访问的资源的所属关系，然后决定是返回空值（0 或空数组），还是`null/undefined`（取决于 schema 是否允许），又或是直接 `throw new Error`来打断所有的返回。

但其实，我们可以有另一种方法：

```gql
type Friend {
  id: ID!
  name: String!
  age: Int!
  sex: String!
}

type Person {
  id: ID!
  name: String!
  age: Int!
  sex: String!
  money: Float!
  friends: [Friend!]!
}
```

如果我们把 schema 设计成这样一种形式，把权限的概念加进 schema 中，这样会不会更好？

其实两种方式各有各的优劣：

第一种方式，在`resolve`里解决一切，糙快猛，但是，在大型项目，多人协作，程序员能力相差较大时，有的人写的 `resolve` 方法可能就没考虑到权限的问题，或者考虑的不够全面；

第二种方式其实是做了更多的工作，本来一个类搞定的事变成两个类。但是把权限上升到类型级别，会更安全。在大型项目时，由项目主导者负责编写 `gql`，其他程序员实现`resolve`方法就要简单多了。


上面是 GraphQL 的 schema 设计中需要注意到的权限问题。另外，我们还有个问题需要注意：

到底该把查询放在哪里？

还是上面的 `Person-Friends` 的例子，我们可以通过 `Person` 得到 `friends`:

```gql
type Query {
  person(id: ID!): Person!
}
```

    事实上，上面那种显然是不行的。如果可以直接通过 id 获得一个人的所有信息，那还要权限干什么。所以可以：

    ```gql
    type Query {
      # 这里不需要客户端传 id，只需要服务端验证客户端的 cookie 或 token
      me: Person!
    }
    ```

    有更大权限的类型显然是不能够轻易暴露的。

但是，通过获取`Person`的形式去获取`friends`的话，不就浪费了一次数据库查询吗？我们需要先查询有这个 id 或 cookie 或 token 的 Person，尽管我们只需要这个 Person 的 id 字段，然后通过这个 id 字段获取他的 friends。

> 好吧，可能有人会说这并没有浪费查询，因为更安全的做法本就应该先检查一遍客户端要查询的*某个人的朋友*中的*某个人*是存在的。不过这里并不讨论这种问题，各自有各自的看法。

如果我们觉得那的确是浪费了一次数据库查询，那我们要怎么办呢？很简单：

```gql
type Query {
  me: Person
  # of 是一个 person_id
  friends(of: ID!): [Friend!]!
}
```

就是这样，把 GraphQL 当成一个 RPC 用就好了。

当然了，这里就又会产生权限问题，知道任何人的 id，就可以知道他的朋友的基本信息。

不过，因为这是一个 root_query，有非常明确的接口目的，实现 resolve 方法的人本就应该注意对应的权限问题。。。


敏锐的人可能注意到了`root_query`、`有非常明确的接口目的`、`把GraphQL当成一个RPC`。其实，如果限制`gql`的类型不能循环引用，那`GraphQL`又跟一个实现了`projection`的`RPC`又有多大区别呢？。。。嗯，还有一个字段级别的参数。。。

还有，*root_query 是有非常明确的接口目的*的，而普通的类型的`resolve`方法，你是很难判断出客户端是基于哪种需求要获取这个数据的。这也是`resolve`方法来判断权限的难点所在。


这篇文章写到这里其实没有解决任何问题。是用`GraphQL`类型系统去解决权限问题，还是直接在`resolve`方法里判断权限，我没有答案；`root_query`是不是越多越好，还是尽量少些，我也没有答案。。。

这篇文章仅仅是告诉大家在设计`GraphQL`的`schema`时，需要注意的地方罢了。。。

----------------

## 2018-01-04

上面的文章有问到：是糙快猛地在 resolver 里解决一切权限问题，还是基于权限衍生出更复杂的类型？现在想想，还是糙快猛好。。。而且我们完全可以写一些判断权限的装饰器，去包裹那些 resolver，整个编程体验会变得相当舒爽。
