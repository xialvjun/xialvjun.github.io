mylang   

import {abc} from 'module' 很傻，因为没法在写 from 'module' 前代码提示 abc
应该 from 'module' import {abc} 这样就能代码提示。。。

同样。。。 var a = call_func(args) 这样可能也不好。。。换成
call_func(args) => a: Person;
a.sayHello();
即
call_func(args)(a:Person => {
    a.sayHello();
})
理解成上面那种回调可能更准确。。。这里就类似于  clojure 的 
(-> args f1 f2) == f2(f1(args))

于是 
call_func(args) = a
from('module') = {abc}
api_sync(url) = data
api_async(url) = data


编程语言里，到处都是运行。。。赋值是运行，调用函数是运行。。。什么都是运行。。。
然后运行的先后顺序，本质上应该是 先有参数，再有函数。。。正好也是 函数调用中先 计算参数，然后把参数传入函数运行。。。

普通语言里。。。
赋值语句是运行，其中，参数是右值，函数是左值的变量声明加上下面的语句
函数调用是运行，参数是参数，函数是函数（这里需要考虑先写参数，后写函数，该如何代码提示）
其实先写参数，后写函数的写法与 clojure 的 (-> a b c d e) 是一样的，等同于
e(d(c(b(a)))) ...


如果 js 有 Thread:
```js
const global_data = new Mutex({
  data: [1,2,3,4,5,6],
  mode: 'rw',
});

const t1 = new Thread(async function() {
  while (true) {
    await Promise.delay(100);
    global_data.lock();
    global_data.data.push('from sub thread');
    global_data.unlock();
  }
});

t1.run();

(async () => {
  while (true) {
    await Promise.delay(100);
    global_data.lock();
    global_data.data.push('from sub thread');
    global_data.unlock();
  }
})();
```



I am RICH language...数字直接都是分数，甚至是复数


module alias + go get/deno

alias.txt
  github.com/abc/bili: golang.org/x/bili
  github.com/abc/bili@^0.2.3: golang.org/x/bili@^0.2.3

from "github.com/abc/bili@^1.3.0" import { bili }

alias.txt 中：
范围小的优先，范围并列的以版本号大的优先（并列是指 <2,>1 与 <1.5,>0.5，有交叉，但互不包含）

from "github.com/abc/bili@^1.3.0" import { bili } 这句在取的时候可能取 1.6.0 版本，然后后续又有代码是 <=1.4.0 ,而 1.4.0 符合 ^1.3.0 ，所以修改上句版本为 1.4.0...
这样不停的回溯修改依赖，似乎不大好。。。。也许在取 ^1.3.0 的时候，就直接把符合条件的所有版本都下载

重点需要分清依赖是静态依赖还是动态依赖。。。动态依赖就是 node 的 require，连 import 都不是。。。动态依赖则不在乎既取了 1.6.0，又取了 1.4.0
静态依赖则不应该有副作用，不存在 go 语言的 import (_ "sqlite/driver")....静态依赖要超级容易分析，然后允许经常回溯，对应的编译文件可以设置方案是不在乎依赖体积，允许重复依赖，尽量都取最高版本，还是在乎依赖体积，尽量最小。。。甚至通过 alias 进行更细致的设置


# half float:
00000 = 0
00001 = 1
00010 = 2
01111 = 1+2+4+8 = 15
10000 = 
10001 = -1
10010 = -2
11111 = -(1+2+4+8) = -15

11111 = unsigned_value - unsinged_10000 = 15
11110 = unsigned_value - unsinged_10000 = 14
10001 = unsigned_value - unsinged_10000 = 1
10000 = unsigned_value - unsinged_10000 = 0
01111 = unsigned_value - unsinged_10000 = -1
01110 = unsigned_value - unsinged_10000 = -2
00001 = unsigned_value - unsinged_10000 = -15
00000 = unsigned_value - unsinged_10000 = -16

1 1*5 1*10
(2-2**(-10))*(10**15)
1 1*15  infinity
0 1*15 -infinity

# unsigned int:
1     => 00000001
127   => 01111111
128   => 10000010 00000000  // 这种仅仅加个 1 可能会完全修改数字，还是不好，还是 https://github.com/multiformats/unsigned-varint 的逻辑完善，仅仅大序小序就决定了不少
255   => 10000001 01111111
300   => 10000010 00101100
16384 => 10000001 00000000 00000000



模块化，单纯的引入模块完全没有副作用，类似 rust(The only functions that can be called in static or constant expressions are `const` functions, and struct/enum constructors.)，所有的顶级定义都叫 Item，包括 macro，Item 的名字不可重复（也许可重复）。。
编译的过程就是走一遍 main 函数的过程，把 main 函数用到的 Item，以及 Item 用到的其他的 Item 都递归走一遍，集合所有的 Item，把 Item 的名字按照“包的名字+版本+模块的名字”补完，
代码里引用包可以只用包名，那么代码所在包就需要有声明依赖文件；也可以代码里直接有依赖的包名和包版本。。。到最后也就是包是没有定义依赖的，而是每句代码的变量都是全名字
然后自己的项目要编译时，可以有个编译预处理代码，会把一个个文件(可能处理 Item 要更细节些，功能更多些)在处理前先通过一遍预处理代码，相当于在内存中修改了文件，从而可以在自己的项目里提前修复上游项目的 bug，例如上游项目有个依赖无法下载，可以通过预处理代码把代码里的依赖包路径变更为镜像路径
因为各自的包都可以对自己依赖的包做预处理，所以非常可能会两个包依赖同一个包，但是对那个包做的预处理不一样。。。这样就看两种预处理的结果有哪里不同，如果是代码逻辑不同，那就当成两个包；如果只是依赖不同，就看处理后的依赖是否可兼容，可兼容，就用其中大的那一个（其实只是预备使用大的那一个，也要看其他地方的依赖，最终保证依赖符合规定但又尽量少）。。。可兼容就兼容。。。

模块化要清楚一点，语言本身是没有任何 `use abc` `extern crate abc` 这样的语句的，这些语句都是用于包管理器的，让其替换为 `mod abc {xxx}` 的.
模块化中，是否允许包 meta 中没有包依赖的其他包信息，而是代码中有这些依赖信息。。。或者说，是否允许代码里有 `use abc@1.2.3::a;` ，如果允许，则必须先下载包，才能知道该包的依赖，但是同一个包的不同版本又可能有不同的依赖，这样就不能统一先知道所有的依赖，再最小化构建。。。如果不允许，则可以有个 .cargo/registry 是个 git 仓库，里面有所有包的元信息，从而计算最小依赖。。。其实允许 `use abc@1.2.3::a;` 这种代码的话，如果 .cargo/registry 里有所有包的所有 item 的元信息的话，一样可以计算最小依赖，甚至是真正的最小依赖（如果 item 的元信息包括 item 本身的大小的话，外部包中没用到的 item 会在构建时去掉）。。。不过需要注意的一点是 `use abc@^1; let a = abc::a; let b = abc::b;` 与 `let a = abc@^1::a; let b = abc@^1::b;` 是有不同的，前者要求两个 `abc` 是同一个，后者无所谓。。。就是类似 `fn abc<T: TraitA>(a: T, b: T)` 与 `fn abc(a: impl TraitA, b: impl TraitA)` 的区别


编译器编译程序有三个级别:
compile -d(--debug): 在 origin 基础上增加 debug 信息
compile -o(--origin): 代码要求做什么，就只做什么，不多做，也不少做。。。编译器能够稳定递归编译自己，也就是每次编译出来的新的编译器的 hash 值相同。。。从而程序的运行时间是准确可计算的。。。
compile -r(--release): 编译器根据代码和要求去优化，例如内联函数，比如给 struct 设置默认值，在构建该 struct 对象的时候仅仅做内存拷贝。。。上面两者都是增大 exe 文件大小，但也加快了程序运行速度。。。也可以根据要求反向去做，减小 exe 大小。。。这些都是看要求本身是如何的。。。对这些要求，社区可以提供 preset。。。例如 compile -r net 是指整个程序是互联网应用程序，往这个方向优化。。。另外，还提供一些优化的宏让程序员自主放进代码中，那样那就算是 origin 了。



rust 不需要 enum，因为可以直接被 mod 替代:
enum Color {
  Red
  Blue
  RGB(u8, u8, u8)
}
Color::Red, Color::Blue;
替换为
mod Color {
  struct Red;
  struct Blue;
  struct RGB(u8, u8, u8);
}
Color::Red
这样替换，能够单独 impl Color::Red...准确说是在 Color mod 中 impl Red

fn abc() {
  // 进入这里的时候，那个 async 段就已经开始执行了，因为 fn abc() async!{}  这里 abc() 就是。。。。不对，都没有执行，因为 abc() 也没有执行 async 段，只有在 poll 的时候才执行
  // 那么，与 async 类似，gener!  也没有执行，而是返回一个 Generator，在 next 的时候才开始执行
  async!{
    await!();
    xxx
  }
  gener!{
    yield!();
    xxx
  }
}

async fn abc() { await }
换为
fn abc() { async!{ await!() } }

包名问题：https://www.reddit.com/r/rust/comments/9adfnq/a_method_to_deal_with_crate_name_reservation_spam/
然后用户在访问网站时，使用包名访问网站，自动回跳转到 包 id 地址上，再显示包内容，从而，用户收藏和分享的也都是 包 id


自动匿名 union 就会自动加 tag，然后 (A | B) | C 等价于 A | B | C.... 所以，哪怕出现前者，也应该先合并再加 tag，而不是 A:11,B:12,A|B:1,C:2 这样的标签。。。也不需要 因为 A 与 B 都有方法 play(), 就让 A | B 能直接调用 play()。。。应该必须让 match A | B 得到真实的类型
rust 中 enum 的 类型大小是 tag 加上最大的一个类型的大小。。。这里的 union 也一样


fn <P>abc<R>(a: P, b: P): R {}
<P>abc<R>(xx, yy) // <P>abc<R>(xx, yy) 中 <P> 可省略。。。另外，有时函数 abc 的定义中，就不需要 R，因为 R 可以从 P 中得到，那么，调用 abc 时更是什么泛型都不用写
这个位置的原因是 <P>abc<R> 即 Param -> abc -> Result
需要考虑是  abc<R>(a, b) 好 还是 abc(a, b)<R> 好


需要思考个问题，为什么变量需要是 Sized。。。能不能无视这些，类型只是编译期的代码逻辑的约束，于是
fn abc() {
  if true { 1 }
  elif true { 2.3 }
  elif true { Promise.resolve(1).map(n => n.toString()) }
  else "123"
}
这里，abc 的返回值类型是 i32 | f64 | Map<Promise<i32>, i32 => String> | String .... 然后
fn main() {
  let a = abc();
  if a is i32 {
    return print("a is an i32, and a can use i32's method. So a + 3 = ", a + 3);
  } elif a is f64 {
    return xxxx;
  } elif a impl Promise<String> {
    return print("a impl Promise<String>, so a can use Promise<String>'s methods.");
  } else {
    return print("a is String");
  }
}
上面 abc 的返回值类型可以省略，由编译器推断（它推断得到的都是准确类型，即结构体类型，除非 abc 返回值里有手写**模糊类型**），也可以由用户手写 Struct | impl Trait
**模糊类型** 是类似 impl Trait, dyn Trait...
然后考虑 abc 内部有模糊类型，它该如何推断：
fn ab(): impl Promise<String> {
  Promise.resolve(1).map(n => n.toString())
}
fn abc() {
  if true { 1 }
  elif true { 2.3 }
  elif true { Promise.resolve(1).map(n => n.toString()) }
  elif true { ab() }
  else "123"
}
这样 abc 的类型，推断得到的是 i32 | f64 | Map<Promise<i32>, i32 => String> | impl Promise<String> | String, 则:
fn main() {
  let a = abc();
  if a is i32 {
    return print("a is an i32, and a can use i32's method. So a + 3 = ", a + 3);
  } elif a is f64 {
    return xxxx;
  } elif a is Map{ m, n } {
    return print("extract a by struct Map, and get m, n");
  } elif a impl Promise<String> {
    // a is Map{ m, n } 和 a impl Promise<String> 的顺序很重要。。。如果 a impl Promise<String> 在前，则 a is Map 永远都不会被执行到
    return print("a impl Promise<String>, so a can use Promise<String>'s methods.");
  } else {
    return print("a is String");
  }
}

if, elif, else ---> if, ef, es ... 所有的 if 后面都相当于默认加了个 else None


js 有 null undefined 两个空值，是由它动态语言的本质决定的。。。例如 function abc(a, b, c) {}  abc(1)  这样，b c 就应该是 undefined 而非 null，以此区分 abc(1, null, null)。。。。
而其他的强类型语言，就只有一个空值，不存在 function abc(a, b, c) {}  abc(1) 。。。用户必须 abc(1, null, null)

final 只赋值一次。。。
const 是 compile time 赋值的 final

// 函数定义， fn fn_name:output_type input_tyep { fn_body }
// fn my_fn:(i32, i8) x:i32 { (9, 6i8) }
// my_fn 1;
//
// fn my_fn2 (x:i32)
// my_fn (1i32)
// 不不不，这种情况不知道怎么区分调用无参数函数，和传递 无参数函数 变量。。。
// 其实也是可以的。。。所有的函数，如果没有 return，就默认加个 return None(pub struct None;)，所以同样的，无参数的函数，则参数类型是 None。。。所有的函数只有一个参数，之后都只是对这个参数做解构
// 所以把无参函数作为变量传递是直接用 它的名字。。。调用它则是 my_fn None
// 不不不，这种小括号只用于 tuple 类型的，让 a(b(c)) 的代码不好写。。。`a b c` 是 `a(b)(c)`；而 `d=b c; a d` 则必须分成两个语句...虽然理论的确如此，但开发体验太差。。。。
// 等等，似乎 `a(b(c))` 可以写成 `a{b{c}}` 或 `a{b c}` 因为 `{}` 就是一个表达式。。。这样，则匿名函数的定义就不好是 `x { x+1 }` 了

