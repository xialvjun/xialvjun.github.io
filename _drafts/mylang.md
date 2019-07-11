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



if cond_expr expr [else if cond_expr expr]* [else expr]?
tuple: (a, b, c)
dict: (a: a, b: b, c: c)
no mix: (a, b: b1, c) is a dict which can be extract from a dict or construct to a dict
tuple with dict: (a, b, (a: a, b: b))
不行, 如果 tuple 与 dict 都用小括号, 那很容易出乱子, 例如: fn hello(a, b, c) {} 这里参数 (a, b, c) 原本是准备对一个 tuple 解构, 然后偏偏函数调用那边原本是 hello(get_x(), get_y(), get_z()) 正常, 突然重构 let (b, a, c) = (get_x(), get_y(), get_z()), 然后 hello(b, a, c) 那这里 (b, a, c) 到底是 dict 还是 tuple... **所以必须区分 tuple 与 dict**, 可以 () 是 dict, [] 是 tuple... () 是 dict 可以鼓励大家使用 dict 作为参数...
其实也可以是 (a,b,c) 是 tuple (a;b;c) 是 dict... 这个应该更好... 这种情况下是 只有一个元素的dict/tuple 都不该存在(虽然可以存在 (a,)/(a;), 但没有意义), 零个元素的dict/tuple是一回事,都是 none
[] is tuple: [a, , c] === [a, null, c]
() is dict
{} is code block


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

mylang 中改变优先级 应使用 {} 而不是 () , 因为 {} 是 表达式 ... 其实 () 也可以, 如果 () 内部只有一个, 而且末尾没有 逗号 时, 它就是用做改变优先级, 但这只是兼容方案
连 类型表达式 也可以改变优先级 如 (...Person*100) 如果觉得不放心优先级, 想多添加下, 可以是 (...{Person*100}) 或 (...(Person*100))
需要注意点: a:(Person) 等同于 a:Person , a:(...Person*1) == a:(Person,) == a:Person*1 ,,,, 
另外, 也就是说 ... 三点语法只能用在 tuple/dict 中 不能 a:...Person*1

许多语言都用特殊语法定义 模块顶级 item, 例如 fn main() {} 用 fn 定义函数, 然后那个函数可以认为是 const, 可以在编译期调用, 例如 fn add_one(n:num) {return n+1;}; const three = add_one(2); 既然 three 是 const, 那 add_one 肯定也是 const... 要注意 const 一定是编译期能确定的, 但编译期能确定的不一定是 const ...
例如完全可能有 static a = 1; fn app() {return ++a;} const b = app(); const c = app(); 最终得到 b=2,c=3, 都是 const, 而 a 可以设定是 程序一运行的时候就是 3 了, 之后 b c 那里不用运行; 也可以设定是 a 继续在程序刚运行时是 1, 之后 b c 那仍然不运行, 毕竟 const... 可能 a 程序刚运行时是 3 更好

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
会展开为
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

**rust Sync 不是编译器特例**
之前以为 rust 的 Sync 啥的是编译器的特例类型...但是仔细想下, 其实不是, 它是 thread 的构造函数要接受的一个普通的 Trait...thread 的构造函数接收一个 闭包结构体, Sync trait 如果所有子元素都 Sync, 那自己就 Sync.... 好吧, 这的确跟通常的 trait 不一样, 通常的 trait 需要自己主动实现, 而 Sync 可以被自动实现, Clone/Copy 是 derive 实现, 自己下面所有的子元素都实现了 Copy/Clone, 其实也是主动实现... 需要有多个 trait 的形容词来实现不同种类的 trait, 甚至是一段编译期逻辑去形容 trait...
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
