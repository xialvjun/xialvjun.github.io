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