上面的模糊类型中，impl Trait 仅仅是写起来方便，而 dyn Trait 则是真正的消除类型。。。运行区别是：impl Trait 是静态分发。。。即 fn abc(p: impl A) 则整个程序中有 abc(p1) 和 abc(p2)，p1/p2 是两个不同的 struct，则会生成两个 abc 函数。。。
impl Trait 等同于泛型函数，其实泛型函数可以有更严格的限制。。。因为，上面有  `fn <P>abc<R>(a: P, b: P): R {}` 的举例，可以保证 a、b 两个参数类型是严格一致，而 `fn abc(a: impl P, b: impl P)` 则不同
。。。。。上一句说的 “严格一致”，到底要不要严格一致，这需要理解：泛型 中的 型 到底是个什么东西，模糊类型算不算型。。。具体类型里面有模糊类型又怎么算。。。union 类型里有模糊类型又怎么算。。。union 类型算不算型


A < A|B

要注意一点，impl Trait 等同于泛型函数，或者说得更直接点，重点是在变量是 静态分发 还是动态分发。。。于是模糊类型与准确类型中，真正的情况是，根本不存在模糊类型。。。而且因为变量的本质是栈偏移量，所以所有的变量一定是 Sized 的，根本不存在非 Sized 的变量。。。rust 中有 !Sized 是因为 rust 把类型的概念太扩大了，一些真实内存中根本不存在的东西，都被认为是类型，例如真实世界中最多只能存在 &[i32] ，但它非要把类型扩大到 [i32] 是一个类型，&[i32] 也是一个类型

一个 impl Future<i32, i8> 可能是 Map<anymous_closure_struct<a, b, c>, xxx> 也可能是 Map<anymous_closure_struct<Then<a, b, c>, b, c>, xxx> 或者 Then<Map<a, b>, b, c>
所以一个 let a: [impl Future<i32, i8>; 10] 这样一个数组，编译器需要在编译时找到 a 里面存在的元素的所有可能的类型，即 impl Future<i32, i8> === Map<a, ,b, c> | Map<b, a, c> | Then<a, b, c> | ....
然后数组的内存大小是 max_size_of(Map<a, ,b, c> | Map<b, a, c> | Then<a, b, c> | ....) * 10
...所以，静态分发会出现几何级别的类型数量上涨，不过这是必须的，无可避免



文件与文件夹与模块：
1. 编译器可以指定编译某个 main 函数，得到对应的 exe （准确的说，是指定编译某个 mod，使用 mod 的全名，这样，有 main 函数的 mod 也并非一定就要是顶级 mod，更通用）
2. 一个文件内可以有多个 mod。。。然后每个 mod 内都可以有一个 main。。。编译器可以不指定一个 mod，而是指定一个文件。。。或者说把文件当成一个 mod 的话，编译器可以不指定一个内部直接有 main 的 mod，而是指定一个内部间接有 main 的 mod。。。所以，准确地说，编译器编译仅仅是编译一个 mod，然后会递归编译此 mod 下面所有的子孙 mod，这些 mod 中有 main 的话，就生成一个 exe，文件名就是对应 mod 的全名...
3. 此外，文件是 mod，文件夹也是 mod。。。并且因为子 mod 可以无缝访问父 mod 的元素，但是文件里面是不会出现文件夹的，只有文件夹里面出现文件，所以这里并不会出错(其实有问题，因为文件有后缀名，文件夹没有)。。。访问 兄弟文件 mod 就是： `::sib_file_name`，访问 叔叔文件 mod 就是： `:: ::aunt_file_name` or maybe `::.::aunt_file_name` 其中 `.` 可以认为是取属性的点语法，前面的空格是 mylang 中设想的空格语法，暂未确定
4. linux 文件系统中不允许出现 具有相同名字的 文件 和 文件夹。。。这里也一样，而且 mylang 中，一个 mod 中的所有的顶级元素，不论他们的类型，是不是 pub，是 struct 还是 trait 还是 fn，名字必须互斥
5. main 函数不知道是否应该为 pub。。。理论上，只要 mod 是 pub 的就行了。。。文件和文件夹是自动 `pub mod file_name { file_content }` or `pub mod dir_name { pub mod file_name { file_content } pub mod file_name { file_content } }`...其中 file_name 和 dir_name 都会被 escape ，使它们成为合法标识符（就不要用中文了，因为 `()[]{}::` 都不是标识符，但他们可以出现在文件名中，至于 `+-*/` 要不要作为标识符，还是就是运算符，需要再考虑）。。。使用 `:` 来 encode，这样 `你好.rs` 就是 `:::你:好`，即 `:` 字符表示下一个字符可以作为标识符。。。。但如果文件名是 `abc:abc.rs` 于是变成 `::abc::abc` 这显然不对。。。
如果把 `:` 换成 `::` ，可以倒是可以，但是不是很美。。。`abc::def` 这里，因为 `d` 本身可以作为标识符，所以 `::` 表示子模块，`abc::你a` 这里，因为 `你` 不能作为标识符，所以 `::` 表示escape。。。但这需要看后面的字符是什么，才能决定前面的字符的作用，而且还是两个 `::` 感觉不好


在 rust 中看到 (a, b, c).some_method() 的方法，初看，完全不能理解，怎么一个 tuple 就有方法，后来才知道是环境中有 impl SomeMethod for (Ta, Tb, Tc) {}...感觉这种模式可能并不好。。。
例如 impl SayHello for Person { fn say_hello(&self) { println!(self.name) } } ....  然后  fn abc(s: SayHello) { s.say_hello() } .... 这种代码，本质上是传进数据 Person 和传进逻辑 SayHello 。。。 所以，应该是 fn abc(p: Person, s: SayHello<Person>) { s::say_hello(p) }
而事实上，s: SayHello 并没有固定在 Person 上，所以是 fn abc<T>(data: T, trait: SayHello<T>) { trait::say_hello(data) }... 这种形式，看起来 trait 可以提取出来，但事实上，函数签名里必须要有 SayHello 这个 trait，用以限制 T
即 fn abc<T: SayHello>(data: T) { SayHello<T>::say_hello(data) }... 或者 fn abc<T: SayHello>(data: T) { type t = SayHello<T>; t::say_hello(data) }....这样看来，SayHello 根本就不是一个 trait，而是一个有众多方法的 object，并且这个 object 还是一个泛型 object，即 object SayHello<T> { fn say_hello(s: T); }  impl SayHello<Person> { fn say_hello(s: Person) { println!(s.name) } }
......不对，其实 trait 本身没问题...不然，使用 trait 的方法都要 SayHello<T>::say_hello(data) 或者 type t = SayHello<T>; t::say_hello(data) , 相比 data.say_hello() 实在是多写太多代码了... 
但是 (a, b, c).some_method() 这种代码又实在太难看懂了，所以，本质问题是在 变量名 上，而不是 对象实例 上...即：
我们可以 fn abc(data: impl SayHello) { data.say_hello() } 这种代码一点都没有不好懂，因为变量名 data 的类型就是 impl SayHello ...
但我们不可以 (Person { name: "nnnn" }).say_helo()   也不可以 let p = Person { name: "nnnn" }; p.say_hello();  需要转成 let p = Person { name: "nnnn" }; let s: impl SayHello = p; s.say_hello();


1 + 2 让人感觉是 1.+(2) 于是会有想法是不是取属性可以用空格代替，函数调用也用空格代替，于是: a b c d e 这么一串，代表的到底是 a.b(c).d(e) 还是 a(b).c(d).e 还是 a.b(c.d(e)) 还是 a(b.c(d).e) 太多可能性，根本编译不了。。。
所以，还是 1.+(2) 这样，用点语法取属性。另外因为整个函数参数是一个类型，所以把 (2) 当成一个 tuple，则是 1.+ (2) 。。。


有 js 用法: a ? dayjs(a).format(xxx) : null
这里面，如果 a 是挺长的表达式，例如 get(obj, 'abc.a') ，那就更蛋疼了
所以，类似 a?.b?.c? 这种语法，如果有 (a? -> dayjs).format(xxx) 这种语法就好了


函数参数整个的是 tuple...然后 gui 编程实在需要 可选参数, 命名参数... 所以 tuple 类型之间有包含关系, 命名参数也需要 函数参数可以是 dict 的概念. 这里 dict 并非 Map<K, V> 而是类似 ts 的 Record<keyof xxx, 这里不知道怎么写> 就是不同的字段这里类型是不同的, 更准确的说 dict 类似 struct... 直接匿名 struct 也可以, 于是小 struct 实例往大 struct 上传, 大 struct 上缺少的字段要有默认值, 所以 struct 声明时要可以设置默认值... 
然后, 因为 tuple 不需要声明就可以使用, 所以 struct 也一样..... 最终, 这里跟 rust 一样, tuple 就是一种 struct
...
上面那段的说法几乎已经就直接是鸭子类型了...但完全是鸭子类型也并不好...所以,  匿名struct 与 匿名struct 之间是鸭子类型, 有名struct 到 匿名struct 是鸭子类型, 反之不是...但是 有名struct 与 有名struct 之间应是实际类型, 这样才能确定 有名struct 的虚函数表
上面的鸭子类型比较特殊: 大的可以转小的, 因为大的有小的的所有字段. 小的也可以转大的, 如果大的那些字段有默认值

类型注重匿名类型与实名类型... tuple dict function 都是匿名类型

async block 会向下传染, 类似 dart2 的 const 会向下传染一样... 另外, rust 的 mut 也是向下传染, 跟 dart2 的 const 一样..


**tuple and dict**
if cond_expr expr [else if cond_expr expr]* [else expr]?
tuple: (a, b, c)
dict: (a: a, b: b, c: c)
no mix: (a, b: b1, c) is a dict which can be extract from a dict or construct to a dict
tuple with dict: (a, b, (a: a, b: b))
不行, 如果 tuple 与 dict 都用小括号, 那很容易出乱子, 例如: fn hello(a, b, c) {} 这里参数 (a, b, c) 原本是准备对一个 tuple 解构, 然后偏偏函数调用那边原本是 hello(get_x(), get_y(), get_z()) 正常, 突然重构 let (b, a, c) = (get_x(), get_y(), get_z()), 然后 hello(b, a, c) 那这里 (b, a, c) 到底是 dict 还是 tuple... **所以必须区分 tuple 与 dict**, 可以 () 是 dict, [] 是 tuple... () 是 dict 可以鼓励大家使用 dict 作为参数...
**也许可以都用 () 来表示 tuple 和 dict, 只看中间的符号是分号还是逗号, 分号就是 dict, 逗号就是 tuple... 只有单个元素, 就 expose 出来**
其实也可以是 (a,b,c) 是 tuple (a;b;c) 是 dict... 这个应该更好... 这种情况下是 只有一个元素的dict/tuple 都不该存在(虽然可以存在 (a,)/(a;), 但没有意义), 零个元素的dict/tuple是一回事,都是 none
[] is tuple: [a, , c] === [a, null, c]
() is dict
{} is code block
至于原本用 () 改变优先级, 现在都用 {} 来改变优先级, 因为是 code block, 意义保持一致

构造
1. abc(a, b, c) ------ ts: abc(a, b, c)
2. abc(a, b, c,) ------ ts: abc(a, b, c)
3. abc(get_a(), b, get_c()) ----- ts: abc(get_a(), b, get_c())
4. abc(a: get_a(); b; c) ------ ts: abc({ a: get_a(), b: b, c: c })
5. abc(a: get_a(); b; c;) ------ ts: abc({ a: get_a(), b: b, c: c })
> 注意只有一个元素的 tuple/dict 的情况, 例如: 
abc(a) 这里 (a) 并非构造一个 tuple/dict, 只有 abc(a,) 则是构造一个 tuple, 此 tuple 有一个元素
abc(a,,c) 这是构造一个 3 元素 tuple, 第二个元素为 null/none/undefined/(), 实际意义是 undefined, mylang 中用 () 替代 undefined, 即 abc(a,(),c)
abc(a;) 是构造一个 {a:type} 的 dict...
总结: 
(a) 仅仅是 a, 并非 tuple/dict
(a,) 单元素 tuple
(a, b) 双元素 tuple
(a, b,) 也是双元素 tuple, 等效于 (a, b)
(a;) {a:a} 的 dict
(a; b)  {a:a,b:b} 的 dict
(a; b;)  也是 {a:a,b:b} 的 dict, 等效于 (a;b;)

解构
1. fn abc(a: i8, b: i8, c: i16) ------ ts: function abc(a: i8, b: i8, c: i16)
2. fn abc(a: i8, b: i8, c: i16,) ------ ts: function abc(a: i8, b: i8, c: i16)
3. fn abc(a: i8, b: (b1: i8, b2: i16,),) ------ ts: function abc(a: i8, [b1, b2]: [i8, i16])
4. fn abc(a: i8, (b1: i8, b2: i16,),) ------ ts: function abc(a: i8, [b1, b2]: [i8, i16])
5. fn abc(a: i8; b: 16;) ------ ts: function abc({a, b}: {a:i8, b:i16})
6. fn abc(a: i8; b: (b1: i8; b2: i16;);) ------ ts: function abc({a, b: {b1, b2}}: {a:i8, b:{b1: i8, b2: i16}})
> 3 与 6 都只生成了 a, b1, b2 三个变量, 没有生成 b 变量...
> 3 里可以写 'b: ' 也可以不写 'b: ', 而它可以写 'b: ' 的原因是 6 里必须写 'b: '
> 3 里可写可不写 'b: ' 在本质上说明了 1-6 这 6 个解构都用了不写 'b: ' 的原理. 拿 1 举例就是 1 本质上是 fn abc (args: (a: i8, b: i8, c: i16))


