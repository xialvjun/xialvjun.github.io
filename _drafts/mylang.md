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
