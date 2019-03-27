GraphQL
服务端无 interface 的话，客户端就无法 fragment xxx on InterfaceName ... 客户端不写 fragment xxx on InterfaceName，照样可以写 fragment xxx on TypeName 甚至 inline 匿名 fragment...
hero {
  name
  ... on Human { height }
  ... on Droid { primary_function }
}
所以服务端完全不需要写什么 interface ，徒增 gql 文件复杂度

但其实 interface 根本就不是用在 fragment 上的，而是用在参数或返回值上的，就跟普通的编程语言一样，多态... 上面的 hero 就是返回一个 interface，可能返回 Human，也可能返回 Droid
另外 GraphQL 还有个 union type 有类似的作用 http://graphql.org/learn/schema/#union-types   但是，要服务端要实现字段返回值类型是 interface/union_type ，需要告诉服务端如何判断对象是什么类型 http://dev.apollodata.com/tools/graphql-tools/resolvers.html#Unions-and-interfaces


constructor 里改 state 无用，改 props 有效，而且改 props 会导致render 3 次，didMount 时已经 render 2次  ，cwrp 里改 props，改 state 都可以，但是要注意改 props 会引起 cwrp 二次运行。。。另外，也会 render 两次。。但是 DOM 只变一次。。。
也就是说，如果 cwrp 里改 props，导致再次运行 cwrp 改 props 并中间同步快速递归，则 cwrp 和 render 都会快速运行。。。但是 DOM 只在最后才改


react 的 props 是 Frozen，但是 如果 props 内部有 Symbol field 为对象，则 Symbol 里面的东西可以随便改


redux_store 可订阅 内存缓存
localstorage 不可订阅 硬盘缓存
url 可订阅 硬盘缓存
全局对象 不可订阅 内存缓存


与 react-reformed 结合使用时，semantic-ui-react 的 form 的 loading 有些反模式，因为 loading 代表还没有 initialState，但是已经创建了，之后再修改 initialState 是不对的。。。
不过可以把 loading 的状态作为 key，loading=true 时生成没有 initialState 的 form，loading=false 生成新的 form




博士，周四周五我们看语义网接口的时候，一直认为有些问题。
我们正在编辑一个 entity，然后要根据这个 entity 得到它可用的 verb list，然后选择了一个 verb，得到这个 verb 可用的 entity list，选择 entity，形成整个主谓宾结构。。。

那么，在 schema 上
verb 应该有两个 category，一个 subject_category 一个 object_category 。。。甚至如果把 verb 弄得更语义化点，可能就是 subject_categories 和 object_categories 了。。。

在客户端操作上
在编辑语义网的时候，编辑人员会正向思考，但也完全有可能反向思考，把当前正在编辑的 entity 思考为宾语，去反向查找

在接口上
graphql 支持多态，schema 定义中，一个字段的类型可以是一个 interface，然后客户端在取值时是能够通过 fragment 功能进行类型断言，
那么 search_entities 是可以返回所有类型的，只要那些类型都 implements 一个共同 interface（有些别的，例如根据 id 获取 article 也完全可以合并为一个接口，不过暂时没必要）。
meta_entity 的 triples 字段感觉不应该是分页接口（虽然客户端可以递归获取完）毕竟需要编辑，那便肯定是全部取完再增删改，
或者提供两个字段 paged_triples & all_triples 。。。 graphql 接口没必要数据库几个字段，schema 就几个字段




type Note {
  content: String
  links: [String]
  public: Bool
}


[title](url)



mysql: json: http://mysqlserverteam.com/json-labs-release-native-json-data-type-and-binary-format/
postgres: json: https://www.postgresql.org/docs/9.6/static/functions-json.html
看了上面两个 SQL 方言，可以看到 sql 变得越来越复杂了，开始具备了许多的编程语言的特性。。。既然如此，为什么不把 sql 彻底改造成一门图灵完备的语言，有 if/else/三元运算符，有循环，有陈述。。。
然后改造成这样的话，需要考虑sql builder又该如何设计
细想，可以知道，sql builder仍然需要以字符串为中心去思考。。。也就是sql 里的 if 不能直接使用编程语言里的 if。。。




不去的理由：
1. 自己觉得自己有点决定草率（连 阿里 滴滴的 hr 都这么说我）
2. 方向不一样：我想把东西做小做简单（只要复制导购端加上一级分销就好了，当然，导购端的 UI 会变），你们想做大
3. 能力不够：我没有一个人完成整个东西的能力，真发生问题了，自己仍然做不了太多，会跟上次一样
4. 感觉有点受欺骗：php 后台 + rn 导购端 （怀疑，除了 rn 导购端是你们自己做的以外，其他都是网上找的改的。。。而且感觉这个 php 后台挺好的，比后来找的那个更好，所以更想不通为什么要放弃旧的用新找的，除了 php 是找的改的，导致性能问题无法解决）
5. 除了完全创业成功，直到上市，不然好像并不能拿到太多钱。。。这个几率带上上面那些疑惑和困难，几率太小
6. 没有在第一轮融资到手的时候找我
7. 讨厌那种该快的时候不快，该慢的时候不慢下来的节奏


去的理由：
1. 有那么一点可能能让自己挑起大梁，决定整体走向，但仍然需要自己主动推进（其实跟在普通公司，自己主动找老板多聊聊是一回事）
2. 当方向与自己一致时，写代码不会烦
3. 如果自己不在现在的普通公司里再做点什么，有可能是在慢性死亡（但是考虑到那些不去的理由，自己觉得加入你们，更像是快速死亡）



做个小说站，消除起点的缺点：
起点的模式下，小说作者旱的旱死，涝的涝死。应该推出个小说平台，能减少高低收入差距，例如没有前十排行，只有无限列表排行，这样就消除了 第十名与第十一名 的巨大差距（他们本该没有太大差距的）