**一直有个问题，没有 undefined 概念的语言要怎么表达 js 中的 undefined**
即 graphql 中有 mutation update_person(id:ID!,name:String,age:Int) 客户端可以传 age:null 让数据库此字段变为 null，客户端也可以传 age:undefined，json化后 age 不存在，用以表示数据库不修改此字段。。。那对于服务端 resolver 的 args type 里要怎么表示这个 undefined...后来想清楚真实逻辑，应该是 args:{id:string,name:string|null,age:i64|null} | {id:string,name:string|null} | {id:string,age:i64|null} | {id:string} 再对args 做 match:
match args {
  // 必须复杂的放在上面... 或者不同的地方放在上面 (这是大类型的值可以赋值到小类型的变量上) : case {age:i64|null}: { 这是有 age 字段, 虽然可能为 null };
  // ? 是不是可以这样: 还可以 case {age:i64}: { 这是有 age 字段, 且不为 null };
  // 的确应该可以上面 case {age:i64} 的写法, 因为 age:i64|null 我们也可以 match age {case i64:{};case null:{};};
  case {id:string,name:string|null,age:i64|null}: {};
  case {id:string,name:string|null}: {};
  case {id:string,age:i64|null}: {};
  case {id:string}: {};
}

另外还可以增加一个变量(适合于没有 union 类型系统的语言, 其实有 union 也是这种更方便), 例如 dart 的 graphql server, resolver 的 args 里那些没传的参数就会是 null, 则需要从 meta 中知道这个 null 到底是传的 null, 还是根本没传... resolver(root, args, ctx, meta:{ast, is_name_exists}) 先判断 is_name_exists, 再使用 args.name


**可选参数绝对不能用参数类型来提供定位的功能, 因为函数参数完全可能多个参数是同一种类型**
(a, b?, c?)
(1) => b=null, c=null
(1,2) => b=1, c=null
(a, b?: i64, c?: f64)
(1, 3.14) => compile error 而不是 b=null, c=3.14 ... 想表达 b=null, c=3.14 应是 (1, null, 3.14)
若是 (a, b:i64=2, c?:f64) 想表达 b 为默认值, c=3.14, js中有 (1,undefined,3.14) 甚至 (1,,3.14) 但没有 undefined 的语言就没办法了...
// ? 需要考虑是否应该让 undefined 成为一个特殊值... 
其实 mylang 中本身已经有了两个特殊值 () [] ,如果 dict 用 (a;b) 语法, 那就只有一个 () 可以用 () 代表 undefined
null 是这里有个空, () 是这里什么都没有   ? 或者是否应该反着来....不不不, 就是 null 是空, ()是什么都没有...
match (1,2,3) { case (): {这是成立的, 大的可以传给小的} } ... fn abc() {}  这里 abc() 就是指 abc 什么参数都不需要, 而不是需要一个空...然后 abc(1,2,3) 也可以运行...
match person_p1{case ():{ 这也应该是成立的, person_p1 是一个实例对象,它有很多成员,这些成员可以组成一个 dict,然后这个大 dict 可以传给 () 这个小 dict }}
即 case () 就是 case default... 只是 match primitive_type... 要看 primitive_type 的实现方式
然后因为 null 是空, ()是什么都没有, 则 (1,,3.14) === (1,(),3.14) 与 {a;b;} === {a;b;()} 这是一个语法糖...不确定是否应该要这个语法糖...
也许这个语法糖是必定要的, 因为要保证 {a;b;} 是有效的代码, 总不能连 {a;b;} 都要编译错误...然后如果 ;} 之间可以省略 (), 为什么 ,, 之间不能省略 ()...
然后, (a:i64,b?:f64) 这里就是 ?: 之间省略了 =()
// ? 或许 mylang 里就不要 undefined 了, 然后可以不要 null, 直接用 () 代替 null... 然后用 is_undefined() 代替 undefined
// ? 可空的 ? 到底应该放在哪里? 变量名后面, 类型后面, 变量名前面, 类型前面...或者是根本没有 可空? ,硬性写默认值 =()
// ? 取可空属性 abc?.a 这种语法的存在前提是 abc: {a:T} | {}.... 但如果 abc:{a:T}|{a:P}|{} 然后 T 与 P 又有相同的后续属性, 则, 代码根本无法判断...
     需要 abc<T>?.a 这里 <T> 放 ?. 前面是 T 是输入类型... 或许应该放在后面, abc?<T>.a 更准确是 abc.?<T>().a .... 
     ? 不清楚这样好不好, 感觉有太多面向对象的成分了, 可能还不如把这特殊函数做成关键字操作符...的确把这些东西都当成函数并不好, ?. 当成函数, 函数还可以用 match 来实现, 可 match 要怎么当成函数, is 要怎么当成函数, 当成函数, 函数内要怎么实现...里面肯定还是要有特殊语法的, 不好, 还不如暴露出来
    *获取 mylang 里可能只有 () 未定义, 而没有 null, 函数想表达 null 的时候, 只要设置一个常亮就好了, 例如:*
    fn update_person(id:string, name='abc':string|false) 当 name==false 时, 表明函数使用者希望函数把 name 设置为 null, 当 name=() 时, 表名使用者希望使用默认值... 还是 未定义 比 定义为空 更有用... 未定义可以让程序员少写代码, 定义为空只需要 函数设置一个特殊值就可表示空, 而且语言支持 union, 所以特殊值可以是其他类型, 更容易了

不用 match n { case } .. 直接就是有关键字 match 和 is ... is 是直接类型... match 是匹配类型... 两者都返回 boolean
if n match (i8,i8) expr
if n is i64 expr
(n ? (i8,i8)).0  这是 ? . 语法, 等同于 if n match (i8,i8) n.0

dart 有个 operator table https://dart.dev/guides/language/language-tour#operators ...里面的 operator 的优先级是从上到下依次降低...然后重写 operator 不改变其优先级... 从而鼓励人们哪怕重写 operator 也不改变它的语义(虽然本身就没人会去改变其语义)


有点需要考虑: int 是 complex, 而 complex 由两个 real 组成, real 由两个 int 组成 .... 再简单点, int 是 real(分数), 可 real 却是由两个 int 组成...
这应该是有 类上绑定的自动转换函数... 而不是基于什么继承

dart 级联操作符 挺适合声明式编程...
return AddressBookBuilder()
    ..name = 'jenny'
    ..email = 'jenny@example.com'
    ..phone = (PhoneNumberBuilder()
        ..number = '415-555-0100'
        ..label = 'home');


数组要怎么弄? 
数组是没有扩容的, 是固定长度的, 当需要扩容的时候, 它是新申请了一份更大的内存空间, 把自己按字节拷贝过去了的...
如果是既扩容, 又增大类型, 则是把对象一个一个赋值过去(赋值是一个很特殊的操作, 小类型对象赋值到大类型变量, 会增加一个 union tag)...
数组跟 tuple 是不同的, 数组有 size 与 length 的不同, tuple 则是 size 与 length 相同. 不过大概, 也许, 可能能用 tuple 实现(但需要宏来生成 tuple 代码)
用宏生成数组  array<Person>!(100, Person(), Person()) 展开成 struct Array{size:100,length:2,data:(Person(),Person(),...default_Person()*98)}...
然后 Array 的方法里根本就不能访问超过自己 length 之外的 default_Person... 另外, default_Person 要怎么生成,  macro 里是使用 unsafe 代码, 填充 sizeof<Person> 的空白内存... Array 有 get 方法, 当 get(index) index 大于 length 时, panic; 有 push 方法, 大于 size 时 panic; 有 set 方法, set 的位置的前方有空白时(即 index > length+1 时), panic

有语法, 直接在堆上生成对象, box array!(100, Person()) ... 这里学习 dart 的 const, 既可用在 value 上, 也可用在 variable 上, 还是向下传递的...当然, 两者编译层面应用逻辑不同... box const 也属于类型的一部分

Vec 实现:
最简单的 Vec 是里面始终只保持一个数组, 当要扩容时, 就生成新的空间更大的数组, 把旧数组丢弃掉... 而更复杂的 Vec 则是可能会同时保留多个数组...
这里说最简单的 Vec: struct Vec<T>{array: box Array<()>}  这里 Array<()> 是 大的 tuple 始终可以传给小的 tuple, 所以把 array 字段当成一个变量, 那就可以把所有的 Array 传给这个 array 变量, ... 不过好像有问题, 因为把大 tuple 对象赋值小 tuple 变量时, 会发生数据丢失(除非用 ... 语法, 这里不谈), 其实应该是:
最简单的 Vec: struct Vec<T>{array: box Array<(T*2^isize)>, array_real_size: isize} 在初始化时, 可能会有 unsafe 把小的 Array as 为大的 Array, 之后在各种操作时, 都会经过 array_real_size 的校验, 返回 Result<T, Error> 一个 union ... 
这要求 box 语法足够直接, 完全没经过 栈... 

... 语法: (a, b, ...c) = (1,2,3,4,5) 则 c = (3,4,5)
Type * const isize 语法: Array<Person * 100> or Array<(...Person*100)> ... 其实不是 Array<Person*100>, 而是 Array<Person, 100>, 因为 Array 要求内部 tuple 的各元素类型相同
as 语法: 
(1,2,3) as (i8,i8) 这等同于 (a:i8,b:i8) = (1,2,3) 有数据丢失, 但不浪费内存... 
12 as i8|null 等同于 a:i8|null=12 会浪费内存做 union 的 flag...
(1,2) as (i8,i8,i8) 这是 unsafe 的, 内存不会发生变化... struct Vec<T>{array: box Array<T, isize.max>, array_real_size: isize} 在初始化和之后改变 array 字段的值时就是用这种(重点: 内存不会发生变化)... array! 这个 macro 内部申请了空白内存, 也是这个 unsafe as
*重点要注意到 as 并不是 编译期类型备注, 而是 运行期内存拷贝*
**as 关键字并非是编译期的 类型注释, 而是运行期 的 内存拷贝**
(1,2,3) as (i8,i8) 会在编译期按照类型区别, 制定好拷贝规则, 在运行期实施拷贝
(1,2) as (i8,i8,i8?) 也一样
而 (i8,i8,i8?) 类型的空间占用应是 8bit + 8bit + (8bit + 8bit), 第三个 8bit 是表名它是 null 还是 i8
这种空间占用表明 union 类型只看直接 union 类型, 不提升. 如: (i8,i8,i8?) 虽然从数据的本质上与 (i8,i8) | (i8,i8,i8) 等同, 但是, 词法规则就决定了它的内存布局, 决定了他们是不同的类型, 能在编译期做 as, 从而运行期按照编译期的规则做内存拷贝, 但不能说两者就是完全相同的类型, 没有内存拷贝...
(i8,i8,i8?) 只是语法糖, 本质上是 (i8, i8, i8 | null), 内存上是 8bit + 8bit + (8bit + 8bit)
(i8,i8) | (i8,i8,i8), 内存上是 8bit + ((8bit + 8bit) + 8bit) 第一个 8bit 是表明是 (i8,i8) 还是 (i8,i8,i8), 后面三个有两个内存复用

mylang 中改变优先级 应使用 {} 而不是 () , 因为 {} 是 表达式 ... 其实 () 也可以, 如果 () 内部只有一个, 而且末尾没有 逗号 时, 它就是用做改变优先级, 但这只是兼容方案
连 类型表达式 也可以改变优先级 如 (...Person*100) 如果觉得不放心优先级, 想多添加下, 可以是 (...{Person*100}) 或 (...(Person*100))
需要注意点: a:(Person) 等同于 a:Person , a:(...Person*1) == a:(Person,) == a:Person*1 ,,,, 
另外, 也就是说 ... 三点语法只能用在 tuple/dict 中 不能 a:...Person*1
... 错, 根本不存在类型 (...Person*100) ... 这里想表达的是 100 个 Person ...其实是一个长度为 100 的数组, 但是 tuple 跟数组是不同的, 数组类型必须一致, tuple 类型可以不同

许多语言都用特殊语法定义 模块顶级 item, 例如 fn main() {} 用 fn 定义函数, 然后那个函数可以认为是 const, 可以在编译期调用, 例如 fn add_one(n:num) {return n+1;}; const three = add_one(2); 既然 three 是 const, 那 add_one 肯定也是 const... 要注意 const 一定是编译期能确定的, 但编译期能确定的不一定是 const ...
例如完全可能有 static a = 1; fn app() {return ++a;} const b = app(); const c = app(); 最终得到 b=2,c=3, 都是 const, 而 a 可以设定是 程序一运行的时候就是 3 了, 之后 b c 那里不用运行; 也可以设定是 a 继续在程序刚运行时是 1, 之后 b c 那仍然不运行, 毕竟 const... 可能 a 程序刚运行时是 3 更好
... 呃, 还是让 const 不得从 static 中派生更好, 因为允许从 static 中派生, 逻辑太多... 相反, 这完全可以程序员自己手动做:
const _a = 1; static a = _a; fn app() {return ++a;} const b = _a + 1; const c = _a + 2;
不然, 依赖的顺序就成了一件烦心的事情

上面说了用特殊语法定义顶级 item...而不是用赋值语句来定义顶级 item, 似乎这样可以打乱定义顺序, 整个程序的初始化都没有副作用一样...
但其实不要被误导了... 哪怕是用特殊语法定义 item, 程序的初始化肯定仍然是有顺序的, 顶级 item 的循环依赖就能轻松证明这点( struct A<T:B>(a:T); struct B<T:A>(b:T) 像这样, 就顶级 item 循环依赖了, 肯定不行...中间至少加个条件 struct A(a:i32|A) )
考虑下: struct Real(a: int, b: int if b!=0) --- 这如果是字面量构建, 那编译期就能判断, 但如果是传变量, 则没法判断, 这就是一个普通的会 panic 的函数...
也许可以:
fn Real(a: int, b:int) { if b != 0 (a, b) else Error('b should not be 0') }
impl Real {}
impl Real match (int, int) {}
impl Real match Error(string) {}
// or
fn Real(a: int, b: int) { if b!=0 (a, b) else panic!('b must not be 0') }
impl Real match (int, int) {}
// or
struct Real(a: int, b: int) { if b!=0 (a, b) else panic!('b must not be 0') }

