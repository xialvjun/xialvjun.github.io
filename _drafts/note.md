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



# 编译原理 -- QQ 聊点记录：
红瞳  10:37:09
" ChaosBot 09:31:48
应该是vlang.io这个 "
用 go 编译的编译器如何做到没有 gc

自动姬  10:38:35
这有啥关系。你把编译器实现成不需要 gc 的，用啥语言编译都一样没有 gc

我傻逼我自豪  10:38:40
大概是语言本身没 GC ？

我可以吞下自己而不伤身体  10:39:17
编译器用不用gc跟语言用不用gc有啥关系

rust的优势  10:44:04
编译后端用不用gc，和语言gc有关，前端无关

双马尾大胸DCjanus  10:47:29
编译器和编译产出有卵子关系。。。你用go实现一个C语言编译器难道他编译出来的二进制就带gc了？

红瞳  10:48:58
不知道怎么用 go 实现一个 C 语言编译器

双马尾大胸DCjanus  10:49:15
@红瞳 聚聚说笑了！

红瞳  10:49:27
真不知道

ChaosBot  10:51:14
[图片]
你等开源了看看

红瞳  10:53:34
以我的理解，go 要实现 C 语言的编译器，最多也只能做到把 C 代码编译为 LLVM 代码或汇编代码，但做不到把 C 代表编译为机器码

我傻逼我自豪  10:53:54
？！为啥你会有这种错觉

双马尾大胸DCjanus  10:54:09
" 红瞳 10:53:35
以我的理解，go 要实现 C 语言的编译器，最多也只能做到把 C 代码编译为 LLVM 代码或汇编代码，但做不到把 C 代表编译为机器码 "
 为何你会有这种错觉。。。

双马尾大胸DCjanus  10:54:29
只是现在流行前后端分离的架构而已。。。

双马尾大胸DCjanus  10:54:44
Go做的C编译器直译汇编有啥问题么

我傻逼我自豪  10:54:46
反正机器码就是各种 binary ，写呗

天字一号抽象吹  10:55:49
简单说 编译器做的工作不就是从一种表示的代码映射成另外一种吗

巧可老师单推  10:56:04
" 红瞳 10:53:35
以我的理解，go 要实现 C 语言的编译器，最多也只能做到把 "
 ？？你在说什么

红瞳  10:56:08
" 双马尾大胸DCjanus 10:54:44
Go做的C编译器直译汇编有啥问题么 "
就是说这种还需要汇编编译器啊

大家好！我来问一个问题，如下图：  10:56:16
" 红瞳 10:53:35
以我的理解，go 要实现 C 语言的编译器，最多也只能做到把 C 代码编译为 LLVM 代码或汇编代码，但做不到把 C 代表编译为机器码 "
 C语言编译器也就是个普通的可执行文件，go语言来写该怎么编译还是怎么编译

双马尾大胸DCjanus  10:56:26
" 红瞳 10:56:09
 就是说这种还需要汇编编译器啊 "
 ???

双马尾大胸DCjanus  10:56:41
大佬你要不要重新学一下编译原理。。。

巧可老师单推  10:56:45
" 红瞳 10:56:09
就是说这种还需要汇编编译器啊 "
 ？？你就不能用go把那个也写了吗

" 双马尾大胸DCjanus 10:56:41
大佬你要不要重新学一下编译原理。。。 "

红瞳  10:58:00
好吧，重新学编译原理。。。

JonirRings-切图仔-成都  10:58:01
[表情]编译器的工作就是把一种语言转换成另一种语言。
一般所谓的二进制你可以看成机器语言，表示成汇编。从汇编转换成二进制的工具，称之为汇编器 assembler

JonirRings-切图仔-成都  10:59:37
而汇编器，你可以看成一个超大的键值对table，和几个基本的计算逻辑（要算跳转地址）。知道这个，要实现它的话，语言限制就小了。

我傻逼我自豪  11:00:06
" JonirRings-切图仔-成都 10:59:37
而汇编器，你可以看成一个超大的键值对table，和几个基本的计算逻辑（要算跳转地址）。知道这个，要实现它的话，语言限制就小了。 "
 其实不用想这么深，就当成一个特殊点的 binary ，啥语言不能写

我傻逼我自豪  11:00:12
js 都可以写汇编器

JonirRings-切图仔-成都  11:00:38
是的，只要这个语言够处理二进制和文件的库或者api，就能写。

自动姬  11:03:12
" 红瞳 10:53:35
以我的理解，go 要实现 C 语言的编译器，最多也只能做到把 C 代码编译为 LLVM 代码或汇编代码，但做不到把 C 代表编译为机器码 "
 可以的，Golang 自带了一个 Plan 9 汇编器，用 Go 写编译器的话可以就用自带的汇编器直接生成汇编

JonirRings-切图仔-成都  11:09:13
说到编译器，我最近再看nes，当年那些大佬写游戏，真的就是用汇编手写，拿草稿纸做跳转计算啊[表情]

JonirRings-切图仔-成都  11:10:04
昨天看了一个叫做micro mage的游戏开发小故事，他们为了把游戏塞进40k的空间内，做了各技巧。

巧可老师单推  11:10:08
" JonirRings-切图仔-成都 11:09:13
说到编译器，我最近再看nes，当年那些大佬写游戏，真的就是用 "
 当时还有别的方法吗？

JonirRings-切图仔-成都  11:10:30
国外的兄弟们，retro爱好真的好强烈，时至今日还有人为nes开发游戏。

红瞳  11:12:19
[图片]
代码 -> AST -> 解释运行
            -> 之前把编译理解成 解释器+AST 打包后的一个整体
            -> 下面两个才是编译
            -> 拼接出二进制
            -> 转换AST为汇编代码 -> 汇编编译器编译汇编代码拼接出二进制

红瞳  11:12:21
是吗

我可以吞下自己而不伤身体  11:12:49
不是

我可以吞下自己而不伤身体  11:13:08
不对，应该说不全面

JonirRings-切图仔-成都  11:13:10
不是，缺了链接器

我可以吞下自己而不伤身体  11:14:16
解释也分解释ast和解释中间码

趙雪松是死變態  11:15:32
" 红瞳 11:12:19
[图片] "
 AST 转为汇编是一个很大的步骤，通常语言还会再次转换成为自己设立的 IR

红瞳  11:15:52
[图片]
代码 -> AST -> 解释运行
            -> 之前把编译理解成 解释器+AST 打包后的一个整体
            -> 下面两个才是编译
            -> 拼接出二进制
            -> 转换AST为汇编代码 -> 汇编编译器编译汇编代码拼接出二进制
代码整体变为 AST 的时候，就已经通过了编译器的类型校验
还有另外一种解释器（也是目前大部分解释器的实现方式），是代码一边 AST，一边解释运行，而并非整体转为 AST

我可以吞下自己而不伤身体  11:16:09
" 趙雪松是死變態 11:15:32
AST 转为汇编是一个很大的步骤，通常语言还会再次转换成为自 "
 √

JonirRings-切图仔-成都  11:16:23
前端：把高级语言转换成ir
中端：分析ir的逻辑并优化裁剪ir
后端1：将ir转换成对应平台的汇编，根据情况才去对应平台的最优指令集和通用指令集
后端2：将汇编转换成二进制的单独块儿
链接器：根据链接脚本和二进制文件的标注信息进行链接，形成最终二进制文件。

趙雪松是死變態  11:17:41
在 rust 我们是这样的： rust -> AST/HIR -> HAIR -> MIR -> LLVM IR -> machine code

趙雪松是死變態  11:18:38
其中 HAIR 的存在可以无视，因为听说那个不过是用来做单元测试而已

红瞳  11:18:41
链接器是指：编译器是一个文件一个文件的编译代码，然后链接器把编译后的文件里面的变量啥的偏移量，整体偏移。。。是吗

我那截图上的是指把整个程序，放到一个文件中了，得到整个的 AST。。。

JonirRings-切图仔-成都  11:22:36
差不多啦。
链接器脚本里面要标注入口位置，分段标记之类的，链接的时候就要计算偏移，把二进制文件中的对应符号给替换了，有些不需要替换的放到符号表里面，让装载器在运行式加载动态链接库。
一般广义的编译器是指编译套件，把链接器也包含进去了。就像你可以直接用gcc把c变异成a文件。
狭义的编译器就是做c到o的工作，但是形成运行文件还是得靠链接器。

红瞳  11:23:11
IR （不管那上面 HAIR 还是 MIR 还是 LLVM IR）其实就相当于 代码，只是不是文本形式的。。。相当于 JSON.stringify(ast) 存下来

我傻逼我自豪  11:23:13
" 趙雪松是死變態 11:17:41
在 rust 我们是这样的： rust -> AST/HIR -> HAIR -> MIR -> LLVM IR -> machine code "
 现在 MIR 倒是挺关键的了

JonirRings-切图仔-成都  11:24:56
" 红瞳 11:23:12
IR （不管那上面 HAIR 还是 MIR 还是 LLVM  "
 代码是二维的逻辑，ast是高维的逻辑。

JonirRings-切图仔-成都  11:25:08
错了，ir是高维的逻辑。

红瞳  11:26:17
呃，不懂。。。不过今天学到的，感觉已经够了。。。

红瞳  11:26:25
谢谢


# 数据库冗余外键该不该要
https://rodgersnotes.wordpress.com/2010/09/18/redundant-foreign-key/
> 其实这个就是最佳方法：A-a_id, B-(b_id,a_id), C-(B.b_id, B.a_id)，也就是 C 上的 a_id 连接的是 B.a_id 而非 A.a_id（要注意是 C(a_id,b_id) 整体连接 B(a_id,b_id)，是联合外键），这样，冗余有了，方便查询，单一数据来源也有了，数据库能正常确保维护数据正确性

https://dba.stackexchange.com/questions/68951/is-it-recommended-to-have-redundant-foreign-key-columns
https://stackoverflow.com/questions/40553231/storing-redundant-foreign-keys-to-avoid-joins
a
b a.id
c b.id
d c.id
select d.* from d left join c on c.id = d.cid left join b on b.id = c.bid left join a on a.id = b.aid where a.id = 'abc'
并不影响写 dataloader
select d.* from d left join c on c.id = d.cid left join b on b.id = c.bid left join a on a.id = b.aid where a.id in ('abc', 'bac')

# 数据库冗余外键该不该要，以及查询方法
https://stackoverflow.com/questions/40553231/storing-redundant-foreign-keys-to-avoid-joins
For @max-vernon 's answer, it's true that the first sql is more than the second, but not too much. I prefer the first one. So:

// you have D, and want to get A, then:
let d = D();
let c = select C.* from C where C.id=d.c_id;
let b = select B.* from B where B.id=c.b_id;
let a = select A.* from A where A.id=b.a_id;
// or
let d = D();
let a = select A.* from A
            right join B on A.id=B.a_id
            right join C on B.id=C.b_id
            right join D on C.id=D.c_id
            where D.id=d.id;

// you have A, and want to get Ds, then:
let a = A();
let Bs = select B.* from B where B.a_id=a.id;
let Cs = select C.* from C where C.b_id in Bs.map(b => b.id);
let Ds = select D.* from D where D.c_id in Cs.map(c => c.id);
// or
let a = A();
let Ds = select D.* from D
            left join C on C.id=D.c_id
            left join B on B.id=C.b_id
            left join A on A.id=B.a_id
            where A.id=a.id;

// if a primary key in composite key, use in operator like this
select * from hubs where (id, user_id) in ((12, 1),(23,3)); // ((12, 1),(23,3)) is an array of array


**postgres index json column**
https://dba.stackexchange.com/questions/193371/which-is-more-efficient-for-searches-on-json-data-in-postgres-gin-or-multiple-i


**graphql schema**
graphql 本身不会区分 null/undefined , 但是实际传输的 variables 会原样传过去
即 Json! 不能匹配 null/undefined
而 Json 能匹配 null/undefined , 并且 args 得到的是原本的 null/undefined
...另外，JSON.stringify 之后是没有 undefined 的，那个 key 都直接没了

**graphql query after mutation**
@成都-切图仔-JonirRings  react-apollo 你知道怎么做一个 mutation，mutation 结束之后立即做一个 query 吗。。。有一些 graphql 后端自动生成框架有弄出这种模式:
type Mutation {
  create_person(xxxx): PersonResult!
}
type PersonResult {
  person: Person!
  query: Query!
}

通过这种形式，客户端可以做到发一次 http 请求，就做到先 mutation 后立即 query。。。然后我现在手写 graphql schema，不想写那么多 XXXResult 类型，有什么方式让客户端直接有类似这种的功能吗？

事实上，我并不需要 Query 的结果。。。我只是想要得到结果后 react-apollo normalize 覆盖到 cache 上去

看起来 batch request 能达到目的 。。。但有几个问题还不清楚：
1. 据说 batch mutation 是 one by one 执行的，但是不知道可不可以 [mutation_1 query_2 query_3 mutation_4 query_5]  这种 batch，另外，如果支持，它的执行顺序是怎样的？
2. react-apollo 或者 apollo-client 那边的 api 应该怎么弄？client.mutate(); client.query(); 这样？它不会被打乱顺序，造成 query 在前，mutation 在后了吧。。。
3. 虽然据说 batch mutation 是 one by one 执行的，但是，去看 apollo-server 的源码，根本没看出来哪里有 one by one 执行的说法。。。https://github.com/apollographql/apollo-server/blob/d0ba38647e92d4798c925972dd92304654dc76b3/packages/apollo-server-core/src/runHttpQuery.ts#L255-L277 根本就不是 one by one 的执行逻辑

如果让自己实现，对于 1 中 [mutation_1 query_2 query_3 mutation_4 query_5], 理想的 batch 应是 [[mutation_1 query_2 query_3],[mutation_4 query_5]], 先执行 mutation_1, 再并发执行 query_2 query_3, 再执行 mutation_4, 在执行 query_5

实在不行, 分两次请求算了 await client.mutation(); await client.query()

等下, 似乎完全不需要有 PersonResult. 因为我们想要有 query 仅仅是用作获取数据 normalize 到 apollo-client 的 cache 上. 然后事实上我们要获取的数据正是 create_person 之后与该 person 相关的数据, 那既然与 person 相关, 那正应该与 Person 关联


**graphql mutation control**
例如 User <--1:{0-1}--> Doctor, 于是有 Mutation
admin_set_doctor(user_id: ID!, doctor_info: Json!): Dcotor!
user_set_doctor(doctor_info: Json!): Doctor!
这里 admin_set_doctor 是给 admin 用的, 需要 user_id 参数, 而 user_set_doctor 则直接从当前 token 中拿 user_id 就好...但是又有 User <--1:N--> Book, 于是有 Mutation
admin_remove_book(book_id: ID!): Boolean!
user_remove_book(book_id: ID!): Boolean!
但事实上, 只要有一个 remove_book(book_id: ID!): Boolean! 接口就好, resolver 里两者不同的仅仅只是 decorator 里的判断不同, 但是 decorator 的判断是可以直接合并的
所以这里不知道怎样才是最佳实践: 是用一个 remove_book 接口还是分 admin_remove_book, user_remove_book; 用一个 remove_book 的话, set_doctor 要不要合并成
set_doctor(user_id: ID, doctor_info: Json!): Doctor! ... user_id 为空时, 为当前 token 的 user_id

暂时还是全部分开吧

另外, 需要说明的是这里 admin_do_something, user_do_something 的名字并不是说 admin 就是一个 Role, 毕竟 Role 有很多. 这里 admin_ 只是直接被 Role 授权做的事情, 而 user_ 则是与当前 token 的资源所属关系本就可以做的事情

**graphql query control**
这里有两种设计思路, 例如 User <--m:n--> Org, 于是有 User.orgs, Org.users...然后, 对于 CMS 后台管理端, 我们需要一个 Query.all_orgs 从而作为管理员创建, 修改所有的 Org. 另外, 作为与 Org 有关联的 User, 也是可以修改 Org 的.
于是, 两种设计思路: 
1. 非管理员调用 Query.all_orgs 会报错, 他们只能调用 User.orgs
2. 任何人都可以调用 Query.all_orgs, 只是看到的结果不同, 管理员看到真正的 all_orgs, 非管理员只看到自己能看到的 orgs...
其实感觉 思路2 有问题, 权限不应该那样玩, 因为完全有可能所有的人都能看到所有的 orgs, 只是非管理员只能修改与自己关联的 orgs... 
*?todo* 另外, 是 Query.all_orgs(user_id: ID) 好, 还是 User(_id: ID!).orgs 好 ?
Query.all_orgs(user_id: ID) 是把 graphql 当成纯粹的 rpc 使用
User(_id: ID!).orgs 则是数据结构关联
如果 User(_id: ID!).orgs 需要做访问限制, 判断 jwt.uid===_id, 则 Query.all_orgs(user_id: ID) 也要判断 jwt.uid===user_id ...
但假如 jwt.uid!==user_id 时, 两者又有区别: User(_id: ID!).orgs 是查不到, 而 Query.all_orgs(user_id: ID) 是查到全部的, 隐藏了 user 与 org 的关联关系...
事实上, 在表结构上, User(_id: ID!).orgs 与 Query.all_orgs(user_id: ID) 就是完全不同的:
Query.all_orgs(user_id: ID) 看起来 user_id 是 org 的一个字段, 而 User(_id: ID!).orgs 则是 org_ids 是 user 的一个字段, 或者包含前者的表结构逻辑. User(_id: ID!).orgs 更正确...
*但假如*把 User <--m:n--> Org 换成 User <--1:n--> Book, 则 Query.all_books(user_id: ID) 和 User(_id: ID!).books 两者表结构的逻辑不分上下, 都能用正确的表结构表示
假设场景: 小学教室的图书角, 学生捐献图书, book.user 是 owner 的意思, book 并非出版书, 而是实体书, 可能会不同的人捐献了同一版本的书.
假如 User(_id: ID!).books 需要做访问限制, 即不能让人知道某个人有哪些 book, 但可以让人知道某个 book 的 user 是谁. 这样, 除非对方把所有的 book 都看完, 才能知道某一个 user 有哪些 book.
于是 Book.user 不设限; all_books(user_id: ID) 当 user_id 存在的话, 就设限, 不存在则拿到所有的 books; User.books 完全设限.
*但假如* User(_id: ID!).books 不需要做访问限制, 那么, Query.all_books(user_id: ID) 与 User(_id: ID!).books 又有什么区别
all_books 能作为全局管理接口, user.books 则不可以, 即 all_books 的 user_id 是可空参数, 而 user.books 的 user_id 是必填参数, 也即 all_books 功能更强大, 业务风险更多
all_books 只查一次, user.books 要先查 user 后查 books
以最小知识原则看, 客户端应该是能只用 user.books 的就只用 user.books, 不行再说 all_books 
另外, 在扩展性上, 两者也有区别, 待写...


**商品有库存, 然后有超卖问题**
解决方式:
1. 普通的数据库锁: select for update / for share 
2. 乐观锁: 取数据的时候, 顺带取一个表示当前数据的状态的一个值(通常是版本号), 之后更新数据的时候, where 语句中判断这个值有没有发生变化. 这里可以是更新库存的时候, where 语句中带上 update product set stock=new_stock where id=id and stock=old_stock... 这样, 如果更新行数小于 1, 则 rollback. 另外, 这句 update 语句必须是事务的最后一行(todo: 事务到底做了什么), 不然, 等它再过一段时间再提交事务, 那那段时间中可能发生超卖
优缺点: 方式 1 是有的数据库不支持行锁, 只支持表锁, 于是降低并发...如果支持行锁, 那就最好(postgres支持行锁). 方式 2 是当并发较高的时候, 会经常发生 rollback, 用户经常收到报错, 还不如老老实实用锁, 用户多等一下.
https://my.oschina.net/liuyuanyuangogo/blog/499460

add, set, del - get
insert, update, delete - select
create, modify, remove - query


**AI压缩**
有大量的类似数据需要存储, 例如全球汽车车祸照片...普通视频, 内容接近, 时间相邻的两帧之间, 数据可以被压缩...然后完全可以把这点拓展开, 成为内容接近, 时间不相邻的 内容也能被压缩...其实那时的压缩是 生成了一个版本的 统一数据模型...这个模型可能挺大, 当相对全球数据又很小...然后每张照片都有自己与这个统一数据模型的差值, 实时计算得出原照片...整个的是无损压缩

**gql 构建 schema 设想**
```ts
// schema.ts 这种写法的优点是 typeDefs 与 resolvers 能同步更改, 避免两边出现相差
const schema: { typeDefs: any, resolvers: any } = make_schema`
type Person {
  _id: ID! ${async (root, args, ctx, info) => { return root._id }}
  name: String!
  books(name_like: String!): [Book!]! ${async (root, args, ctx, info) => db.manyOrNone(`select * from book where person_id=? and name like ?`, [root._id, args.name_like])}
}
`

// 或者... 不过这种不知道怎么把 typeDefs 给合并起来
const Person = make_schema`
type Person {
  _id: ID! ${async (root, args, ctx, info) => { return root._id }}
}
`

// 暂时是上面一种写法
export function make_schema(strings: TemplateStringsArray, ...values: any[]) {
  let typeDefs = '', resolvers = {};
  
  strings.forEach((str, idx) => {
    typeDefs += str;

    let type_or_fields = typeDefs.match(/((scalar|type)\s+\w+)|(\w+(\(.+\))?:)/g);
    type_or_fields.reverse();
    let is_field = type_or_fields[0].endsWith(':');
    let type_name = type_or_fields.find(it => it.startsWith('scalar') || it.startsWith('type')).split(/\s+/)[1];
    if (is_field) {
      let field_name = type_or_fields[0].match(/\w+/)[0];
      resolvers = { ...resolvers, [type_name]: { ...resolvers[type_name], [field_name]: values[idx] } };
      // resolvers[type_name][field_name] = values[idx];
    } else {
      resolvers = { ...resolvers, [type_name]: values[idx] };
      // resolvers[type_name] = values[idx];
    }
  });

  return { typeDefs, resolvers };
}


export const schema = {typeDefs: '', resolvers: {}};
export const gql = (strings: TemplateStringsArray, ...values: any[]) => {
	let s = make_schema(strings, ...values);
	schema.typeDefs += '\n' + s.typeDefs;
	lodash.merge(schema.resolvers, s.resolvers);
	return schema;
};

```


**高考不公平问题**
有北京/深圳等地高考分数线低, 有衡水/黄冈等地高考分数线高, 有新疆/西藏等地高考分数线低...
北京/深圳 取素质教育
衡水/黄冈 取应试教育
新疆/西藏 连基础教育设施都不齐备
这其实是教育公平的问题: 教育设施不齐备的, 应该努力让它教育设施齐备; 应试教育是贫民阶层通向上层通道的最根本的途径, 必须保全; 素质教育是一种新思想, 可以鼓励.
所以, 个人认为最公平的做法应是: 全国统一高考, 试卷统一, 分数线统一; 各高校可以按自己喜欢的特长素质, 对取素质教育有成果的学生加分, 但必须保证没加分进来的学生的比例在 A% 以上; 至于教育设施不齐备的, 这是社会之殇, 整个社会应该从其他的方面去弥补它, 例如政府在那些地区大力鼓励投资, 但不应以损害社会的潜力为代价去弥补.
然后, 上面说的 A% 这个数值必须是全国统选得出的, 就跟选总统一样. 政府可以再定义一个 B%, B 必然大于等于 A, 要求所有高校使用 B 这个数值. 这个 B 的改动就是政府的事情了, 不涉及社会结构.


