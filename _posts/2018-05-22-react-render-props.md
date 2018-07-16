# 什么才是学习

人类在原始人的时候就已经会使用火了。可是那不是科学。  
直到人类发现 **“燃烧是一种剧烈的氧化还原反应”** 之后，这才是科学。

- 内容可以不只是文本，也可以是节点:

  - 会写出这样的代码不叫会 react:

  ```jsx
  <Card head="这是 head"></Card>
  ```

  - 会写出这样的代码才叫会 react:

  ```jsx
  <Card head={<div className="card head">head</div>}></Card>
  ```

- 内容可以不只是节点，也可以是逻辑（把复杂逻辑折叠进 vdom 中，是折叠，既不是隐藏，也不是完全暴露）:

  - 会写出这样的代码不叫会 react:

  ```jsx
  <Card head={<div className="card head">head</div>}></Card>
  ```

  - 会写出这样的代码才叫会 react:

  ```jsx
  <Card head={card_meta => (
    card_meta.shouldRenderHead && <div className="card head">head</div>
  )}></Card>
  ```

- 初次使用 render props 的时候，有几人意识到自己在用 render props 呢，而它又有多么强大的功能呢？

  - 会用 `react-router` 不叫会 react:

  ```jsx
  <Route component={SomePage} />
  ```

  - 会自己写出才叫会 react:

  ```jsx
  <MyComplexLogic>
    {logic => (
      <div>
        <button onClick={logic.do_something}>do_something</button>
      </div>
    )}
  </MyConlextLogic>
  ```

- 局部状态，轻松解决（状态放进 vdom 中，而不需要单独写个 Component 了，毕竟程序员写 vdom 的成本比写 Component 的成本低得多的多）

  - 会写出这样的代码不叫会 react:

  ```jsx
  <Consumer>{something => xxx}</Consumer>
  ```

  - 会写出这样的代码才叫会 react:

  ```jsx
  <State>{({state, setState}) => xxx}</State>
  ```

- 把 DOM 自带的状态统一抽象为 react 的状态，从而方便管理

  - 会写出这样的代码不叫会 react:

  ```jsx
  <State>{({state, setState}) => xxx}</State>
  ```

  - 会写出这样的代码才叫会 react:

  ```jsx
  <Form>
    {({ values, value, checked }) => (
      <form>
        <input type="text" {...(value('name').bind)} />
        <input type="checkbox" {...(checked('name').bind)} />
      </forn>
    )}
  </Form>
  ```

  - 会写出这样的代码才叫会 react:

  ```jsx
  <Hover>
    {({ hovered, bind }) => (
      <div
        style={% raw %}{{ background: hovered ? '#ccc' : '#fff' }}{% endraw %}
        onMouseEnter={bind.onMouseEnter}
        onMouseLeave={bind.onMouseLeave}
      >
        content
      </div>
    )}
  </Form>
  ```

  - 会写出这样的代码才叫会 react:

  ```jsx
  <Scrollable>
    {({ transform, bind }) => (
      <div style={\{ transform \}} {...bind}>
        content
      </div>
    )}
  </Scrollable>
  ```

  > 的确，可能后面两种 `Hover` 和 `Scrollable` 两个例子太过极端，但会不会是一回事，用不用是另一回事。

- 把 react 的 lifecycle 抽到 jsx 中定义，方便操作

  - 会写出这样的代码不叫会 react:

  ```jsx
  <State>{({state, setState}) => xxx}</State>
  ```

  - 会写出这样的代码才叫会 react:
  
  ```jsx
  <Lifecycle
    props={% raw %}{{ list }}{% endraw %}
    getDerivedStateFromProps={(props, state) => {
      const plist = props.list,
            slist = state.list;
      if (plist.length > slist.length) {
        return {
          list: plist.map(pit => 
            slist.findIndex(sit => sit.id===pit.id) > -1 ?
              pit :
              { ...pit, just_insert: true }
          )
        }
      }
      if (plist.length < slist.length) {
        return {
          list: slist.map(sit =>
            slist.find(pit => sit.id===pit.id) ||
            { ...sit, just_remove: true }
          )
        }
      }
      return props;
    }}
    componentDidUpdate={(prevProps, prevState, snapshot, instance) => {
      setTimeout(() => {
        instance.setState(state => ({ list: state.list.filter(it => !it.just_insert && !it.just_remove) }));
      }, 300);
    }}
  >
    {state => state.list.map(it => (
      <div key={it.id} className={`${it.just_insert ? 'inserting' : ''} ${it.just_remove ? 'removing' : ''}`}>
        content
      </div>
    ))}
  </Lifecycle>
  ```

  > 这个 `Lifecycle` 实现了个 css 组动画，当然，也确实是有些复杂，但这种概念本身就代表了 jsx 的无限可能性。


一时有感，感慨为什么没能在两年前刚学 react 的时候就能想到这些用法。。。