一个点子: 程序内部分三种概念: 类型, 逻辑, 数据.
类型随便定义: type A = {a:i64,b:i64} | {c:i8}; 定义了一个类型... 之后再使用 A 的时候要 match
逻辑是函数, 结构体本质上也是一种函数: fn create_a(a:i64, b:i64): A {return {a, b}}.... 还有对 A 定义方法
数据则是 A 的数据结构, 而且真正使用 A (即 A 的方法的内部) 要对 A 做 match, 得到里面的数据, 再操作
这种方式就断绝了 结构体实例, 能轻松实现 real(分数) 类型:
type Real = (i64,i64); fn init_real(a:i64,b:i64) { Real|Err b==0 ? Err('分母不得为 0') : Real(a, b) }
好像还有点问题, 根本就没有 Err('分母不得为 0') : Real(a, b) 这种代码, type 根本没有自构造函数...
那换成 ('分母不得为 0') as Err : (a,b) as Real ... 这样好像也不行, 既然 init_real 里可以 这样 as, 那别的地方也可以这样 as, 于是完全可能出现 (1,0) as Real, 但这个 Real 是错误的, 如果允许它通过, 那所谓的实现 Real 就没有意义了

对于要求加载模块完全无副作用, 则必须模块顶级 item 的声明是完全独立的, 不依赖其他 item 的, 例如 struct A<T: Person> {a:T} 这种就不行, 它依赖了 Person... 不清楚可不可以做到完全无其他依赖的语法...其实可以把 struct A<T: Person> {a:T} 变为 defstruct A<P> => struct A<T: P> {a: T}  这样理解的话, 单纯的 struct A<T: Person> {a:T} 其实是单例

type Gender = 'M'|'F'|'U';
impl Gender {
  pub const Male = 'M';
  pub const Female = 'F';
  pub const Unknown = 'U';
}
enum Gender {
  Male = 'M';
  Female = 'F';
  Unknown = 'U';
}
// xxxx 凭什么下面的代码可以有 Gender.Male
type Gender = {
  const Male = 'M';
  const Female = 'F';
  const Unknown = 'U';
  Male | Female | Unknown
}
enum 类型在当 value 使用的时候, 本质是个 const 对象 const Gender=(Male:'M';Female:'F';Unknown:'U')
在当类型使用的时候, 是这个 const 内部的那些 const 的 union 类型... 从而:
用 macro 来生命 enum: 
enum!(Gender, (
  Male:'M';
  Female:'F';
  Unknown:'U';
));
// ! const 作为类型在 union 中理论上应该是可以不占 flag 的, 运行时变量如果跟 const 值一样, 例如是相同的数字, 需要用运行时 typeguard 来转化类型

enum Color {
  name(string);
  rgb(i8,i8,i8);
  hsl(i8,i8,i8);
}
本质上是
type NameColor = string;
type RGB = (i8,i8,i8);
type HSL = (i8,i8,i8);
type Color = NameColor | RGB | HSL;
let a: Color = xxx;

match a { // match 相比 if else 最大的区别是 match 必须完整
  NameColor: xxx;
  RBG: xxx;
  HSL: xxx;
}
这说明 type 并非类型别名, 不然 RGB 与 HSL 就没区别了

**match / is 到底是什么:**
首先要确定的是, 就算是 a match const b, 它也不是要求 a 实现 PartialEqual, 把 a 与 b 做运行时比较, 而是要 a 就是 b
match 是在运行时对比 union 的 flag, 

上面的 enum! 会展开为
const Gender = (Male:'M';Female:'F';Unknown:'U');
type Gender = Gender.Male | Gender.Female | Gender.Unknown;
不行不行... const 对象本身可以作为类型来使用, 所以 const 与 type 的 item 不可重名...需要有一个换个名字, 例如 type GenderT
不不不, 感觉还是最初的 type Gender = 'M'|'F'|'U'; impl Gender { pub const Male = 'M';xxx } 最好, 跟 下面的 Person 保持一致, 而且 Person 内部可能也会有 const/static 属性(const 的都是 static 的)  static 属性用 :: 或者也许可能换个, 例如 - 来表示(不行, - 是减号)

type Person = (name: str; age: u8; gender: GenderT);
// 定义 type 可以是直接定义一个结构体, 也可以 结构体 | 结构体, 即一个 union 类型, 也可以是一个 function, 返回值则为其类型
// 符合 type 的结构体可以直接 as 为此 type,(赋值就是一种 as)... as 为 type 之后才能使用 type 的方法, 不能直接在 dict/tuple 上运行方法
// 下面的  type Person() 这不太一致, 还是用 等号= 更好, 即 type Person = xxx;
type Person(name: str, age: u8, gender: GenderT) {
  if age == 0 panic!('age must be greater than 0') else (name;age;gender)
}
type Person = (name: str, age: u8, gender: GenderT) => if age == 0 Error('age must be greater than 0') else (name;age;gender)
impl Person match (name:str;age:u8;gender:Gender) {
  pub const has_soul = true;
  pub const say = (n: str) => {
    println(`hello ${n}`);
  }
  pub static population = 100;
  pub name;
  // ? 下面的 pub hello 该不该加 pub fn hello
  pub hello = (other_name: str) => {
    println(`hello ${other_name}, I am ${this.name}.`);
  }
}
// 可以给 match 部分命名
impl Person.OK match (name:str;age:u8;gender:Gender) {}

trait SayHello {
  pub const hello = (n: str) => println!(`hello ${n}`);

}

对于 pub, 参考 rust
```rust
mod b {
  pub struct B(i8, pub i8);
  impl B {
    pub fn new(one: i8)->B {
      // return B(0, one);
      B(0, one)
    }
  }
}
fn main() {
  let i = b::B::new(10);
  println!("{}", b.1);
}
```

fn main(args: str[]): nil {

}


```rust
// rust 也支持循环依赖... 不过如果 struct 是循环依赖, 需要使用 指针
pub mod abc {
    #[derive(Debug)]
    pub struct B(i32, pub i8, super::A);
    impl B {
        // 这里 rust 要求 static/const 变量必须声明类型... 其实个人感觉等号右边的值分两种, 有明确类型的, 和无明确类型的, 10 就是无明确类型的, 10u8 则是有明确类型的, 如果右值有明确类型, 则变量不需要声明类型, 而且 const 值本身就是类型... 更别说如果用 const 来声明函数, 有时候函数签名会很长, 而闭包函数更是无法写签名
        pub const MAX: u8 = 10;
        pub fn new(one: i8)->B {
            super::c();
            let r = B(123, one, super::A::Two(12));
            println!("{:?}", super::A::One(Box::new(r)));
            let r = B(123, one, super::A::Two(12));
            B(123, one, super::A::One(Box::new(r)))
        }
    }
}
fn main() {
    let b = abc::B::new(10);
    println!("{}, {}", b.1, abc::B::MAX);
}
fn c() {
    println!("c");
}
#[derive(Debug)]
enum A {
    One(Box<abc::B>),
    Two(i32)
}
```


**? 语言有 compile time 特性, 区别于 const**
compile time: 可缩写为 comptime(参照 ziglang), 也许还可以是 cpt ... cpt 与 const 的区别是:
cpt 是真正在编译器进行的, const 则只是在编译期可分析, 在运行期才计算的(如果有 comptime 的话, const 为了区别就只能这样定义)...例如:
comptime comptime_random = Math.random();
const const_random = Math.random();
则 comptime_random 在程序每次运行, 值都是相同的, 因为它的值已经在编译的时候就定下了, 写进了二进制文件中;
而 const_random 在每次程序重新运行, 值都会变化, 只在程序的一个生命周期内值不变;
**dart 有 static final 与 const**
假如说 dart 的 static final 没有内部可变性, 则 const 就是编译期就处理好内存, 之后运行到 const 只是指向内存而已

**rust Sync 不是编译器特例**
之前以为 rust 的 Sync 啥的是编译器的特例类型...但是仔细想下, 其实不是, 它是 thread 的构造函数要接受的一个普通的 Trait...thread 的构造函数接收一个 闭包结构体, Sync trait 如果所有子元素都 Sync, 那自己就 Sync.... 好吧, 这的确跟通常的 trait 不一样, 通常的 trait 需要自己主动实现, 而 Sync 可以被自动实现, Clone/Copy/PartialEqual 是 derive 实现, 自己下面所有的子元素都实现了 Copy/Clone/PartialEqual, 其实也是主动实现... 需要有多个 trait 的形容词来实现不同种类的 trait, 甚至是一段编译期逻辑去形容 trait...
rust 有 Drop, 是在离开变量作用域时调用, 这个绝对跟编译器有关
所有不可测大小的 类型, 都要是 & 借用, 或者 box 指针 包裹


type Person = (name: str, age: u8) => only one return struct
// or
type Person = (name: str, age: u8) => many return struct
// many struct 的话, 那些 struct 是否需要命名

// 如果可以这样的话, 那谁都可以给别人的类创建构造函数... 如果说不脱离模块的话, 似乎是可以的
type Person.from_json = (jso: Json) => many or one struct

fn abc a: i8 | i16 | i32 str::format!("{}", a)
fn abc (a: i8 | i16 | i32) (str::format!("{}", a))
fn abc (a: i8 | i16 | i32) {str::format!("{}", a)}
fn abc (a: i8) | (b: i16) | (c: i32) {str::format!("{}", a)} ---- 错错错
1. 首先把 fn abc 换成 const abc = a: i8 | i16 | i32 => str::format!("{}", a)
2. 从 `fn abc (a: i8) | (b: i16) | (c: i32) {str::format!("{}", a)}` 可以看出后续的代码根本写不了...因为虽然函数调用中 实参->形参  类似于赋值, 赋值 类似于解构, 解构 类似于 match... 但中间有稍许区别, 至少 match 是由 if 来控制, 且每个 match 都有个代码体...这样似乎就是函数重载了, 但它又跟重载不同, match 由 if 控制, 是有顺序的, 可被跳过的... 而函数重载却没有顺序... 另外, 函数需要有签名, 而由 if 控制的 match 是纯粹运行时的, 无需签名

有的语言根本没有函数重载, 而是推荐写多个函数, 然后由上层来判断...其实这种方式也不知道是好还是不好... 真实来说, if 不能消除, 只能转移, 只是转移得好坏而已...如果有重载, 或者是函数内有 if match, 那就是把 if 保留在内部, 外部简单些...如果内部没有 if, 那外部就要有 if 了, 但如果外部安排得好, 倒也不会有问题... https://jingyan.baidu.com/article/359911f576a91d57fe0306dd.html
有 type Person.fromJson 的话, 那应该函数就应该没有重载, 也不需要内部 match

干脆 "是内部 if 还是外部 if 交给程序员决定"... 现在只需要想 内部 if 的话, 参数要怎么写
赋值与 match:
let res = a_function();
if (res match (a: i8)) {
  println!(a);
} elif (res match (b: i16)) {
  println!(b);
} elif (res match (c: i32)) {
  println!(c);
} else {
  never_reach!();
}
// or
let res = a_function();
if (res match (a: i8)) {
  println!(a);
} elif (res match (b: i16)) {
  println!(b);
} else {
  let (c: i32) = res;
  println!(c);
}
// or
let res = a_function();
if (res match (a: i8)) {
  println!(a);
} elif (res match (b: i16)) {
  println!(b);
} elif (res match (c: i32)) {
  println!(c);
} // no else but compile ok

// 但如果想
let (a: i8) | (b: i16) | (c: i32) = a_function();
// 这种代码根本写不了... 函数形参等同于这里等号左边的部分
// 而如果只是
let res: i8 | i16 | i32 = a_function();
// 这其实跟上面三个 let res = a_function(); 是一样的, 另外, 这种就难以 代码及注释 了
// 或许可以
let res: (a: i8) | (b: i16) | (c: i32) = a_function();
let res: (a:i8,x:i8) | (b:i16,y:i8) | (c:i32,z:i8) = a_function();
const abc = res: (a:i8,x:i8) | (b:i16,y:i8) | (c:i32,z:i8) => {
  if (res match (a: i8)) {
    println!(a);
  } elif (res match (b: i16)) {
    println!(b);
  } elif (res match (c: i32)) {
    println!(c);
  } 
}
或者根本不允许  解构与 union 在同一级
const abc = res: (i8,i8) | (i16,i8) | (i32,i8) => xxx
更深层的同一级
const abc = res: (i8,(a:i8,b:i8) | (c:i16,d:i16)) | (i16,i8) | (i32,i8) => xxx
上面 (i8,(a:i8,b:i8) | (c:i16,d:i16)) 是错的, 因为是纯粹类型, 那内部也是纯粹类型, 因为它既然已经是纯粹类型, 就不需要文档了
所以根本不存在 (i8,(a:i8,b:i8) | (c:i16,d:i16)) 这样的代码, 只能是 (i8,(i8,i8) | (i16,i16))
更深层的同一级
const abc = (a: i8, b_or_c: (b0: i8, b1: i8) | (c0: i16, c1: i16)) => xxx
此时对 b_or_c: (b0: i8, b1: i8) | (c0: i16, c1: i16) 准确说是 (b0: i8, b1: i8) | (c0: i16, c1: i16) 这部分, 就是结构与 union 在同一级, 解构白白浪费
应该写成 const abc = (a: i8, b_or_c: (i8, i8) | (i16, i16)) => xxx
对于没有 union 的倒是可以级联解构 const abc = (a: i8, (b0: i16, b1: i16)) => xxx 这里 (b0: i16, b1: i16) 前的 b: 可以事实上也应该省略, 即解构就不应该原本的它命名, 更符合 不允许解构与 union 在同一级 res: (a: i8) | (b: i16) | (c: i32)

**rust 的 match**
https://kaisery.gitbooks.io/rust-book-chinese/content/content/Patterns%20%E6%A8%A1%E5%BC%8F.html
https://kaisery.gitbooks.io/rust-book-chinese/content/content/Match%20%E5%8C%B9%E9%85%8D.html
https://kaisery.github.io/trpl-zh-cn/ch06-02-match.html
match 主要匹配 enum, 提取 enum 内部的 struct 的数据(enum 内部的 struct 的字段全是 pub); 也可以单独提取 struct 的内容, 而且可以不提取的字段不写, 即 let a = Point{x:1,y:2}; match a { Point{x,..}=> }... 所以它能遵守里面的字段的 pub 规则
rust 中用 _ 代表省略单值..., 用 .. 代表省略多值

rust 中有大量特殊 trait, 例如 From(编译器自动帮你转类型), Drop(编译器帮你运行 drop 函数), PartialEqual(复写 =), Add(复写 +) ...


