{% raw %}

# Context Api 的正确用法

react 官方文档示例里只是用 context api 做了跨组件的状态的分享。。。但是没有跨组件的动作分享。怎么解决呢？动作即状态嘛:

```ts
import * as React from "react";
import { Component } from "react";
import { render } from "react-dom";

const Counter = React.createContext<CounterProvider>(null);

export class CounterProvider extends React.Component {
  state = this.props.initialState || { count: 0 };
  inc = () => {
    this.setState({ count: this.state.count + 1 });
  };
  dec = () => {
    this.setState({ count: this.state.count - 1 });
  };
  inc_async = () => {
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  };
  render() {
    // 必须抽出新对象，不可以直接把 this 作为 value 传给 Provider，那样会被阻断渲染
    // CounterProvider render 不会引起 this.props.children render，所以没有性能问题 https://github.com/facebook/react/issues/4067#issuecomment-110792425
    // 另外虽然 Provider render 不会引起 children render，但是 children 的生命周期是跟随 Provider 的生命周期的
    return (
      <Counter.Provider value={{ ...this as any }}>
        {this.props.children}
      </Counter.Provider>
    );
  }
}

export const CounterHoc = name => BaseComponent => p => (
  <Counter.Consumer>
    {counter => <BaseComponent {...{ ...p, [name]: counter }} />}
  </Counter.Consumer>
);

export const CounterConsumer = Counter.Consumer;
// 上面这种用法，完美支持 render-props 和 hoc 的用法。。。
// 有了这些，如果不需要时间回溯，也不追求单 store 结构，基本就可以换掉 redux 了

const App = () => (
  <CounterProvider>
    <CounterConsumer>
      {counter => (
        <div>
          <div>{counter.state.count}</div>
          <button onClick={counter.inc}>inc</button>
          <button onClick={counter.dec}>dec</button>
          <button onClick={counter.inc_async}>inc_async</button>
        </div>
      )}
    </CounterConsumer>
    <CounterConsumer>
      {counter => (
        <div>
          <div>{counter.state.count}</div>
          <button onClick={counter.inc}>inc</button>
          <button onClick={counter.dec}>dec</button>
          <button onClick={counter.inc_async}>inc_async</button>
        </div>
      )}
    </CounterConsumer>
  </CounterProvider>
);

render(<App />, document.getElementById("root"));
```

{% endraw %}
