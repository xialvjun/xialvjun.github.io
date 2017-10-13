# react 组件的可扩展性设计

其实这些东西我们都知道，甚至可能自己也有用到，但是大概没有主动意识到，以至于在设计组件的时候可能会走一些冤枉路，这里只是把它主动的提出来，进行一次总结。

我把 react 组件在扩展性这个层面分为三种：
1. 普通不可扩展组件
2. 简单界面扩展组件
3. 高级逻辑扩展组件

### 普通不可扩展组件

```jsx
// 普通不可扩展组件
class MyComponent extends Component {
  render() {
    const { somepart_visiable } = this.props;
    return <div>
      some thing
      {somepart_visiable && <span onClick={this.some_function}>somepart</span>}
    </div>
  }
}

render(<MyComponent somepart_visiable={true}/>, container);
```

实际案例: 多不胜数

### 简单界面扩展组件

```jsx
// 简单界面扩展组件
class MyComponent extends Component {
  render() {
    const { somepart } = this.props;
    return <div>
      some thing
      {somepart}
    </div>
  }
}

render(<MyComponent somepart={<span onClick={outter_some_function}>somepart</span>}/>, container);
// or
let another_way = <OtherComponent>
  <span onClick={outter_some_function}>somepart</span>
</OtherComponent>
```

实际案例: 同样多不胜数

### 高级逻辑扩展组件

```jsx
class MyComponent extends Component {
  render() {
    const { somepart } = this.props;
    return <div>
      some thing
      {somepart(this.some_function)}
    </div>
  }
}

// 这里有一个闭包，所以可以使用 outter_some_function...当然，其实在 render 函数里使用闭包并不好，可以把 outter_some_function 放在组件上
render(<MyComponent somepart={(inner_function) => <span onClick={inner_function} onMouseOver={outter_some_function}>somepart</span>}/>, container);
// or
let another_way = <OtherComponent>{
  (inner_function) => <span onClick={inner_function} onMouseOver={outter_some_function}>somepart</span>
}</OtherComponent>
```

实际案例: react-router 的 Route 组件、react-motion 的 Motion 组件，或者自己的实际例子:

    自己想设计一个充分可扩展的 Uploader 组件，它需要可以完全定制界面，它可能需要支持 Drop&Drop API，它可能需要支持预览文件内容，它可能需要支持多文件上传，它可能需要支持文件上传控制(并非自动上传，而是有开始上传和取消上传)，它可能需要...如此多的定制项，意味着它只能是一个只是提供上传逻辑的组件，本身不涉及任何界面成分的逻辑组件。所以，它的使用方式可能应该是：

    ```jsx
    <Uploader>
    {(add_file, del_file, files, upload, upload_all, read_file, ...many_other_logics) => <div>
        <button onClick={upload_all}>upload all</button>
        <input type="file" onChange={e => [...e.files].map(f => add_file(f))}/>
        <ul>
        {files.map(f => <li key={f.name}>{f.name}<button onClick={e=>del_file(f)}>x</button></li>)}
        </ul>
    </div>}
    </Uploader>
    ```

这整个组件扩展逻辑中有一个 **IOC(控制反转)** 的思想，把原本由内部组件控制的界面或者逻辑反转到外部，由外部来控制，给组件的使用者以最大的自由。