**https://zhuanlan.zhihu.com/p/49732754**
两个问题:
1. 多个 render props 的嵌套会导致 callback hell 类似结果，直接让你的代码反人类。 ---- 为什么 callback hell 就叫反人类呢? js 中事件回调函数产生 callback hell 是反人类是因为本来我们是在写从上到下的命令式编程, 中间突然插入了个事件回调这样的声明式编程, 打乱了代码逻辑...可是 react jsx 本来就是声明式编程啊, 它产生 callback hell 不是理所应当的吗? 使用 render props 的方式, 我们明确的知道一个变量的作用域就在那一块, 所以想知道那个变量到底是被怎么使用的只要看那一块的代码就足够了, 这不是很好嘛? 至于代码嵌套看起来不好看的问题, 我觉得好代码应该是 好写 + 好阅读(而不是所谓的好看)...
2. 它们致命是缺点是并不适合中大型项目，它们自由度太高，缺乏对业务代码的约束 ---- 为什么灵活就不适合中大型项目? 要不要统一它应取决于团队管理, 而非技术管理. 你再怎么不灵活的东西, 别人非要换种方法用你也没辙, mirror 别人就是 const {app} = actions; 然后单独使用 app变量, 想少打几个字, 你一样要看半天才能反应过来这是调用 action, 或者有人自以为是, 要再对这 actions 做封装...团队不能管理好, 靠技术限制, 只能是防君子不防小人. 大型项目团队开发, 重点还是要做好团队管理.


**websocket 应用逻辑**
http://arthas.com.cn/2018/04/23/websocket%E9%95%BF%E8%BF%9E%E6%8E%A5%E5%8F%8A%E5%BF%83%E8%B7%B3%E5%AE%9E%E7%8E%B0/
https://github.com/zimv/websocket-heartbeat-js/issues/6
<!-- ? 错误 -->
server 不定时向 client 发送消息，client 处于无保证状态，可能会被正常关闭[WebSocket.close(), 正常关闭网页, 正常关闭浏览器]
正常关闭的话，client 会向 server 发送一个关闭 handshake，于是两边正常关闭... 但是有：
1. client 可能会被异常关闭，例如突然断电，kill 浏览器进程， server 收不到关闭 handshake，不会触发 server.onclose， send(msg, err => ) 的 callback 中 err 也始终是 null
这会永久浪费 server 性能， 需要 server 主动 ws.terminate()
2. client 可能没有关闭，但是 client 的网络暂时断了（client 短暂断网不会触发 client.onclose, 除了 client 断网，还有 websocket 太久没消息，服务商自动关掉这个 websocket）
这种情况下，server 会继续发送消息，client 收不到消息。当 client 网络重新连接后，client 会重新收到消息... 
(另外，client 断网太久会触发 client.onclose，server 则仍然继续发消息)
client 正常关闭，server 会收到关闭 handshake，也正常关闭
server 正常关闭，client 会收到关闭 handshake，也正常关闭
client 异常关闭，不再以同 IP 上线，server 会继续发送消息很长一段时间，并且 server.send(msg, err => assert(err, null))
client 异常关闭，很快以同 IP 上线，server 立即收到关闭 handshake
server 异常关闭，不再以同 IP 上线, client 都会等待一段时间后，触发 client.onclose
server 异常关闭，很快以同 IP 上线，client 都会等待一段时间后，触发 client.onclose。期间，如果 client.send(msg, err => err 是 null)，但立即触发 client.onclose

<!-- ? 正确 -->
总结: server 与 client 完全相同
一端正常关闭，另一端也会正常关闭。
一端异常关闭（断网，更准确的说是找不到此 ip），另一端会等待一段时间后再关闭。
如果这段时间内找到了此 ip:
   如果双方进程都保留着 websocket 连接，则连接恢复正常，并且把这段时间内 send 的消息一块发完(只保证自己这边的顺序，至于双方的顺序就不被保证了)
   如果其中一方连接丢失，则另一方会在 send 的时候发现并立即触发自己的 close。
       或者等待一段时间后关闭自己
连接正常，哪怕没有任何消息，也不会关闭：所以本质上来说，websocket 本身就有个底层传输层心跳包，不然无法出现“等待一段时间后再关闭”的情况
                     但长时间没有消息，运营商可能会断开连接，让两端各自认为另一端异常关闭，并且一直找不到 ip，哪怕明明 ip 在那儿，连接在那儿。

于是, 单纯的对于使用而言, 只要 client.onclose = () => { setState({closed:true}); client.reconnect() } 就好
如果要求界面上完全显示（即要不 client 显示自己已断开连接，要不 client 就要立即响应 server 变化）： server 要每秒向 client 发 **应用层心跳**, client 如果两秒内没收到心跳，就断开自己，并显示已断开，并重新连接
如果要求 server 消息不丢失（事实上做不到，应该改变数据模型）


**my own immer**
```ts
type ExtractArray<T extends any[]> = T extends (infer R)[] ? R : any;

const pgss = Symbol('$$__proxy_get_set__$$');
// type PGS<T> = (T extends (infer R)[] ? (PGS<R>)[] : ({ [P in keyof T]: PGS<T[P]> })) & { [pgss]: T }
type PGS<T> = { [pgss]: T } & { [P in keyof T]: PGS<T[P]> }
// if want addEventListener, write `listeners = fn[]` outside
// ! 这里 pgs+pgss 可以用于 全局状态管理和局部状态管理. 这里的方便的地方是 get 不会报错, 类似 lodash.get 方法...
// 不过, 真正严格的程序, 还是应该能保证数据有正确的初始值, 但这扔不妨碍 pgs 很方便, 至少它可以不用太多的检测 api 结果: pgs(res).data.list.map(item => <div/>), 不必 res && res.data && res.data.list
function pgs<T>(base: T, onChange?: ((n: T, o: T) => any)) {
  const proxy: PGS<T> = new Proxy({}, {
    get(t, p: (keyof T) | (typeof pgss), r) {
      if (p == pgss) {
        return base;
      }
      try {
        const v = base[p];
        if (Object.prototype.toString.call(v) === '[object Array]') {
          const pv = pgs(v, (n, o) => proxy[p] = n as any);
          const rs = (v as any as any[]).map((it, idx) => pgs(it, (n, o) => (pv as any)[idx] = n));
          (rs as any)[pgss] = v;
          return rs;
        }
        return pgs(v, (n, o) => proxy[p] = n as any);
      } catch (error) {
        return pgs(undefined, (n, o) => proxy[p] = n as any);
      }
    },
    set(t, p: keyof T, v: T[typeof p], r) {
      const o = base;
      if (Object.prototype.toString.call(base) === '[object Array]') {
        base = (base as any).slice();
        base[p] = v;
      } else {
        base = { ...base, [p]: v };
      }
      onChange && onChange(base, o);
      return true;
    }
  }) as any;
  return proxy;
}
pgs.symbol = pgss;

pgs([1,2,3,4]).filter(n => )
const obj = pgs({ a: { b: [1,2,3,4] } });

obj.a.b[0][pgss] = 345

function produce(base: any, fn: any) {
  let pro = pgs(base);
  fn(pro);
  return pro[pgss];
}

// function proxy(base: any) {
//   const get: typeof base = new Proxy({}, {
//     get(t, p, r) {
//       return base[p];
//     }
//   });
//   const set: typeof base = new Proxy({}, {
//     set(t, p, v, r) {
//       return true;
//     }
//   });
//   return [get, set]
// }
```


**栈与堆**
红瞳  13:48:11
生成 C 不比生成 Go 好?  … C 几乎不需要 runtime, 不需要垃圾回收… V compiler 会检测语法自动帮我们垃圾回收
拼音  13:48:40
不是说go后端的调度器复杂
红瞳  13:49:11
为什么要在语言层面实现调度器... 在 lib 层面实现调度器才是正确的思路啊...
拼音  13:49:35
作用域的那种垃圾回收不一定比运行时专门一个算法的好
拼音  13:50:33
比如极端情况下，算法可能会直接工作在另一个cpu
拼音  13:50:41
垃圾回收的开销就是0了
红瞳  13:52:43
就拿 web server 来说... go 在语言层面实现调度器... 于是一个请求进来,  发起了 两个 io… 两个 io  结束后都会修改一个变量 context … 这样, 在 go 里, 就必须把那个变量 context 用 锁 包起来.... 但如果是 库 层面实现调度器, 那我们可以实现一个 一个 request 只会在一个 scheduler 上, 不会跑到别的 scheduler 上去.... 这样, 那个 变量 context 就不需要锁了...
拼音  13:52:51
https://blog.codingnow.com/2011/04/lua_gc_multithreading.html
红瞳  13:53:30
" 拼音 13:50:33
比如极端情况下，算法可能会直接工作在另一个cpu "
如果是工作在另一个 cpu 上, 那就是两个 核 同时修改一块内存... 会出错的... 
拼音  13:53:47
不会的
拼音  13:53:59
线程自己都会跳来跳去
红瞳  13:54:28
跨线程能访问的 内存, 都必须用 锁包起来
拼音  13:54:59
不用
拼音  13:55:12
你要保持一致性的话才要锁
拼音  13:55:55
所以有时候FP的多线程程序比OOP还快，因为偏向只读数据结构
拼音  13:56:01
很多地方不需要锁
红瞳  13:56:14
而 作用域 实现的垃圾回收, 它其实就跟 栈 的垃圾回收一样…… 
红瞳  13:56:14
https://github.com/xialvjun/xialvjun.github.io/blob/master/_posts/2018-07-10-why-stack-and-heap.md
拼音  13:57:39
这个理解有点问题
拼音  13:57:49
真实的代码其实是a在开头
拼音  13:58:09
int main() {
  int a;
  for(;;) {
    a = 1;
  }
}
拼音  13:58:29
这样应该就懂了
红瞳  13:58:47
不… 应该是  int main() { for(;;) { int a; a=1; } }
红瞳  13:58:59
因为 C 是 块作用域, 不是函数作用域
拼音  13:59:10
在int a的时候就分配了内存，作为栈内存的一部分
拼音  13:59:29
作用域跟内存是两个概念
拼音  13:59:55
啊，c语言并不是基于作用域管理内存的语言
拼音  14:00:14
rust
拼音  14:00:17
可能是，没看过
红瞳  14:02:00
我是说 C 语言对于栈上的内存的管理 是基于 作用域的... 对于 堆上的内存的管理, 是手动的... 然后 rust 它跟 c++ 的 RAII 是一样的, 它们本质上是把  堆 上的内存 跟 栈上的内存 关联起来了... 形成某个时刻栈上的内存被清掉的时候, 堆上的内存也被清掉
拼音  14:02:27
C 语言对于栈上的内存的管理 是基于 作用域的
不是的
拼音  14:02:35
就是基于函数调用
红瞳  14:03:04
所有语言的关于 栈上的 内存的管理, 都是基于作用域 的....
拼音  14:03:08
函数调用时候在栈上分配一个帧，退出的时候直接出栈
拼音  14:03:20
几乎所有语言的栈内存都是这样的
红瞳  14:03:32
至于你那个语言是  函数作用域, 还是 块作用域.... 那是看语言本身
拼音  14:04:18
作用域只对程序员有意义
拼音  14:04:27
编译之后就没有作用域的说法了
拼音  14:05:27
或者把栈帧叫作用域也可以，但还是跟块那个对程序员才有意义的作用域不是一回事
红瞳  14:11:30
编译器到底是直接使用 对程序员就有意义的 作用域来决定怎么操作内存, 还是使用自己的 函数 层面作用域... 那只是编译器后期优化  才做的事情….. 单纯对原理而言, 编译器回收内存的最早时间 就是   变量离开了对程序员有意义的作用域
红瞳  14:11:57
编译器可以延迟回收内存, 但不可以提前回收内存
拼音  14:14:08
那你觉得栈内存跟堆内存的区别是啥
红瞳  14:14:09
而垃圾回收, 则不可避免会造成   世界暂停… 或者至少是部分世界暂停 (就例如一块空间里的时间停止, 外接跟它无法交互, 它内部无法交互, 它跟外界无法交互)
拼音  14:14:56
你这个理解的话，c不是必须有gc了吗……
红瞳  14:15:34
… 不知道你怎么理解的... 我都要怀疑是不是我语文不好了
红瞳  14:15:53
无所谓... 我只是问下 v 的评价…
拼音  14:15:53
在变量离开对程序员有意义的作用域的时候回收内存 <-这个行为就是垃圾收集的工作
红瞳  14:16:20
不是的....
红瞳  14:16:38
垃圾收集才没有那么智能, 知道 变量离开了 作用域...
拼音  14:16:48
那gc的工作是啥
红瞳  14:17:04
gc 是 pull…. rust 是 push
拼音  14:17:52
啥是pull
红瞳  14:19:28
gc 是 时不时地 停止整个程序的运行, 然后遍历所有变量, 看哪些变量已经离开作用域, 不再有可能被访问到, 再把那些变量清除掉....
rust 那种是  变量离开作用域, 立马就通知操作系统, 清除自己的内存...
诺, gc 是时不时地访问, 是轮询, 是 pull…. rust 那种是 通知, 是 push
拼音  14:20:15
那gc用不用管栈内存
红瞳  14:20:40
gc 不用管 栈内存啊… 因为 栈内存 自带 push 啊
拼音  14:21:25
那栈内存是什么时候释放的
红瞳  14:23:46
变量离开 作用域 的时候, 也就是 作用域结束的时候... 这里我把栈的没有经过任何优化的操作 理解为: 进入作用域就在栈顶新加一块内存, 离开作用域的时候就把那块内存清掉
拼音  14:24:42
你debug js之类的东西的时候
拼音  14:25:14
断点其实是能看到调用栈的
拼音  14:25:43
在for里面断点会，调用栈会多一个for专门的位置吗
红瞳  14:27:34
……… 算了, 不说了, 我也不是为了说服你… 你老拿优化后的, 或者是 中间加了更多操作 后的东西说事.... 
拼音  14:27:56
debug的时候是没优化的
拼音  14:30:34
如果这种行为展示出来的都跟实际执行的不一样，调试器还有啥用……
红瞳  14:30:52
那也是中间加了更多操作的... debug 会把栈保留下来... 于是如果是 无限尾递归, 可能正常运行没有事, 但加了 debug, 可能就内存崩溃了
拼音  14:31:50
对的，但调试器保留的就是真实的栈啊
拼音  14:32:05
保留这个操作不影响栈的内容



**dart initializer list 要怎么理解?**
就是先不管 super class, sub class… 就一个普通的 class… 如果这个 class 没有构造函数, 那它就有一个 默认的空参数的构造函数…
如果有构造函数, 那就没有那个空参数的构造函数(其实感觉这里可以理解为先运行那个空参数构造函数, 再把 this 代入运行那个自己写的构造函数)… 
然后有子类了... 子类不会继承父类的构造函数… 如果子类没有构造函数, 那创建子类实例 会先运行父类空构造函数, 再代入 this 运行子类空构造函数… 
给子类写个普通的构造函数, 那它会先运行 父类的空参数构造函数, 再把 this 代入子类的新写的构造函数

普通的 class:
空参构造函数 -> this 代入手写的构造函数(手写的无名与命名构造函数地位等同, 不会是先运行手写无名构造函数, 再运行手写命名构造函数)
子类 class:
父类空构造函数 -> this 代入子类空构造函数 -> this 代入子类手写构造函数
initializer list:
先运行父类空参构造函数, 再把 this 代入 initializer list, 里面运行父类手写构造函数, 再把 this 代入 子类手写构造函数


**no cookie no cors**
如果所有 web 服务器根本就无视 cookie，那 cors 还有必要存在吗？
假如说 没 cookie， 那 cors 要保护啥呢？  xss什么的？
CORS 能防御 XSS ?   XSS 不是跟 有坏蛋在你的网站上提交信息, 被保存至你的网站的服务器的数据库中, 然后, 那信息被渲染到你的网站的其他用户的页面上, 然后那信息还是一段执行脚本, 这样就拿到了你的用户在你网站的私密信息, 拿到了他的 token …
CORS 跟 XSS 有啥关系...
拿到了 token…坏蛋想要做啥事不行, 非要在浏览器上做坏事, 用 curl 做坏事不更简单
我觉得 cors 就是保护 cookie 的.,.. 但是如果 网站根本不用 cookie, 那根本就没必要让浏览器有 cors
cookie 在浏览器上一直没被保护... 别人的网站页面向你的服务器发请求, 一样会发送 cookie 
浏览器弄个 cors 就是为了让 服务器决定 哪些网站页面能向你的服务器发请求
哪些网站页面能向你的服务器能发哪些请求
allow method 是能发哪些请求...
allow origin 是哪些网站页面...
这些都是由你的服务器来决定的
而服务器需要决定这种东西, 全都是因为  浏览器无法保护 cookie… 别人的网站只要是向你的服务器发请求, 你的 cookie 就会被发送
但浏览器又为了兼容性, 没法改 cookie 的运行机制…所以只能弄个 cors 来让服务器决定这个事了... 本来如果 能改 cookie 的运行机制的话, 完全可以把 cookie 更改为 只有 url 地址栏的域名与 cookie 的域名相同的页面, 才能使用 cookie… 
CSRF 是漏洞的名字.... CORS 是功能名字… 浏览器实现了 CORS 这个功能, 才能一定程度上抵挡 CSRF

https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2017/september/common-csrf-prevention-misconceptions/
上面的链接说: cors is a mechanism that applications hosted on two different domains to share resources … 完全就是瞎说... 它少了个状语… safely
cors 是为了安全的跨域共享资源...
如果只是单纯的跨域共享资源... 呵, n 多年前的浏览器有阻止过吗
你想怎么共享就怎么共享
但是 那种共享 是有漏洞的, 就是 csrf 漏洞… 所以出了个 cors 来补这个漏洞
按链接的说法, cors 不是为了抵抗漏洞的, 而是为了实现功能的... 那开发人员会想, 哦, 那我实现功能就好了, 本来也没漏洞… 于是把 服务端的 cors 配置全都设成 * 


**响应式界面**
```js
const root = div({ className: 'abc' }, [
  h1('head head head'),
  do {
    let d = div({ onClick: e => d.textContent = parseInt(d.textContent) + 1 + '' }, ['0']);
    d
  }
]);
document.body.append(root);
```
要知道 element 本身就是响应式的, element.value = xxx 就直接让界面改变了... 现在只是 js 变量不是响应式的, 另外, 就是那些 element 不能轻易的拿到引用...所以解决这两点, 就能轻松做到响应式界面了... 可以用 表达式为一级公民 的语言来拿到 element 引用, 响应式... 其实单纯界面数据直接就混在 element 属性里, 改变其属性就改变界面, 至于其他逻辑数据, 就只是事件响应了... 逻辑数据改变 -> 界面数据改变 -> 界面改变


https://www.google.com.hk/search?newwindow=1&safe=strict&ei=eU0oXZ_mDNCWr7wP4fiO0A8&q=%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E6%89%A7%E8%A1%8C%E7%A8%8B%E5%BA%8F%E6%97%B6%E4%BC%9A%E6%A3%80%E6%B5%8B%E7%A8%8B%E5%BA%8F%E8%AE%BF%E9%97%AE%E4%B8%8D%E5%B1%9E%E4%BA%8E%E8%87%AA%E5%B7%B1%E7%9A%84%E5%86%85%E5%AD%98&oq=%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E6%89%A7%E8%A1%8C%E7%A8%8B%E5%BA%8F%E6%97%B6%E4%BC%9A%E6%A3%80%E6%B5%8B%E7%A8%8B%E5%BA%8F%E8%AE%BF%E9%97%AE%E4%B8%8D%E5%B1%9E%E4%BA%8E%E8%87%AA%E5%B7%B1%E7%9A%84%E5%86%85%E5%AD%98&gs_l=psy-ab.3...7295.13643..14004...0.0..0.150.3844.3j31......0....1..gws-wiz.iVoIDEmby-4


