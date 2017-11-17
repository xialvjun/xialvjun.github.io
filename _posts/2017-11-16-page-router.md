# 页面路由的思考

传统的路由思维是以页面为导向的，一个页面一个路径，然后 react-router v4 给我们带来了以组件为导向的路由。。。此时，我们应该可以知道路由的本质其实就是对当前路径的一个 if 判断，即

```js
if (match(location, 某些条件)) {
  显示(A)
} else if(match(location, 另外的条件)) {
  显示(B)
}
```

上面说的都只是单纯的思维方式，然后实际使用中我们也能使用这种思维方式完成一些普通的需求，一般就是 `Layout + Component` 的显示方式。。。

### 但是我们能不能更激进一点呢？

在实际移动页面中，列表页进详情页，这是一个很常见的情况，普通的路由形式会导致之后再从详情页退回列表页时，列表页会重建，许多内部状态，例如 scrollTop 丢失，于是有些人会把这种状态给转移到 redux 中。。。也可能有些人会把详情页做成一个 modal，然后回到列表页就没问题了。。。但是从详情页进入另一个详情页呢，可能就变成了单纯的详情页组件的内部状态变化，中间没有创建/销毁什么组件，于是要手动设置 scrollTop 为 0，然后退回去上一个详情页时，又要恢复之前的 scrollTop，也就是之前进入新详情页之前需要记录对应的 scrollTop。。。。

虽然这些都不是不可以做，但实在是太复杂了不是吗？

那么，**能不能所有的 history push 操作都是新的 modal 呢？**（诚然，这样可能会出现性能问题，但我们暂时先不管它）

页面的进入方式有：

```yaml
list:
  detail
detail:
  detail
  list
```

我们普通的路由方式是：

```yaml
app_layout:
  list
  detail
```

如果，每个 history push 操作都是新的 modal，则路由会是？

```yaml
app_layout:
  list:
    portal:
      detail:
        portal:
          list:
            portal:
              detail:
                portal:
                  list:
                  detail:
          detail:
  detail:
    portal:
      list:
      detail:
```

恩，其实就是递归的：

```js
const App = () => <Switch>
  <Route path="/items" component={List}/>
  <Route path="/:id" component={Detail}/>
</Switch>

const List = ({match}) => <div>
  <ul>
    <li><Link to={match.url+'/1'}>item1</Link></li>
    <li><Link to={match.url+'/2'}>item2</Link></li>
  </ul>
  <Portal>
    <Route path={match.url+'/:id'} component={Detail}/>
  </Portal>
</div>

const Detail = ({match,history}) => <div>
  <button onClick={e=>history.go(-1)}>back</button>
  <Link to={match.url+'/items'}>list</Link>
  detail
  <Portal>
    <Switch>
      <Route path={match.url+'/items'} component={List}/>
      <Route path={match.url+'/:id'} component={Detail}/>
    </Switch>
  </Portal>
</div>
```

上面的递归路由形式就很好的解决状态保留的问题。。。因为它完全与用户本身的操作一致。。。用户点击链接前进，就会创建组件，用户回退，就会销毁组件。。。不会出现前进却是先销毁后创建。。。与 history 模型一致。。。

当然，这种使用方式也有问题：
1. 当 modal 层数太多时，就会出现性能问题了，尤其是用户根本不知道 modal 的事情；
2. 地址栏的 url 会变得越来越长；

对于问题 1，可以参照 https://reacttraining.com/react-router/web/example/modal-gallery 解决
对于问题 2，暂时没想到办法。。。如果不解决问题 1，似乎问题 2 可以在进入新路径前判断下当前层数，如果层数太高，则 redirect 一下，把底下的几层去掉，当然，这种操作会造成几乎整个程序所有的组件都销毁重新创建。。。
