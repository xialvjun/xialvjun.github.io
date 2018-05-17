# 有了 ResizeObserver 我们再也不需要 css 了

css 到底比 style 多些什么？

伪元素：html 添加元素比 css 添加元素要方便得多
:active, :hover: 这样的状态类的伪类:  这个应该由状态管理起来，看 react-powerplug
:nth: 这样的复杂选择器，直接判断 js 循环的 index 就好
媒体查询: resizeobserver  就是媒体查询啊
动画: style也有transition啊。。。然后，事件里的命令式的动画，js不比css要方便的多？

```jsx
<ResizeObserver>
{contentRect => contentRect.width > 600 ? <div>
  <div>extra</div>
  <main>main_content</main>
</div> : <div>
  <main>main_content</main>
</div>}
</ResizeObserver>
```

然后 resizeobserver 要获得元素的 size ，需要元素 DidMount ，于是在 ssr 中， ResizeObserver 根本无法给出 size ，整个的根本无法渲染，所以应该给个 defaultSize 


```jsx
<ResizeObserver defaultSize={{width: 1024}}>
{contentRect => contentRect.width > 600 ? <div>
  <div>extra</div>
  <main>main_content</main>
</div> : <div>
  <main>main_content</main>
</div>}
</ResizeObserver>
```

然后，不同的组件关心不同的 size ，有的只关心 width ，有的只关心 height ，可以分出不同的 ComponentClass 或者增加个属性来表示，从而避免不必要的 render


可惜 ResizeObserver 在 2016.10 就出现了，可是到现在为止都只有 Chrome 实现了