**用 item 名字来决定 pub, _开头就 private**
_ 开头就 private 与 用 _ 代表省略 保持了一致...
dict/tuple 默认是 pub, 所以 type 也应该默认 pub
深度 type 例如 type A = (a:i8;b:(c:i8,d:(e:i8,f:i8))) 这种, 如果想要只 pub f, 写得有点多, b-d-f 都写, 不如在 a,c,e 前加 _
而且如果是只隐藏 e, 则只在 e 前加 _
tuple 也可以用 _: let a = (1,_2,3) 则 a.0, a.2 可以, 但不可以 a.1... 正好数值 literal 的第一个字符不能是 _, 其他 expression 前加个 _ 也没有问题, _ 与 expr 间可以有空格, 可以没空格


**enum**
mod Color {
  const RED = 1u8;
  const GREEN = 2u8;
  const BLUE = 3u8;
}
enum_mod!(Color) ===== Color::RED | Color::GREEN | Color::BLUE;
type ColorT = enum_mod!(Color);
其实跟 下面的 并没有什么差别,最多 mod 会在编译期展开,直指 const RED,而 const 对象取属性,则是在运行时取.其实也可以在编译期取,看怎么理解 const
enum!(Gender, (
  Male:'M';
  Female:'F';
  Unknown:'U';
));
=======
const Gender = (Male:'M';Female:'F';Unknown:'U');
type Gender = Gender.Male | Gender.Female | Gender.Unknown;

**还是不要有自定义 enum 的内存表达了**
因为允许自定义的话, 可能出现不同的枚举值, 有相同的内存表达
const a = 1;
enum!(Gender, (
  Male: a;
  Female: 1;
  Unknown: 2;
));

**typescript const type**
const a = 1;
const b = 2;
const c = 1;
let m: typeof a|typeof b|typeof c = 1;
let d = 1;
typeof d ====== number
const e = 1;
typeof e ====== 1


**宏编程**
宏有好几种宏, 有的只接受个 token list, 自己对 token list 变换... 有的接受个 expression, 能识别 expression 的类型,
其实宏可以匹配 PEG, 然后提供 PEG rule 是 mylang 本身的... 然后
macro_content = 'select * from ' mylang ' where ' mylang .... 这样就能根据 peg 得到的东西转换, 也能得到 mylang 部分内部的 ast 和类型信息... macro 就是一个增强语言本身定义的 PEG 规则的东西....
然后因为都是定义的 PEG, 所以在 macro 内部做代码补全也更轻松

既然总归是有 trait 影响语法的情况出现, 干脆就各种操作符都是 trait, 包括一元操作符... 或者是方法名可以有各种各样, 而且有修饰关键字, 说明此方法是放在哪里的, 例如前置方法, 后置方法, 中置方法 等等..........---- 算了, 还是不要有前置方法, 后置方法啥的, 迷惑性太大... 全都中置方法, 全是二元的...因为参数只有一个, 直接组构和解构而已

_ 用来表达 private, 是关键字后, 还可以用它来表达快捷参数函数,... 而且正好 mylang 的函数只有一个参数, 可以用 _.0  _.a 来取本该是解构出来的值

**可能有懒加载模块**
所以加载模块是  const abc = import('');  const abc = await import_async('');   不过也可能也可以直接全部都在顶部声明模块依赖, 静态分析哪些可以懒加载, 再加个 关键词 来强制懒加载... 懒加载的模块不能在顶级使用
模块加载要有加载全部的方法, 而不是所有的地方都通过模块名再去访问内部的东西... 因为 可能依赖 


**可变性**
有两种概念的可变性:
1. rust 内存版: let mut a = (1, 2); 此时, 可以改变整个指向 a = (3, 4); 也可以改变内部属性的指向 a.0 = 3; ... 其实这里面根本不是改变指向, 而是改变变量对应偏移量所在的栈内存... let mut a = (1, 2); 时, 栈上确实有个 (1, 2), 之后 a = (3, 4); 就把那段内存更改为 (3, 4) 了;... 因为 rust 是真正的改变内存, 所以把整个指向改变与部分改变合并为一种语法在概念上是一样的
2. kotlin 指向版: val a = (1, 2); 此时, 不可以改变整个指向 a = (3, 4); 但可以改变内部属性 a.0 = 3; 要想改变整个指向, 需要是 var a = (1, 2); 这样看的话, 改变内部属性对应的其实就相当于 val a = (var 1, var 2); ... 于是类似 dart 的 class, 它里面有的成员是 final 不可被改变指向, 有的是普通的 可以被改变指向...

rust版 有优点: 一不改, 整个的都不能改, 于是可以跨线程; 也有缺点: 一改, 整个的都可以改, 不像 dart 的 final 成员, rust 要实现外部可改, 内部不能改的成员, 只能是把成员私有, 再提供个 get 方法返回个不可变借用... 那到底要不要内部 final 呢? 感觉其实不要更好, 首先, 内部 final 是不必要的, 本来就可以不要; 其次, 如果有内部 final 了, 其实就是一个成员是 pub 的, 但不可以 set 它... 这有隐含 getter setter 的概念... 感觉其实比写一个 get 方法返回一个不可变借用要别扭不少...

**mut 属于类型的一部分, 它应该放在哪里?**
let mut a = (1, 2);
// 是否允许 写 mut 但不写类型
let a: mut = (1, 2);
// 是否使用 _ 表示类型通配符
let a: mut _ = (1, 2);
// 或者使用 * 表示类型通配符
let a: mut * = (1, 2);
let a: mut (i8, i8) = (1, 2);
// 是否使用 * 表示 mut --- 这要看 * 在 rust 中表示啥
let a: * = (1, 2);
// 是否用 * 表示 mut 的时候, 可以无空格
let a: *_ = (1, 2);
let a: *(i8, i8) = (1, 2);
// 是否可以根本不用 let ... 注意: golang := 声明变量不允许接类型
a: mut (i8, i8) := (1, 2);
// 或者不要冒号... golang var 声明变量不用冒号 var a i8 = 8
a mut (i8, i8) := (1, 2);
a: *_ = (1, 2);


**type 是可 nested 的**
type A = {
  a: i8,
  b: {
    b0: i16,
    b1: i32,
  },
};
于是我们可以 let a: A = {a:127,b:{b0:999,b1:99999}} , 也可以 let b: A.b = {b0:999,b1:99999};


**type 构造函数**
之前有想法是 type Person = (name: string, age: u8) => (_id: 123, name, age);
或者说是 type Ratio = (a: u64, b: u64) => if b == 0 panic!("b must not be 0") else (a, b);
不过后来实在是觉得这样 type 函数的 参数 可能是 union, 返回值也可能是 union, 太复杂...
现在想来, 也许可以用 private 来实现 constructor, 并拒绝直接结构体构造...例如: 假设默认是 pub, 用 _ 表示 private
type Ratio = (_ u64, _ u64);
const create_ratio = (a: u64, b: u64) => if b == 0 panic!("b must not be 0") else (a, b) as Ratio;
impl Ratio {
  const get_a = &self => self.0;
  const get_b = &self => self.1;
}
而且不把它暴露出来, 也不提供 set 方法是有理由的... 暴露出来, 用户就有可能 let mut r = create_ratio(1, 3); r.1 = 0; 这样弄错了...
set 方法倒是可以提供, 在方法内部判断是否有错... r.set_1(0) 将抛错
> 仍要仔细考虑 type 函数是否也可以... 感觉 type 函数容易出现 type A = () => (); type A.a = () => (); 
> 这样让 A.a 看起来 A 是一个对象,而不是一个 type
> 不用 type 构造函数, type 仍然可以是 union...
上面错了, 哪怕字段是 private, 但 as 不受 private 约束, 也就是模块外部也可以 (1, 3) as Ratio... 需要给 Ratio 增加个空字段, 让外部无法对齐
type _phantom = ();
type Ratio = (_ u64, _ u64, _ _phantom);

......
> 可能还是 type 声明的类型, 除了自己的模块, 不然不能基础数据 as 到它...也就是说不能把 普通 tuple/struct 传参给需要一个 type 的函数...这样应该能较好的解决封装问题

**模块封装性**
mod A {
  type A = xxxx;
  impl A {
    const a = () => println!("a");
    const b = (&self) => println!("b: {}", &self);
    // 这里还是需要命令式编程, 顺序性的决定 item, 避免出现顶级循环依赖, 例如
    const a = <T: typeof b>(&self, b: T) => { println!("a"); b(&self); }
    const b = <T: typeof a>(&self, a: T) => { println!("b"); a(&self); }
    // 命令式编程中, 上面的写法很容易知道出错, b 未初始化, a 不能用 b... 但声明式编程却有可能写成上面那种错误形式
    fn a<T: typeof b>(&self, b: T) { println!("a"); b(&self); }
    fn b<T: typeof a>(&self, a: T) { println!("b"); a(&self); }
    // 另外 typeof 可以换成 macro: typeof a === typeof!(a)  ... 不能是 type!(a) 因为 type 是关键字
    // 现在就是静态方法, 和实例方法, pub 和 pri 该怎么写了

  }
}

let use(./abc) > (abc;); === let (abc;) = use(./abc); === let (abc;) < use(./abc);
let abc() > a;
a.some_what();
abc() > a => a.some_what();    XXXX, 错, 这都不分 大于 和 传入了... 用 |> 或者 -> 都太多字符了, 还不如个工具函数或工具宏 pipe!()...

abc() |> a;
a.some_what();
use!(./abc |> rename_abc);
use!(./abc);

**还是加 pipe**
pipe 最重要的作用是 **减少命名**... 而且 mylang 中所有的参数本质上只是一个 对象, 所以 pipe 和 call 都非常适合转换
let print_square_of_x_plus_one = x => x |> _ + 1 |> square |> print
let print_square_of_x_plus_one = _ |> _ + 1 |> square |> print
因为如果只是用工具宏 pipe!() 的话, 如果宏只是转换代码的话, pipe!(_, _ + 1, square, print)... 写到 pipe!(_, _+1, sq) 的时候编译器很难做到前置提示, 用 |> 就真正在编译器级别把它转为后置提示了

abc() &> a;   a = &abc();
// cuocuocuo
abc() *> a;   a = 
mut abc() &> a;   a = mut &abc();   *a.xx = xx; / *a = bac();
abc() &> mut a;   mut a = &abc();   a = &bac();

**文件夹并非模块**
很多语言里把文件夹都当成一个模块... 然后 文件夹内部的 index 文件或者 lib 文件作为模块内容... 感觉很琐碎, 容易出错...
而且 rust 的 feature 方式来条件编译, 很麻烦...还不如不同的 entry point 达到不同的编译内容...条件编译也可以, 很灵活, 但是不应被鼓励, 会造成代码太乱...
于是因为有不同的 entry point, 所以也不该有 index 文件...应手动指定 entry...
于是 "文件夹不是模块" 就理所应当
例如有
tmp
├── a.rs
├── b
│  ├── b.rs
│  └── bb.rs
└── b.rs
则 a.rs 里 use b/b;
如果 b/b.rs 里有 pub mod bbb {}... 则 use b/b::bbb;
再考虑上 相对路径, 绝对路径, 还有本模块所在文件内部其他模块...
```rust
// a.rs
use ./b;
use ./b/b;
use ./b/bb;
use ./b/b:bbb;
mod a {
  // 两个 : 表名到上一层
  use ::b;
  mod c {
    // 三个 : 表明取当前文件顶层
    use :::b;
  }
}
mod b {}
// todo: 上面那么多引入会引发重名错误, 但意思表达到了
```
文件夹不是模块, 文件才是模块... 文件夹只是文件的名字的一部分...只是个路径而已...文件内部也有写在该文件内的模块, 文件内还可以 pub 其他文件模块

可能另一种方法更符合直觉...不区分文件夹/文件/模块... 只是查找顺序的不同而已...或者发现有相同的引用可能就报错...这样则是先查模块, 查不到就查文件, 查不到就查文件夹
```rust
// 引入 abc 这个包, 而 abc 的名字来源于 package.json 里定好的  abc: uuid@version
// abc 是一个包名... 包只是一个文件夹... 里面有 package.json, 有设置 main 入口
use abc;
// 引入当前文件所在目录里的 abc 文件[夹]模块
use ./abc;
// 引入电脑 根目录下 abc 文件[夹]模块
use /abc;
// 如果有上级模块的兄弟模块叫 abc, 就引入那个模块, 没有就引入上级目录下的 abc 文件模块...即
// mod x { use ../abc; }; mod abc {};... 其实只要简单的要求文件与文件夹不重名就够了, 重名直接报编译错误
use ../abc;
```
mod 要做好 normalize


实测 umi-request@1.2.11 会消耗 非 200 的响应, 例如 401... 而且明明已经消耗了, 却仍然报错, 如果状态码不在 200-300 之间... 
https://github.com/umijs/umi-request/blob/master/src/middleware/parseResponse.js#L60-L69

个人感觉, 如果要报错, 那就早点报, 也干脆不要 parseJSON 了, 如果要 parseJSON, 也不要动原 res, 只动 copy res...所有 middleware 的设计原则都是: 预设 ctx 上有什么东西, 以只读的方式去读取他们, 产生结果, 把结果放到 ctx 上


**contracts**
https://dlang.org/spec/contracts.html
https://softwareengineering.stackexchange.com/questions/229972/what-is-the-difference-between-dependent-typing-and-contracts


