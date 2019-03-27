form 在 DOM 中除了是一个 form ，让 内部的 input 在按下回车的时候就去提交整个表单以外，还有一个 div 的功能。。。

那么是否可以
const form = new Form();
<div>
  <div>
    <input form={form} />
    <input form={form} />
    <input form={form} />
  </div>
  <input form={form} />
  <button form={form} />
</div>

form 与 ui 本身分离。。。。form 本身只是一个功能组件。。。与 html 结构不同

同样的。。。 a 标签它的本质应该是什么？
<a href="xxxxx">
  <h4>title title</h4>
  <h6>description description</h6>
  <button>delete</button>
</a>
希望在按下 button 的时候不进行跳转，在按下别的地方就都跳转。。。。这种的确可以在 button 里 preventDefault()  stopPropagation() 。。。但 a 应该只是一个功能组件，点击某一个区域上的东西，就跳转。。。

这里要认真想好各个组件的功能。。。尽量做到分离，做到正交，原子化。。。其实，功能化的组件，也可以在 jsx/html 里写出来，没有问题，但尽量区分好功能

// 另外，去除 vdom 的概念，也就是不需要 reconcile 。。。所以，类似 react hook 那些东西都有其他的变化，例如 useRef 就根本不需要。。。所以  const form = new Form() 是可以的
仍然用 vdom。。。vdom 能简化程序员的编程逻辑，不用管这个状态变了要怎么做，那个状态变了要怎么做；只管整体状态怎么映射。。。

然后 'lit-html' 这种库，虽然真的全面函数式，但是不可 scale。。。因为它不可以局部 update。。。react 的 component 有锚点，在 component 内部局部更新的逻辑没错（理论上当然是连局部更新都不用，而是用精准更新，但上面说了为了简单的编程模型，才用 vdom，所以就局部更新）。。。所以，react 完美。。。react hook 在组件内部 hook 来提供状态，在组件内部提供功能。。。或者 genc 用来创建大量的功能组件。。。不过功能组件太多可能有一点点影响性能。。。。

上面的 form  a  说的本质是：用 react 组件重建  html，构建新的排版逻辑等等


写 UI 应该命令式编程与声明式编程有机结合起来。。。例如 blueprintjs 里的 Toaster 和 Alert
它的 Toaster 就是一个好的例子，而 Alert 则是坏的例子。。。其实 Alert 可以用成命令式
然后 error 与 loading 状态有不同。。。loading 状态会自动消失，而 error 状态会存在于组件中。。。可以 Toast 显示 error，也可以 Alert 显示 error，Alert 显示 error 更好（给用户截图的时间），而且应该在 Alert 消失的时候把 error 状态清空
...
命令式编程，顺序明确；声明式编程，逻辑简单。


有个文本组件，它仅仅只是渲染文本，不涉及行距，字距，padding等东西。。。因为不涉及字距，所以，一次只渲染一个字符。。。命名 Char。。。
然后该组件的 ref 有个 getter 方法，其实 getter 方法只是获取的是它的 ref 的只读属性。里面有渲染完成后的大小。。。
然后再一个文本组件，没有行距、padding，只能渲染单行文本，命名为 Text。。。里面渲染多个 Char。。。给出 getter 返回真正渲染了多少个字符，被截去多少个字符
然后再又有文本组件， Paragraph，有行距、padding，能渲染多行文本。。。
这三个组件并不是声明式组件，而是命令式组件，不能用在类 react、flutter 声明式编程系统中。。。
它们需要一个字符一个字符、一行一行的渲染（这里的渲染并非渲染到屏幕上，而是渲染到 gpu 缓存中对应屏幕的一张图片中，所以与屏幕刷新无关）
