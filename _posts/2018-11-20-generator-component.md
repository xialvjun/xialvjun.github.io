# render-props-component hell, Compose, genc(generator-component)

类似 `react-powerplug` 之类的使用 `render-props-compoennt` 进行 `state and effect` 管理的库现在已经被大家所熟知了:

- react-powerplug
  ```jsx
  <State initial={{count:0}}>
    {({state, setState}) => (
      <button onClick={_ => setState({count:state.count+1})}>{state.count}</button>
    )}
  </State>
  ```
  ```jsx
  <Value initial={0}>
    {({value,set}) => (
      <button onClick={_ => set(value+1)}>{value}</button>
    )}
  </Value>
  ```
- @reactions/component
  ```jsx
  <Component didMount={ele => do_effect()} />
  ```

然后，这种 `render-props-component` 用多了，会出现 `jsx hell`，类似 `callback hell` 一样不停地往深层写下去。。。哪怕抽出为函数，那也并没有改变 `hell` 的本质，于是出现了类似 `react-adopt` 的库:

- react-adopt
  ```jsx
  <Adopt mapper={{a: <Value initial="0" />, b: <Value initial="100" />}}>
    {({a, b}) => (
      <>
        <button onClick={_ => a.set(a.value+1)}>a: {a.value}</button>
        <button onClick={_ => b.set(b.value+1)}>b: {b.value}</button>
      </>
    )}
  </Adopt>
  ```
  但是 `react-adopt` 在之前有些 [bug: 每次 render 都会重新创建组件](https://github.com/pedronauck/react-adopt/issues/11), 于是自己写了个 `@xialvjun/react-compose` 并拓宽了下使用方式。

以上，关于 `render-props-component` 的使用就差不多了。直到：

[精读《Epitath 源码 - renderProps 新用法》](https://github.com/dt-fe/weekly/blob/master/75.%E7%B2%BE%E8%AF%BB%E3%80%8AEpitath%20%E6%BA%90%E7%A0%81%20-%20renderProps%20%E6%96%B0%E7%94%A8%E6%B3%95%E3%80%8B.md)

```jsx
const App = epitath(function*() {
  const { count } = yield <Counter />
  const { on } = yield <Toggle />

  return (
    <MyComponent counter={count} toggle={on} />
  )
})

<App />
```

不过它又有 [每次 render 都会重新创建组件的 bug](https://github.com/Astrocoders/epitath/issues/23#issuecomment-440152131)...

我结合自己的使用经验，写了个 [`@xialvjun/react-element`](https://github.com/xialvjun/react-element)

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { Element, init_value, genc, init_state, init_ref, init_refs } from "@xialvjun/react-element";

// the name of `genc` is generator component

const App = genc(function*() {
  const [a] = yield <Element construct={init_value("a")} componentDidMount={ele => console.log('didMount', ele.value)} />;
  const [b] = yield <Element construct={init_value("b")} />;
  const [c] = yield <Element construct={init_value("c")} />;
  return (
    <div>
      <button onClick={_ => a.set_value(a.value + "a")}>{a.value}</button>
      <button onClick={_ => b.set_value(b.value + "b")}>{b.value}</button>
      <button onClick={_ => c.set_value(c.value + "c")}>{c.value}</button>
      {/* genc can be used both outside and inside of jsx... but hooks can only be used outside of jsx... */}
      <Element construct={init_value("d")}>
        {genc(function*(ele) {
          const [a] = yield <Element construct={init_value("a")} />;
          const [b] = yield <Element construct={init_value("b")} />;
          const [c] = yield <Element construct={init_value("c")} />;
          return (
            <div>
              <button onClick={_ => a.set_value(a.value + "a")}>
                {a.value}
              </button>
              <button onClick={_ => b.set_value(b.value + "b")}>
                {b.value}
              </button>
              <button onClick={_ => c.set_value(c.value + "c")}>
                {c.value}
              </button>
            </div>
          );
        })}
      </Element>
    </div>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

[![Edit zl2j7q0r2m](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/zl2j7q0r2m)