**generator**
闭包是个匿名结构体, generator 其实也是个结构体, 并且内部有很多函数和状态, 例如:
```js
function abc*() {
  let a = 0;
  let b = null;
  while(true) {
    b = yield a++;
    console.log(b);
  }
}
```
这个 generator 相当于一个:
```js
class Generator_abc {
  a=0;
  b=null;
  // 差不多是这个意思
  next(_b) {
    b = _b;
    console.log(b);
    return a++;
  }
}
```
然后 generator 有不方便的地方是: 它只能顺序执行, 不能后续的 next 调用让 generator 的运行状态换位置... 造成的后果是: 
https://www.zhihu.com/question/388457689/answer/1165782397 ... react 为了能随时暂停和重启, 甚至选另一个位置重启 diff 过程, 做了 fiber...而 crank 把调度留给 generator 去表达, 就不能做到 "选另一个位置开始" 的逻辑...
generator本身已经可以 **多进多出**, 但如果它还可以 **多进多出任意位置进**, 就更爽了:
```ts
function abc*() {
  let a: int = yield:x 1;
  let b: string = yield:y 2;
  console.log(a, b);
}
let g = abc()
assert(g.value === 1);
// g.x("abc"); wrong type 这里是 x,y 方法的参数类型取决于 a, b 的类型, 所以 a,b 应该强制声明类型, 如果没有, 则认为是 yield 的原值类型
g.x(10);
g.y("abc"); // log: 10 abc
// 除了可以 x, y 以外, 还可以 next, 但 next 的值类型就还没搞清楚
```
这样, 它本质就是:
```ts
class Generator_abc {
  a: int;
  b: string;
  x(_a: int) {
    a = _a;
  };
  y(_b: string) {
    b = _b;
    console.log(a, b);
  };
}
```
个人认为 generator yield 带名字的, 是函数, yield 不带名字的, 是 next; next 的不能作为右值(因为)... 
~~next 的会跳过 yield 带名字的, 而且那会把 yield 的值本身作为右值~~
next 不会跳过 yield 带名字的, 而是调用 next 无效, 另外, 上一次调用 next 得到的 结果中, 有函数 x/y.... { x: (a:int)=>xxx }


**条件类型你尽管定义，能实现算我输😁**
let a: 0..8 = 1; // ok
let b: 0..8 = a + 1; // not ok, 因为 a 是 0..8, 再加 1 有可能溢出
let c: 1..9 = a + 1; // ok
0..8 这个类型与 0|1|2|3|4|5|6|7 类似, 但本质不同
它本质上是一个 const 无序集合, 即:
const T = 0..8;
let a: T = 1;
0..8 与 0|1|2|3|4|5|6|7 的不同是:
0..8 只是一个类型描述信息, 只存在于编译器的运行时中... let a: 0..8 = 1; a 只占一个字节
0|1|2|3|4|5|6|7 是一个 union 类型，union 的部分在编译后的程序的运行时中仍然存在，占两个字节，一个类字节，一个值字节
甚至可能有 0|1|2|3...|255|256... 300  ... 300 > 255, 于是这里, 光 union 的类字节就占 2 个。。。
而 let a: 0..8 甚至可以有 let a: 0..Infinite
... 这里 0..8 只是数字可用的定义常量集合的语法。。。用这种语法定义出的常量集合 拥有在编译期与运行期都可用的转换函数。。。
let a: 0..8 = 1; // 这就是编译期把 const 1 转为 0..8
let b: 1..9 = a + 1; // 这就是编译期把 0..8 + const 1 确定可以转为 1..9
if (some_num match 0..8) // 这就是编译期确定 some_num 必须在 i8 范围, 且 >=0, <8 ... 
然后编译期确定 i8 又导致编译期确定 i16 ... 意思是 if (some_i16 match i8) ... 理论上可以升级至 所有的 match (match 是可选的，as 是强迫的), 但也可以编译期加一定的范围，例如至少编译期确定 some_num 至少是个 num ，而不是 string。。。。不过想想，编译期不做限制也没啥

另外, 0|1|2|3|i8 这种是否可以。。。
如果可以，意味着 union 类型是有顺序的，编译期给值赋类型时，从前到后。。。如
let a: 0|1|2|3|i8 = 1;
编译期给类型 0|1|2|3|i8 类型分 2 个字节:
第一个字节是类字节, 0x00 是 const 0, 0x01 是 1 ... 0x03 是 3, 0x04 是 i8;
第二个字节是值字节. 于是 a 的内存是 0x0101. 
如果是 let b: i8|3|2|1|0= 1; 则 b 的内存是 0x0001 ... i8 后面的 3|2|1 永远不会用到.., 编译器可以做优化, 但那是编译器的优化模式, 而严格照代码编译的模式不管这些
如果 union 是有顺序的, 则 union 的 union 是不能合并的... 
因为如果能合并, 则 (i8|i16|i32) | (i16|i32|i64)  === i8|i16|i32|i64 ... 但 (i8|i16|i32) | (i32|i16|i64) 合并是啥 ...
不能合并的话 (i8|i16|i32) | (i32|i16|i64) 的类字节就要占 2 个字节...

... 不对, 如果是有顺序, 就更是能够合并的, 因为 (i8|i16|i32) | (i32|i16|i64) 中, (i8|i16|i32) 造成了 (i32|i16|i64) 中的 i32|i16 永远不存在
而合并的话, i32|i16 === i32.... 那其实也有 i8|3|2|1|0 === i8

则 union 类型, 1: 前面的类不可包含后面的类型; 2: union 与 union 的 再 union 会 flat, 并把后面的被包含的类型抹去

union 类型的值, 会被编译成一个结构体 {type:int,value:buffer} ... 然后使用其值,都是先判断 type 再根据 type 本身的内存结构去使用 value


**关键字重用**
import 'http' as http;   let a = b as i32; 这两处 as 是完全不同的用法, 但这里做关键字重用
array.map(_ + 1); array.reduce(_ + _1, 0); array.reduce(_0 + _1, 0);  ---- 不, 还是不用 _ 作为占位符, 因为 _ 可以作为 标识符... 
也许 $ 作为标识符更好(java, js, php, perl)都支持 $ 作为标识符, 且 $ 只能做开头, 用作占位符正合适
array.map($ + 1);
array.reduce(0, $ + $1);
array.reduce(0, $0 + $1);
$ 与 $0 代表第 0 个参数, $1 代表 第1个参数....
....错了... 按之前的想法, 无论怎样的函数, 必定有且只有一个函数, 剩下的是模式匹配做参数解构... 所以用 _ 做占位符也合适, 可以规定单独的 _ 不能作为标识符, 于是:
array.map(_ + 1); array.reduce(0, _.0 + _.1); 点语法后接数字是取 tuple 内容的语法, rust 就这样... 
tuple 本身使用没比 dict 方便, 都是点语法, 只是 tuple 不需要想名字... 所有, 既是 tuple,又是 dict 是没必要的, 因为既然能想名字,就没必要用 tuple


**macro**
macro abc {
  // lisp code
  // 可调用 命令行 程序进行副作用调用...
  // 命令行程序来自于 安装包时 自动安装, 类似 node_modules/.bin 命令行程序 名字带包版本号, 可用 semver 匹配
  (PEG => PEG)*n;
  (PEG => AST)*n;
}

abc! expression;




**lift up const like dart**
render 函数中经常出现 arrow 函数, 如果这个 arrow 函数是个闭包, 捕获了外部变量, 那没办法, 但如果这个函数不是闭包, 例如只是一个 compare 函数, 完全可以提升到最外部, 然后弄个 memonize_compare(arr, lift_up_compare_fn).... 甚至就算闭包, 如果捕获的变量是 render 外部的, 比 render 生命周期更长的变量, 一样可以这样提高性能...
> 但为什么要 lift up 呢, 为的是减小作用域... 另外, lift up 的都是值, 这样就是编译期自动命名了...
可以加关键字 `memonize_compare(arr, lift (a, b) => -1)`, lift 关键字是作用在值上, 相当于在上层加了句  `let lift_final_1 = expression;`, 

但是, memonize_compare(arr, lift_up_compare_fn)  这种调用不适合链式调用. 可以:
函数仍是普通的函数, 但可以中置调用
fn memonize_compare<T>(this: T[]: fn: (a: T, b: T) => -1|0|1): {} --- [1,2,3].memonize_compare((a,b) => -1)
前置调用:
fn abc(a: i8, b: i16, c: i32): i32 {} --- abc(1i8,2i16,3i32)
后置调用:
fn abc(this: i8): i32 {} --- 18i8.abc()
> 中置调用 定义的函数, 也可以前置调用
这就全了, 没有说把 this 放进参数列表的中间的情况... 事实上 this 是一个类型, this 后面的所有参数作为一个整体 tuple 是另一个类型
......
不做什么面相对象编程设计, 而是统一用作用域来找函数
```ts
// a.ts
export type Person = { name: string, age: number }
export function say_hello(this: Person) {}
const a: Person = {name:'xia',age:29}
console.log(a.say_hello()); // ok
console.log(say_hello(a)); // ok

// b.ts
import {Person} from './a';
const a: Person = {name:'xia',age:29}
console.log(a.say_hello()); // not ok, 因为当前作用域没有 say_hello 函数... 需要类似下面 c.ts

// c.ts
import {Person, say_hello} from './a';
const a: Person = {name:'xia',age:29}
console.log(a.say_hello()); // ok, 因为当前作用域有 say_hello 函数

// d.ts
import {Person, say_hello} from './a';
const a: Person = {name:'xia',age:29}
console.log(a.say_hello()); // ok, 因为当前作用域有 say_hello 函数
(() => {
  function say_hello(this: any) {console.log('this:any')}
  a.say_hello(); // ok and log - this:any 此时, 作用域被覆盖
})()

// e.ts
// ! 现在需要考虑 是否支持函数重载, 即
type Person {};
type Animal {};
function say_hello(this: Person) {}
function say_hello(this: Animal) {}
// 自动寻找匹配的函数...

// 感觉并不需要函数重载, 编辑器自动 auto_import, auto_rename 就好...例如
import {Person} from './a';
const a: Person = {name:'xia',age:29}
a.say// 输入到这里的时候, 编辑器能找到 say_hello , 选择 auto_complete 时, 就 import {say_hello} from './a' 了

// ...还是不弄作用域完全分离了, 换成
import {Person} from './a';
const a: Person = {name:'xia',age:29};
a.say_hello();  // ok
say_hello(a); // not ok
Person.say_hello(a);  // ok = 应是 Person::say_hello(a)
import {say_hello} from './a';
say_hello(a); // ok
// 甚至 这个 import {say_hello} from './a'; 都可以不要, 因为有 Person::say_hello ... 这样再减少下重复书写, 就跟 rust 的 impl Person {} 一模一样了
export function say_hello(this: Person) {} ==== impl Peerson { pub fn say_hello(&self) {} }
export function say_hello(this: Person as SayHello) {} ==== impl Peerson for SayHello { pub fn say_hello(&self) {} }
// 但问题是, memonize_compare 它不是一个 fn, 而是一个 闭包, 而且这个闭包有多种实现方式, 全局的闭包, 或者依赖于 this 的闭包, 于是
impl Person {
  static cache = Arc([]);
  // pub fn memonize_compare() { cache } ... 换成 const memonize_compare = () => {} ... 因为上面也有赋值语句... 但赋值语句也可以 pub...
  // 即 pub 的可使用的地方是 所有的可被当成命名空间的地方, 那种地方不可以有条件语句/循环语句... 模块, impl 块 都如此
}
```
但是还需要考虑, 这种机制下, trait 的作用如何实现.
type 是数据结构

**构造函数是有用的**
构造函数是有用的, 避免直接暴露结构体, 让用户创建出错误的数据, 但函数重载很不好, 所以用 dart 的方式写构造函数.
```dart
class A {
  var a = 1;
  val b = 2;
  pub var c = 3;
  A.w() {
    // 此时, 所有的 var a = 1;val b = 2; 都已经执行完, 哪怕是在下面的, 因为它算是异步的. 
  }
}
interface T {

}
impl T for A {}
```


**是传参数, 还是传函数**
这个项目, https://github.com/alpinejs/alpine , 尝试把它变成 jsx, 哪怕不用 vdom, 也会发现需要使用 render-props...
```jsx
<div x-data={{count:0}}>
  {_ => <button onClick={() => _.count++}>{_.count}</button>}
</div>
```
但目前, 写函数的成本仍然太大...能不能更小的成本...例如 scala 的隐式函数...
```js
div({x_data:{count:0}}, _ => [<button onClick={() => _.count++}>{_.count}</button>])
// 等效于
div({x_data:{count:0}}, [<button onClick={_.count++}>{_.count}</button>])
// 其实这里 onClick={_.count++} 是有问题的, 因为 onClick 也是函数, 则里面的 _ 变成了 event 参数
// 不如
{
  const data = {count:0};
  div([<button onClick={data.count++}>{data.count}</button>])
}
```


**让赋值语句也是函数调用, 把函数调用变的普遍, 调试栈是所以运行代码的集合**
13 -> (a: final i32);
console.log(a);
jsx 所有的 children 都变成 render props

**所有的 数值字面量 都是BigDecimal, 然后丢失信息赋值到变量类型** 则:
var a = 0.1 + 0.2;  --- var a: f32 = BigDecimal('0.1') + BigDecimal('0.2') --- var a: f32 = BigDecimal('0.3');
var a = 0.3; --- var a: f32 = BigDecimal('0.3');
a === 0.3; --- a === BigDecimal('0.3') --- a === (typeof a)(BigDecimal('0.3')) --- true


**class 本质上是一个 function**
https://github.com/reactjs/rfcs/issues/177
return is the natural way to send a value out ... 所以用 return ref 代替 forwardRef 更合适...
但是为什么 class component 里用特殊属性, 代替 forwradRef 更好呢? 更准确的问题是:
为什么直觉里 class 的 代替 forwardRef 的形式就是特定属性呢?
就是因为 class 本质上是一个 function, 而 属性 则是这个 function 的一个返回值...
进而更深入的认识到, class 就是一个 闭包, 无非是闭包捕获的变量可作为属性去访问...

所以也许可以:
class A(_name: string) {
  name = _name;
  
}
其实本质上, class 与 vue 的 composition-api 的 setup 函数没啥不同, 都是创建一个状态机...
然后在语言层面, class 可以作为 一个纯粹的类型(完全不存在与运行时中), 也可以作为一个 namespace,
class 的 constructor 其实就是 class 作为 namespace 下面的函数
static member 是 namespace 下面的状态... 暂时不知道是否应该允许内部闭包类
class 的区域应该是纯声明式的, 没有上下, 先后, 条件的关系

