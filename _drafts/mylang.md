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
