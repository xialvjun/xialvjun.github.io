---
layout: post
title: [转载加总结]HTML 性能优化
---

# 转载原文

### [如何减少HTML页面回流与重绘（Reflow & Repaint）](https://zhuanlan.zhihu.com/p/22181897)

<article class="md">
        <p>如果你的HTML变得很大很复杂，那么影响你JavaScript性能的可能并不是JavaScript代码的复杂度，而是页面的回流和重绘。</p>

<p><strong>回流</strong>（Reflow）是指布局引擎为frame计算图形的过程。
frame是一个矩形，拥有宽高和相对父容器的偏移。frame用来显示盒模型（content model），
但一个content model可能会显示为多个frame，比如换行的文本每行都会显示为一个frame。</p>

<blockquote>
  <p>关于CSS盒模型的介绍请参考：<a href="/2015/05/28/css-display.html">CSS 盒模型及其呈现方式</a></p>
</blockquote>

<p><strong>重绘</strong>（Repaint）发生在元素的可见性发生变化时，比如背景色、前景色等。
因此回流必然会引起重绘。</p>

<!--more-->

<h1 id="0">HTML 布局</h1>

<p>HTML使用流式布局模型（flow based layout），
这意味着多数情况下一次扫描就可以计算所有的图形显示。
处于流后面的元素一般不会影响前面元素的图形，
所以布局过程可以从左到右、从上到下来进行。</p>

<p>所有的HTML回流都是从根frame开始（HTML标签）的，递归地处理部分或全部子frame。
回流过程中也可能创建新的frame，比如文本发生了换行。
一个frame的回流会导致它的所有父节点以及所有后续元素的回流。</p>

<p>有些HTML回流是立即执行的（immediate to user or script）并且会影响整个frame树，
比如窗口大小变化、更改文档的默认字体；有些HTML回流则是异步的、渐进的（incremental），
比如更多的文档流从网络中到达，这些渐进的回流可以入队列进行批量处理。</p>

<h1 id="1">回流的原因</h1>

<p>浏览器在实现回流时，会递归地处理frame。 每个frame的回流都有一个原因，
这个原因会随着frame逐级向下传递（传递过程中可能会改变）。
回流的原因决定了当前frame的回流行为，有这样5种原因：</p>

<ol>
  <li>初始化（Initial）。DOM载入后的第一次回流，将会遍历所有frame。</li>
  <li>渐进（Incremental）。当一个frame发生渐进回流时，意味着它前面的元素都没有变，
 而是它里面的元素变了。这会引起自底向上的作用。</li>
  <li>改变大小（Resize）。元素的容器边界发生变化时，此时元素内部状态没变。
 在计算自顶向下的布局约束的同时，可以复用内部状态。</li>
  <li>样式改变（StyleChange）。整个frame树都应得到遍历。</li>
  <li>Dirty。当一个容器已经缓存了多个子元素的Incremental回流时，该容器出于Dirty的状态。</li>
</ol>

<p>前面四种原因的回流都是在Presentation Shell中立即调用的，
而最后一种回流只有Incremental回流已经到达目标frame时才进行。
（因为这时自底向上的影响才被计算出来，才能决定容器的图形显示）</p>

<p>如果你是Web开发者，可能更关注的是哪些具体原因会引起浏览器的回流，下面罗列一下：</p>

<ol>
  <li>调整窗口大小</li>
  <li>字体大小</li>
  <li>样式表变动</li>
  <li>元素内容变化，尤其是输入控件</li>
  <li>CSS伪类激活，在用户交互过程中发生</li>
  <li>DOM操作，DOM元素增删、修改</li>
  <li><code class="highlighter-rouge">width</code>, <code class="highlighter-rouge">clientWidth</code>, <code class="highlighter-rouge">scrollTop</code>等布局宽高的计算（见<a href="/2016/04/24/client-height-width.html">视口的宽高与滚动高度</a>一文）。</li>
</ol>

<blockquote>
  <p>计算这些元素和布局大小时，浏览器会立即Flush渐进回流队列。</p>
</blockquote>

<p>这些会引起回流的操作中，6、7 是和JavaScript代码相关的。
所以为了避免回流提高页面性能，前端开发需要注意的主要是这两点：<strong>避免大量的DOM操作和布局计算</strong>。</p>

<h1 id="2">最佳实践</h1>

<p>避免布局宽高的计算，意味着尽量使用CSS而不是JS来实现页面的布局效果。
另外一方面，布局宽高的计算结果应当尽量保存避免重复计算。</p>

<p>下面来讨论如何避免大量的DOM操作。请看示例：</p>