class A {
  name: string;
  age: number;
}
语法糖(这里用 () 表示 dict, 用 [] 表示 list): A (name:'xia';age:29) or A ['xia',29] .... --- 也许都用 () 然后用 ; 区分 dict, 逗号 区分 list 更合适
如果 A 有了自定义的 constructor, 则没有上面的语法糖 constructor:
class A () {
  name: string;
  age: number;
}
class A (_name: string) {
  name = _name;
  age: number;
}
class A {
  name: string;
  age: number;
  A (_name:string,_age:number) {
    name = _name;
    age = _age;
  }
}

class 的模式与 rust 有显著不同... rust 是区分状态可变不可变, 并且有内部可变性的, 而 class 是状态机, 显然作为状态, 本身就是可变的
... 但这种不同又在本质上有另一种相同... class 本质是一个 闭包... 然后 rust 的闭包是 FnMut ... class 其实也是如此...这是一种内部可变性
所以...单纯的数据用 匿名 tuple/dict, 或者用 type 给它名字... 状态机 则是 class
struct PersonData = (name:str;age:i8);
class Person {
  mut data: PersonData;
  Person(_data: PersonData) {
    data = _data;
  }
}

...
有纯粹的 interface 要求一个实体实现了 xx 函数集合 ... 或者不止函数集合, 也有状态集合....
也有 mixin 里面自带方法体, 或者 状态实体, 直接把方法体包含进去, 也生成状态(这里似乎 mixin 也有 constructor, 不然 状态可能非法), 放进去...
一个是纯粹的要求, 一个是辅助覆盖, 一个有状态, 一个只有方法 ... 2x2=4 , 应能生成 4 种模式...
但是真正接口使用方其实不应该在意状态(真在意也可以提供 getter), 所以 interface 应该没有状态集合...
而因为 似乎 mixin 也有 constructor, 不然 状态可能非法... 所以根本就不应该有 mixin, 而是一个新的 class, 被 mixin 的对象只是新的 class 的一个成员...
所以最终是 没有 mixin, 而 interface 也只有方法的集合(有的方法只有方法声明, 有的有方法体, 有方法体的方法只能使用该 interface 的方法声明或方法体的方法, 如果想更改状态, 应该是调用只有方法声明的方法, 然后等待那个只有方法声明的方法被实体类实现), 而实体类实现 interface 时, 必须实现只有方法声明的方法, 在里面可以访问实体类和interface的任何成员

关于 class 的东西, 干脆换一个关键字... 例如 state_machine 或直接 state

考虑到 vue 的 composition-api 的 setup 函数是创建一个状态机, 之后都是 render 方法, 跟 class 组件其实是一样的, 那有没有可能有这样的语法:
class A mix B, C {
  onMount(() => {});
  onMount(() => {});
  if (true) {
    onUnmount(() => {});
  }
  var c = ref(0);
  render() {
    return <div>{c.value}</div>
  }
}
... 好像完全不可能, 因为如果有死循环了...
但换成这样就可以了
class A mix B, C {
  constructor(props) {
    super(props);
    this.onMount(() => {});
    this.onMount(() => {});
    if (true) {
      this.onUnmount(() => {});
    }
    this.c = ref(0)
  }
  render() {
    return <div>{this.c.value}</div>
  }
}
**--------------下面非常重要--------------**
... class 状态机 是 适合 大部分消息来自于外部; (内部状态引用都需要一个 this, 麻烦一些)
... setup 状态机 是 适合 大部分消息来自于内部; (有快捷的内部状态引用)
如果 class 相比 setup 仅仅只是这么个优点的话, 似乎新语言完全不用 class, 只用 闭包 返回带有函数字段的 对象就够了
function new_person(name: string) {
  return {
    name, // 这里的 name 应该是地址的引用, 即 get name() {return name},set name(v) {return name=v}
    hello: () => console.log(name),
    eat: (thing) => console.log(name + ' eat ' + thing),
  }
}
然后是纯粹的鸭子类型做多态即可
...
但是函数要怎么复制呢... 类的继承, mixin, 可以定义函数使用外部变量:
```mylang
const eat = (name: &str) => () => {
  console.log(name + ' is eating.');
}
const hello = (name: &str; age: &u8) => () => {
  console.log(name + ' is ' + age + ' years old.');
}
const TraitEatAndHello = (name: &str; age: &u8) => (eat: eat(name); hello: hello(name;age))
const new_person = (name: str; age: u8) => {
  return (
    ...TraitEatAndHello(name; age);
    ...TraitHasName(name);
    sing: () => console.log(name + ' is singing.');
  )
}

// 但是这限制了只有一个 constructor, 相比 dart 的 named constructor...于是
const new_person = xxx;
const new_person_from_json = xxx;
但是这样如何保证 上下两个函数 的返回类型一样呢....甚至 仅仅一个 function, 都可能返回一个 union 类型
```

function say_hello() {
  rtc name: string, age: number;
  console.log(name, age);
}
const TraitA = { say_hello };
function new_person(name: string) {
  return {
    ...TraitA,
    ...TraitB,
    // 这里的 name 应该是地址的引用, 即 get name() {return name},set name(v) {return name=v}...
    // 它对于 rust 那种系统编程级别的语言, 就是天然的 mut 借用, 对于 js 这种, 则是 get set
    name, 
    hello: () => console.log(name),
    eat: (thing) => console.log(name + ' eat ' + thing),
  }
}

**--------------上面非常重要--------------**


java 的 package 机制是所有的 package 都是命名空间, 都是公开的, 只是名字的长短不同而已... js 的文件模块机制也是全部是公开的...
java 与 js 的区别只是 java 没有 import a from './a'; export { a }; 即 java 没有 reexport


**jsx 为了逻辑, 逻辑代码放 jsx 中, 为了性能, 实际定义放上层 --- lift 关键字**
```jsx
// 为了方便编写 和 代码阅读
const MyCom = defineComponent({
  setup() {
    const tick = ref(0);
    return () => (
      <div>
        <button onClick={() => tick.value++}>{tick.value}</button>
      </div>
    )
  }
});

// 为了性能
const MyCom = defineComponent({
  setup() {
    const tick = ref(0);
    const tick_increase = () => tick.value++;
    return () => (
      <div>
        <button onClick={tick_increase}>{tick.value}</button>
      </div>
    )
  }
});

// 新语言 lift 关键字: 会先看 接下来的表达式 引用了什么变量, 然后把此表达式尽可能地往上提升
const MyCom = defineComponent({
  setup() {
    const tick = ref(0);
    return () => (
      <div>
        <button onClick={lift () => tick.value++}>{tick.value}</button>
      </div>
    )
  }
});

// doc lift
// from
const tick = ref(0)
return () => lift () => tick.value++
// to
const tick = ref(0)
const $1 = () => tick.value++
return () => $1

// from
const tick = ref(0)
{
  const b = 2
  const d0 = () => {
    console.log(lift tick);
    console.log(lift b);
  }
}
// to
const tick = ref(0)
const $1 = tick
{
  const b = 2
  const $2 = b
  const d0 = () => {
    console.log($1);
    console.log($2);
  }
}
```
但是如果按 rust 的系统编程形式说明, 对 lift 关键字定义出的对象的使用, 都是不可变借用...
另外, lift 关键字可以 lift 到顶层, 再顶层, 就变成了类似 dart 的 const value... lift 可以自动提升到 const value



**延迟 type**
```ts
infer type G;

const vuex_module = {
  getters: {
    g: (state, getters, rs, rg) => ({...} to G)
  },
  actions: {
    a: ({commit, getters}) => {
      getters.g as G
    }
  }
}
```


**错误处理**
go 的 return error 脱裤子放屁
相反 panic recover 很好
另外 try catch 造成了缩进... 如果 panic revocer 是无缩进的 即
```go
do_something();
panic xxx;
do_something();
recover xxxxx;
```
即, 在 panic 之后, 下面的所有代码都被忽略, 直到遇到第一个 recover, 遇到 if 也忽略, 不忽略 loop defer
但这样 panic 又会丢失 错误的类型信息.... 其实编译器真要收集 也是可以收集到 所有的错误类型的, 得到一个 union type, 则:
```mulan
fn do_a() {
  panic '错误';
}
fn main() {
  do_a();
  panic 2;
  let e: string|number = recover;
  match e {
    case string: xxx;
    // case number: xxx;
    case _: xxx;
  }
}
// or
fn main() {
  defer {
    let e: string|number = recover;
    match e {
      case string: xxx;
      // case number: xxx;
      case _: xxx;
    }
  }
  do_a();
  panic 2;
}
```
但又有问题, 当把一个 会 panic 的函数 A 作为参数传给别的函数 B 时, B 运行 A 会导致 B panic 出了 A 会 panic 的类型, 这里编译器要怎么知道 panic 的类型
... 所以, 所有几乎所有函数都至少还有个 error 泛型
http://semicircle.github.io/blog/2013/09/24/letpanicfly/
recover() 应该能返回 error 和 stack_trace, error 是用户 panic 的任何东西, stack_trace 是 recover 本身收集的. 还可以 recover(option) option 告诉说不用 stack_trace, 从而 recover 更快

需要知道 dynamic dispatch 和 static dispatch 的区别


**基本构成**
const item 只有 函数, 基本类型, 结构体 和 结构体的值... 没有 class 的 new ... 没有 函数调用... 总的说来就是没有函数调用, 哪怕是 constructor 也一样, 避免副作用
有全局函数 get_current_thread() ... thread 上可以放一些状态... thread 上放的状态要求 size, 所以 main 函数 上可以声明第一个 thread 的 context type...
后续创建 thread, 要先创建一个 context, 然后 move 到那个 thread 上...
因为 'const item 只有 函数, 基本类型, 结构体 和 结构体的值', 所以初始化完全无需担心循环依赖 (结构体它循环依赖不了, 因为如果循环依赖, 他就无法创建此结构体的值; 函数循环依赖, 他只是死循环, 是合法的)
好像不是, 不然 const A = 1 + 1; 这种就不能有了, 因为它是函数调用... 除非说区分基本类型,操作符 ...
大概应该是所有的 const 的东西都可以参与进来... 而所有的 io 都不是 const 的, 即使用了 std.io 的 main 函数不算 const


**同时提供鸭子类型与准确类型**
提供准确类型的原因是, 鸭子类型有可能发生类型碰撞. 例如 error 有 AError = { message: '', a: xx } BError = {message: '', b: xx}... 这很好, 但谁知道会不会有人写出了 CError = {message:'',a:xx} 呢, 毕竟写 CError 的时候不知道存在 AError ...所以需要在出现 UNION 类型时, 自动添加 类型 id, 以在运行时区分, 这就有准确类型存在的情况, 也是必要了.....Error 是被动的 union 类型, 其他 Array 啥都是主动的 union 类型, 由用户自己加个标志位完全可以理解, 而被动的 union, 用户无法主动加唯一标志位....即
type Person = {name:string,age:number};
fn a(x: Person) {}
a({name:'xia',age:3}) 是错的, 
需要写成 a(Person{name:'xia',age:3})


**默认 private**
vue 的 setup function 是创建状态机, react 的 class api 也是创建状态机...任何语言的 class 都是创建状态机...
所以其实 setup function 就是 class 的一个变体, 无非只是它只有一个 pub member - 返回的 render 函数...
如果我们需要, 完全可以 setup function 返回一个 { render: xxx, ref: xxx } 来多加几个 pub member...
闭包捕获的东西, 其实就是 能被 pub member 引用的 pri member


**curry and pipe and autobind**
```
fn abc(a:A,b:B,c:C) {}
let a:A,b:B,c:C;
a.abc(_,b,c);
[a,b].abc(_.1,_.2,c);
fn dabc({d:A,e:B,f:C}) {}
a.dabc({d:_,e:b,f:c});
({a,b}).dabc({d:_.a,e:_.b,f:c});
// 只判断 0 层和 1 层，再深的层就没必要了。。。
// 似乎 1 层也没必要，因为既然 1 层需要组件实参，那就把实参放在左侧构建就是
[a,b].abc(_.1,_.2,c); => [...[a,b],c].abc(_);
let o = ({a,b});
({d:o,a,e:o.b,f:c}).dabc(_);
// 不对，不能在左侧构建，因为这种语法糖就是为了级联操作，所以不能改左侧
// 另外，placeholder _ 也是必要的，因为要在右侧灵活地构建实参，函数不一定是接受 tuple 并且 pipe 的不一定是某一个固定位置的参数
// 从语法层面，我们可以支持 0 层和 1 层以及更多层，但是对于 lsp 而言，就不需要支持 2 层以上的了，不然就指数爆炸了
```
有上述语法，就不需要 class 了，其实也不能有 class，不然就会出现 class 属性与外部 function 命名冲突了
然后这对 import 语法提出了要求。它需要支持 import 一个 struct 附带 import 所有能使用这个 struct 的 functions

点语法
abc(a,b,c)
a.abc(_,b,c)
(a;).abc(_.0,b,c)
curry
abc(_,b,c)(a)
curry更倾向于 placeholder 所以用下划线
而point则倾向于替换，所以用 美元符号$
即
点语法
abc(a,b,c)
a.abc($,b,c)
(a;).abc($.0,b,c)

curry 还是用作传函数到高阶函数去吧例如
const bigger_than_sum = (a,b,c) => c > (a + b)
(int[]).filter((3).bigger_than_sum($,1,_)) // filter(x => x > 4)
(int[]).filter({
  console.log(_);     // 这种情况下似乎就矛盾了, console.log(_); 里的 _ 是环境里的 _ 呢 还是全新的 _ ? 如果是全新的,那这句 log 就是生成一个新的 log 函数, 本身什么都没做
  (3).bigger_than_sum($,1,_)
})
想要
(int[]).filter(_ > 4) == 本质上是 (int[]).filter( bigger_than(_, 4) )
我们还不能用类型来判断, 完全可能 一个函数加上参数之后, 返回的类型仍是函数本身, 这样就不知道是该把 _ 当成上一级的 _, 还是本级新的 _
???? 暂时没想到怎么做才好