做个浏览器插件, 集合 [Aerys - 窗口标签管理器](https://chrome.google.com/webstore/detail/aerys-tab-manager/kclbicheojedbinfjdjjolmciodoihkl), [OneTab](https://chrome.google.com/webstore/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall), 和 [The Great Suspender](https://chrome.google.com/webstore/detail/the-great-suspender/klbibkeccnjlkjkiokjodocebajanakg) 三者的功能... 然后 aerys 与 onetab 有很多的结合, 要能灵活给 tab 分类, 关闭 tab 时指定分类...其实是创建工作空间 workspace, 然后把 tab 拖到 workspace 中, 可以对整个 workspace 操作, 也可以对单独某个 tab 操作
其实就是 aerys + onetab = [Freezetab](https://chrome.google.com/webstore/detail/freezetab/ecpipjjckcegdmapdifgigmempnikcjg)...不过 Freezetab 很丑就是了
好吧, 已经有很好的工具了 [Workona - Tab Manager & Productivity App](https://chrome.google.com/webstore/detail/workona-tab-manager-produ/ailcmbgekjpnablpdkmaaccecekgdhlh)

有个收藏夹搜索插件 [Bookmark Manager Plus](https://chrome.google.com/webstore/detail/bookmark-manager-plus/pfbeenngglcojppheoegjjjomfkejibg) 还行


/***
 * ┌───┐   ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┐
 * │Esc│   │ F1│ F2│ F3│ F4│ │ F5│ F6│ F7│ F8│ │ F9│F10│F11│F12│ │P/S│S L│P/B│  ┌┐    ┌┐    ┌┐
 * └───┘   └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┘  └┘    └┘    └┘
 * ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───────┐ ┌───┬───┬───┐ ┌───┬───┬───┬───┐
 * │~ `│! 1│@ 2│# 3│$ 4│% 5│^ 6│& 7│* 8│( 9│) 0│_ -│+ =│ BacSp │ │Ins│Hom│PUp│ │N L│ / │ * │ - │
 * ├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─────┤ ├───┼───┼───┤ ├───┼───┼───┼───┤
 * │ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{ [│} ]│ | \ │ │Del│End│PDn│ │ 7 │ 8 │ 9 │   │
 * ├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤ └───┴───┴───┘ ├───┼───┼───┤ + │
 * │ Caps │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  │               │ 4 │ 5 │ 6 │   │
 * ├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────────┤     ┌───┐     ├───┼───┼───┼───┤
 * │ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│  Shift   │     │ ↑ │     │ 1 │ 2 │ 3 │   │
 * ├─────┬──┴─┬─┴──┬┴───┴───┴───┴───┴───┴──┬┴───┼───┴┬────┬────┤ ┌───┼───┼───┐ ├───┴───┼───┤ E││
 * │ Ctrl│    │Alt │         Space         │ Alt│    │    │Ctrl│ │ ← │ ↓ │ → │ │   0   │ . │←─┘│
 * └─────┴────┴────┴───────────────────────┴────┴────┴────┴────┘ └───┴───┴───┘ └───────┴───┴───┘
 */


**for await(let a of b){}  vs for(let a of b) {await a}**
```ts
var delay = (ms) => new Promise(res => setTimeout(res, ms))
async function* abc(n) {
    let i = 0;
    while (i < n) {
        yield i++;
        await delay(1000);
    }
}
async function main() {
    for await (let b of abc(10)) {
        console.log(b);
    }
    // ! 下面的直接报错... 因为一开始根本不知道 stream 内有多少个元素, 所以如果 for 里面没 await, 那就无限个了...其实感觉无限个也没啥
    for (let a of abc(10)) {
        let b = await a;
        console.log(b);
    }
}
```
**Dart Sync Generator and Async Generator**
假设说 for(let a of abc(10)) {await a} 语法可以的话... 那 Sync Generator 就可以任意 for of, 而 Async Generator 则要求 for of 内部必须 await a, 不然会阻塞死线程, 并且生成无限 future, 这其实是不对的, 也就是说 for(let a of abc(10)) {await a} 语法根本不应该成立, 它让语法使用者觉得 不 await a 也没问题, 但实际 不 await a 是有问题的...所以他们是不同的东西, 使用不同的语法, 当然也是不同的类型


**量子猫**
所有在你之前观测了猫的人都处于纠缠态, 你在观测了其中一个人之后, 就能知道所有人看到的猫的死活, 换句话说就是加入你看到猫死了, 那你就能知道你的朋友 A 是一个看到了死猫的 A, 纠缠态崩塌


**html 5 viewport**
```html
<meta name='viewport' content='width=design_width, user-scale=no'>
```

**DI: 依赖注入**
```ts
class A {
  constructor(this.a: string)
  do_a() {
    console.log('a: ', this.a);
  }
}
class B {
  constructor(this.b: number)
  do_b() {
    console.log('b: ', this.b);
  }
}
class C {
  constructor(this.a: A, this.b: B);
  do_c() {
    this.a.do_a();
    this.b.do_b();
    console.log('c'); 
  }
}

// other logic code
const c = new C(new A('a'), new B(0));
c.do_c()
```
上述的代码是有必要的, A 处理 A 的事情, 所以它有自己的成员变量和成员方法, B 也一样. C 是对 A,B 功能的组合, 它可以是传 A,B 的实例给自己, 也可以是直接在自己的 constructor 里创建 A,B, 但显然, 后者的话, 就让 A,B 的创建逻辑侵入了 C 的创建逻辑, 即 C 的构造参数要包括 A,B 的构造参数, 这会级数层级增长, 显然是不合适的.
所以, C 只应该是只接受 A,B 实例... 然后, 假设要增加 C 的功能(因为 C 是其他类的功能的组合, 那其实就应该能增加更多的类, 而不是只限定为 A,B 两个类), 需要在 C 的 constructor 上增加 `(this.d: D)` 参数, 则所有的下面的 logic code 有 `new C(new A('a'), new B(0))`, 都要变为 `new C(new A('a'), new B(0), new D(d))`, 哪怕那些 logic code 跟 D 一点关系都没有, 本质上那些 logic code 只是需要 C, 但不需要全部的 C...
所以 DI 框架 `const c = Context.getInstance(C)` 就应运而生. 然后对于有些目的不同而参数不同的实例, 可以有 `const c = Context.getInstance(C, 'purpose')`, `purpose` 对内又级联影响了 A,B,D 的创建和缓存...
> 其实 DI 本身是面向对象的自有问题. 事实上, C 只是一系列功能的组合, 它本不应成为一个单独的对象, 它的功能本身就是零散的, 至少, 按上面说的需求里, A,B 与 D 没有结合到一块...
> `do_c` 应是一个顶级函数, 而非 C 的成员函数... 然后在调用 do_c 的逻辑代码中, 需要由那逻辑代码去创建 A,B 事实上也确实应该由那段逻辑代码创建, 因为那逻辑代码的业务与 A,B 相关. 而且往往在调用 do_c 之前, A,B 就已经被创建, 在作用域里面了... 然后 `do_c(a, b)`
> 其实 DI 准确说只是一个全局 Bean 管理模式, 就跟 全局状态管理 Redux 一样


**编程中的 设计与编写**
编程 就像 画画. 
css是设计，style是元信息。。。我们画牛也是设计个骨架后，填充大量的元信息。。。不能把元信息填充进设计里复杂了设计，也不能只给用户提供个设计。
样式是如此，组件化编程也是如此。


**gls**
Component design tip: padding can be used in any component that has an explict visually designed border (e.g buttons).
只给有明显边界的元素加 padding... 例如一个具体的 layout, 一个 button...但是对于一段话 p, 它其实是没有明显边界的

**graphql ppt**
alias
client batch_query - server support


**typesafe sql: ddl and dql**
```ts
const db = connect(connection_string);
{
  const schema = new PostgresSchema();
  const users_table = schema.table('users');
  const users_table_id_column = users_table.column('id', 'uuid');
  users_table.column('name', 'varchar');
  users_table.primary(users_table_id_column);

  const rooms_table = schema.table('rooms', tb => {
    const id_col = tb.column('id', 'uuid');
    tb.column('name', 'varchar');
    tb.primary(id_col);
  });

  const user_room_table = schema.table('user_room', tb => {
    const uid_col = tb.column('user_id', 'uuid').foreign(users_table_id_column);
    const rid_col = tb.column('room_id', 'uuid').foreign(rooms_table.columns['id']);
    tb.primary('user_id', 'room_id');
    tb.primary(tb.columns['user_id'], tb.columns['room_id']);
    tb.primary(uid_col, rid_col);
  });

  db.sync(schema).then(_ => {});
}

db.create_table('')

db.generate_code('./db.ts');

// other_file.ts
import connect from './db.ts';
const db = connect(connection_string);
from(db.users).left_join(db.user_room, db.user_room.user_id.equal(db.users.id)).select(db.users.$all);
```


**better than smox**
```ts
const dux = Dux({
  state: { g_count: 0 },
  actions: {
    up(s) {
      s.g_count += 1;
    }
  },
  effects: {
    async aup(actions) {
      await delay(1000);
      actions.up();
    }
  },
  children: {
    s_count: {
      state: { s_count: 0 },
      actions: {
        up(s) {
          s.s_count += 1;
        }
      },
      effects: {
        async aup(actions) {
          await delay(1000);
          actions.up();
        }
      },
    }
  }
})

dux.parent === null;
dux.state;
dux.actions;
dux.effects;
dux.children.s_count;
dux.children.s_count.state;
dux.children.s_count.actions;
dux.children.s_count.effects;

dux.children.dyn_module = {};
dux.actions.dyn_action = function(){};

dux.module('s_count.a.b.c');
```


**graphql split**
```graphql
#import "./UserInfoFragment.graphql"

query CurrentUserForLayout {
  currentUser {
    ...UserInfo
  }
}
```


**Code should be beautiful in logic, not in graphic.**
Code should be beautiful in logic, not in graphic. There are so many stupid persons think it in graphic and keep telling others that code like theirs is beautiful. Code should be beautiful in logic means: 上帝的归上帝, 撒旦的归撒旦.

**代码该在哪儿就在哪儿, 那才是好代码... 也就是说: 上帝的归上帝, 撒旦的归撒旦.**
命令式编程与声明式编程能灵活结合的方法就能更好的实现上面的目标. 
jsx 就把声明式编程与命令式编程灵活结合 (声明 vdom, 命令式事件代码)
函数回调 就是声明回调, 命令式回调内容... 但是异步回调之所以被诟病, 本质上是因为在业务逻辑上它是同步的, 仅仅只在机器执行上是异步的. 对于业务逻辑本身就是声明式的, 函数回调就非常合适了, 例如 http_server_handler... 虽然机器执行上可以  for await (const req of server.listen()) ... 但根本不会有人这样写, 这样的代码根本就没有 server.listen().on_request(req => {}) 来得清晰

**基于规则的晋升**
意淫到自己未来是个大富翁, 请了一大堆老师编写出我喜欢的教材, 然后自己面对那些教材, 会有自己的想法: 为什么不这样那样写? 然后会去骂那些老师, 而骂他们会让他们更战战兢兢, 也不能判断出我的喜好. 所以应该是发现自己喜欢的教材, 就提升老师的排名. 自己有某种想法, 就让老师根据那种想法写教材, 然后自己选一个作为最佳, 并提升其排名...
可以用这种思路构建在线教育...众多老师你一篇文章, 我一篇文章一块集合成一本教材, 学生看教材, 对每篇文章评分.

**不讨论爱情, 它太模糊**
只讨论道德(大爱)和特殊性(对某个人要比其他人特殊). 有的人有道德却没特殊性, 例如高僧, 有的人有特殊性却没道德(这样不一定就对那个特殊的人好)

**myself promise**
```ts
function exec_p(p: P<any, any>) {
  if (p.status === 1) {
    const then_list = p.then_list;
    p.then_list = [];
    then_list.map(({ res, rej, on_res, on_rej }) => {
      try {
        res(on_res(p.value));
      } catch (error) {
        rej(error);
      }
    });
  }
  if (p.status === 2) {
    let catched = false;
    const catch_list = p.catch_list;
    p.catch_list = [];
    catch_list.map(({ res, rej, on_rej }) => {
      try {
        catched = true;
        res(on_rej(p.error));
      } catch (error) {
        rej(error);
      }
    });
    const then_list = p.then_list;
    p.then_list = [];
    then_list.map(({ res, rej, on_res, on_rej }) => {
      try {
        if (on_rej) {
          catched = true;
          res(on_rej(p.error));
        }
      } catch (error) {
        rej(error);
      }
    });
    if (!catched) {
      throw p.error;
    }
  }
}

class P<V, E> {
  static resolve<V>(v: V) {
    return new P<V, undefined>(res => res(v));
  }
  static reject<E>(e: E) {
    return new P<undefined, E>((_, rej) => rej(e));
  }
  status: 0 | 1 | 2 = 0;
  value: V = undefined as any;
  error: E = undefined as any;
  constructor(fn: (res: (v: V) => void, rej: (e: E) => void) => void) {
    const res = (v: V) => {
      if (!(v instanceof P)) {
        this.status = 1;
        this.value = v;
        exec_p(this);
        return;
      }
      v.then(nv => res(nv), ne => rej(ne as any));
    };
    const rej = (e: E) => {
      if (!(e instanceof P)) {
        this.status = 2;
        this.error = e;
        exec_p(this);
        return;
      }
      e.then(ne => rej(ne), ne => rej(ne as any));
    };
    fn(res, rej);
  }
  then_list = [] as any[];
  then<FV extends (v: V) => any, FE extends (e: E) => any>(on_res: FV, on_rej?: FE) {
    let p = new P((res, rej) => this.then_list.push({ res, rej, on_res, on_rej }));
    exec_p(this);
    return p;
  }
  catch_list = [] as any[];
  catch<FE extends (e: E) => any>(on_rej: FE) {
    let p = new P((res, rej) => this.catch_list.push({ res, rej, on_rej }));
    exec_p(this);
    return p;
  }
}

(async function() {
  console.log(0);
  await new P(res => setTimeout(res, 1000));
  console.log(1);
  await new P(res => setTimeout(res, 1000));
  console.log(1);
  await new P(res => setTimeout(res, 1000));
  console.log(1);
  var p = new P((res, rej) => setTimeout(() => rej(2000), 2000));
  p.then(_ => console.log('then')).catch(e => console.log('catch', e));
  p.catch(e => console.log('ccc', e));
  try {
    await new P((res, rej) => setTimeout(() => rej(2000), 2000));
    // todo 这个 3000 不应该显示, 但现在还显示着
    console.log(3000);
  } catch (e) {
    console.log(e);
  }
})();
```


**为 react事件函数内显示的 vdom 附加状态**
```jsx
function() {
  const [name, set_name] =  useState('');
  const ref = useRef();
  return <div>
    <input value={name} onChange={e => set_name(e.target.value)} />
    <button onClick={_ => {
      console.log(name);
      Modal.confirm({
        title: 'set_age',
        content: <State ref={ref} initial={''}>
          {([age, set_age]) => <div>
            <input value={age} onChange={e => set_age(e.target.value)} />
            <span>这里必须用受控组件, 不然无法实现同步显示 age 的效果 {age}</span>
          </div>}
        </State>,
        onOK: () => {
          console.log(name, ref.current.state);
          // ! 但这里要注意一点, 在显示这个 Modal 的过程中, 如果别的地方修改了 name, modal 中显示的 name 是不会被刷新的, 这里 onOK 的 name 也是旧的
          // 而且更不可以在 Modal 里调用 set_name
        }
      });
    }}>set_age</button>
  </div>
}

// 其实还有更简单的.
const Hooks = ({children}) => children();
Modal.confirm({
  content: <Hooks>
    {() => {
      const [] = useState('');
      return <div />
    }}
  </Hooks>
})
```

**大中台，还是大忽悠？！**
https://zhuanlan.zhihu.com/p/95313644
夏吕俊 刚刚
我对文章的理解是: 大中台是公司在发展过程中出现多条业务线, 产生许多互不关联的后端系统, 业务线没有整合, 不能满足运营人员把业务线整合推销给用户的运营需求, 于是出现所谓的大中台, 去整合统一所有后端系统的接口和数据, 从而满足快速变化的前端需求, 继而满足运营和产品的想法... 其实从技术层面, 就是重构后端, 合并系统.... 不知道我对文章的理解有没有出错? 艾特作者.


https://www.zhihu.com/question/283762516/answer/826001147 我知道内卷跟资本主义没啥关系. 但是"易被替代"在gc主义下其实并不是个严重问题, 在资本主义下才显得非常严重, 它也是造成大家疯狂内卷的原因之一. 说到底, "易被替代"不能成为原罪. 全社会每个人都要做到不被替代, 不可能的.


<!-- 我的学习之路... 
后端(java)? flutter? rust? -->


https://www.cnblogs.com/qing-5/p/11126524.html
https://blog.csdn.net/jyt11112/article/details/72770090
https://blog.csdn.net/qq_22881435/article/details/88972958
https://segmentfault.com/a/1190000013069516 BFC(Block Formatting Context)：块级格式化上下文。
https://zhuanlan.zhihu.com/p/70949908


**短 ID**
https://github.com/cryptocoinjs/base-x 可以先生成几个字节的随机数据, 然后用 base32 / z-base32 / base58 转成字符串...至于唯一性就由数据库保证
短 ID 用作 user_id, username 可以是任何字符, 只要不重复就行, 这样就不需要昵称了(本身可重复的昵称这一概念并不好用)... 系统会清除僵尸用户 username, 以释放靓名. 清除 username 时会备份至用户的一个字段里, 用作以后用户记起来, 想登录用


**幂等**
做聊天室, 用户发消息, 可能一时没有返回, 于是连续按发送... 可以让客户端生成个 消息顺序(这里没必要客户端定义整个id), 消息顺序和内容都相同时, 就当成一条消息
还是带时间戳最好, 可以单用户多客户端登录, 有的接口以最后的时间戳为准...如果只是 int 顺序, 则无法多客户端登录


**kuber8s -> minio ...**

**seo**
有两种方式
1: 直接做 spa, 完全不考虑 seo... 之后每晚定时跑无头浏览器脚本, 生成页面 html,存储起来...然后 nginx 判断 user-agent 头看是爬虫还是别的, 是爬虫就导向静态文件
2: 做个无样式的 gatsby, 定时跑生成 html
/abc?n=1  和 /abc?n=2 爬虫会把他们识别为 2 个页面... 但是之后根据这请求, 导向对应的 html 就要 nginx 做 rewrite 了
hash className 不适合 seo, 需要语义 html tag 和 className... 可以加 无意义的语义 className
 记得 head 里加 seo meta


**vue composition api**
vue composition api 是用命令式语法写出状态机. react hooks api 本质也是用命令式语法写出状态机, 不过脑子要转一层...
最好的前端框架应能做到 命令式语法 与 声明式语法 随意切换...
react 可以写 RenderProps 组件:
```jsx
const RenderHooks = ({children}) => children();
const vdom = <RenderHooks>{() => {
  const [count, set_count] = useState(0);
  return <button onClick={() => set_count(count+1)}>{count}</button>
}}</RenderHooks>
```
于是, vue 理应也可以做到
```jsx
const vue_vdom = <Setup>{() => {
  const count = useRef(0);
  return () => <button onClick={() => count.value++}>{count.value}</button>
}}</Setup>
```
为什么 "最好的前端框架应能做到 命令式语法 与 声明式语法 随意切换..." ...
因为这样好用, 更能达到 上帝的归上帝, 凯撒的归凯撒. 甚至可以:
```jsx
const vue_vdom = <Setup>{() => {
  onMounted(() => getCurrentInstance().$ele.animate());
  return () => <button>123</button>
}}</Setup>
```

**idea: 增加个 js 编译期工具**
```tsx
compt!{
  return require('fs').readdir('../imgs').map(img => `import img_${img} from '../imgs/${img}';`).join('\n')
}
console.log(img_abc);

// or
compt(() => require('fs').readdir('../imgs').map(img => `import img_${img} from '../imgs/${img}';`).join('\n'))
compt(function() {
  return require('fs').readdir('../imgs').map(img => `import img_${img} from '../imgs/${img}';`).join('\n')
})

// or compt 里的函数不能是闭包...更类似于
compt("require('fs').readdir('../imgs').map(img => `import img_${img} from '../imgs/${img}';`).join('\n'))")
```

**所有的应用逻辑状态, 应该都是 git 状态**
@antv/g6 里的 behavior 有 click-select, 也可以自定义 hover-select ... 然后, 两者完全可能会发生冲突...
在 hover 的 mouseenter 时, 设置 selected=true, 在 mouseleave 时设置 selected=false... 但原本该节点就是 selectd 时, 则进去出来一次, 原有状态就被清空了
于是可以在 hover 的 mouseenter 时, 记录原状态 item.old_selected=item.hasState('selected') 之后再设置新状态, leave 时恢复至原状态...
但还可能在 mouseenter 后, mouseleave 前, 有别的东西修改了其状态(click 设置 selected)... 这就会出现 click-select 无效...
所以本质是 "一个状态, 协作修改, 应该使用 git 的逻辑..."
> 但是这在 app 开发中, 想完全自动 git 几乎不可能, 因为可能出现 merge conflict, 所以应该是不同的东西修改不同的状态, 
但是现实世界却是"不同的东西修改相同的状态", 所以是 "不同的东西修改不同的状态, 最后在别的地方有状态合并"...
而 render 函数最方便做状态合并: item.setState('selected', item.hover_selected || item.click_selected);
其实是 A 逻辑改 a 状态, 产生 $a stream, B 逻辑改 b 状态, 产生 $b stream, 然后两个 stream 聚合 --- cyclejs


**new framework**
```tsx
// 纯 js, 无需响应式, 类似 flutter
const Com = () => {
  let c = 0;
  return () => <div>
    <div onClick={_ => update(() => c+=1)}>{c}</div>
    <div onClick={new_update(() => c+=1)}>{c}</div>
  </div>
}
// ? 目前不清楚 props 应该怎么放, 放 A 处, 不能 watch, 放 B 处, 要跟 react 一样...
// ? 或者放 A 处, 要保持 props 引用不变, 然后 watch(() => props.a, (cv, pv, inv) => {}, opts), 这样要求框架有较多的全局状态, watch 不能随处 watch
const Com = (A) => {
  let c = 0;
  return (B) => <div>
    <div onClick={_ => update(() => c+=1)}>{c}</div>
    <div onClick={new_update(() => c+=1)}>{c}</div>
  </div>
}
// 组件 h 函数, 自带属性选择器... 生成 <div data-id="ComH_hash">Hello</div>
const ComH = () => {
  return h => <div>Hello</div>
}
// 总的
import createApp from 'my_package';
const app_update = createApp(<App />).mount(any_dom_comment_or_ele_or_any_other);
let app_state = { c: 0 };
setInterval(() => {
  app_update(() => app_state.c += 1);
}, 1000);
const App = () => {
  return () => <div><Acom /><Bcom/></div>
}
const MyCom = (props) => {
  // 只在 setup 与 onMounted 可以 watch... computed 也是
  watch(() => props.a, () => {});
}

// createApp(<App />) 而不是 createApp(App) 是因为 render 里的 <div><Acom /></div> 本质是把这个 <Acom /> 传到 createCom(<Acom />).mount(create_comment());
// 这样的话, react 是把所有的事件都提升到 app root dom 上, my_package 则把所有的事件都提升到各自的 com root dom 上, 性能要差些, 但应该没问题

// 全局 update 函数不知如何实现
const update = create(<Com />); // 这是组件自己的 update, 但如何有个 全局 update, 根本无解, 通过事件时设置 update 全局也不可行, 因为有对父组件的回调
// 所以在 setup 函数中 getCurrentInstance().update

// ! 似乎这么多, 还不如 react 的 hooks, 毕竟感觉 watch(() => props.a) 要保持 props 对象的引用, 并不好
const Com = props => {
  useSetup(() => {
    let c = props.initial || 0;
    // 也不好, 作用域问题...
    return { c };
  });
}

// 那就如果觉得 保持对 props 的引用较 low, 就干脆, getCurrentInstance().props ... 所有对 props 的合理应用都是 this.props 来用
// 可以用 this, 也可以用 getCurrentInstance(), 最好后者, this 易出现误解 ... 只是定义个类型... 则:
const instance = create(<Com />);
// instance.update
// instance.props
const Com = () => {
  const ins = getCurrentInstance();
  // 用户可以自己通过简单 hack 得到 const reactive_props = ins.reactive_props; watch(() => reactive_props.value, ...);
  console.log(ins.props);
  let c = ins.props.initial || 0;
  watch(() => ins.props.value, cv => ins.update(() => c = cv));
  // 其实如果必须 ins, 则 watch, onMounted 之类都可以放到 ins 上... ins.watch(), ins.onMounted()... 
  // 如果都放到 ins 上, 则, 并非必须在 setup/onMounted 里 调用...
  return h => <div><div>{c}</div>{ins.props.value}</div>
}

// 像这种纯 js 没法做 computed, 其实也可以, useMemo ...但总体性能还是比 reactive 差
// 或者还是 shallow_reactive_props, shallow_ref_state 最合适
import { shallowRef } from "@vue/composition-api";
import immer from 'immer';
const ref = <T extends any>(obj: T) => {
  const proxy = shallowRef(obj);
  proxy.immer = (fn:(base: T) => any) => proxy.value = immer(proxy.value, (base: T) => { fn(base); })
  return proxy;
};
const count = ref({ count: 0 });
console.log(count.value);
count.immer(c => c.count+=1);
count.value = "total change";

// or better ts
const immer_ref = <T>(obj?: T) => {
  const target = shallowRef(obj);
  const set = (fn:(base: T) => any) => {
    target.value = immer(target.value, (base: any) => {
      fn(base);
    });
  }
  return new Proxy(target, {
    get(target, p, receiver) {
      if (p === 'value') {
        return target.value;
      }
      if (p === 'immer') {
        return set;
      }
    },
    set(target, p, value, receiver) {
      if (p === 'value') {
        return target.value = value;
      }
      return value;
    }
  }) as (typeof target) & { immer: typeof set };
};
```
vue2 之所以要区分 props 和 attrs 就是因为 props 是响应式的, 而 vue2 用的响应式 getter/setter, 需要预先定义好字段
而 props 只要支持 `<div {...props}></div>`, 就会出现没有预先定义的字段, 所以需要手写 `{ props: ['a','b'] }`
在使用 proxy 之后, 就不需要定义 props 也能完全响应式了, 能 `watch(()=>props.a, a => a)` 了

vue composition api 需要 ref instance 可以:
```tsx
const MyCom = (props) => {
  const command = () => {};
  // 可以只返回 render 函数, 则 ref 此组件得到 undefined ... 
  // 返回 [instance, render] ... instance 并不一定是 object, 也可以是 primitive type or function
  // 为什么不像 react forward 在 顶部参数里加上 ref... 因为那样要预先定义类型
  return [{ command }, () => <div></div>]
};
```

**tsx**
```tsx
var a = <div>
    <img />
    <abc.af />
    <ninja />
    <Img />
    {[() => 123, () => 222]}
    {() => 234}
</div>
// 被编译为
var a = h("div", null,
    h("img", null),
    h(abc.af, null),
    h("ninja", null),
    h(Img, null),
    [() => 123, () => 222],
    () => 234);
```


**多镜头投影仪**
小孔成像原理很简单, 而且它的清晰度取决于小孔直径, 直径越小, 成像越清晰;
眼睛成像是进化版的小孔成像, 通过晶状体, 让逻辑上的小孔的直径变成无限小, 而实际的小孔可以大一些, 从而有更多的通光量;
想着餐厅可以用投影仪把订餐界面投到桌面上, 用户可以在上面操作, 甚至按下界面上的占位按钮, 就可以占位(桌面显示此处已占位), 整个餐厅只用一个投影仪, 而不是一个桌面一个(这成本太大, 而且不好移动桌面)...
但是投影仪有劣势是会被物体遮住, 所以如果有侧面的投影仪会更好, 而且移动桌子本身也要求投影仪侧投. 而想要任意侧投, 又要保持投影出来的界面是正规的矩形, 还想要充分利用分辨率(即侧投是通过光线变化来实现, 而不是通过投影仪显示屏幕的画面变换来实现), 则需要一个能任意变形的透明玻璃(即眼睛的晶状体)...
要做眼睛的晶状体, 要不就做一个实际的晶状体, 要不就做一个逻辑的晶状体(通过一堆反射镜各种改变角度).
但就算能任意侧投, 会被挡住还是会被挡住, 所以如果能多个不同位置的投影镜头, 在同一个物体上, 投影同一个界面, 类似无影灯, 这样就不会被遮住了. 
而且对于手势操作的输入检测, 给每个投影镜头都配一个摄像头, 则保证了, 只要用户能看到自己点击了这个按钮, 则一定有一个摄像头也能看到用户点击了这个按钮.


**typescript 类型定义要注意 逆变协变**
```tsx
export const with_ctx = <CtxT extends React.Context<any>, prop_nameT extends string>(
  Ctx: CtxT,
  prop_name: prop_nameT,
) => {
  return <ComT extends React.ComponentType>(Com: ComT): FC<Omit<ComponentProps<ComT>, prop_nameT>> => props => (
    <Ctx.Consumer>{ctx => <Com {...({ ...props, [prop_name]: ctx } as any)} />}</Ctx.Consumer>
  );
};

// 于是
const A: React.FC<{name: string,age:number}> = () => null; // 这里参数部分不写 props, 或者写 props: {} 都是可以的
// 即 ----- 外面必须多传字段, 里面可以少用字段 -----
const NameCtx = React.createContext<string>('');
const with_name = with_ctx(NameCtx, 'name');
const B = with_name(A); // 这里传入 A, ts 会报错... 因为 with_name 接收的参数是 ComT extends React.ComponentType
// 而 React.ComponentType 是 type ComponentType<P = {}> , 即 ComponentType<{}>...
// 即 const left_value: ComponentType<{}> = right_value as FC<{name: string,age:number}> ... 即 外面可以不传字段, 里面却要多用字段, 显然有问题
// 所以应该改成 const left_value: ComponentType<any>
```
变量 value 等效于 函数 () => value


**react clean up resource shared by children**
```tsx
/**
 * https://github.com/facebook/react/issues/19482
 * https://github.com/facebook/react/issues/6424
 *
 * 这样无效
 * <div>
 *   <UnloadWrapper onUnload={this.componentDidUnmount}></UnloadWrapper>
 *   {this.props.children}
 * </div>
 *
 * 这样有效
 * <div>
 *   {this.props.children}
 *   <UnloadWrapper onUnload={this.componentDidUnmount}></UnloadWrapper>
 * </div>
 *
 * 这样保险, 正确
 * <div>
 *   <UnloadWrapper onUnload={this.componentDidUnmount}>{this.props.children}</UnloadWrapper>
 * </div>
 *
 * 最正确的是 子元素 的 render 里也渲染一个 UnloadWrapper.
 * 当然, 只是单层资源嵌套的情况下, 子元素直接在 componentWillUnmount 执行 clean up 逻辑也没问题.
 */
export class UnloadWrapper extends Component<{ onUnload: () => void }> {
  style = { display: "none" };
  onUnload = (ele: HTMLSpanElement) => {
    if (!ele) {
      this.props.onUnload?.();
    }
  };
  render() {
    return (
      <>
        {this.props.children}
        <span style={this.style} ref={this.onUnload} />
      </>
    );
  }
}

// // 还可以
/**
 * willMount    didMount
 * willUpdate   didUpdate
 * willUnmount  didUnmount
 */
// const useWillDid = <T extends () => void | (() => any), D extends any[]>(fn: T, deps?: D) => {
//   const out = useRef<() => any>();
//   out.current = useMemo(fn, deps) as any;
//   useEffect(() => {
//     out.current && out.current();
//     out.current = undefined;
//     return () => !out.current && (out.current = fn() as any);
//   }, [out.current]);
//   const style = useMemo(() => ({display:'none'}), []);
//   return <span ref={useMemo(() => ele => !ele && out.current && out.current(), [])} style={style}></span>;
// };

// // or
// const useWillDid = <T extends () => void | (() => any), D extends any[]>(fn: T, deps?: D) => {
//   const out = useRef<() => any>();
//   out.current = useMemo(fn, deps) as any;
//   const is_last = useRef(false);
//   is_last.current = false;
//   useEffect(() => {
//     out.current && out.current();
//     is_last.current = true;
//     return () => {
//       if (is_last.current) {
//         out.current = fn() as any;
//       }
//     };
//   }, [out.current]);
//   return (
//     <span
//       ref={useMemo(
//         () => ele => {
//           is_last.current && && out.current && out.current();
//         },
//         [],
//       )}
//     ></span>
//   );
// };

// 上面注释的把三个声明周期混合, 并不能做 resource clean up , 下面的才 ok
type life = 'mount' | 'update' | 'unmount'
const useWillDid = <T extends (life: life) => void | ((life: life) => any), D extends any[]>(fn: T, deps?: D) => {
  const inv = useRef<void | ((life: life) => any)>();
  const mounted = useRef(false);
  const is_last = useRef(false);
  is_last.current = false;
  inv.current = useMemo(() => fn(mounted.current ? 'update' : 'mount'), deps);
  useEffect(() => {
    inv.current && inv.current(mounted.current ? 'update' : 'mount');
    mounted.current = true;
    is_last.current = true;
    return () => {
      if (is_last.current) {
        inv.current = fn('unmount');
      }
    };
  }, [inv.current]);
  const style = useMemo(() => ({ display: "none" }), []);
  const ref = useMemo(() => (ele: any) => !ele && inv.current && inv.current('unmount'), []);
  return <span ref={ref} style={style}></span>;
};
```


**websocket 最佳体验**
知道 websocket 最佳体验是:
服务器每隔一秒向客户端发个 空消息, 
客户端时刻监测自己超过 2 秒没收到消息, 就主动断掉 websocket, 从而在界面上显示网络连接已断开, 并再次连接 websocket...
> 对于这一套做法, graphql 的 apollo-server 和 apollo-client 对应的 subscriptions-transport-ws 已经自带这一套逻辑:
它是 在服务端 设置 keepAlive: 1000 (每 1000ms 给所有的连接端发一个 空消息), 在客户端设置 timeout: 2000 (2000ms 内没收到消息就断开重连)


**for await...of vs for...of {await}**
```js
A: for await (const x of asyncIterable) { console.log(x); };
B: for (const x of asyncIterable) { console.log(await x); };
// A, B 两者是完全不同的
// A 是循环体运行结束后, 会等待 "新的 promise 到来, 并等其结束" 或 "所有都结束"
// B 是循环体运行结束后, 直接拿下一个 promise 进入循环体... 但事实上, 这个时候还不知道有没有下一个 promise... 如果没有下一个 promise, 但已经进入循环体了, 则能做的只有 throw, 但它其实是正常结束, 而不是 throw error... promise 也没有 break 状态, 也不该关心外部 for 循环的 break

// 其实感觉换成这样更好 --- 这是表达式里可以有语句
while (const {value,done} = await asyncIterable.next(); !done) {
}
```




**vue 组件的最顶层 div 不要加 class, 让外面加**
不然, 内部有  class="graph" ... 外面有 .graph 给其他的 元素用... 这样就冲突了


**queueMicrotask**
if (typeof window.queueMicrotask !== "function") {
  window.queueMicrotask = function (callback) {
    Promise.resolve()
      .then(callback)
      .catch(e => setTimeout(() => { throw e; }));
  };
}


**input mask**
input mask 应该与手机上单屏幕输入短信验证码的, 例如 4 位短信验证码, 有 4 个短横线, 在那 4 个短横线上输入... 应该对应这种场景来想.
所以 mask input 其实只是**一块能响应键盘输入的屏幕空间**, 然后因为 mask input 可能有 pattern , 例如 1 字母 + 2 数字+ 1 标点 + 1 字母... 
所以它想要支持用户把光标移动到中间, 删除中间某一位, 这会造成非常麻烦的逻辑问题...
所以合适的是 mask input 根本不支持光标移动, 或者支持移动, 但操作如下:
当光标在当前输入的最后一位时, 可以 backspace, 可以输入文字(继续输入后面的空白处);
当光标在中间部分时, 不可以 backspace, 只可以输入文字(替换光标的后一位);


**加密文件系统 + 版本文件系统**
keepass 与 git 不好兼容使用, 而且我们可能希望使用更好用的 keepass, 让 keepass 直接提供一个加密文件系统...
然后对于服务器, 我们是把加密后的整体同步到 服务器上, 然后服务器又对应多个客户端, 似乎服务器也要支持版本控制...
但服务器存的是加密后的东西, 所以版本管理里 合并 就无法完成(不懂内容, merge 是会出错的)...所以服务器没有版本控制, 它只能是时刻保持最新版本...
也不是说服务器始终保持最新, 而是客户端保持一个 同步记录 列表( hash 数组), 服务器那边有它的当前 hash... 客户端想要覆盖上去, 先要看自己的 hash 列表里是否包含服务器的 hash, 包含则直接覆盖上去, 不包含则先从服务器下下来, merge 后再覆盖上去...
不对, 不是 hash, 因为完全可能 对一个资源先加上去, 后删除, 之后又加上去 ...所以服务器还是 git...问题是服务器那边的 merge 绝对不允许出现冲突文件的情况
不, 不止是不允许出现冲突文件的情况, 连通常的不冲突的 merge 也是不行的(即假如 a/b 两个文件不能共存, A 客户端提交了 a 文件, B 客户端提交了 b 文件, 然后要 merge, 通常的 git 服务是直接 merge 了, 而这个必须是客户端这边 pull 下来, 决定删除其中一个, 再 push)


**后端 api prompt**
后端接口 有没有可能 prompt 呢 ? … 例如  删除一个东西, 它可能造成级联删除或置空, 这里后端就 prompt 一个东西.... 
其实是返回一个值, 这个值是一个 form schema, 并带上后续的请求地址, 客户端完成 form, 并提交, 则继续 后端的那个函数....
...
好像完全没必要... 直接就后端提供两个接口就是: apis.delete_no_cascade -> return error(error 内包含会影响的其他数据) -> apis.delete_cascade


**midway and eggjs transaction**
midway 是依赖注入框架, 它需要自己 init DB, 它的 Sequelize 实例一般写在 models/db.ts 中, 注入它就好. 至于 Model 其实用的就是这个实例, 是 Sequelize 使用 config 里的 modelMatch 方法找到 model 文件, 自己去 require 并 addModel 的
eggjs 的 Sequelize 实例 在 egg-sequelize 插件里可以看到就是  this.ctx.model 本身


**vite multi enviroments config**
```ts
// vite.config.ts
import * as reactPlugin from 'vite-plugin-react';
import type { UserConfig } from 'vite';

// ? 需要考虑 配置是统一放在 vite.config.ts 中好还是在 代码里根据 APP_MODE 来决定好
// 统一放在 vite.config.ts 中 有麻烦的地方是 如果遇到特殊的逻辑, 则 APP_CONFIG 要加一个名字很长的属性: 
// 例如 jinan 环境不显示菜单 a-b-c, 则应所有配置都加属性 is_a_b_c_showing, 只有 jinan 里它为 false
// 感觉还是 --- 统一放在 vite.config.ts 中好... 而且这种甚至未来可以把配置存进数据库进行管理, 直接在代码里用 APP_MODE 的话, 没法做到这点
export interface AppConfig {
  VITE_BASE: string;
  VITE_OMEGA_KEY: string;
  VITE_SSO_API_URL: string;
  VITE_PORTAL_API_URL: string;
  VITE_OBJ: any,
}
const app_configs: Record<string, AppConfig> = {
  development: {
    VITE_BASE: '/',
    VITE_OMEGA_KEY: '',
    VITE_PORTAL_API_URL: '/portal/api',
    VITE_SSO_API_URL: '/sso/api',
    VITE_OBJ: { a:123, b: 234 },
  },
  test: {
    VITE_BASE: '/sso',
    VITE_OMEGA_KEY: 'omegae18a679d88',
    VITE_PORTAL_API_URL: '/sso/portal/api',
    VITE_SSO_API_URL: '/sso/soo/api',
    VITE_OBJ: { a:123, b: 234 },
  },
};

console.log('='.repeat(80));
const APP_MODE: string = process.env.APP_MODE!;
console.log('process.env.APP_MODE =', APP_MODE);
console.log('='.repeat(80));

const app_config: AppConfig = (app_configs as any)[APP_MODE];

const config: UserConfig = {
  jsx: 'react',
  plugins: [reactPlugin],
  base: app_config.VITE_BASE,
  /**
   * * define 相比 process.env 或 import.meta.env 优势是 它直接注入的是 js 对象, 而并非字符串...
   * * 但它仍是字符串替换, 所以是每次使用的值是 deepEqual 的...
   * 具体说明:
   * 有 config
   * define: { a: 1, b: 'b', c: /\w+/, d: { e: /[e]+/ } }
   * 有 src
   * log(a);  log(b);   log(c);     log(c);     log(d);           log(d);           log(d.e);
   * 生成
   * log(1);  log('b'); log(/\w+/); log(/\w+/); log({e:/[e]+/});  log({e:/[e]+/});  log(/[e]+/);
   */
  define: { app_config },
};

export default config;


// src/global.d.ts
import { AppConfig } from '../vite.config';

declare global {
  export const app_config: AppConfig;
}


// package.json
const package_json = {
  scripts: {
    dev: 'APP_MODE=dev vite',
    build_test: 'APP_MODE=test vite build',
  }
}
```




**最好的浏览器 fetch 客户端**
```ts
import wretch from 'wretch';
const retch = wretch('', { credentials: 'include' }).middlewares([
  next => async (url, opts) => {
    try {
      const res = await next(url, opts);
      res
        .clone()
        .json()
        .then(json => {
          if (json.errmsg) {
            // message.error(json.errmsg);
          }
        });
      return res;
    } catch (error) {
      // message.error('网络错误');
      throw error;
    }
  },
]);
export const portal_api = retch.url(app_config.VITE_PORTAL_API_URL);
export const sso_api = retch.url(app_config.VITE_SSO_API_URL);
export const get_user_info = () => portal_api.url('/v1/sso/user-info').get().json();
export const get_phone_sms = (phone: string) => sso_api.url('/get_phone_sms').query({ phone }).post().json();
```


**mapbox-gl source-layer**
What's the difference between `source-layer` and `multi sources`? I thought `a source with layers` is in fact just `a group of sources`. I don't know if I'm right.

mapbox-gl react/vue 组件库, 可以加个 `<Event type="moveend" layer={null} listener={xxx} />` === `map.on(type, layer, listener)`

**微前端**
微前端目前看到的唯一优势是: 渐进式更新技术栈. 然后可以尝试 qiankun 在 开发期和生产期 载入 vite/snowpack 的 esmodule/bundles ...开发期载入 esm 可以看 https://2ality.com/2019/10/eval-via-import.html ... snowpack bundle 可以有 webpack_plugin, 可以配置生成 umd , vite 目前不知


**backend apps**
coturn: https://github.com/coturn/coturn - webrtc
sipjs: https://sipjs.com/ - webrtc
easyrtc: https://github.com/open-easyrtc/open-easyrtc
minio: https://github.com/minio/minio - file manager
sonic: https://github.com/valeriansaliou/sonic - elastic search

**技术栈 dev packages**
pg-ts: ts-sql-query https://github.com/Ff00ff/mammoth / https://github.com/adelsz/pgtyped (前者方便, 后者完整)
(https://github.com/chakra-ui/chakra-ui / https://github.com/tailwindlabs/tailwindcss chakra-ui 比 tailwind 有接近的灵活性, 但更多出一些功能组件) + https://github.com/framer/motion (其实 motion 自己就可以完全作为 css 框架, 因为 hover 啥的它也能向下传递)
chakra-ui === tailwindcss + https://github.com/tailwindlabs/headlessui
react-router-dom vs takeme
typestyle + tailwindcss
https://github.com/banterfm/graphql-crunch


在这里面找合适的
react-router-dom
date-fns dayjs
ahooks
mobx
mobx-react-lite
@xialvjun/mobx-loading
react-hook-form
axios wretch
react-datepicker
reactjs-popup @tippyjs/react @popperjs/react @popperjs/core
ag-grid-react
atomic-css/atomizer tailwindcss


**跨域访问 cookie**
1. 被访问接口肯定是跨域的, cors 除了 @koa/cors 默认以外, 还得设置 credentials: true 即 cross-origin-allow-credentials: true
2. 被访问端 之前设置的域名是 Same-Site:None 的, 为达成这一点, 需要被访问端是 https 的
    如果被访问端是被代理的, 代理到它中间没有 https(显然也不会有), 则需要设置 new Koa().proxy = true, 且收到 header X-Forwarded-Proto: https
    该 header 一般来源于 nginx 设置 proxy_set_header X-Forwarded-Proto $scheme;
以及合适的时候, 直接返回 html
add_header Content-Type text/html; // or default_type text/html;
return 200 '<html><body>Hello World</body></html>';

```tsx
// 除了 nginx 直接返回 html 以外(此种方式没有 git 记录, 没有编译构建时的正确性验证), 可以直接生成 dist 时包含一个 xx.html
// 例如 callback.html = <script></script>
// 例如 cors.html = <script></script>

// cors.html
<script>
// 由外部项目传 APP_ENV, 而不是放进本项目编译构建过程中, 因为目前没找到合适的方式在 vite 内往 html 内注入环境变量
// 除了双 entry html, 而 entry html 的脚本都是新 http 请求, 没找到内联脚本的方法, 感觉还不如直接 hash
const APP_ENV = window.location.hash;
window.onmessage = e => {

}
</script>

// 多 entry html, 这种方式可以引库, 脚本大小要大一些, 而且是两次请求(html+js), 不过有 ts 保证
// vite.config.ts
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        nested: 'cors.html'
      }
    }
  }
// cors.html
<script type="module" src="/src/cors.ts"></script>

// 其实在 vite 内直接往 html 内注入环境变量也可以, 需要自己写插件
plugins: [{
  name: 'xxxx',
  transform(code, id, ssr) {
    if (/cors\.html/.test(id)) {
      return code.replace(/APP_CONFIG/g, JSON.stringify(app_config));
    }
  }
}],
// 然后在 main.tsx 中 import 该 html 文件
```


**大量系统调用后端改造 - 滴滴智慧交通**
当前状况: 有大量前端系统(abcde), 每个前端系统都会配一个 nginx(ABCDE), 这些 nginx 把请求导向各种后端 xyz ... nginx 配置有时不在版本管理中, 有时会有系统开发已经过去太久, 新人对系统不熟悉, 产品让做新功能, 接口就直接让新人在老系统里找, 就找到的是浏览器发给 nginx 的请求, 于是会出现 E 依赖 A. 另外大家用的都是 cookie, 跨域访问 cookie 很不方便(cookie 的 httponly 在 react/vue 之后已成历史),  js 也不能在请求一个跨域内容时, 自己设置 cookie 头...它的控制逻辑离真正的发送请求较远. 总的就是很麻烦. 所以有想法:
弄个 reverse_proxy, 它会把响应的 Set-Cookie 复制一份, 改变名字为 X-Set-Cookie, 把请求的 X-Cookie 改变名字为 Cookie ... X-Cookie 与 Cookie 不可以同时存在(即所有这种写法的 fetch.credentials='omit')... 这样, 后端仍是想怎么写就怎么写(反正我们也控制不了后端), 前端那些旧的项目仍然不用动(Set-Cookie 仍然在, 没有 X-Cookie 时 Cookie 也不会被覆盖), 新项目可以自己灵活管理认证信息
> 其实这种大量系统, 每个系统好几个部署... 也应该用 hash-history, 而不是 browser-history


**AsyncComputed / DvaEffectQueue / VuexActionQueue**
我们需要确实考虑 vuex 的 action 是否遵从顺序. 会不会出现 `dispatch('fetchFriends', 'jack')` 之后很快又 `dispatch('fetchFriends', 'tom')` 然后是 tom 的返回值先到达, 于是 jack 的响应覆盖了 tom 的响应, 最终出现 用户以为自己看的是 tom 的朋友列表, 但实际看的是 jack 的朋友列表 这种数据错位的情况. 所以我们需要 ActionQueue, 而且在之后 `dispatch('fetchFriends', 'tom')` 时, 把之前 jack 的请求都给 cancel 掉(AbortController), 所以需要 dva 的 `call(api_fn, payload)` 这种代理, 而且完全可能是 进行到哪一步就不能 cancel 了, 则有一个 effect 中多个 call, 且规则不同 `call(api1, {cancelable: true}); call(api2, {cancelable: false})`... 其实还不够, action 还应该是 transaction 的. 其实就是每个 action 都应当成是后端的 抢购api 去写...
不过 mobx 的 action 本身就在 transaction 中, 而且 action 返回 cancelable_promise, react 事件那边可以在再一次调用时, 把上一次 cancel 掉

**iframe**
iframe 内能正常跳转, location.href = xxx; 但它不会修改 iframe 的 src... 只有 iframe.contentWindow.history/location 等能体现


**解耦**
https://www.w3cschool.cn/architectroad/architectroad-reverse-dependency-and-decoupling.html#
case 1: 不太清楚, 自己的理解是: copy paste is better than add a dependency;
case 2: 主旨是: 做好基础设施;
case 3: 没什么好说的;
case 4: 没什么好说的;
case 5: 增加服务发现, 连接上了一个, 就连接上了所有

case 1/2 是代码层面的解耦, 其实代码层面就没啥解耦可说, 业务逻辑本身是耦合的, 那代码自然也是耦合的, 要解耦, 就是要改变业务逻辑, 整理业务图, 就像一个网图一样, 移动节点位置, 让连线交叉变少. 这里节点其实就是代码
case 3/4/5 是运维层面的解耦, 其实也是改变了业务逻辑(要改代码适配这种架构)


**detect browser import**
```js
// https://gist.github.com/ebidel/3201b36f59f26525eb606663f7b487d0
// https://stackoverflow.com/questions/60317251/how-to-feature-detect-whether-a-browser-supports-dynamic-es6-module-loading

// Feature detect static imports.
function supportsStaticImport() {
  const script = document.createElement('script');
  return 'noModule' in script; 
}
// Feature detect dynamic import().
function supportsDynamicImport() {
  try {
    new Function('import("")');
    return true;
  } catch (err) {
    return false;
  }
}
// supportsDynamicImport 仍有部分浏览器检测错误
function betterHasDynamicImport() {
  try {
    return new Function("return import('data:text/javascript;base64,Cg==').then(r => true)")();
  } catch(e) {
    return Promise.resolve(false);
  }
}
function bestCheckDynamicImport() {
  let supported = false;
  try {
      eval("try { import('foo').catch(() => {}); } catch (e) { }");
      supported = true;
  } catch (e) {
  }
  return supported;
}
```


**账户系统**
```graphql
type User {
  # id 是带有业务性质的 username, 全局唯一, 各自抢注. 不允许中文, 例如 'xialvjun'
  id: ID!
  # uuid 是表明这个账户属于哪一个真实的人的. 当合并两个 account 时, 只需要把两个 account 的 uuid 设置成一样的就行, 没有其他业务语义
  uuid: String!
  # 合并 account 本身并不合并认证信息, 但可以提示用户合并(可选)认证信息
  password: String
  email: String
  mobile: String
}
```
不行, 我们是支持用户修改自己的 username 的, 如果 id 作为其他表的外键, 那修改就要所有表都修改... 所以
```graphql
type User {
  id: ID! # id 是一个业务无意义的 id, 用户无感知, 通常用 uuid, 仅仅用于外键到其他表, 避免用户做个人 id 的变更
  pid: String! # pid 是表明这个账户属于哪一个真实的人的. 当合并两个 account 时, 只需要把两个 account 的 pid 设置成一样的就行, 没有其他业务语义, 通常用 uuid, 用户无感知 。。。 或者改名叫 human_id 长度长些无所谓，含义要准确
  # 合并账户本身并不合并认证信息, 但可以提示用户合并(可选)认证信息
  # 其实认证信息并非一个 User 对应一个 email 的, 完全可以一个 User 对应 n 个 email, n 个 password.... 但因为实际效益不大, 而且可以合并账户, 让一个真实的人有多个 email, 多个 password

  username: String! # 全局唯一, 不允许中文, 例如 'xialvjun', 主要是为了方便其他人输入
  nickname: String # 全局唯一, 但允许中文, 用户自己展示
  email: String
  mobile: String
  password: String  # 用户可以用 username/nickname/email/mobile + password 来登录, 因为这种情况可能出现 A.username==B.nickname, 如果再密码相同, 就不知道了, 所以 username/nickname/email/mobile 共享一个命名空间 。。。 算了, nickname 就不弄登录了
  # 两种方式：1. 用户输入 nickname/email/mobile，自动判断它是什么，然后 username 随机；2. 判断输入的是 nickname，如果字符简单，就放到 username 上，如果不简单，就放在 nickname 上，同时 username 随机，email/mobile 也 username 随机；---- 还是 1 吧
}
```
对 User 表的所有操作都记录下来, 避免有的人长时间用 email 登录, 后解绑 email, 却又忘记了 username, 导致需要找回账号
注册时没提供 username, 则默认随机字符串

**2020 年末 哈尔滨漫展不雅照**
漫展里女主跟自己的男朋友摆各种床照(做爱)姿势, 引人不适, 被骂.
为什么男女朋友在街上亲吻, 然后两者对外表现为害羞, 这会让人祝福; 而男女朋友在公共场所摆做爱姿势, 对外表现为不在乎, 会让人讨厌?
因为前者并非主观意愿上去挑战习俗, 它是情之所至, (如果这个时候有个房间能让我们躲在里面亲热, 我们会很乐意进去, 现在只是不得不在外面亲吻, 我们也很害羞).
而后者则是挑衅, 大家都遵守这一条规则, 然后有一个人不遵守那规则, 本身这也与大家无关, 只要没有伤害到他人就好, 但是他还主动出来, 那其实就有着挑衅的味道, 就是在说"打破规则的我是聪明人, 而你们都是傻逼". 如果大家能被说服, 那那个人就是带领社会打破规则的英雄, 如果不能, 那那个人就是傻逼, 而且还挑衅大家, 自然应该被大家攻击.


**js 原型链**
<!-- Object.prototype.prototype === undefined;
Object.prototype.__proto__ == null;
Object.__proto__ == Function.prototype; // === ƒ () { [native code] }
Function.prototype.__proto__ == Object.prototype; // === { toString, hasOwnProperty, __proto__: null } -->
<!-- 有 `{ toString, hasOwnProperty, __proto__: null }` 这样一个对象 0, null 是这个对象的原型, 然后这个对象是其他   -->
null
  -> { toString, hasOwnProperty, __proto__: null }: Object.prototype
    -> Function.prototype
      -> Object
      -> Function
      -> function A: A
      -> new Function()
    -> function A: A.prototype
      -> new A()
    -> new Object()


**async_hooks**
```ts
import { createHook, executionAsyncResource, executionAsyncId, triggerAsyncId } from 'async_hooks'

const symbols: symbol[] = []
createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource()
    for (const sym of symbols) {
      resource[sym] = cr[sym]
    }
  },
}).enable()

export type Context<T> = { value: T }

export function createContext<T>(value: T, name?: string): Context<T>
export function createContext<T>(): Context<T | undefined>
export function createContext(value?: any, name?: string): any {
  const id = Symbol(name || 'context')
  symbols.push(id)
  executionAsyncResource()[id] = value
  return {
    get value(): any {
      return executionAsyncResource()[id]
    },
    set value(nv: any) {
      executionAsyncResource()[id] = nv
    },
  }
}

// async_hooks is in lexical structure
const delay = (ms: number) => new Promise((res => setTimeout(res, ms)));
const ctx = createContext(100, 'test');
let [a,b,c,d,e,f,g] = [executionAsyncResource()] as any[];

(async () => {
  b = executionAsyncResource();
  console.log(triggerAsyncId(), executionAsyncId(), ctx.value, );
  ctx.value = 200;
  console.log(triggerAsyncId(), executionAsyncId(), ctx.value, );
  await Promise.all([(async () => {
    c = executionAsyncResource();
    console.log(triggerAsyncId(), executionAsyncId(), ctx.value, );
    await delay(1000);
    d = executionAsyncResource();
    console.log(triggerAsyncId(), executionAsyncId(), ctx.value, );
    ctx.value = 300;
    console.log(triggerAsyncId(), executionAsyncId(), ctx.value, );
  })(), (async () => {
    e = executionAsyncResource();
    console.log(triggerAsyncId(), executionAsyncId(), ctx.value, );
    await delay(2000);
    f = executionAsyncResource();
    console.log(triggerAsyncId(), executionAsyncId(), ctx.value, );
  })()])
  g = executionAsyncResource();
  console.log(triggerAsyncId(), executionAsyncId(), ctx.value, );
  // console.log(
  //   '\n a == b', a == b, 
  //   '\n b == c', b == c, 
  //   '\n c == d', c == d, 
  //   '\n e == f', e == f, 
  //   '\n c == e', c == e, 
  //   '\n b == g', b == g,);
  
})();
```

**react fiber**
http://www.ayqy.net/blog/dive-into-react-fiber/
https://zhuanlan.zhihu.com/p/26027085
https://zhuanlan.zhihu.com/p/95443185
react fiber 就是 调度 react 任务的执行的一个引擎. 它把 react 组件的 各个生命周期, render 甚至事件回调(因为事件回调是虚拟事件系统,所以由 react 控制) 都当成一个任务放进任务列表中, 任务有优先级(同步执行, 下一帧执行, 下一回 render 执行等), 任务有是否可以省略(例如有新的 render 任务的话, 旧的 render 生成虚拟 dom 可以省略), 来分段执行任务, 保证 60 帧不卡顿, 直到得到一次完整的 dom patch, 此时执行 dom patch(此时可能有卡顿), 并设置 current_vdom=刚才计算出来的完整 vdom. 因为, 声明周期已经不是一一对应了, 完全可能 componentWillReceiveProps 执行多次, componentDidUpdate 执行一次


**tcp 三次握手, 其实是把 非幂等变成幂等**
我要连接了 - 我收到了你的连接请求, 已经准备好了, 你连接过来吧 - 连接(并发送数据): 第三次握手可以发送数据
这种把 非幂等变为幂等 的逻辑, 其实也适用于很多其他地方, 例如 消息的一次且仅一次的传达:
A发送消息给B - B收到消息, 向 A 发送确认收到消息 - A 收到确认, 向 B 发送确认收到确认 --- 最后 B 收到 A 的确认, 就可以开始执行消息内容了(如果是并发, 则需增加消息 id)


**stackoverflow 后端开发 DI, controller,service,repository is bad**
```md
Why not just `router + handler + single_instance_db_pool` pattern?

Many people around me say the controller-service-repository pattern is MVC.

As far as I know, the pattern MVC(model view controller) is just used for UI programming. UI programing needs states of tree shape, MVC fits it well.

But doesn't the backend programing have no state? HTTP is a stateless protocol. Yeah we have session, database to store the state, but they are totally different from UI state which is in a tree shape.

The UI state machine accept messages from anywhere include trunk/branch/leaf of the tree, and it needn't to worry about concurrency.

The backend state machine accept messages from just one point, then split by the router, it's flat.

----------

Then if the controller-service-repository pattern is not something like MVC, why do people use it?

In my opinion, `oop class` is used to create a state machine, so things like React suits it well, but things like controller/service/repository have not state, we usually use it just for its static functions even though we didn't add the `static` keyword. Don't you declare them singleton scope in Spring?

Sorry, I didn't ask a very clear question. I just think the backend development should be a request context flowing through a series of utils functions then getting the response, rather than so many concepts controller, service, repository, DI and many others.
```


**politics**
不知道 MMT是什么，但如果是跟自己想的这一套模式类似，那我完全不知道它为什么不行。

国家为所有人提供基本工资，这份工资可以让大家维持基本的低尊严生活。有人想要追求高尊严生活，会去创业或工作，创造价值(这里创造的价值养活了所有人)。国家，一需要对大家执行阶梯税率，从而控制市场中流通的钱，避免物价变动(其实变动也没太大关系，基本工资也相应变动就行)；二需要严格限制资产流出(如果地球成为统一的国家，那也不存在资产流出了)；三发展科学技术，提高生产效率；四灵活调整低尊严1生活与高尊严生活的差距，激发大家工作动力(其实在生产效率足够的今天，感觉一部分人为了实现自己的人生价值，去创造的价值都足够养活全人类)。

举个例子就一个人一生需要十万斤大米，一斤大米一块钱。我种了100万斤大米，扣税后得到50万块，其中十万块我买大米了，另外40万我别墅游艇(这就有税收的那50万养活了5个人)，然后别人卖我的40万的别墅游艇，他只拿到20万，另20万也是税收(养活了2个人)。
----
最近听到 现代货币理论(MMT) 这个词，模糊的感觉它能直接带领社会进入社会主义中期。但是网上看到的文章都是从钱，负债，央行，财政这些表面的东西去解释，东西很多，概念很复杂，看得模模糊糊地。想着你们能不能从一般价值(例如大米)，社会矛盾以及暴力机构 的角度去解释下 MMT。
----
全民发钱，让富人的负债萎缩，反而相当于富人赚得更多，因为本质上富人其实是自己的净资产为负的人。
但其实这个理由阻止全民发钱是行不通的。
1. 让负债萎缩的条件是通胀，全民发钱不一定引发通胀。
2. 全民发钱，我们也可以看做全民向国家借钱，这样就能为不习惯负资产的人也提供了负资产。让大家跟富人一样负资产。




**自己在 stackoverflow 上问为什么 spring 类框架都是 controller service repository 模式，而不是 router handler db_pool 模式，遭删除**
建立三种类型的提问网站，1. 具体知识的提问网站，类似 stackoverflow；2. 具体逻辑的提问网站，用户可以说明一个问题，答者提供算法（例如 web-guard 里的批量定时轮询任务）；3. 观点争论的网站（所有人投票，随时可以改变投票，可以增加候选，每个候选可以有自己的区，里面有文章支持自己的观点，投票该观点的人可以投票置顶文章，每人有 5 票，可以置顶 5 篇文章）（可以是甜咸之争，可以是空格 tab 之争，可以是 spring DI 模式 vs no DI），让知识和观点沉淀出来，而不是淹没在争吵中。


**promise**
```ts
function createPromise<T>() {
  let resolve: (value: T | PromiseLike<T>) => void = null as any;
  let reject: (reason?: any) => void = null as any;
  let promise = new Promise<T>((_res, _rej) => {
    resolve = _res;
    reject = _rej;
  });
  return { resolve, reject, promise };
}
function makeCancelable<T>(p: Promise<T>) {
  const wp = createPromise<T>();
  p.then(
    value => wp.resolve(value),
    reason => wp.reject(reason),
  );
  const cancel = () => {
    wp.resolve = () => {};
    wp.reject = () => {};
  };
  (wp.promise as any).cancel = cancel;
  return wp.promise as Promise<T> & { cancel: typeof cancel };
}
```


// parallel {
// 	loop {
// 		const conn = socket.accept();
// 		Thread.run(handle, conn);
// 	}
// }

// run_concurrently([myfunc, anotherfunc])

// async with trio.open_nursery() as nursery:
//     while True:
//         incoming_connection = await server_socket.accept()
//         nursery.start_soon(connection_handler, incoming_connection)


# 如何惩罚炒房者
https://www.zhihu.com/answer/85475145
可以按全民过去买房卖房上赚的钱，给全民发钱，在房产上赚的多的，就发钱少。以此惩罚炒房者。或许有人想房子可以立马涨价啊，但其实这个发钱操作是在房价崩盘后实施的，而国家其实很容易就能让房价崩盘。另外还要发钱不影响其他资产持有者，可以对资产评估，等比增加钱。
当然，如果是纯共产主义，那其实发钱应该是为了惩罚持有任何资产的人的，不仅仅指房产。

# RestApi Schema
有的公司还不能迁移到 graphql，可以弄个代理层，给 代理层配置 类似 graphql.schema 的配置。。。
然后客户端请求代理层，服务端开发者自己调试接口时也用那个代理层调试，从而职责匹配。。。
接口开发都 put(幂等) 和 post(非幂等)
> 有三种方案
  1. 让后端接口按统一的规范写(url上没有参数，url没有深层调用，所有接口都是 post，接受 json 参数，返回值结构 {data:T,error:string})。这种不能处理旧接口，不过也可以理解为旧接口不用管，即已经有的能正常运行的代码，就不要乱重构了。这样形成一个命令行程序，只要置顶 baseUrl 就好了
  2. 写 node 层，去做参数转换和响应转换。
  3. 写个网页 UI，在 UI 上操作哪个请求指向哪个连接，各种转换逻辑。甚至可以变更 graphql 的概念，例如通用响应结构，继承通用响应结构。
   >  2 有问题就是 这会让公司里的人都认为这 node 代码应该由前端去写，如此就做不到职责匹配了。


**如果没有共同爱好的话**
就算能开始聊, 那之后要聊什么呢....


**掌控气象**

高空气球风力发电机，搜索到有类似的想法 https://patents.google.com/patent/CN101476546A/zh，用这种东西获取全球空气流动信息。
弄许多可快速移动和部署的大风扇（风力发电机？）根据全球空气流动信息，四两拨千斤，让全球风调雨顺。
http://blog.sciencenet.cn/blog-274385-828801.html


**react useImmer**
```ts
function useImmer<S>(initialState: S | (() => S)) {
  const [s, ss] = useState(initialState);
  const immer = useCallback(
    <T extends any[]>(fn: (s: S, ...events: T) => any) => (...events: T) =>
      produce(s, s => {
        fn(s as S, ...events);
      }),
    [s],
  );
  return [s, immer, ss] as const;
}
```


**myown forgo**
```tsx
const { render, onBeforeMount, onMounted, onUnmounted, onBeforeUpdate, onUpdated, ...xxx } = forgo;
// update 分内部自己的 update 和外部收到新 props 的 update，以及 provide 收到新值的 update，对应的生命周期也许需要区分开。
// 一样可以有 watch，哪怕并非响应式，因为 watch(props => props.a) 的形参 props 会被调用两次
const A = (init_props, ctx) => {
  const { refresh } = ctx;
  watchProps(props => props.a, (current_a, previous_a, invert) => {});
  let local_state = 1;
  watch((props) => local_state, (current_counter, previous_counter, invert) => {});// 如果是这种，那就是不区分三种形式的 update
  // return (props) => <div></div>  // 1
  // return (props, ctx) => <div></div>
}

const B = (init_props, init_data_ctx, self_ctx) => {
  const { update } = self_ctx;
  init_data_ctx[user_symbol];
  let ref = null;
  return {
    render: (props, data_ctx) => <div></div>,
    ref: (ele) => ref = ele,
    instance: {}
  }
}
```


**typescript macro**
atomic css / windicss / tailwindcss 这些可以用 macro 做
react 渲染 svg，根据 color 属性，预先分析 svg，确定 color 用在哪里，把 svg 转变为 react 组件


**问面试官的问题**
反向过滤：
怎么看低代码平台
自己认为的最佳技术栈实践 - 数据库-后端(ts-sql-query, graphql)-前端(react-mobx)
微前端
spring- controller，model，dao，service，view 。。。。。
serverless



**UI编程思想**
1. 数据变形，子状态定义越晚越好
2. 变形后数据，子状态 使用越广越好
3. js比模板好

3 绝对正确，1 比 2 更重要



**连接，幂等**
所谓连接，就是通信的多方共享状态：a知道b名字，a知道b知道a的名字，b知道a的名字，b也知道a知道b的名字，于是，b只要听见a说了句“b，请xxx”，b就能知道a是在对它说话，知道a不是在无意义地说胡话 ---- 这就是连接。
连接协议里，所有的“消息传递的错误处理”，都是把非幂等的状态同步变为幂等的状态同步。a说“b，请xxx”，b收到一条消息，a以为出错了，又说了次“b，请xxx”，于是b共收到两条消息，于是b执行xxx操作执行了两次。所以a可以说“b，消息1，请xxx”，b执行xxx，a没收到b的确认，于是重复一次，b收到消息，发现之前已经收到过这个消息，于是忽略。


**所谓选择，就是承认失败**
假设自己是一个老师，给一群小学生教学。给他们两份文档，一份是讲解一个数学知识点的文档，对应有题目，一份是讲解一个游戏规则的文档，对应有游戏。
学生会更懂游戏规则。这个结果有三层原因：直接原因是学生是带着大脑去看游戏文档的，但没有带着大脑去看数学文档。深层原因是小孩子对游戏更感兴趣。根本原因是小孩子人生经历不足，不明白什么更重要，更能得到更好的人生体验。
可是，如果是说是为了更好的人生体验而选择知识，似乎又是世故，是承认自己弱小，承认失败。
但另外也有问题是 怎样才能叫人生经历足了呢？ 1.赤子之心，2.跟经历过人生起伏之后的看得开，3.以及经历人生起伏之后仍然保持的赤子之心，到底哪个更珍贵。
也许1是幼稚，也许2是失败，也许3是另一种失败和幼稚。似乎一切只能回到结果论。可如果是结果论的话，没有赚到钱的自己凭啥让人喜欢。这同时又是另一个结果论，没人喜欢自己的世界，自己也不用去喜欢这个世界。


**分层架构**
https://www.quastor.org/p/software-architecture-patterns
好多人喜欢说分层架构是，要有 dao 层，有 service 层，有 controller 层。
但其实那恰恰不是分层。
软件设计中，最明显的分层是 前后端分离。
然后 前后端分离 会有一个接口出入口。
分层架构，应该层与层之间要有个接口出入口。最终就是每一层就是一个单例，最终整个应由有三四个单例对象来完成功能。
所以后端弄分层，就应该是三个单例对象完成功能，server -> router -> db。


**各种管理系统的默认状态的选择要注意**
例如一些车辆管理系统，车上有 IOT 设备，连接互联网，发送自身状态到系统上。系统上会显示车辆是在线还是离线。
但是因为各种原因，例如后端脏数据，前端部分接口请求出错 等等原因，导致有车，但没有信息知道车是在线还是离线。但是前端始终要显示一个状态，哪怕是前端自己的状态。
这种时候，要么增加个 未知 状态，要么有个默认状态。默认离线 一般应该比 默认在线 好。但编写代码的时候可能就有人没有注意 默认状态的选择 这一点。


**roxy**
jsx 的 props 还是一个 T extends {key?:PropertyKey}, 而不是 any, 因为要放 key, 而且 new_jsx 也不是把 key 放进别的地方, 它甚至是把所有的东西都放进 props 里, key, ref, children


**requestAnimationFrame**
```js
console.log('a');
requestAnimationFrame(() => console.log('b'));
requestAnimationFrame(() => console.log('c'));
Promise.resolve().then(() => console.log('d'));
console.log('e');
// a e d b c;
```

```js
console.log('a');
requestAnimationFrame(() => {console.log('b');Promise.resolve().then(() => console.log('bb'));});
requestAnimationFrame(() => console.log('c'));
Promise.resolve().then(() => console.log('d'));
console.log('e');
// a e d b bb c;
```

```js
console.log('a', performance.now());
requestAnimationFrame(() => {console.log('b', performance.now());console.log('bb', performance.now());});
requestAnimationFrame(() => console.log('c', performance.now()));
console.log('d', performance.now());
// a 2627.199999988079
// d 2627.2999999821186
// b 2630.5
// bb 2630.5999999940395
// c 2630.5999999940395
// OR
// a 51107.29999998212
// d 51107.5
// b 51113.79999998212
// bb 51113.79999998212
// c 51114
// OR
// a 154118
// d 154118.19999998808
// b 154130.29999998212
// bb 154130.40000000596
// c 154130.5
// 说明 --- 错，这没有说明什么，raf 和 performance 不能用 console.log 来测试，console.log 是阻塞式 io
```


console.log('a', performance.now());
requestAnimationFrame(() => {console.log('b', performance.now());});
requestAnimationFrame(() => console.log('c', performance.now()));
console.log('d', performance.now());

```js
var pn = [];
pn.push(['a', performance.now()]);
pn.push(['b', performance.now()]);
pn.push(['c', performance.now()]);
pn.push(['d', performance.now()]);
pn.push(['e', performance.now()]);
pn.push(['f', performance.now()]);
console.log(pn);
// 全部一样
```

var pn = [];
pn.push('a');
requestAnimationFrame(() => pn.push('b'));
requestAnimationFrame(() => pn.push('c'));
Promise.resolve().then(() => pn.push('d'));
pn.push('e');
console.log(pn);

```js
var pn = [];
pn.push(['a', performance.now()]);
requestAnimationFrame(() => {pn.push(['b', performance.now()]);pn.push(['bb', performance.now()]);});
requestAnimationFrame(() => pn.push(['c', performance.now()]));
pn.push(['d', performance.now()]);
console.log(pn);
// 0: (2) ['a', 633232.099999994]
// 1: (2) ['d', 633232.099999994]
// 2: (2) ['b', 633246.6999999881]
// 3: (2) ['bb', 633246.6999999881]
// 4: (2) ['c', 633246.6999999881]
```

```js
var pn = [];
pn.push(['a',performance.now()]);
requestAnimationFrame(() => {pn.push(['b',performance.now()]);Promise.resolve().then(() => pn.push(['bb',performance.now()]));});
requestAnimationFrame(() => pn.push(['c',performance.now()]));
Promise.resolve().then(() => pn.push(['d',performance.now()]));
pn.push(['e',performance.now()]);
console.log(pn);
// 0: (2) ['a', 932672.6999999881]
// 1: (2) ['e', 932672.6999999881]
// 2: (2) ['d', 932672.7999999821]
// 3: (2) ['b', 932679.7999999821]
// 4: (2) ['bb', 932679.7999999821]
// 5: (2) ['c', 932679.900000006]
```

```js
var pn = [];
pn.push(['a',performance.now()]);
Promise.resolve().then(() => pn.push(['b',performance.now()]));
Promise.resolve().then(() => pn.push(['c',performance.now()]));
Promise.resolve().then(() => pn.push(['d',performance.now()]));
pn.push(['e',performance.now()]);
console.log(pn);
// 0: (2) ['a', 1022847.2999999821]
// 1: (2) ['e', 1022847.2999999821]
// 2: (2) ['b', 1022847.5]
// 3: (2) ['c', 1022847.5]
// 4: (2) ['d', 1022847.5]
```


**VR 系统界面设计**
我们有很多种窗口，有类似 Oculus Quest2 在 2021 年一样的界面，用手柄光标去指向操作，然后这种界面还被设定为相对现实定位，我们可以走近它。
还应该可以有窗口相对人身定位（窗口在我的右侧，我转向后，它仍在我的右侧，我横着向右走，它也仍在我的右侧），用手指触碰操作。
推荐操作是：
VR 中，五指张开代表松开，五指握实拳代表握住，则之后被握住的东西跟手的位置以及手背平面的方向应保持一直。如果物体不可扭转，但左右手同时操作造成扭转，或者物体不可放大缩小，但左右手同时操作造成放大缩小，则根据幅度智能判断（或者用户设定惯用手）。用户同时会有四只手，两只自己的手，另外两只是用户伸直手臂仍不能触碰到远方时，自动延长的虚拟手臂（不一定要显示成手臂，可以就一条光线，甚至不显示，但手要显示成手的样子，同步真实手的手势），自动延长到“可判物”为止，可判物一般是窗口，ar 中还可以是地面，墙壁（隔空在墙壁上画画）等。手收回就等比收回。虚拟手延迟显示，手要摸的东西在臂长范围内，就没有虚拟手。
窗口控制：
现实定位窗口处于远处，双手伸直，五指张开放窗口两侧，握实，开始定位窗口（其实本可以单手伸直就去定位的，但窗口本身也有手势操作，尽管手势操作是先经过系统，后进入应用，但避免冲突，系统还是尽量少拦截操作，所以只双手才定位窗口），双手缩至胸前（此时虚拟手消失，窗口也定位到胸前，变更为由实体手操控窗口了，且这个过程中进大远小，窗口也缩到双手距离的大小），双手把窗口放到一个位置，向两侧转动手，像拧螺丝一样，双手张开（即松开物体），此时窗口就相对身体定位了（回到胸前再推出去就是相当于从身体延申出去一条梁，窗口是固定在梁上），如果想把窗口按身体定位，但超出臂长，可以手抓住梁再往外抽（拧螺丝后，一只手不松开，另一只手松开后，去抓梁），或者所有相对身体定位的元素都有可见的梁。
相对身体定位窗口变更为 现实定位窗口，只要砍掉梁就可以了


**async generator make observable**
```ts
async function* makeObservable(observable) {
    const defers = [makeDefer()];
    observable({
        next: v => {
            defers[defers.length - 1].resolve(v);
            defers.push(makeDefer());
        },
        throw: e => {
            defers[defers.length - 1].reject(e);
        },
        return: v => {
            defers[defers.length - 1].resolve(v);
        },
    });
    while (1) {
        const defer = defers[0];
        if (!defer) return;
        const value = await defer;
        defers.shift();
        yield value;
    }
}
function makeDefer<T = any>(): Promise<T> & {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
} {
    let defer = null;
    const p = new Promise<T>((resolve, reject) => {
        defer = { resolve, reject };
    });
    Object.assign(p, defer);
    return p as any;
}
var observable = makeObservable(observer => {
    const ws = new WebSocket('adsg');
    ws.onopen = () => {
        ws.send('dasfadsg');
    };
    ws.onmessage = observer.next;
    ws.onerror = observer.throw;
    ws.onclose = observer.return;
});

for await (const m of observable) {
    console.log(m);
}
```

注意，generator 最后 return 的值不会被 forof 拿到。虽然可以手动 .next 调用拿到（在 g.done 第一次等于 true 的时候）。即
https://stackoverflow.com/a/37202835/3127028
```js
function* ggg() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}
for (const n of ggg()) {
  console.log(n); // 只会输出 123，不会输出 4。目前不知道这是什么考量
}
```


**id生成: uuid 赛高**
好多后端面试都喜欢问 id 生成策略，然后来 雪花id(snowflake) 算法，1比特浪费，41比特毫秒时间戳，10比特机器码，12比特随机（应该是随机而不是顺序）
但其实 uuid 本身就有这功能，还更好：
uuid 分 v1, v3, v4, v5。其中对应雪花算法的就是 v1: 时间戳 + 机器mac地址（这不比手动分配的机器码方便） + 随机（无非是占用空间大一倍而已，uuid 是 128bit，用一个 u128 表示，雪花 是 64bit）。另外，uuid v4 是完全随机的 128bit， v5 是做衍生id （用一个 字符串 + 另一个 uuid 来生成，例如 一个用户有一个 id，然后一个用户只有一个钱包，则 钱包id=v5('钱包',用户id)），至于 v3 其实是跟 v5 一样的，不过 v5 用的 sha1，v3用的 md5，即 v3 过时了


**新网络架构，解决 ddos**
车小胖，刚才看到 ddos 攻击，然后有个想法。ddos 攻击根本原因是：网络中间设备都假定流量是好的，同时流量接收方也没有证据证明自己就是流量接收方，从而提前让前面的中间设备帮忙拒绝流量。可能有点模糊，不过继续看。要解决那上面的问题，我们可以用 非对称加密 来创建网络（没有 ip 协议了）。加入网络前，电脑自己生成一对公私钥，然后在路由器上注册自己（就是把公钥和网口绑定）。然后如果来了 ddos 流量，电脑判断出这是恶意流量，可以拜托上层路由直接把来自于他且发给自己的流量给拒绝掉。电脑只需要签名一条这样的命令并发出去，路由器就可以操作了。
现在问题是掩码怎么办，没有掩码，那路由表就太大了，不可能实现


**rust类型**
```rust
trait A {
    fn a(&self) -> usize;
}
impl A for String {
    fn a(&self) -> usize {
        self.len()
    }
}

trait B {
    fn b(&self) -> usize;
}
// 不可以 impl B for impl A {}
// 不可以 impl B for dyn A {}
// 但可以 impl B for &dyn A {} 或 impl B for Box<dyn A> {}，但 Box<dyn A> 要经过一次强制类型声明
// 但其实最正确的做法应该是：这种不需要再经过一次强制类型声明
impl<T: A> B for T {
    fn b(&self) -> usize {
        self.a() * 10
    }
}
fn main() {
    let s = String::from("Hello, world!");
    println!("{}", s.b());
}
// 上面的强制类型声明的问题应该还是自己对 rust 不熟悉的问题，但要说的是：impl A 作为类型时，其实就是泛型的缩写。也就是说“泛型有三种写法”：
// 1. `fn a(arg: impl Tr) {}` or `fn a() -> impl Tr {}`; // 最简便，但只能 impl 一个 trait 。。。呃，其实可以多个，例如 sqlx::error::Error 有 `Tls(Box<dyn Error + Send + Sync + 'static, Global>)`
// 2. `fn a<T: Tr>(arg: T) {}` or `fn a<T: Tr>() -> T {}`; // 能 impl 多个 trait, 例如 <T: Ta + Tb>
// 3. `fn a<T>(arg: T) where T: Tr {}`; // 除了能 impl 多个 trait, 还能间接判断, 例如  `fn a<T>(arg: T) where Option<T>: Debug {}`
// 但要注意，3 是能间接判断，却不能反向判断，不能写成 `fn a<T>(arg: T) where String: T {}`
// 根本原因是 rust 是完全与内存相关的，trait 对于 rust 并非一个类型，只有 struct 才是类型
// 然后 一个类型不能重复实现同一个 trait(否则运行一个函数都不知道运行哪一个)。。。 所以 type A = Option<AnyMap>; impl XXX for A {} ...这种代码说不定就错了，因为完全可能别人也写了 impl XXX for Option<AnyMap>;
```



**react.setState 的坑**
https://www.jianshu.com/p/56711ae6c4a0

**leaflet / mapbox-gl / openlayers / cesium**
leaflet 最小，其次 mapbox-gl 或 openlayers，至于 cesium 最大（不过不知道 cesium 是做啥的）
https://www.jianshu.com/p/ae73b3990259


# WebSocket 界面
WebSocket 在界面上应该要有显示连接状态的地方，这样前端代码才不至于无法选择连接错误发生多少次后才停止重试。而且像某些协议里的连接重试时间不断变长，其实体验也不好

# 傻逼的 click 延迟
```vue
<script setup>
import { ref, shallowRef, watch, getCurrentInstance } from 'vue';

const num = ref('');

const data = [
  46, 93, 47, 37, 0, 67, 38, 35, 4, 67, 28, 13, 49, 64, 83, 16, 4, 80, 67, 35,
  30, 34, 60, 42, 61, 67, 86, 83, 11, 46, 0, 17, 0, 83, 37, 1, 6, 28, 70, 50,
  14, 37, 98, 32, 63, 5, 69, 37, 95, 6, 90, 40, 17, 27, 52, 87, 82, 72, 68, 56,
  86, 52, 27, 32, 26, 21, 70, 71, 37, 89, 43, 81, 91, 20, 47, 96, 68, 85, 84,
  33, 12, 20, 55, 12, 42, 16, 66, 57, 41, 76, 78, 41, 3, 56, 7, 32, 57, 64, 62,
  3,
];

const list = shallowRef();
const search = (txt) => {
  if (!txt) return (list.value = undefined);
  list.value = data.filter((v) => v > (parseInt(txt) || 0));
};

const select_item = (item) => {
  alert('select_item' + item);
};

const ins = getCurrentInstance().proxy;
const blur1 = () => (list.value = undefined);
const blur2 = () => ins.$nextTick(blur1);
const blur3 = () => setTimeout(blur1);
const blur4 = () => setTimeout(blur1, 10);
const blur5 = () => setTimeout(blur1, 100);
const blur6 = () => setTimeout(blur1, 1000);

// 当把 li 上的 @click 换成 @mousedown 则哪怕是 blur1 都是正常调用的
</script>

<template>
  <div>
    <input
      type="number"
      v-model="num"
      @focus="search($event.target.value)"
      @input="search($event.target.value)"
      @blur="blur1"
    />
  </div>
  <ul v-if="list && list.length">
    <li v-for="it in list" @click="select_item(it)">{{ it }}</li>
  </ul>
  <div v-if="list && !list.length">NO DATA</div>
</template>
```

# useApi
```ts
export const useApi = <F extends (...args: any[]) => PromiseLike<any>>(fn: F) => {
  let _args: Parameters<F> = null!;
  const state = shallowRef({
    loading: false,
    error: null,
    args: null as Parameters<F> | null,
    res: undefined as Awaited<ReturnType<F>>,
  });
  return {
    get value() {
      return state.value;
    },
    set value(v: typeof state.value) {
      state.value = v;
    },
    fn: ((...args: any) => {
      _args = args;
      state.value = { ...state.value, loading: true, error: null };
      return fn(...args).then(
        res => {
          if (_args !== args) return new Promise(_ => _);
          state.value = { ...state.value, loading: false, args, res };
          return res;
        },
        error => {
          if (_args !== args) return new Promise(_ => _);
          state.value = { ...state.value, loading: false, args, error };
          throw error;
        }
      );
    }) as F,
  };
};
```

# vue 写 css 主题
vue scoped css 写主题无需管 :global 之类的东西，因为 scoped 添加的属性只在后代选择器的最后一个选择器上添加，所以前面的部分其实是全局的

# makeResource
```ts
/**
 * 创建一个资源，所有组件共用同一个资源，当资源不被任何组件使用时销毁资源
 * reset 是用于当资源损坏的时候（例如 websocket 连接断开，factory 里已经决定不再自动重连了，那么可以把 t 设置为空，从而在下一次别的组件 consume 的时候能重建 t）
 */
const make_resource = <T>(factory: (reset: () => void) => T, destroy: (t: T) => void) => {
  let t: T = null!;
  let count = 0;
  const consume = () => {
    t ??= factory(() => t = null!);
    count++;
    return t;
  };
  const release = () => {
    count--;
    if (!count) {
      destroy(t);
      t = null!;
    }
  };
  return { consume, release };
};

export const { consume: connect_ws, release: close_ws } = make_resource(
  reset => {
    // 这个比较特殊，因为需要自动重连，所以需要内部可变性，一般不需要内部可变性的资源可以直接返回资源
    const ref: { ws: WebSocket } = { ws: null! };
    connect();
    let connect_times = 0;
    return ref;
    function connect() {
      connect_times++;
      if (connect_times > 5) {
        reset();
        return();
      }
      ref.ws = new WebSocket('');
      // 无限重连
      ref.ws.onclose = connect;
      ref.ws.onmessage = msg => {};
    }
  },
  t => t.ws.close()
);
```

# useSafeActivatedDeactivated
```ts
export const useSafeActivatedDeactivated = (on_activated: () => any, on_deactivated: () => any) => {
  // ? 某些情况下会出现打开并显示组件时，触发了 onMounted，却没有触发 onActivated。原因似乎是因为 keep-alive.include 在打开组件时没有该组件
  let is_activating = false;
  const _on_activated = () => {
    if (is_activating) return;
    on_activated();
  };
  const _on_deactivated = () => {
    if (!is_activating) return;
    on_deactivated();
  };
  onMounted(_on_activated);
  onBeforeUnmount(_on_deactivated);
  onActivated(_on_activated);
  onDeactivated(_on_deactivated);
};

export const useSafeActivatedDeactivatedTimeout = (on_activated: () => any, on_deactivated: () => any, ms: number) => {
  let timeout = 0;
  useSafeActivatedDeactivated(
    () => {
      if (!timeout) {
        on_activated();
      } else {
        clearTimeout(timeout);
        timeout = 0;
      }
    },
    () => {
      timeout = setTimeout(() => {
        timeout = 0;
        on_deactivated();
      }, ms) as any;
    }
  );
};
```


# wait 
```ts
type Awaitable<T> = T | Promise<T>;

export const wait = async (fn: () => Awaitable<boolean>, ms: number, { step = 0, signal = null as any as AbortSignal }) => {
  const now = Date.now();
  while (true) {
    const res = await fn();
    if (res === true) return true;
    if (signal?.aborted) return false;
    if (Date.now() - now > ms) throw '超时';
    await new Promise(res => setTimeout(res, step));
  }
};

export const wait_strict = async (fn: () => Promise<boolean>, ms: number, { step = 0, signal = null as any as AbortSignal }) => {
  const timeout = {};
  let race_res = null;
  race_res = await Promise.race([
    new Promise(res => setTimeout(() => res(timeout), ms)),
    (async () => {
      while (true) {
        const res = await fn();
        if (res === true) return true;
        if (signal?.aborted) return false;
        if (race_res) return;
        await new Promise(res => setTimeout(res, step));
      }
    })(),
  ]);
  if (race_res === timeout) throw '超时';
  return race_res as boolean;
};

```

# 电脑文件管理
对于下载的大文件（各种压缩包，程序安装文件，音视频等媒体文件），只需要区分是 public 还是 private 就行，除了 public/private 以外，各自都混沌地放在一个目录里，用 标签系统去管理（标签可以给文件打标签，也可以给文件夹打标签（因为有些下载文件是种子，有目录，里面有少量小文件））
对于用户产生的文件（例如程序安装目录，工作项目目录，压缩包解压目录-也是程序安装目录），就相对有目的性，而且小文件太多，
然后简便访问，可以用 subst M: D:\Download\ 命令 来把目录给映射为分区。 subst 的命令里删除虚拟映射是 subst /D M:

TotalCommander 有给文件加注释的功能，而且还不影响文件的 hash

感觉最合适的就是 下载统一放在一个目录。然后 有 下载的分类目录，里面放 下载的东西的 symbol link （放 symbol link 而不是 hardlink , 也不是 目录连接点junction link，目录连接过时 https://ourtechroom.com/tech/junction-vs-symbolic-links/#:~:text=Junction%20Links%20works%20only%20for,both%20absolute%20and%20relative%20path. ） 
hardlink 则因为只能用于文件，如果是复制目录，但文件是 hardlink，则在目录里创建新文件不会被同步（虽然一般来说不会动修改的东西，不会往 下载的种子文件夹内放其他东西，但也可能有例外，例如想给下载文件里放上之前的下载网页地址，就 nushell `echo {url:'xxxx'} | save a.mp4.json` 和 `open a.mp4.json | upsert url xxxx | save a.mp4.json`）。。。虽然 pnpm 是目录用符号链接，文件用硬链接，但目前没有这样的工具，干脆整个就符号链接算了
也就是说有目录
D:
  downloads
    a.mp4
    b.mkv
    cccc
      c.exe
      c.txt
  tags
    programming
      a.mp4.symbolic
      cccc.symbolic
    vtuber
      b.mkv.symbolic
  user
    .config/c/.c.conf
  apps
    // apps 里可以分 tag，例如 game, util 这种，也可以不分，因为 apps 其实是一个生命周期挺短的文件夹，换电脑，卸载软件，它都没了
    cccc
      cccc.symbolic - 可以有，可以没有，看自己的使用方便程度
      launch_c.exe

# p2p 审查对抗
i2p 很好，但是有缺点就是谁都能知道你使用了 i2p，也就是政府可以调试 i2p 软件，连接进 i2p 网络，看到都有哪些 ip 连接了 i2p 网络，政府可以根据 ip 抓人，就算不抓人，给你停网两天也够你受的。而事实上所有的 p2p 都必然是这样，知道都有谁使用了该 p2p 网络。
所以需要有 half point to point (hp2p) ，在用户可以自己选择是否服务其他节点（替别人转发流量，帮别人查询文件 等等），用户可以自己选择初始连接哪些节点，可以黑名单节点，可以只连接哪些节点，黑名单其他全部节点。服务于他人的节点是 英雄节点，其有现实的力量可以抵抗政府抓人或断网。政府也可以假扮英雄节点，来找到谁连接了 p2p 网络，这种是 间谍节点。只要自己不做英雄节点，也不连接间谍节点，就不会被发现自己有使用该 p2p 网络。除非说政府看谁的流量有流向英雄节点，但那也只能说明你跟英雄节点正常交流，并不能说明你有使用 p2p 网络，甚至你完全有可能只是在使用英雄节点所在机器提供的其他服务，完全不知道他有在运行 p2p 网络。
英雄节点可以手动维护，也可以英雄节点自己自发的判断。普通人连接一个自己相信的英雄节点，然后那个英雄节点把其他的他认为也不错的英雄节点告诉普通人。然后有用户也想要提供服务，那它一开始只能给英雄节点提供服务，等到服务得多了，英雄节点判断它是一个好节点时，才愿意在“告诉普通人其他英雄节点”这一步把它也带上。

网络层级 + 网络中继 也很有趣，能有效抵抗审查。例如 用 qq 发文件就是一种网络，英雄节点收到了普通节点的流量，可以通过 qq 转发给其他英雄节点。这就是 基于ip网络的i2p 与 基于qq网络的i2p 中继了


# 视频解码 降低延迟的一个点子
https://tvoskit.cn/index.php/article/22.html
I帧.(关键帧,无需参考其他帧) P.(向前参考I. P.帧) B.(向前和向后参考I. P.帧)
压缩率排序: B >P>I帧，B帧压缩率最高，失真最多
2个I帧之间 组成GOP(Group of Picture)
IDR帧(Decoded Picture Buffer): 特殊的I帧,一般是在第一个I帧,立马清空参考帧列队,并将解码数据全部丢弃, 后面的帧不能参考IDR前面的帧, 有了IDR帧就能从随意点起播, 如果没有IDR帧随意点起播会崩溃
收到IDR帧, 解码器需要重新更新PPS和SPS参数
解码必须包含I. P.帧
I. P.帧之间插入的B.帧越多压缩比越高，然后增加B帧增加延迟
直播时b帧丢弃，加快直播播放，客户端无法保证是不是立马接受到后面的B帧数据，最后用户看到的是永无止境的等待，b帧双向参考,参考向前向后参考I. P.帧
如上图：I frame 的解码不依赖于任何的其它的帧.而p frame的解码则依赖于其前面的I frame或者P frame.B frame的解码则依赖于其前的最近的一个I frame或者P frame 及其后的最近的一个P frame

知道上面的知识后，大概能够想到所有的视频解码都是 I/P/B.帧 的概念。【I帧.(关键帧,无需参考其他帧) P.(向前参考I. P.帧) B.(向前和向后参考I. P.帧)】
但是帧的下载是需要时间的，帧的解码也是需要时间的。尽可能让越早需要的帧越早下载到，就能降低解码需要等待帧下载的等待时间。所以可以把 B 向后参考的 I.P.帧 编码到 B 的前面，则会再下载 B 之前先下载到 B 需要的 I.P ，之后在下载 B 的时候就把 I.P 给解码了（但没有播放），之后下载完 B 后就可以立即解码并播放 B 了，所以视频帧的顺序是

原本是: IBBBPBBBPBBBIBBBP
现在是: IPBBBPBBBIBBBPBBB
原本播放占用内存为 B*n + I + P 。。。 播放顺序是按文件的下载顺序来的，
现在播放占用内存为 固定的 3 帧，因为 B 序列是下载后立即解码播放的，只要保留 B 前面的两个 IP 就好  。。。 而播放顺序，因为只需要管 3 个帧的内存，则是：、
I__ 等待，IP_ 播放I，IPB 播放完I后播放B然后立马释放掉B变成 IP_，IPP 播放左边的P然后释放掉，右边的P左移变成 IP_，IPI 播放P然后释放掉左边的已经播放的I变成 PI_ 。。。。
上面的描述方式太繁杂，用 大写IPB 表示已播放，小写表示未播放，中划线表示转化/释放
`i__,ip_-Ip_,Ipb-IpB-Ip_,Ipp-IPp-I_p-Ip_,Ipi-IPi-_Pi-Pi_,Pib-PiB-Pi_,[Pip-PIp-_Ip-Ip_,Pii-_Ii-Ii_](Ip_/Ii_ 两者等价)`


# 实时转换视频
有的系统里拿到的原视频是 h264 裸流，不是 mp4 文件，本来理应是拿到裸流文件后，立即转换为 mp4 文件存储（事实上裸流没必要存储，转换命令是 ffmpeg -i abc.264 -c copy abc.mp4，几乎不消耗 cpu），但也可能就是有人想只存 264，不存 mp4，虽然浏览器也可以用 js/jmuxer 对 blob 做简单转换（也消耗不了多少资源）从而去播放，但是没有进度条。所以想着是不是可以对视频资源做代理，实时转换为 mp4。
remote/local 264 files -> proxy + local dir -> browser
local 264 files 相比 remote 264 files 逻辑更简单，这里不做讨论
浏览器请求视频 abc，proxy 发现 local dir 里没有 abc.mp4, proxy 内部的固定数量的 ffmpeg workers 也没有一个是 abc.264，则 proxy 运行 ffmpeg -i remote/abc.264 -c copy local/abc.mp4，proxy 轮询 local dir，发现 abc.mp4 立即发回响应，但不给 Range header。如果 proxy 发现 local dir 里有 abc.mp4，ffmpeg workers 里也有 abc，则也是立即响应，但不给 Range header。如果 local dir 里有 abc.mp4，而 workers 里却没有 abc，说明 abc 已经转换完成，则立即响应，并提供 Range header。当然，所有的客户端等待都有超时错误逻辑。

其实用 ffprobe -i abc.264 看下，再对比下 ffprobe -i abc.mp4 可以发现区别：
```264
Input #0, h264, from 'test.264':
  Duration: N/A, bitrate: N/A
  Stream #0:0: Video: h264 (Main), yuv420p(progressive), 288x704, 25 fps, 25 tbr, 1200k tbn
```

```mp4
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'copy.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf59.16.100
  Duration: 00:21:32.00, start: 0.000000, bitrate: 622 kb/s
  Stream #0:0[0x1](und): Video: h264 (Main) (avc1 / 0x31637661), yuv420p(progressive), 288x704, 621 kb/s, 25 fps, 25 tbr, 1200k tbn (default)
    Metadata:
      handler_name    : VideoHandler
      vendor_id       : [0][0][0][0]
```

https://www.cxymm.net/article/zhuix7788/21158301

fps 是帧率，tbr 也是帧率，一者是拍摄帧率，一者是播放帧率（应该是 fps 是播放帧率，tbr 是拍摄帧率），两者一般相同，但有时为了兼容旧的标准（旧的因为一些物理原因导致的故意错开），可能会不同，播放器会根据两者的差，决定平均一段时间会丢弃掉几帧。tbn 是把一秒分为多少个时间单位，可以被 tbr 整除。例如 NTSC 标准 fps=29.97，tbr=30，（NTSC标准把播放帧率稍微调低一点是为了消除由彩色信号及伴音信号所產生的圖像干擾，欲知详情，参看Wikipedia：[link](https://zh.wikipedia.org/zh/NTSC%E5%88%B6%E5%BC%8F)。），后来的数字视频没有这个限制了，但要兼容旧标准，于是有了这么多麻烦的东西。则是每 3000 帧（即 100 秒），都应播 3000 帧，实播 2997 帧，视频播放器会根据预置的配置，也可能根据人体可感知的时差来动态计算，这里就是
> 这样，如果利用每秒30帧的速度来采集视频，而用29.97f/s的速率来播放视频，每个小时就少播放了108帧，这样播放时间会比真实时间变慢。为了解决这个问题，SMPTE 30 Drop-Frame就采取了丢掉这108帧的方式，具体策略是每1分钟丢两帧，如果是第10分钟则不丢，所以每小时丢掉的帧数是：2×60 – 2×6 = 108 帧。更具体的信息，可以参考：[link1](http://www.dropframetimecode.org/), [link2](https://hi.baidu.com/mqstudio/blog/item/1f4b9712950233cec2fd783e.html)。

h264文件没有 时长duration，没有 比特率bitrate，因为 h264 本身就是动态比特率，在只拿到部分文件时，拿到的只能是拿到的部分的平均比特率。拿到整个文件了，根据 总帧数（解码出来多少就是多少） / 拍摄帧率tbr 就是时长了，或者是 总帧数减去应忽略的帧数 再除以播放帧率，这也是时长。纯粹的 h264 流并没有总帧数数据。既没有总帧数，从而得到时长，也没有整个文件的平均比特率，根据文件大小和总时长，从而在进度条上拖动，来发送 Range header 定点播放。两者缺少任意一个都做不到定点播放，更何况两个都没有。

其实没有这两个东西，也能实现有限度的定点播放，
用支持 Range header 的 web 服务器，用 mpv 播放（ffplay 也能实现相同的效果，但是它没有界面，不能直观看到进度条），能看到下面有进度条，也能定点播放，但每次定点，显示的播放时间就会重置为0（因为定点播放实际上是拖动到百分比上，但实际上不知道整体的时间，拖动是拖动到文件大小的百分比上的，又因为动态比特率，两者并不完全等同，而且也得播放器播放过一段内容之后才能基于已播放的平均比特率去预估整体时间，播放得越多预估得越准确），所以其实它的定点也并不准确，随着后面的播放，进度条的前进速度也会变化，甚至可能倒退。

# h264 裸流网页直接播放的优化

部标平台视频回放里，设备上传的视频是 h264 裸流文件，而非封装好的 mp4 文件，目前需要服务器对视频用 ffmpeg 封装一下。

后端考虑这种操作可能会在未来产生性能风险，所以前端这两天探究了下浏览器直接播放 h264 裸流文件的方案。

目前已经可以在前端直接播放 h264 裸流文件，但是还做不到拖动进度条。

然后我研究了下 h264 裸流文件格式，用 ffprobe 看了下 h264 和 mp4 文件的元信息

```
# 264
Input #0, h264, from 'test.264':
  Duration: N/A, bitrate: N/A
  Stream #0:0: Video: h264 (Main), yuv420p(progressive), 288x704, 25 fps, 25 tbr, 1200k tbn

# mp4
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'copy.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf59.16.100
  Duration: 00:21:32.00, start: 0.000000, bitrate: 622 kb/s
  Stream #0:0[0x1](und): Video: h264 (Main) (avc1 / 0x31637661), yuv420p(progressive), 288x704, 621 kb/s, 25 fps, 25 tbr, 1200k tbn (default)
    Metadata:
      handler_name    : VideoHandler
      vendor_id       : [0][0][0][0]
```

https://www.cnblogs.com/valin/articles/3228864.html
https://blog.51cto.com/70565912/533736

另外尝试了下市面上常见的视频播放器，配合支持 http Range header 的 web 服务器，看到 mpc-hc 播放 h264 没有进度条，ffplay/mpv/vlc 能拖动进度（ffplay 没有 gui 界面不说，mpv 的进度条在每次拖动的时候，播放时长就置零了，vlc 比 mpv 还差，有进度条，但一直没有播放时间，拖动还花屏），配合 h264 裸流文件格式的理解，可以想到：

> http Range header 是 web 服务器在收到浏览器请求文件的请求时，根据文件类型决定在响应头上加 Content-Range: bytes 0-NNNN/MMMMM 告诉客户端文件总共有多大，然后之后客户端发请求时可以发 Range: bytes=AAAA- 告诉服务器从文件的第 AAAA 字节开始返回内容，从而实现文件内容的定点获取。

从上面的元信息对比中可以看到，mp4 相比 h264 仅仅只多了个 时长Duration 和 比特率bitrate(要说明的是现在大部分媒体文件都非固定比特率，而是动态比特率，于是这里的比特率都是指平均比特率，平均比特率其实就是视频大小除以时长)，也就是说 mp4 比 h264 就多一个视频时长，另外还从[这里](https://bbs.csdn.net/topics/390839947#:~:text=%E6%97%B6%E9%97%B4%E6%88%B3%E4%BF%A1%E6%81%AF,2)了解到 mp4 作为封装格式，还比 h264裸流 多了个关键帧的时间戳。现在我们可以理解到各种操作的原理了：

1. 浏览器播放由支持 Range header 的服务器提供的 mp4 文件，可以定点拖动的原因是：拖动到一个位置后得到一个百分比，根据这个百分比对应 Range header 去请求文件，拿到中间的片段的内容，解析内容，找到第一个（也就是最近的）有时间戳的关键帧，进度条定位到这个时间戳相比一开始就获取到的视频总时长得到的百分比处，同时视频的播放时间也设置到这个时间戳处，开始播放。

2. mpv 播放由支持 Range header 的服务器提供的 h264 裸流文件，可以定点拖动，但一拖动，播放时长就置零的原因：跟 1 一样，根据百分比请求片段内容，但是 h264 裸流文件没有帧的时间戳，尽管 mpv 知道前面的部分有多大，但它不知道前面的部分有多少帧（因为动态比特率），有多少时长，mpv 就只能直接播放第一个解析到的关键帧，进度条也不按真实的去调整，播放时长也只能置零。可是 mpv 在播放的时候，进度条也能慢慢前进，它是基于什么前进的呢？猜测可能此时进度条是完全的 buffer 进度条，而非视频时长进度条。

综上，只有 h264裸流 从理论上就做不到完美的播放。最理想的情况也只能做到类似 mpv 那样，提供一个 buffer 进度条，而非视频时间进度条，而且这样会脱离整个社区，对以后的视频相关的开发，就难以再利用社区资源了，例如用 video.js 等。

其实我个人不太理解后端转换的瓶颈在哪里，目前我知道 ffmpeg 封装 h264 为 mp4 其实基本消耗不了多少 CPU/内存，主要是读写文件有一定的 IO 开销。一个 90MB 的视频，封装好，个人电脑用差不多 1s，服务器理应会更低。可以设备上传之后就立即转换，可以用户请求时在去转换这样延迟操作（只要IO够快，整体转换的时间控制在一定以内，让用户等个几秒感觉问题并不大），或者两个结合起来。另外可能考虑启动 ffmpeg 是启动进程，进程过多会影响系统，那也可以用 worker 模式解决。



# 系统设计-错误处理
错误分能解决的和不能解决的，从世界的角度看，所有错误都是能解决的，但是系统设计里，我们要设计的系统是有边界的，所以对于某些错误，我们就干脆不解决好了，不然什么错误都去真正的解决，那系统就是没边界的了，我们做不到。能解决的错误自然是解决。解决不了的错误，在系统设计里应该是要防止它破坏系统，所以就是后续的逻辑不进行，如果可以还把之前的操作回退，然后还要提醒用户。
错误是否能解决取决于系统设计得有多广。例如 对一系列的数值求和，然后发现其中一个不是数值。系统对数值数组从前往后加，发现了错误。
有的系统直接报错，避免求出了一个错误的值；有的系统会把错误存起来，把前面的和继续往后面加，最终得到一个数值的和以及一系列的错误字符串，用户可以处理那些错误字符串，然后系统接着求和，得到最终结果。
这两种方式都是可以的，只看系统预计要设计成管的有多宽。


# 服务自由
https://news.ycombinator.com/item?id=31807783
所有的自由最终来源于“用脚投票”，但离开是有代价的，所以所有的服务都有责任尽可能减少用户离开的代价。例如允许代理操作用户账户，允许用户数据的导出，允许删除账户。

# 代码文档
https://news.ycombinator.com/item?id=31819926
代码文档按上面的说法是四种文档，自己的观点其实也差不多，主要是对大的东西提供文档，说明这个东西是做什么的，大概是怎么做的，以及简单的用法，其实就差不多一个 readme。至于具体是怎么做的，直接看代码。而代码本身就干脆不写文档了，偶尔两行注释倒也不是不可以。然后对于 api，那是直接生成的。


# 编程原语: effect
什么叫 effect ？看 koka-lang 的使用 https://koka-lang.github.io/koka/doc/book.html#sec-with 的 with-handlers 和 https://koka-lang.github.io/koka/doc/book.html#sec-handling ，似乎可以认为 effect 其实就是内部使用了外部函数就是 effect ，其实感觉挺正确的，调用外部函数才能对外部做修改，这不就是副作用吗。然后 koka 还会先定义 effect type，然后在调用的时候 with effect，相当于修改外部函数指向另一个函数引用，就把副作用让调用方去决定。
另外为什么 exception 也是副作用，可以认为 exception 相当于 if (var error = exception()) return error; 既调用外部函数，也中断当前函数的执行


# player & creator
自己有时候觉得自己应该学点音乐, 把自己积累的情绪爆发出去. 然后会音乐叫 艺术家. 但是发现这样的命名是有问题的, 因为会想着制作音乐是艺术家, 能情绪爆发, 那凭什么制作软件不算艺术家, 不能情绪爆发, 不是有很多电影电视里主角开始有干劲的时候就音乐情绪开始爆发了吗? 然后发现问题根源在 制作音乐 和 演奏音乐不是一回事. 作曲是一件要花很长时间的事情, 会无聊, 跟制作软件没什么区别; 演奏音乐时间很短, 可以爆发情绪, 它相对有点特殊; 听音乐也能爆发情绪, 它其实跟使用软件是一回事, 玩游戏, 看小说, 看视频也能爆发情绪. 回到演奏音乐, 它其实是一个很低级的生产状态, 更高级的生产状态其实是播放音乐, 但是演奏音乐对于演奏者自己而言是有意义的, 它其实就是听音乐, 演奏者自己在自己大脑里听音乐, 或者说听音乐的人就在自己大脑里演奏音乐, 演奏音乐就是等同于玩游戏.


# web3 直播
bilibili 直播平台收成非常高 - 50%. 当然, 它有它的理由. 那么有没有一种开放的人们发声的平台. 可以提供一个直播协议, 然后有直播服务商, 任何要直播的人可以买直播服务商的服务, 用开放软件连上去后, 提供直播流. 直播服务商会把流 cdn 到各个节点, 让用户去连接观看. 这个流量费由 直播的人 支付... 其实理论应该也可以协议各自支付一部分, 或者由观看的人支付. 直播打赏全部到了主播手里.

# UI/UX 中的报错
有个 LiveVideo 组件，根据属性中的某某 id 值，内部会去查询 live_url，然后播放。然后外部可能批量显示 LiveVideo, 于是查询 live_url 可能会批量报错，于是一下子弹出很多个报错框。为了避免一下子弹出很多报错框，可以：
方式 1：
LiveVideo 有暴露 start_promise，然后外部等待所有的 start_promise 都结束，然后再判断是否报错；
方式 2：
彻底理解清楚用户需求。用户只是不想有太多报错框很难看。所以报错应该可以 throttle/debounce 做错误汇总。即 LiveVideo 如果报错，就 emit('error')，然后外部组件去收集错误，debounce 下去消费错误列表。虽然可能 5 个 LiveVideo 有 2 个成功，2 个很快就失败，1 个很慢才失败。于是可能会出现两个报错弹窗，但我觉得这是合理的。它也没有方式 1 的耦合。

于是在写接口调用代码时，有统一在 axios 的 hooks 中加弹窗报错并 throw；有只在 hooks 里 throw，外部控制弹窗报错。甚至是根据参数决定弹窗，默认弹窗。


# mapbox-gl 聚合
mapbox-gl 的聚合需要 geojson source 设置 cluster=true，然后添加三层layer
circle - filter:['has','point_count'] - 添加聚合的圆圈，如果 symbol 用 image 的话也可以
symbol - filter:['has','point_count'] - 添加聚合的数量文字
symbol - filter:['!', ['has','point_count']] - 实际的被聚合的东西

一定要加上 'icon-allow-overlap': true, 'text-allow-overlap': true,，不然可能出现有聚合圆圈，但里面没有数字的情况，另外也有聚合点消失，但实际点却又没出来，因为它也是 symbol


# 复杂动画 X 复杂业务逻辑
复杂业务逻辑 里如果还要糅合上 复杂动画，复杂度会剧升。
复杂业务逻辑为了尽可能少 bug，会尽可能 单一数据源(single_source_of_truth)，然后加上响应式，尽可能声明式编程。
而复杂动画，因为有大量的前后顺序关联，如果用响应式会造成有太多的临时状态，根本无法定义状态，所以用命令式编程更好。
> 事实上，vue 的 transition、transition-group 组件根本无法定义复杂的动画逻辑。例如嵌套的 transition 要如何做进入和离开动画。

例如页面切换，单一数据源，即 const tab = ref('a');tab.value='b'; 来切换，则是 a销毁，b创建 是同时进行的，两边的动画也是同时进行的。
但要有复杂动画逻辑，甚至，a，b 还共享别的外部状态，如果 a 还没销毁完成，就修改 外部状态，则 a 可能会有奇怪的变化，如果 不修改外部状态，则 b 进来时会处于一种奇怪状态。所以要 a消失，消失完成后，改变外部状态，b进入。此时不能用 tab 来控制 a是否消失，那变成 const is_a_showing = ref(true); const is_b_showing = ref(false); 这样呢？这到的确能解决问题，但其实把业务逻辑的复杂度增加了（把动画逻辑 糅合进 业务逻辑，耦合增加了）。
那有没有一种统一的模式来融合，从而解耦两种逻辑呢

于是一开始有 _coms/Transitions.vue 组件的想法：
```html
<TransitionsVue ref="test_ani" :init_states="{a:{from:{left:'0'},to:{left:'300px'}}, b:{from:{top:'0'},to:{top:'300px'}}, c:{from?:'from_clazz',to:'to_clazz',duration:3000}}" v-slot="{slot_ref,slot_style}">
  <TestAniVue :init_ref="slot_ref" :style="[{position:'absolute',transition:'all 1s ease'},slot_style]" />
</TransitionsVue>

insp.$refs.test_ani.a();
insp.$refs.test_ani.b();
await insp.$refs.test_ani.c();
```
基本也可行，不过引入了别的概念，也麻烦。还不如直接用 web animation api 或者 popmotion。
于是就是业务逻辑仍按正常的走，尽可能用**单一数据源和响应式**，但是所有的组件创建之初都是 display:none 的状态。要在创建完成之后，再 animate 它。


# vue-composition-api 里的 provide vs prop 传递
provide 隐式往下传递信息，prop 显式。provide 通常是侵入式的，prop 通常
设计中心是围绕在 父组件 上，此时适合用 provide。
但如果设计的本身就是 子组件，则适合用 prop。
而且一般来说，prop



















# 主播与乞丐的不同
昨天下午稍微思考了下卖艺和乞讨的区别。

暂时的结论是：客观的区别目前还待继续寻找，但主观的区别则很清晰 - 对于卖艺的人，哪怕他过得比我好，比我更幸福，我也乐意去支持他；对于乞讨的人，如果他过得比我好，那我就不乐意支持他了。

如果卖艺的人的收获与其创造的一般价值的比 要比自己的低，自己会更乐于支持对方，把自己的收获转给对方，让其创造更多的一般价值，从而让世界变得更美好。这里面需要付费方有对劳动方的收获和创造的一般价值的预估。对于精神文明建设者，所谓创造的一般价值更多是指对自己的影响，是一个主观判断。

客观上：同步沟通 + 自由打赏 往往容易形成低自尊工作。把自由打赏变成延时打赏，即打赏后，主播不能立即看到。主播可以第二天看记录，此时才能看到，于是在下一次的直播中，对打赏的人进行感谢，打赏的人不在线，可以有软件提供上线提醒。 这里，主播的感谢本身已经不影响打赏的行为，不感谢，打赏也要不回去，甚至其他人也不清楚主播有没有感谢，这为主播留下了更多的博弈空间。

以下是思考过程。

我们需要找到一条线把卖艺和乞讨两者切割开，这样才能让自己以正确的方式支持自己想支持的人，也让被支持的人能安心地接受大家的支持。

-- 这样才能让自己不迷茫地支持自己愿意支持的人，被支持的人在接受支持时也不至于迷茫。

而且，随着社会生产力越来越高，未来将会有越来越多的人从事建设人类精神文明的行业。而且此类职业会变得越来越趋同，例如主播、职业画师、接受别人赞助的开源工作者、教师等等等等。

我们需要确认到底有没有一条客观的线来确定什么行为会伤害劳动方自尊？是劳方主观的认为没伤害自己的自尊就ok吗，还是付费方主观认为并没有想过伤害劳方自尊就行。

所以我这里用标签的方式去对职业做判断，这些标签包括客观的，也包括主观的，标签还可以合并（即“既...又...”，例如“既是同步又是面对面”），而且随时可能增加标签来从别的维度去思考区别：

职业：同步还是异步，面对面还是远程，定额收益还是自由打赏收益，一对一还是一对多，劳动意图来源方是付费方还是劳动方

乞丐：同步，面对面，自由，偏一对一，劳动方
主播：同步，远程，偏自由，一对多，偏向劳动方
知识付费：异步，远程，偏自由，一对多，劳动方
教师：同步，面对面，定额，一对多，偏向付费方
github sponsor：异步，远程，偏自由，一对多，劳动方
patreon：异步，远程，偏定额，一对多，劳动方
心理医生：同步，面对面，定额，一对一，付费方
白领：同步（当着老板面完成一件事）或异步（老板安排任务，下去做），面对面或远程，定额，一对一，付费方
服务生：同步，面对面，定额（工资）或非定额（小费），一对一，偏向付费方
厨师：同步，面对面，定额，一对多，付费方

额，上面的形式太傻了。加一个标签就要所有的职业都写一遍，而且我暂时无意分析除主播以外的其他行业。下面单独分析标签：

同步还是异步：主播是同步的，也有部分工作内容是异步的（例如切片），这个标签不存在问题，同步的职业多了去了，教师、心理医生也是同步的；
面对面还是远程：主播是全远程，这个标签也不存在问题，教师、心理医生也可以远程，一些开源项目的维护者，只接受其他人的赞助作为生活来源的人更是全远程，这些人绝对是未来的世界需要的，所以这个标签没问题；
定额收益还是自由打赏收益：主播的收益比较偏向自由打赏，虽然舰长收益是定额的，但选择上舰长还是别的完全是自己选的。与此类似，知识付费，开源赞助也大多是付费方自己选择赞助多少钱。






知识付费也好，github sponsor，patreon，都是此类。这几个跟主播的区别主要是这几个是异步沟通的。那同步沟通，建设人类精神文明的有吗，教师，心理医生。

题外话：如果把动作本身就算作信息交流的话，外科手术医生也算同步沟通。如果把



# HonkaiImpact3: starfall & rubia
听这两首歌，感觉 starfall 是一个英雄壮烈牺牲时的音乐， rubia 是别的人纪念那个英雄的音乐。
然后想到很多以前的电视剧，发现连续多次煽情很容易疲劳和尴尬。
然后尝试分离，发现它们两者本就应该分离。英雄牺牲讲的是英雄的故事；纪念英雄讲的是纪念英雄的那个人的故事，讲的是那个人对英雄的爱。两者不可等同。如果是做游戏，它们甚至都该做进一个系列的两个游戏中。


# better dht
dht kademlia 为路由无视空间距离，每次转发至少减少一位 id/ip 的不同，但这样很容易流量从 中国-美国-德国-中国-美国-中国 这样多走太多的冤枉路。如果能在 id 里有两段信息，一个是 id，一个是地址空间（用户自己可以指定自己的空间范围，看自己能承受的风险来决定空间范围设定多明确），空间范围仅仅是辅助路由，实际连接只看 id 段是否相同。
也许没啥意义，也许还不如直接尝试得到网速。
有了这种更好的路由的话，i2p 的速度会大大加快


# vite deploy
1. node 版本

2. vite build 需要较大的内存 
https://github.com/vitejs/vite/issues/2433 
https://lightrun.com/answers/vitejs-vite-vite-build-error-out-of-memory
node --max_old_space_size=16384 ./node_modules/vite/bin/vite.js

3. ant-design-vue@1 有声明自己的 esmodule 但内部使用 require，打包后，浏览器运行时报 require is undefined 
https://github.com/originjs/vite-plugins/issues/9#issuecomment-924668456
build: {
  commonjsOptions: {
    transformMixedEsModules: true,
  },
}
另外，看下 https://github.com/vitejs/vite/issues/3409

4. nginx rewrite
https://www.cnblogs.com/woshimrf/p/nginx-proxy-rewrite-url.html
有的 nginx 不支持 proxy_pass 的简易 rewrite 写法，需要直接用 rewrite ^/order/(.*)$ /$1 break; 来去掉 /order


# 为什么音频有帧的概念
音频本身其实是没有帧的，最多也就是有*采样sample*，但一般其采样率太高（44.1khz），所以不把一*样*当成一帧。
无损无压缩音频格式（PCM）就完全没有帧的概念。但是部分压缩音频格式（mp3/aac）却添加了帧的概念，其动机主要是为了存储和解析。
https://www.researchgate.net/post/Why-is-audio-compression-based-on-frame-by-frame-processing
对音频做压缩需要经过傅里叶变换，而并非直接对单*样*做存储格式调整（其实也调整不了啥，能调整的话，那*样*一开始就那样存了）。
https://cn.bing.com/search?q=FFT&PC=U316&FORM=CHROMN   https://en.wikipedia.org/wiki/Fast_Fourier_transform
傅里叶变换把信号从原始域（一般为空间/时间）转为频率域，依赖之前的信号。
则为了降低解析延迟，网络延迟，减少出错的代价，需要对音频做分块打包，每个包单独的做傅里叶分析来压缩。
这样的一个包就是一帧。
其实*音频的帧*就跟*视频的关键帧加上其后的非关键帧直到下一个关键帧这里的多个帧*一样。
1. 视频的压缩简单方法是 帧要么是关键帧（几乎无压缩），要么是非关键帧，则依赖前面的关键帧来压缩
2. 不要混淆某些音频处理软件里的说的帧与这里的音频帧的概念。音频处理软件里说的音频帧更多是指需要人手动做的标记，用于音量在时间上的控制，或者辅助视频剪辑


# 大部分（基本所有）的扁平化管理都是错的
我认为在聊天群里，在职位标识上，要体现出管理层级（不用体现上下层级，但要体现出管理层级，即：我向谁负责），这是一个权力和职责的问题，避免出现性格偏软的人利益受损。
只有我的上级（最多再加上上级的上级）才能给我下发命令，其他人是没有权力管理我的。
而扁平化管理里，大家互相不知道职位，不知道对方干什么的，则谁都可以给你下发任务。一个任务模模糊糊的，你可以做，别人也可以做，但凭什么就得你去做。
真正的扁平化管理里，其实就是没有管理，大家是一个创业团队，都能自己给自己找事做（非创业团队凭什么员工会给自己找事做），所有人都有全技能，（没有谁给谁安排任务，所有人都是专家级别的人物），团队间需要的只是交流，同步创业愿景和目前的所有的进度。


# 理想的社会是 零代价离开 还是 民主
零代价离开，离开这个词用得不是很好。它应该是双方的离开，而不是单方的离开。应该用词 零代价break。
有遇到公司内部演讲 *讲真，我的任务从没被Kill过！* 
有的人做简单的，甚至什么事都没做，都能很好的晋升；有的人做很困难的，哪怕做了很多，做得很好，也经常被挑刺，无法晋升。
民主到底能不能解决这个问题？不一定，他有个人情的问题，而且有的情况是人情越用越多，但这种对于真正的生产力其实并没有帮助。


# 正确的函数 curry 化
```js
function wrong_curry(fn) {
  const args = [];
  return function curried(...ags) {
    args.push(...ags);
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return curried;
  };
}

function right_curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    // 这种不行的原因是不知道 brgs 的长度
    // return right_curry((...brgs) => fn(...args, ...brgs));
    return right_curry(fn.bind(null, ...args));
  }
}
```
wrong_curry 不够函数式，它利用单一的状态去实现，会造成中间函数只能用一次。例如：
```js
const add_4_nums = (a,b,c,d) => a+b+c+d;
const curried_add_4_nums = wrong_curry(add_4_nums);
const one_add_3_nums = curried_add_4_nums(1);
const three_add_one_num = one_add_3_nums(1,1);
// 此时，one_add_3_nums 已经不可以再使用了(函数的实际作用已经与函数的名称语义不同)，因为此时实际上 args 里已经有 三个1 了， one_add_3_nums === three_add_one_num。
```
这也体现出 可变性有多么容易出错


# AR 演唱会
真正的巨型（城市级别的，隔着好几条街看到一个好几百米高的巨人在跳舞）全息投影目前很难做到，但是可以所有有 ar 设备的人联网，共同看一场直播演唱会。因为是 ar，不是 vr，所以可以多人协同，更有参与氛围。描述场景：小森在一条街上压着马路，突然记起来前几天看到的广告，说是人民广场今天会有一场 miku 的 ar 演唱会，时间上，现在已经开始了。于是他从口袋掏出 ar 眼镜戴上，打开直播软件，立即就听到了音乐。他朝人民广场的方向望过去，看到了个好几百米高的 miku 在那里唱着跳着。人民广场离他所在的街道就三条街，不算很远。他就往那边跑去。离广场越近，声音越大，到广场时，看见有许多人跟他一样，都戴着 ar 眼镜，看着 miku 打 call。此时直播软件提醒他已到达目的地，可以取下耳机，直接听广场上的大音响的声音。
这里面最难的技术难点在直播的同步：（要所有人看到听到的是同步的）如果直播是视频，那也许 srt 协议可以；但如果是实时渲染，可能更容易，只要同步时间，根据广场的定位器同步定位，预先加载模型和动作，之后就是大家都是同步的了。
另外，是视频的话，目前看到的 vr 视频都是观看者处于视频球的球心，但像这种场景，应该是 miku 处于无数个摄像机组成的球的球心，之后只是放大缩小了。但是这种要怎么做 2D 投影，并尽可能减少浪费？（另外，这种似乎不用做 3D，因为两只眼睛本身就是球上的两个摄像机）
这种视频场景就是：
> 突然想到一个应用场景，涉及到一个很高深的数学问题，问下群里的大家。有无数个摄影机，它们组成一个球，镜头对着球心。在球心处有个 miku 手办在跳舞。现在这种信息要如何投影到 2D 平面上呢，而且要尽可能的排除重复信息。因为我们现在的 VR 视频，它的场景不是 视频是个球，观看者在球心里吗，跟描述的场景完全是反着的。描述的场景是 观看者的座位组成一个球，视频内容，或者说舞台在球心。难道只能靠纯粹的信息论的压缩吗？难道这还需要加一道采样关（就是有100个摄像头还是10000个摄像头）？另外，这种弄出来的视频得多大啊，理论上应该可以很小的吧，它提供的真实信息应该不比目前的 VR 视频提供的信息多多少吧。
> 感觉在计算机上可以有个解了。就是目前的 2D 视频是：(关键帧 + (普通帧 * n + 次关键帧) * n + 普通帧 * n) * n 。这里面 关键帧、普通帧、次关键帧 组成一小段模糊混合的信息，里面用傅里叶变换等信息论技术做压缩和还原。而此处描述的场景，也应该先把问题分割成小数据的问题，然后做压缩和还原。至于多摄像头采样，并非错误的思路，它仍然是不可少的。所以切割成小数据问题，应该是把球变成一个正多面体（比如正六面体，就是正方体），每面的面心所对应的角度的摄像头是关键帧，（注意，这里说的是对应的角度，而非把摄像头放到正多面体的面上去拍摄），然后，假如此处立体视频，对应传统视频的帧率是30fps，则此立体视频，每1/30秒内应该有 6 个关键帧（因为是 6 面体），然后，采样率（摄像头个数应该是 6 的倍数，且每面是一个数的平方，例如 9，则一共有 6 * 9 = 54 个摄像头），每个摄像头，除面心摄像头本身是关键帧以外，其他摄像头应与相关联的 5 面合并做压缩（正方体与一面相接的有四面，影响到一个点的有五面）。
> 不对，并不应该是对“面”做均分（面做的平分对应的角度并非对球的平分），更不应该是每面是一个数的平方（有的正多面体，它的面并非正方形，哪来有平方）。。。应该直接就是对球做平分，则对应到正多面体，就是一面就是一帧。那么要怎么决定谁是关键帧呢？应该有派生正多面体（例如正四面体，有四个顶点，把四个顶点按一半的棱长切掉，它就成为一个正八面体，即正八面体是正四面体的派生正多面体），则如果非常讲究的话，可以是。。。
> 完全错误。因为说到底还是要靠数学工具做压缩，所以模型不应该设计得太复杂。应该直接记录 3D 信息，即每一时间帧都是一个 3D 模型，在时间上定义关键帧和普通帧，然后做压缩。无非是以前的 2D 压缩算法不能用了。


# Vue Setup 组件

```ts
// Setup.ts
import { defineComponent, PropType } from 'vue';

// 同层级多个此组件时，记得带 key. 
// 例如: <Setup v-if="flag" :setup="">xxx</Setup><Setup v-else :setup="">xxx</Setup>
// 上面的例子在 flag 切换时, Setup 不会切换, 需要带 key:
// <Setup key="flag_true" v-if="flag" :setup="xxx">xxx</Setup><Setup key="flag_false" v-else :setup="yyy">yyy</Setup>
export default defineComponent({
  props: {
    setup: {
      type: Function as PropType<(props: any, ctx: any) => any>,
      required: true,
    },
  },
  setup(props, ctx) {
    const all = props.setup(props, ctx);
    // 直接用 js 写比用 .vue 文件写，可以少写一个 component: <component :is="is"><slot v-bind="all"/></component>, 从而让外部更灵活的控制组件根元素
    // 除非说 .vue 文件里 template 里可以直接使用 this: <slot v-bind="this" />, 从而让外部的 slot 自动解了 ref.value, ~~可惜不行~~(好吧，确实可以)
    // 而这种 js 写法不会自动解 ref.value, 在外部需要 xyz.value 来使用。另外 js 写法 setup 不一定非要返回 Object, 它返回是什么就是什么
    return () => {
      return ctx.slots.default?.(all);
    };
  },
});
```

```vue
<script lang="ts">
import { defineComponent, PropType } from 'vue';
export default defineComponent({
  props: {
    component_is: {
      type: String,
      default: 'div',
    },
    setup: {
      type: Function as PropType<(props: any, ctx: any) => Object>,
      required: true,
    },
  },
  setup(props, ctx) {
    return props.setup(props, ctx);
    // const all = props.setup(props, ctx);
    // return { all };
  },
});
</script>

<template>
  <component :is="component_is">
    <slot v-bind="this"></slot>
    <!-- <slot v-bind="all"></slot> -->
  </component>
</template>
```


# form validate
许多表单组件库，例如 element-ui 的 form 都有 validate 方法，validate 错误时会滚动表单至错误处。但有些时候校验是后端做的，此时单独为校验做个接口并不划算，就直接提交，出错就报错就是了，此处一般是 alert/toast 弹窗。但其实可以有体验优化，就是 接口返回错误 message 的时候，可以顺带告诉前端是哪个字段错误，前端就给那个字段一个必错的 validator，然后做一次 validate。于是后端的错误信息就放到 输入框的下面 了，而且表单还会滚动到那里，总体体验就像是前端校验一样。


# js export 函数库
优先用  `export function abc() {}` 而不是 `export const abc = () => {}` 因为 function 有函数提升，可以不用在意代码的顺序，哪怕有循环引用也没有关系，无非是递归而已。函数本身就是支持递归的。无非是 递归运行可能在模块初始化时就开始了。
当然，也有不好的地方，就是 模块里 可能不仅仅 export 函数，还会 export 其他对象，此时只能用 export const ，那样就跟 函数不一致了。
算了，还是统一 `export const abc = () => {}` 吧

# LiveVideo.vue
记录此组件的原因是因为 - 此组件对 LiveVideo 的接口抽象挺不错，需要三个函数，组件负责处理生命周期
```vue
<script lang="ts">
import { defineComponent, getCurrentInstance, ref, shallowRef, watch, PropType, onMounted, onBeforeUnmount } from 'vue';
// import 'flv.js';
import DPlayer, { DPlayerOptions } from 'dplayer';
import { useApi, useInterval } from '../refs';

export default defineComponent({
  props: {
    start_then_url: {
      type: Function as PropType<() => Promise<string>>,
      required: true,
    },
    heartbeat: Object as PropType<{ fn: () => any; ms: number }>,
    stop: {
      type: Function as PropType<() => Promise<any>>,
      required: true,
    },
    dplayer_opts: Object as PropType<Partial<DPlayerOptions>>,
  },
  setup(props) {
    const ins = getCurrentInstance()!;
    const insp = ins.proxy;

    const { start_then_url, stop, heartbeat, dplayer_opts } = props;
    const api_start = useApi(start_then_url);
    const api_stop = useApi(stop);
    // const api_heart_interval = heartbeat && useInterval(async () => heartbeat.fn(), heartbeat.ms);
    const api_heart_interval = useInterval();

    const start_error = shallowRef();
    // 保留 start_promise 让外部判断 start 过程结束，是否报错，来把错误汇总显示
    const start_promise = shallowRef();

    let player: DPlayer | null = null;
    let wrapper: HTMLDivElement = null!;
    const cleanup = async () => {
      if (player) {
        player.destroy();
        player = null;
        wrapper.innerHTML = '';
        api_heart_interval?.clear();
        await api_stop.fn();
      }
    };
    const refresh = async () => {
      try {
        await cleanup();
        start_error.value = null;
        const url = await api_start.fn();
        const container = document.createElement('div');
        wrapper.innerHTML = '';
        wrapper.appendChild(container);
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        player = new DPlayer({
          live: true,
          autoplay: true,
          mutex: false,
          video: { type: 'flv', url },
          ...dplayer_opts,
          container,
        });
        heartbeat && api_heart_interval.set(heartbeat.fn, heartbeat.ms);
      } catch (error) {
        start_error.value = error;
      }
    };

    onBeforeUnmount(cleanup);
    onMounted(() => {
      wrapper = insp.$refs.wrapper as HTMLDivElement;
      start_promise.value = refresh();
    });
    return { start_error, refresh, start_promise };
  },
});
</script>

<template>
  <div class="live_video">
    <div class="wrapper" ref="wrapper"></div>
    <slot :start_error="start_error" :refresh="refresh">
      <div v-if="!!start_error" class="error">
        <div>抱歉，视频加载失败!</div>
        <div class="refresh_btn" @click="refresh">点击刷新</div>
      </div>
    </slot>
  </div>
</template>

<style lang="less">
.live_video {
  // background: no-repeat center / cover url('../../assets/images/monitorManage/play-back.png');
  position: relative;
  .wrapper,
  .error {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .wrapper .dplayer {
    width: 100%;
    height: 100%;
  }
  .error {
    width: 100%;
    // background: #0d1438;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .refresh_btn {
      cursor: pointer;
      filter: brightness(110%);
      &:hover {
        filter: brightness(120%);
      }
    }
  }
}
</style>
```

# useLazyCascader - element-ui.el-cascader
```ts

export function useLazyCascader(props: { value: string; label: string; lazyLoad: (node: any, resolve: any) => any }, value: WatchSource) {
  // 让 cascader 等待加载完，然后调用 computePresentText() 从而正常回显数据
  let _promise: any = Promise.resolve();
  const _props = {
    lazy: true,
    ...props,
    lazyLoad: async (node: any, resolve: any) => {
      _promise = new Promise(res => props.lazyLoad(node, res));
      const res = await _promise;
      resolve(res);
    },
  };
  // el-cascader 在 value 改变时不会主动响应，只是在初始化时会调用 lazyLoad，但是 load 结束后，也不会更新显示的值，只是下拉框里高亮被更新了
  // 需要等待 lazyLoad 结束后，主动调用 comonent_instance.computePresentText(), 但 computePresentText 内有判断逻辑不好动
  // 临时设置 checkStrictly=true 后会立马变回 false，设置 node.isLeaf 会 getter 报错，所以直接设置 presentText=node.getText() 就是
  const setup = () => {
    const insp = getCurrentInstance()!.proxy;
    const _ref = ref();
    // ! 没用，在 value 变化，路径完全变化后，cascader 并不会去请求之前没下载的路径，所以还是每次在外部引起的 value 变化时，重建 cascader 算了
    const _key = ref(0);
    onMounted(async () => {
      watch(
        value,
        cv => {
          let retried = false;
          computePresentContent();
          async function computePresentContent() {
            const r = _ref.value;
            if (!r) return;
            let p = null as any;
            while (p !== _promise) {
              p = _promise;
              await p;
              await insp.$nextTick();
            }
            const node = r.panel.getNodeByValue(cv);
            // ! 之前那样会有 bug，会在遇到哪怕加载全部也不存在的 value 时就死循环加载。所以加个 retried 来打断循环
            // 因为 retried 是外部状态，所以把 watch_fn 抽出
            if (!node && !retried) {
              if (cv && cv.length) {
                _key.value++;
                await insp.$nextTick();
                retried = true;
                computePresentContent();
              }
              return;
            }
            r.computePresentContent();
            await insp.$nextTick();
            r.presentText = node.getText(r.showAllLevels, r.separator);
          }
        },
        { flush: 'post', immediate: true }
      );
    });
    return { ref: _ref, key: _key };
  };
  return { props: _props, setup };
}
```

使用时
```
const cascader = useLazyCascader(xxx);
<Setup :setup="cascader.setup" v-slot="{ref,key}">
  <el-cascader :key="key.value" :ref="ref" v-model="value" :props="cascader.props" />
</Setup>
```

把这个记录下来的原因只是这个的 设计思路 和 中间细节 都还不错，例如 抽出 computePresentContent ，把 retried 放外面


# 计算百分比
```js
const tidy_data = computed(() => {
  const arv = api_result.value;
  if (!arv) {
    return [];
  }
  const sum = arv.reduce((acc, cv) => acc + cv.vehicleNum, 0);
  const len = arv.length;
  let rest = 100;
  return arv.map((it, idx) => {
    const is_last = idx === len - 1;
    const value = it.vehicleNum;
    const percent = !sum ? 0 : !value ? 0 : is_last ? rest : value / sum;
    return { ...it, name: it.vehicleTypeName, value: it.vehicleNum, percent }
  })
});

// OR

// export const compute_percent = (a: number, b: number, digits = 1) => (!b ? 0 : !a ? 0 : parseFloat(((a / b) * 100).toFixed(digits)));
// export const get_percent = (a: number, b: number, digits = 1) => (!b ? '0' : !a ? '0' : ((a / b) * 100).toFixed(digits));
// get_percent 和 list_percent 都故意返回字符串，尽量让调用者不要拿结果再次做数学运算
export const list_percent = (list: number[], digits = 1) => {
  const sum = list.reduce((acc, cv) => acc + cv, 0);
  if (!sum) {
    return list.map(_ => '0');
  }
  const last_not_0_idx = list.length - 1 - list.slice().findIndex(v => v);
  const dum = 10 ** digits;
  let rest = 100 * dum;
  return list.map((n, idx) => {
    if (idx === last_not_0_idx) {
      return rest / dum + '';
    }
    const int = Math.round((n / sum) * 100 * dum);
    rest -= int;
    return int / dum + '';
  });
};

const tidy_data = computed(() => {
      if (!api_result.value) {
        return [];
      }
      // const sum = api_result.value.reduce((acc, cv) => acc + cv.vehicleNum, 0);
      // return api_result.value.map((it, idx) => {
      //   return { ...it, name: it.vehicleTypeName, value: it.vehicleNum, percent: get_percent(it.vehicleNum, sum, 2), color: COLORS[idx] };
      // });
      const vehicle_nums = api_result.value.map(it => it.vehicleNum);
      const percents = list_percent(vehicle_nums, 2);
      return api_result.value.map((it, idx) => {
        return { ...it, name: it.vehicleTypeName, value: it.vehicleNum, percent: percents[idx], color: COLORS[idx] };
      });
    });
```


# rem 布局
rem 布局经常会遇到**实际屏幕比设计稿小**的情况，然后设计稿里又有元素有使用 12px，导致实际显示时，无法把那个元素的文字缩小到比 12px 还要小的情况，但元素的 container 又是使用 rem 设置的宽高，进而导致**文字超出容器的显示范围**。就算设计稿没有元素使用 12px，而是最小字体为 14px，但屏幕缩小到一定程度，元素的字体大小仍然会达到 12px 的底线。
所以**rem布局应该只能解决 实际屏幕比设计稿大，从而可以无缝放大，但不能解决 屏幕比设计稿小 的问题**，最简单的实现是: 
`html.font-ize = max(100px, 100vw * 100px / 1920px)` (1920px 是设计稿宽度)
至于要解决 屏幕比设计稿小 的问题，需要的是 流式布局/flex
https://news.ycombinator.com/item?id=33707392
https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/

如果可以的话，能设计稿为 1280*600 吗？ 我知道你们 UI 一般都是出 1080p 的，但事实上这种逻辑其实是错的。1080p 的设计稿在小屏幕上是没法等比缩放的，非要缩放，也会有字体不清晰的问题。1080p 的设计稿在小屏幕上，只能用 流式布局，而流式布局 其实很多 产品/客户 也都不咋喜欢。而小设计稿 到 大屏幕上就很容易做等比缩放了

或许 1280*600 实在太小了，在 显示表格 之类的时候显示不了几行几列，在小屏幕上 显示不了几行几列 可以接受，但是在大屏幕上就。此时就是特意地不想要 等比缩放。

所以 1600*(900-100) 挺合适。此时就是，实际屏幕比这大时可以等比缩放，比这小时，完全无缩放，流式布局

https://www.zhihu.com/question/41014727/answer/2804040764

# 样式
一个系统的样式应该分为 工具样式 与 结构样式，所以可以分为两个 less 文件。这两个都是全局样式，应以 特定字符 gb(global) 开头
工具样式 - 或许不该叫工具样式，而该叫组件样式
结构样式 - 指的并不是分页面样式，而是按照整个系统的结构
```utils.less
.gb_form_inline {}
.gb_divider {}
// etc
```

```structure.less
.gb_login {}
.gb_home {
  .gb_layout {

  }
}
```
然后页面组件内应该只有尽可能少的组件内样式，用 vue scoped 限制


# 业务系统中，超多字段的增删改查
这些字段经常需要一些其他基础数据才能正常展示，例如 select 里需要 option 列表，于是经常会在 setup 函数里去获取这些数据。另外，这些字段也可能发生变化，今天加了这个字段，明天又移除了这个字段，然后程序员又忘记对应移除 setup 里获取的数据，于是它成为死代码。其实可以直接使用 Setup 组件去获取那些技术数据，这样在移除界面元素时，会同步移除 Setup 组件。
```
<el-form>
  <el-form-item label="项目名称" prop="projectId">
    <Setup :setup="() => ({projects: useMineProjects()})" v-slot="{projects}">
      <el-select v-model="form.projectId">
        <el-option v-for="it in projects" :label="it.name" :value="it.id" />
      </el-select>
    </Setup>
  </el-form-item>
</el-form>
```
至于为什么不直接封装一个 MineProjectSelect 组件，因为那样不够灵活。
另外，好吧，这个在 vue 上仍有问题，它需要把 useMineProjects 放到上层组件的 setup 里


# IOT 设备的控制
zigbee、蓝牙、wifi，甚至可能还有不少别的设备。要控制那些设备，首先需要手机（控制设备）支持 当前的通讯协议（zigbee/蓝牙/wifi）。
然后还需要 手机 知道怎么控制此设备，而这往往是要手机安装特定的软件。这很麻烦，也不标准。
那有没有一种足够灵活的标准。例如，这些设备内部都有个 http 服务，虽然设备本身不使用 ip/tcp 协议，但是可以让 http 运行在 zigbee 协议上，而手机只用安装统一的软件，调用手机硬件 zigbee 跟设备交互，得到 设备提供的网页，在网页上做控制。

不过还有设备反控制手机，例如蓝牙耳机控制音量大小。这种是 蓝牙 设备连接上后，说明自己支持什么协议。这种可能就没那么灵活了，但是能代码控制，也能反向控制。
其实要说，的确是这种最好。手机硬件 支持蓝牙，但它本身不识别蓝牙的任何应用协议。操作系统也不管这东西。这样就可以有一个 软件 去调用手机的 蓝牙 通讯协议，与设备做交互，那软件可以随时增加新模块，支持新协议。


# Koka + gqless
https://gqless.com/

```js
const ComponentUsername = () => {
  return <div>{query().user().name()}</div>
}

const q = query_builder(ComponentUsername); // This is pure. It's kind of FBIP. The query_builder create a state, and query().user().name() mutate it
q.do_query(); // this has IO effect

fun query_builder(com_fn) {
  const state = {};
  with query: () => state;
  com_fn();
  return state;
}

const vdom = react(ComponentUsername); // This is pure. The query().user().name() is just to read data from cache

fun react(com_fn, cache) {
  with query: () => cache;
  return com_fn();
}
```


# CAS-content addressable storage 内容寻址存储
ipfs/dat/beaker/lbry 等等。它们要么太复杂，要么有相当大的局限性。
- p2p 网络层面避免吸血（人们向大佬节点要资源，大佬节点说很短时间之前把资源给了a，你们同时也可以找a要，人们告诉大佬说找a要不到，大佬于是伪装一下，找a要资源，去验证，验证发现a是吸血节点，于是大佬就告诉大家，就是俗称的说坏话。其实伪装比较难，因为 ip 很难伪装，所以，这中间任意一步都广播，人们自己决定节点的可信度。至于 ip 与节点的关系，是认为只要 ip 相同，那哪怕节点 id 不同，只要有一个坏人，就都当作坏人，还是说忽视 ip，只认节点 id，那由各客户端自己决定）
- p2p 避免吸血 。 其实是 gossip 协议，然后各客户端记录下大家说的话，客户端自己判断其他客户端的可信度。还有客户端之间互相帮忙（例如有新人a刚入网，找我b要资源x，我根本不认识a，我认识的人中也没有聊起过a，那我给a只分配很少的流量，甚至不分配流量。但是同时也有人c找我要资源y，我正给c传着，我想a可以帮我，所以我要求a帮我，只要它帮我，我就给它分配更高的带宽，我把y的后面的部分提前传给a，然后告诉c让他也从a那里拿，然后c说他的确从a那拿到了，那我就给a分配更多的带宽）。其实就是 - 事件关联的话，就发准确消息。事件无关的人，就 gossip 说坏话。
- 不能像 ipfs 那样把文件都拆散，需要是完整的文件，从而不影响用户自己本地使用。分享单位是文件，而非文件片段（事实上，两个相类似的文件，文件片段也类似的可能性很小，视频在做少量剪辑后，虽然看起来内容差不多，但是基本都是重新编码了，就算没重新编码，偏移量应该也变了，片段 hash 基本没有重复的）
- 用户只需要决定共享文件夹（最好支持多文件夹）即可。当然，别的上传速度等配置也要有
- 可以用这个做程序分发，甚至都不用担心隐私文件被分享，因为人们不知道你隐私文件的 hash
- 树形结构 `repo_dirs:{repo1:{programs:{pro1:{pro1.exe,config.json}}}}` ... 基于这个树形结构，要做程序分发可以简单的命令 `cas hash1 -r repo1 -p programs/pro2` 这里 -p 不是系统文件路径，而是相对于 repo 的路径。当然，要更新就需要更复杂的逻辑，参考 scoop
- 甚至做自己个人目录的同步也可以。我在公司电脑工作，下班了，公司电脑不关，获取自己个人目录 hash，回到家里电脑，添加公司电脑节点，然后 下载个人目录 hash，很快就能拿到个人目录，虽然此时只有 文件元信息（文件名、大小、时间等，大概没有时间），你用哪个文件，就后续下载哪个文件。另外，因为之后还想回到公司后，把家里的同步过来，但家里的并没有完全填充文件内容，所以 目录的hash应该只是个merkel-tree，是对文件的hash，文件名、大小这些meta信息的再hash。
- 事实上，目录，就是一个文件。文件本身是没有文件名的，也没有大小信息，文件只在目录里才有文件名和大小。初始目录就是 repo1，不提供 -p 参数的话，就默认 hash 作为文件名。这个文件是目录，还是文件，等文件下下来自然就知道。至于这个文件是mp3还是mp4，那就得用户自己尝试了。但如果这个文件在目录里，那目录自然存储了它的文件名，那就知道它是mp4了
- hash 算法采用 sha256 . hash算法分为安全hash和非安全hash。安全hash(md5/sha1/256/512)很难伪造具有相同hash的其他文件。非安全hash（crc32/64）往往只是为了校验文件完整性，避免下载错误. 而 md5 已经被破解，sha1 也即将被破解，所以用 sha256. 尤其要用这个做程序分发，而且是 p2p，如果不用安全 hash, 那只要有人构造个病毒，放在自己的 repo 里，就自动传播出去了。当然，也有文件大小来做校验。要 hash 和大小都相同才认为是正确的文件，但只有目录里的文件才有文件大小。如果你是分发单个文件的安装包，那安装包被替换了也不知道。如果你是分发整个目录，那也可以替换整个目录。所以，一定要安全 hash。用 sha256

> IPNS 要等 IPFS/CAS 成熟，都用起来之后再说
> 之后还有时间签名功能，更是另说
