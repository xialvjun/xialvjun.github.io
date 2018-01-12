# Portal 的一种特殊点的用法：

> 也许没啥卵用。。。-_-!

```jsx
// Portal.js
import ReactDOM from 'react-dom';

const body = document.body;
export function Portal({ target=body, children }) {
  if (!target) {
    return null;
  }
  return ReactDOM.createPortal(
    children,
    target,
  );
}

// ComponentWithTab.js
import React, { Component } from 'react';

class ComponentWithTab extends Component {
  state = { content_container: null }
  // 这个 ref 函数绝对不能是 render 内部行内函数，否则就会造成无限刷新
  set_content_container = e => this.setState({ content_container: e })
  render() {
    return <div>
      <ul className="tab">
        <li>
          tab1
          <Portal target={this.state.content_container}>content1</Portal>
        </li>
        <li>
          tab2
          <Portal target={this.state.content_container}>content2</Portal>
        </li>
      </ul>
      <div ref={this.set_content_container} className="content"></div>
    </div>
  }
}
```

上面的例子其实也没啥大用，无非是让 tab 与 content 在结构上一一对应，也许在数据层面更合理些。