**函数调用**
函数式编程有语法 {x:Int | x > 2} , 这是 dependent_type , 但另一方面感觉它用来表现 函数调用也不错... 竖线 左边如果是一个 类型定义, 则竖线右边是函数体. 竖线左边如果是一个具体的值, 则竖线右边则是 对应 **curry and pipe and autobind** 里的 函数调用, a | abc($,b,c) 
... 想到 **curry and pipe and autobind** 和 **函数调用** 都可以解决的办法...
**curry and pipe and autobind** 有问题是 遇到了 作用域内 有其他的 placeholder ,是否要用新的 placeholder 的问题... 
解决方案是 placeholder 可以是  _, _1, _2, 环境中有 _ 的话, 要使用新的 placeholder 就序号加 1, 例如
(int[]).filter({
  (string[]).filter({
    log _;
    _1 includes 'hello';
  });
  _ > 4;
})
pipe 也是
a | abc({
  m | $ > $1 ? $ : $1
}, b, c);  === abc(a > m ? a : m, b, c)  ... 觉得这语法太奇怪, 换个形式
get_a() | abc(get_m() | $ > $1 ? $ : $1, b, c)  避免写成
let a = get_a()
let m = get_m()
abc(a > m ? a : m, b, c)
.... **还是不用数字吧, 换成长符号** 即 $1 变成 $$ , _1 变成 __ , 这样的话, 就是不鼓励大家出现 $10 这种代码了, 毕竟不能写成 $$$$$$$$$$ 这种, 鼓励大家能命名变量的话就尽量命名变量, 而且对符号的使用更好, __ 比 _1 更像一个 placeholder
另外, pipe 与普通函数怎么区分?  
(int[]).filter(v => v > 4) 转成新语法是 (int[]).filter(v | v > 4) .. v 那里其实是类型, 但因为能自动推断,
与 (int[]).filter(v | $ > 4) ... 
v | $ > 4 我们能判定它是一个 函数调用
但 v | v > 4 凭什么就不是一个函数调用...或许可以是 v: infer | v > 4, 这样, 左边就是一个类型了, 则整体肯定是一个函数定义
这里又涉及到类型的定义方式,
其一是 infer, 这以前有想过, 其中最合适的地方是 react 里 `let a = ref<infer>(); return <Abc ref={a}/>` 推断 infer 处的类型是 Abc instance...
其二是 类型解构... type A = (int,string) 这是类型定义 (a:int,b:string) => a+b 这是类型解构, 类型解构给加了名字...其实 infer 就相当于类型解构: infer | $.1 + $.2 即
`(a:int,b:string) | a + b` === `infer | $.1 + $.2` === `_.1 + _.2`
需要注意类型解构加了名字 不仅适用于 tuple, 也适用于 dict

函数调用，点语法 还是 竖线语法。。。
`let v = 5;`
`v | $ > 4` 但是它跟 `v | _ > 4` 有什么区别? 换成通用法
`v | bigger_than ($, 4)` and `v | bigger_than (_, 4)` 好像竖线更好，统一了 $ 与 _
另有问题，运算优先级。。。 
`v | bigger_than (_, 4)` 是 `(v | bigger_than) (_, 4)` 还是 `v | (bigger_than (_, 4))`
而且，`(_, 4)` 本身就是一个函数，它的类型是 `<T>(p: T) => (p, 4)`, 而 bigger_than 显然不接受函数作为参数。。。
所以 placeholder 需要支持向外传递。。。于是跟 placeholder 作用域内有新 placeholder 的问题有冲突（上面十几行有）。。。
(int[]).filter({
  (string[]).filter({
    log _; // 这里 _ 是 int 还是 string 还是生成一个新的 log 函数呢
    _1 includes 'hello'; ----------------
  });                                   |
  _ > 4; // 这里支持 _ 是 int             |
})                                      |---> 这里就不弄什么 多层级的 placeholder 了
直接原理就变成：`log _;` 表明 log 需要一个能满足其类型需求的 logable 对象, 它是一个 placeholder 表达式，它可以用作 函数，也可以用作 函数调用，但具体它用作什么，取决于它最近满足的类型需求。。。例如
let a: string = xxxx, b: string = yyyy, dateFormat='yyyy-MM-dd';
(string[]).map(parseDate(_, dateFormat)); // 我们可以这样。。。但是
(string1[]).map(parseDate(_, dateFormat));


use a::b::c::{A, B, C};
abc(_.1, _.2, 3)(a, b)
(a, b).abc($.1, $.2, 3)



一个 pub 的结构体,里面有 pri 的字段, 那这个结构体就无法被外部直接创建, 相当于私有化了构造函数


**algebraic data type**
product_type:
type A = {m: M, n: N} // 这样 A 就既是 M 也是 N, 因为它里面有 M N, 从功能角度来讲, 可以当成 M N 来用
sum_type:
type A = M | N // 这样 A 不是 M 就是 N, 它不能直接当成 M N 来用, 但可以通过判断, 来得到具体类型...事实上, 大部分语言的 sum_type 实现是
enum A = { m(M); n(N) } // 再本质的实现是
type A = { type:'m'|'n', m: M, n:N } // 是通过一个 枚举值来判断值类型的...
然后还要有 anonymous_sum_type ... 也有要 anonymous_product_type ...
anonymous_product_type 就是 字面量对象
anonymous_sum_type 就是 union

尽管 product_type 中 A 可以当成 M N 来用, 但这里就不用直接点出 M N 的方法了, 还是先点出 M/N 再说
curry 

**generator function type**
从类型上来说，generator function 包含三个类型，一个 定长 tuple 作为输入参数，一个定/不定长 tuple 作为输出与二次输入，一个定长 tuple 作为最终结果
type GeneratorFunction<Input, [[O1,I1],[O2,I2],[O3,I3],....], Output>
如果再做下移位，就是输入次数与输出次数相同，则不用管首次输入（即参数）
type GeneratorFunction<[[I0,O0],[I1,O1],[I2,O2],...]>
但是不定长 tuple 要如何作为类型存在呢？一般来说，它根本不存在。但是我们 generator 完全可以做到在事实上它是存在的，这是 dependent type
function* g(num: number) {
  let o: {a:number} = yield {b:num};
  while(num--) {
    let p: {c:number} = yield {d:num};
  }
  let q: {e:number} = yield {f:num};
  // return {g:num};
}
则 g 的类型:
如果 num 不是 dependent type，它只是纯粹的 number，则词法分析就能得到 g 的类型是 
`GeneratorFunction<[[number,{b:number}], [{a:number},{d:number}]*0|1, [{c:number},{d:number}]*n, [{c:number},{f:number}], [{e:number},{g:number}|undefined], ]>`
其实上面这个 `[{a:number},{d:number}]*0|1` 甚至别的地方都有问题，看来不能移位，虽然事实上 输入次数与输出次数相同，但因为词法逻辑的原因，无法移位
`GeneratorFunction<number, [[{b:number},{a:number}], [{d:number},{c:number}]*n, [{f:number},{e:number}], {g:number}|undefined]>`
这里，尽管这有 tuple 是不定长的，但至少 tuple 内的元素类型的 顺序 是可确定的。。。这个是有意义的吗。。。
如果 num 是 dependent type， 则 上面的 `[{d:number},{c:number}]*n` 里的 n 都可以确定范围，如果 num 是 const 的，则 n 就是固定的，甚至 n 可为无穷


**tuple indexed from 1**
https://stackoverflow.com/a/67212999/3127028
I guess since tuple is fixed length, defined by user and mostly important is that it's indexed by user, so tuple is 1 based index. Array/List, on the contrary, is indexed by computer (we often index list with list[i] and the i is calculated by Math), so 0 based index is easier.
Just my own guess. Don't know if it's right.


// https://cn.pornhub.com/view_video.php?viewkey=ph5dc162506f880
// https://cn.pornhub.com/view_video.php?viewkey=ph600dc5844c554
// https://cn.pornhub.com/view_video.php?viewkey=ph5db3336b80c8f
// https://cn.pornhub.com/view_video.php?viewkey=ph5de22474810ce
// https://cn.pornhub.com/view_video.php?viewkey=ph5d653958115f8
// https://cn.pornhub.com/view_video.php?viewkey=ph57816898149cf
// https://cn.pornhub.com/view_video.php?viewkey=ph5d914ed1ba9dd
// https://cn.pornhub.com/view_video.php?viewkey=ph5e30ee595e658
// https://cn.pornhub.com/view_video.php?viewkey=ph605519dab6fce


**完全的 duck-type, 由 symbol 来区分类型**
其实就是 显式比隐式好 的逻辑. 不然由 type-name 来区分类型, 其实一样是 type-name 自带一个 symbol, 这对于只需要 duck-type, 不需要区分类型的场景还浪费了内存

symbol 可以定义在全局, 也可以定义在函数运行时, 这样就可以动态生成新类型了, 而无需别的状态去做判定

因为用 symbol 来区分类型, 所以对于 tuple 类型, 必然是 tuple 与 dict 定义是一体的, 不然 symbol 无法放进去, 即 const s = symbol(); type A = (s:nil, number, string);

小括号做类型, 中括号做取属性, 大括号做流程

// nil 占 0 内存, 在编译期判定
// i8 | nil 占 2 字节内存, 一个给 int8, 一个给 union? 好像还不对, union 在编译期判定的?
// 内存的事情再说, 先想着把 mylang 编译成 js 再说, 至于说编译为 c, 内存要尽可能优化, 取决于 mylang 的类型系统有多好

注意尽管用了 symbol, mylang 也与 js 是完全不同的, js 里属性名是字符串, 而 mylang 里属性名是编译期偏移量. 那 symbol 不是编译期偏移量, 它能是什么 ?
是反向引用? var a = Symbol(); var b = {[a]: 123,x:234}; 对于这种, a 内存里是一个 map, b 内存里只有 {x:234}, 而 a 的 map 里有 { [addr_of_b]: 123 } 这样?


**堆内存就是一种类型**
let a = box(i8<1e6>())
上面数组长度属于 泛型. 因为定长数组本就是编译期确定的, 所以作为泛型正好. 即所有类型后面都可以接数值泛型, 表示数组... 好吧, 太特殊了, 还是用中括号吧
let a = box(i8[1_000_000]()) 
值字面量是放进 栈 还是放到 堆上, 是看它直接被怎样使用.
操作堆上的值不需要 解地址, 因为 堆 就是类型, 编译的时候直接就知道因为是堆类型, 所以先解地址,然后属性偏移量,再操作.
但这样也有问题就是不支持 地址操作, 对于一些 unsafe 的场景应该会有问题


**编程语言字符样子**
有类似的字符，例如 12345 的 1 和 list 的 l， 这是由字体去控制的，而不是由编程语言控制；
有不可见的字符，或者别的控制字符，这对于所有的字体而言都一样，它不是字体的问题，而是 utf8 的问题，这可以由编程语言去控制不许有；
至于别的什么 中文标识符，emoji标识符，都应该支持。其实，符合语言本身的标识符，比不准确的翻译更好。


**tuple and dict**
好像专业说法是 tuple/record or list/dict or array/map
另外，type A = (i8, name:str, i16) , 则 A.1 是 i8，A.2 是 str，A.3 是 i16，为什么 name 要占一个位置，只是因为 name 只是一个偏移量。
另外，tuple 从 1 开始 既是与 array 区分，也是符合常人心里， a.10 就是至少有 10 个成员。除 tuple 外，标识符不可为数值。tuple 的成员用数值去取也只是用 十进制，不需要别的啥进制，不需要前面可为 0（就首数字不可为0），因为这个数值只是为了给人命名用，人习惯非零的10进制

**多层解构**
这是 rust 代码
`async fn delete(db: Data<&Database>, storage: Data<&Storage>, Path(file_id): Path<i32>) -> Result<impl IntoResponse> {}`
本来我们想着解构是统一的，类似 ts: `{a:{b,c},d}: {a:{b:string,c:number},d:boolean}` 类型要统一写到一块儿去
但是 rust 打破了这点，本身 函数参数就可以理解为对 tuple 的解构，然后具体的某个参数还可以继续解构，即对应 ts 语法应为: `{a:{b:string,c:number},d:boolean}`
对于 tuple 参数可以是 `({b,c},d): ({b:string,c:number},boolean)`, 对应改为 `({b:string,c:number},d:boolean)`
然后解构有两个选择，是解构必须全部解构，还是没解构到的就默认丢掉。前者可以加个手工丢弃的关键字 `_`, 然后如果加 `_` 那要决定是区分 `_*` 和 `_+` 还是不区分。
感觉还是解构必须全部解构，但不用区分 * 和 +，所以加个 `_` 就行。
那上面的多层解构看起来某些时候跟定义一个 dict type 没啥区别，因为 dict type 本身就有名字，如果是 tuple type 的话，就要赋予名字了。
另外，rust 的 tuple 是从 0 开始的
其实按我这里的理念，上面 rust 代码应该是 `(db: Data<&Database>, storage: Data<&Storage>, Path(file_id: i32))`


**错误不可以隐式忽略，但可以显示忽略**
https://news.ycombinator.com/item?id=30611367
C 语言 printf 会打印到 stdio，这可能会出错，但 printf 却不会报错，不需要 try-catch，而是返回一个非 0 的值，程序员很容易直接忽略值。
这里就应该让它类似 rust:
```
println!()?; // 如果出错，则会函数停止 并返回 Error 到外层
println!().unwrap();  // 如果出错，则函数停止，panic。。。。 这样看，panic 跟返回 Error 没太大区别。。。主要 panic 返回的是一个字符串 error，panic 不需要写返回值类型。但如果要求所有的 Error 都可以字符串化，并且函数能自动推导返回值类型，则可以不用 panic 了
println!().ignore();  // 如果出错，则会被忽略，这是显示忽略
println!(); // 这样有个返回值可能是 Error，直接被忽略了，编译报错
let n = println!(); // n 是一个 Result，这个 n 如果不做处理，就会编译报错
```

但是好像 panic 留着更好。有些东西确实会出错，但是为了开发体验，真的就是忽略。 i32 + i32 可能会超出 i32 范围，为此还要 (i32 + i32)? 也太麻烦了，这个时候就直接 panic 好了
或者不留 panic, 这些非常简单的算术 默认溢出会导致一个确定的值（本身已经失去了业务意义）。如果想要运行时检测，则用特殊方法。至于运算符重载，也是不允许返回 Result 的，不然有的重载不返回 Result，有的返回 Result，不一致。可以有自己的有名字的函数去实现 运算符功能，并返回 Result
