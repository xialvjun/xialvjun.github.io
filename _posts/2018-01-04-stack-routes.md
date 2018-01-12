# 页面路由的思考(二)

某一天，灵机一动，想到了页面路由，尤其移动端的路由的基本完美的解决办法，而且，继续使用当前的 **react, react-router** 技术栈，代码量相当少。。。

**TL;DR** 很简单，就是在定义页面路由的组件里监视路由变化（不论是根据 `componentWillReceiveProps` 还是 `history.listen` 又或者别的方式)，保留每次变化的 location，形成一个 location 数组，并根据 history 变化的 *action_type(PUSH, POP, REPLACE)* 对此 location 数组进行不同的操作，最终渲染出一个 react-router 的 Switch 数组出来。。。

## 样例代码

[gist 路径](https://gist.github.com/xialvjun/161d907d583688b17308fec28743b137)

```jsx
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Link, withRouter, matchPath } from 'react-router-dom';


const db = {
  authors: [
    { id: '8', name: 'xialvjun', gender: 'M', },
    { id: '1', name: 'lilei', gender: 'M' },
    { id: '7', name: 'hanmeimei', gender: 'F' },
  ],
  posts: [
    { id: '3', title: 'i like javascript', author_id: '8' },
    { id: '2', title: 'i like rust', author_id: '8' },
    { id: '7', title: `it's sunny`, author_id: '8' },
    { id: '5', title: 'i like javascript too', author_id: '1' },
  ],
};


const Home = () => <div>
  <h2>Home</h2>
  <Link to="/authors/8">xialvjun</Link>
</div>;


const Author = ({ match, location, history }) => {
  const author_id = match.params.author_id;
  const author = db.authors.find(a => a.id === author_id);
  if (!author) {
    return <div><h2>Author with id: {author_id} doesn't exist.</h2></div>;
  }
  const posts = db.posts.filter(p => p.author_id === author_id);
  const others = db.authors.filter(a => a.id !== author_id);
  return <div>
    <h2>name: {author.name}</h2>
    <h6>gender: {author.gender}</h6>
    <div>
      <h4>posts:</h4>
      <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
    </div>
    <div>
      <h5>others:</h5>
      <ul>{others.map(o => <li key={o.id}><Link to={'/authors/' + o.id}>{o.name}</Link></li>)}</ul>
    </div>
  </div>;
};


const routes = [
  { path: '/authors/:author_id', component: Author },
  { path: '/', render: Home },
];


class StackRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locations: [props.location] };
    this.max_layer = 5;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location != this.props.location) {
      if (nextProps.history.action === 'PUSH') {
        const next_route = routes.find(r => !!matchPath(nextProps.location.pathname, r));
        const this_route = routes.find(r => !!matchPath(this.props.location.pathname, r));
        if (next_route != this_route) {
          this.setState({ locations: this.state.locations.concat(nextProps.location).slice(-this.max_layer) });
        } else {
          const next_match = matchPath(nextProps.location.pathname, next_route);
          const this_match = matchPath(this.props.location.pathname, this_route);
          // console.log(next_match, this_match);
          if (next_match.url !== this_match.url) {
            this.setState({ locations: this.state.locations.concat(nextProps.location).slice(-this.max_layer) });
          } else {
            this.setState({ locations: this.state.locations.slice(0, -1).concat(nextProps.location).slice(-this.max_layer) });
          }
        }
      } else if (nextProps.history.action === 'POP') {
        this.setState({ locations: this.state.locations.slice(0, -2).concat(nextProps.location).slice(-this.max_layer) });
      } else if (nextProps.history.action === 'REPLACE') {
        this.setState({ locations: this.state.locations.slice(0, -1).concat(nextProps.location).slice(-this.max_layer) });
      }
    }
  }
  render() {
    const { state: { locations } } = this;
    // shouldn't use location.key because it will make normal push rebuild almost whole page
    return locations.map((loc, i) => <Switch key={i} location={loc}>
      {routes.map(route => <Route key={route.name} {...route}></Route>)}
    </Switch>);
  }
}

StackRoutes = withRouter(StackRoutes);


render(<BrowserRouter><StackRoutes/></BrowserRouter>, document.querySelector('#root'));
```

*已根据此思路，向 react-router 仓库的 website 包提交了一个包含 example 的 [PullRequest](https://github.com/ReactTraining/react-router/pull/5835)，~~希望被接受吧。~~已经被拒，泪奔 T-T，不过倒也的确像被拒理由里说的那样，作为介绍示例而言太复杂，而且功能特殊，哪怕功能很强大，但也只是适合作为一个工具库存在。*

*近期准备根据此思路写一个方便使用的组件，名字已经想好了：[StackSwitch](https://github.com/xialvjun/stack-switch)。*
