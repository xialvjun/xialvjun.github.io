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
