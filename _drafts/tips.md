css:
使用 styled-components 。。。不介意 bundle 体积的话，可以直接在 js 文件内写 css。。。如果想分开 js 文件与 css 文件，或者介意 bundle 体积，也可以分开写，然后使用 css-loader minify 之后注入到 styledc-components 中。。。

对于已经有样式的第三方组件库，同样是 css-loader minify 之后，注入到 styled.injectGlobal 中

事实上，https://github.com/styled-components/babel-plugin-styled-components 该插件自带 minify 功能，但是对于第三方样式，还是有用 css-loader 的必要的。。。



redux:
直接用 redux-thunk 就好，没必要 saga 。。。 saga 比较大，而且它主要注重在流程控制方面（例如没有login前没有logout的说法），实际需要的不多。。。
使用 redux-act 做同步 action 与 reducer，使用 redux-thunk 做异步 action，并在内部调用 redux-act 生成的同步 action。。。。。。redux-act 有生成 action 简单，从而让程序员有细化 action 的趋势，喜欢 action 更好。。。

redux 里也没必要存放太多的数据，一般也就是 `token, current_user, buy_cart` 等少量的全局状态。。。要学会分清哪些是真正的全局状态，哪些不是。。。也不要太追求局部状态保存的功能，没那个必要。。。事实上，局部状态保存一般也不是放在 redux 里，而是放在 localStorage 中...局部状态保存并不需要可订阅


redux_store 可订阅 内存缓存
localstorage 不可订阅 硬盘缓存
url 可订阅 硬盘缓存
全局对象 不可订阅 内存缓存





apollo:
使用 graphql ，配合 apollo-client + redux 很好




recompose:
使用高阶组件，比把所有状态、逻辑放在一个 component 里要来的清晰，虽然并不会减少多少代码就是，而且可能增加代码

```js
// 一个 form 例子
compose(
    withState('api_status', 'set_api_status', {loading: false, error: null}),
    withState('model', 'set_model', props => props.initialModel || {}),
    withState('validate_erros', 'set_errors', null),
    // 使用 debounce 来避免不必要的 validate
    withPropsOnChange(['model'], debounce(({model, set_errors}) => set_erros(validate(model)), 500)),
    withProps(({model, api_status, set_api_status}) => ({
        // async save() {
        //     try {
        //         set_api_status({loading: true, error: null});
        //         await api.save(model);
        //     } catch (error) {
        //         set_api_status({...api_status, error});
        //     } finally {
        //         set_api_status({...api_status, loading: false});
        //     }
        // },
        // // 提供了两种写法，上面那种是错误的，因为在 await api.save 之后， api_status 的引用就已经是旧的引用了
        async save() {
            try {
                set_api_status({loading: true, error: null});
                await api.save(model);
                set_api_status({loading: false, error: null});
            } catch (error) {
                set_api_status({loading: false, error});
            }
        }
    })),
)(({initialModel, model, set_model, api_status, validate_errors, save}) => (
    <div>
    </div>
))
```

从上段代码可以看到，使用 recompose 能够让代码逻辑区分更明确。。。不同地方的代码负责管理不同的任务。。。model 的管 model，validate 的管 validate，api 的管 api。。。
相比而言，传统的 react 把所有状态都放在一个 state 中，一起来管理，逻辑就不是那么清晰了。。。
当然，使用 recompose 这种形式来写组件也有一些不方便的地方。。。例如上面的 `async save` 方法，参数里的 props 在异步代码中会丢失。。。而传统的 react 组件写法，使用 `this.props.api_status` 能保证永远拿到的都是最新的 props。。。

对于 form，有 react-reformed 这个高阶组件这个 helper



react 组件界面控制代码设计:
普通组件:        <MyComponent props1={p1} props2={p2} />
稍微有点扩展:     <MyComponent props1={p1} a_part={<button>a_part</button>}/>
极度扩展:        <MyComponent props={p1} a_part={a => <button>{a}</button>} />

这里有一种 IOC（控制反转） 的思想。。。


上面的 IOC 思想有时候可能会产生一点问题，例如：
<ul>{items.mao(item=><li key={item.id} onClick={e=>this.setState({item})}>{item}</li>)}</ul>
<SomeForm initialModel={state.item.abc} a_part={<div>{state.item.def}</div>}/>
这种例子中，initialModel 与 a_part 会发生不同步，一个小 tip 可以解决，给 SomeForm 加上 key。。。
<SomeForm key={state.item.id} initialModel={state.item.abc} a_part={<div>{state.item.def}</div>}/>




浏览器打印 https://ask.helplib.com/319215 。。。@page 里设置 margin:0 可以隐藏页眉页尾。。。 position:fixed 可以设置每页都显示的内容，用来设置页眉页尾。。。



1. create-react-style   macro
2. render-props 的使用 react-powerplug matchMedia ResizeObserver
3. stack-switch
4. rx-domh
5. react 性能。。就 减少使用 render 内的 对象字面量和 inline 函数。。。至于 render-props 会不会影响性能，是当函数运行，还是当组件来创建。。。
6. taro mpvue 微信小程序 --- react 三点：组件自带状态、jsx、生命周期




**视频网站**
视频网站会员.... 会员可以任意点播所有内容, 非会员可以点播 网站给他们免费看的东西(而且免费内容会随时间变化, 可能今天免费, 明天不免费, 这是要塑造符合网站价值观的平民)

