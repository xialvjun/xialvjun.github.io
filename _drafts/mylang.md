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
