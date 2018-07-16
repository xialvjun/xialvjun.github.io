# 有了 ResizeObserver 我们再也不需要 css 了

css 到底比 style 多些什么？

伪元素：html 添加元素比 css 添加元素要方便得多
:active, :hover: 这样的状态类的伪类:  这个应该由状态管理起来，看 react-powerplug
:nth: 这样的复杂选择器，直接判断 js 循环的 index 就好
媒体查询: resizeobserver  就是媒体查询啊，还有 window.matchMedia 函数也可以用来代替
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



1. 让 create-react-style 支持 native, tora 之类的框架
2. <Query>{q => q ? <Query></Query>}</Query> 内层的 Query 到底会不会在服务端渲染得到 （服务端可以循环 + Promise.race 来判断）
3. apollo-client 似乎失去了 normalize



xialvjun - Today at 3:50 AM
I noticed:
class App extends Component {
  state = { count: 0 }
  render() {
    return <div>
      <button onClick={e => this.setState(s => ({count: s.count + 1}))}>inc</button>
      {this.props.children}
    </div>
  }
}

function Children() {
  console.log('children rerendered');
  return <div>children</div>
}

render(<App><Children /></App>, document.querySelector('#root'));

Then, it only log children rerendered once, no matter how many time I click the inc button. 
Can someone tell me why?
Chad*ElChulo - Today at 3:50 AM
2 seems more javascript
pretty subjective thing though
NickServ - Today at 3:51 AM
@xialvjun Because you only render Children once
In the children prop of App(edited)
xialvjun - Today at 3:54 AM
I don't realy make sense of what's render...  I just know the code React.createElement(Children) is only executed once... But how can it affect the render
DarkFox - Today at 4:03 AM
are javascript objects similar to python's dictionaries?
kingdaro - Today at 4:06 AM
depending on how you use them, sure
DarkFox - Today at 4:07 AM
wdym
NickServ - Today at 4:09 AM
@xialvjun You want to list as many as are in count?
@DarkFox They are similar, but they have prototypical inheritence and only have string/number/symbol keys(edited)
The new Map class is closer to dictionaries
DarkFox - Today at 4:11 AM
can i use dictionaries like i would objects?
as long as i use string keys?
NickServ - Today at 4:11 AM
Yes, it's a very common practice in JS
Though there are some advantages to Map
DarkFox - Today at 4:11 AM
no im talking about python
NickServ - Today at 4:11 AM
Oh
Yes
DarkFox - Today at 4:11 AM
i know its common in js lol
can i nest other dicts and lists in dicts?
NickServ - Today at 4:12 AM
But Python has classical, not prototypical, inheritence
Yes
DarkFox - Today at 4:12 AM
what does that mean?
NickServ - Today at 4:12 AM
In JS, an object can directly extend another object
In Python, objects have classes, and only classes can extend classes
xialvjun - Today at 4:12 AM
@NickServ No. In fact, the code just behave like what I want. I am just curious about the inner sense of React: how can React rerender App without rerender App.props.children
NickServ - Today at 4:13 AM
It rerenders Children in the place where it already is, it does not recreate it
The goal of React is to render UI declaratively, so by default it updates existing DOM nodes
It is not imperative like jQuery
xialvjun - Today at 4:16 AM
Yeah, that's awesome. But how can React achieve the awesome feature? It's just js code, isn't it? How can React tell the difference between this.props.children and <Children />
NickServ - Today at 4:18 AM
JSX is a  non-standard syntax feature that compiles to React elements in JS
In this case it's React.createElement(Children, null)(edited)
Additionally, children are nested, so <App><Children /></App> becomes React.createElement(App, null, React.createElement(Children, null))
When they're actually rendered, it's passed as a prop named children
So the value of this.props.children is the React element for Children
This is returned, and only rendered once because it exists once
In other words children lets you replace something inside the component
xialvjun - Today at 4:28 AM
Maybe I just find it: https://github.com/facebook/react/blob/master/packages/react/src/ReactElement.js#L249-L256
There is a global value called ReactCurrentOwner.current, the value of it first time is store in App.props.children. Then the value changed, but App.props.children doesn't know it because React.createElement(Children, null) just execute once.
GitHub
facebook/react
react - A declarative, efficient, and flexible JavaScript library for building user interfaces.

So, even though the vdom is just pure js object, but at differnet time, the generated object is different.
NickServ - Today at 4:32 AM
In components, createElement gets called on every render
xialvjun - Today at 4:37 AM
yeah. So:
class App extends Component {
  state = { count: 0 };
  prev_another_children = null;
  render() {
    const another_children = <Children />;
    console.log(isDeepEqual(this.prev_another_children, another_children));
    console.log(isDeepEqual(this.props.children, another_children));
    this.prev_another_children = another_children;
    return <div>
      <button onClick={e => this.setState(s => ({count: s.count + 1}))}>inc</button>
      {another_children}
      {this.props.children}
    </div>
  }
}

function Children() {
  console.log('children rerendered');
  return <div>children</div>
}

render(<App><Children /></App>, document.querySelector('#root'));

This demo will show everything...(edited)
NickServ - Today at 4:42 AM
Yea that shows it twice right?
xialvjun - Today at 4:47 AM
Pity.... We can not use isDeepEqual because ReactCurrentOwner.current is such a complex object. But I believe there must be a identity in it which can shows this.prev_another_children._owner.identify === another_children ._owner.identity and this.props.children._owner.identity !== another_children._owner.identity
NickServ - Today at 4:49 AM
But you're telling the elemtn to show twice
It will happen regardless of if they're equal
Because div has two additional children (besides button)
xialvjun - Today at 4:53 AM
The Children component to show twice or show once is not the point. I just want to check the differences between vnode generated outside and vnode generated inside.
NickServ - Today at 4:55 AM
Are you trying to work around a bug in react's renderer or is there a specific use case you're trying to implement in your component?
xialvjun - Today at 4:58 AM
No, nothing, it's over. I just wanted to know how react runs inside it, dig into its source code. And now I think I've made sense of it. Thanks very much.