<div class="language-javascript highlighter-rouge"><pre class="highlight"><code><span class="kd">var</span> <span class="nx">s</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">body</span><span class="p">.</span><span class="nx">style</span><span class="p">;</span> 
<span class="nx">s</span><span class="p">.</span><span class="nx">padding</span> <span class="o">=</span> <span class="s2">"2px"</span><span class="p">;</span> <span class="c1">// 回流+重绘</span>
<span class="nx">s</span><span class="p">.</span><span class="nx">border</span> <span class="o">=</span> <span class="s2">"1px solid red"</span><span class="p">;</span> <span class="c1">// 再一次 回流+重绘</span>
<span class="nx">s</span><span class="p">.</span><span class="nx">color</span> <span class="o">=</span> <span class="s2">"blue"</span><span class="p">;</span> <span class="c1">// 再一次重绘</span>
<span class="nx">s</span><span class="p">.</span><span class="nx">backgroundColor</span> <span class="o">=</span> <span class="s2">"#ccc"</span><span class="p">;</span> <span class="c1">// 再一次 重绘</span>
<span class="nx">s</span><span class="p">.</span><span class="nx">fontSize</span> <span class="o">=</span> <span class="s2">"14px"</span><span class="p">;</span> <span class="c1">// 再一次 回流+重绘</span>
<span class="c1">// 添加node，再一次 回流+重绘</span>
<span class="nb">document</span><span class="p">.</span><span class="nx">body</span><span class="p">.</span><span class="nx">appendChild</span><span class="p">(</span><span class="nb">document</span><span class="p">.</span><span class="nx">createTextNode</span><span class="p">(</span><span class="s1">'abc!'</span><span class="p">));</span>
</code></pre>
</div>

<blockquote>
  <p>来源：<a href="http://www.blogjava.net/BearRui/archive/2010/05/10/320502.html">http://www.blogjava.net/BearRui/archive/2010/05/10/320502.html</a></p>
</blockquote>

<p>可见，通过DOM API进行CSS样式操作会产生大量的回流和重绘。
这一点是可以避免的，比如：预定义CSS类，在JS中进行类的替换（DOM 属性操作）即可。
除此之外，还有很多小技巧可以减少页面回流。下面来总结一下：</p>

<ol>
  <li>避免逐项更改样式。最好一次性更改<code class="highlighter-rouge">style</code>属性，或者将样式列表定义为<code class="highlighter-rouge">class</code>并一次性更改<code class="highlighter-rouge">class</code>属性。</li>
  <li>
    <p>避免循环操作DOM。创建一个<code class="highlighter-rouge">documentFragment</code>或<code class="highlighter-rouge">div</code>，在它上面应用所有DOM操作，最后再把它添加到<code class="highlighter-rouge">window.document</code>。</p>

    <blockquote>
      <p>也可以在一个<code class="highlighter-rouge">display:none</code>的元素上进行操作，最终把它显示出来。因为<code class="highlighter-rouge">display:none</code>上的DOM操作不会引发回流和重绘。</p>
    </blockquote>
  </li>
  <li>避免循环读取<code class="highlighter-rouge">offsetLeft</code>等属性。在循环之前把它们存起来。</li>
  <li>
    <p>绝对定位具有复杂动画的元素。绝对定位使它脱离文档刘，否则会引起父元素及后续元素大量的回流。</p>

    <blockquote>
      <p>使用CSS3的transition也可以获得不错的性能。</p>
    </blockquote>
  </li>
</ol>


        <p>转载请注明来源： <a href="http://harttle.com/2015/08/11/reflow-repaint.html">http://harttle.com/2015/08/11/reflow-repaint.html</a></p>
      </article>


# 总结

1. 影响 HTML 性能的主要是两点：`重绘(repaint)` 与 `回流(reflow)`。任何对页面可视部分的可视操作都会引起重绘，对页面元素盒模型有影响的操作会引起回流。重绘对性能影响还好，回流影响最大；
2. 可以通过一些技巧来减少页面回流：把多次修改变为一次修改(`innerHTML`或`documentFragment`或`把修改style变为修改class`)，减少修改次数；把要多次修改的元素摘出文档流（绝对定位或`display:none`），修改完后再放回去。

这些知识在我的一篇博客 [响应式 DOM](http://xialvjun.github.io/2017/03/15/rx-domh-reactive-dom/) 末尾提到的我自己写的一个 UI 库 [rx-domh](https://github.com/xialvjun/rx-domh) 中就有应用。

另外，再举个实际的例子：

很多响应式设计里有从左或从上弹出的抽屉，有的人可能设计成把 width 或 height 渐变来达到弹出效果，这其实是非常不好的。不仅体验不好，性能也很差。从 0 渐变到应有值，抽屉内部的内容完全没法看，体验很差，而且抽屉内部内容在不停的 reflow，性能极低。所以，对于这种情况，我们大部分都使用 transform 来解决。transform:translate 效果类似 position:relative，不会引起内部和外部的 reflow，而且渐变过程中，整体形状保持一致，体验更好。
