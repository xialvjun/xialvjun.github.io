# 什么才是学习

人类在原始人的时候就已经会使用火了。可是那不是科学。 
直到人类发现“燃烧是一种剧烈的氧化还原反应”之后，这才算科学。

内容可以不只是文本，也可以是节点：
会写出 `<Card head="这是 head"></Card>` 这样的代码不叫会 react。 
会写出 `<Card head={<div className="card head">head</div>}></Card>` 这样的代码才叫会 react。

内容可以不只是节点，也可以是逻辑（把复杂逻辑折叠进 vdom 中，是折叠，既不是隐藏，也不是完全暴露）：
会写出 `<Card head={<div className="card head">head</div>}></Card>` 这样的代码不叫会 react。
会写出 `<Consumer>{something => xxx}</Consumer>` 这样的代码才叫会 react。

初次使用 render props 的时候，有几人意识到自己在用 render props 呢，而它又有多么强大的功能呢？
会用 `<Route component={SomePage} />` 不叫会 react。 
会自己写出 `<MyComplexLogic>{logic => <div><button onClick={logic.do_something}>do_something</button></div>}</MyConlextLogic>`

局部状态，轻松解决
会写出 `<Consumer>{something => xxx}</Consumer>` 这样的代码不叫会 react。
会写出 `<State>{({state, setState}) => xxx}</State>` 这样的代码才叫会 react。
会写出 `<Form>{({state, setState, bindForm}) => <form><input {...bindForm('name')}/></forn>}</Form>` 这样的代码才叫会 react。
