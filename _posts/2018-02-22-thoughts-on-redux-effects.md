## 一点关于 redux effect 的思考

结论：让 effect 返回一个 Promise，方便进行命令式编程；而且可以给 effect 加一些装饰器（限制并发数为 1），达到更好的控制，减少状态数量，并且仍然返回 Promise。

--------------

我们都知道 redux 本质上只是一个 Observable 对象。

Effect 则是 redux 生态里衍生出来的概念：除了修改 redux 的 state 以外，还要进行一些其他的副作用的操作。例如调用 API 得到结果，根据结果修改 redux 的 state，然后可能还要做些别的操作(例如存储到 localStorage 中)。

> 这里说的 effect 不同于 redux-saga 的 effect，反倒更类似于 redux-thunk。

Redux 只是一个 Observable 对象，里面有当前应用的状态，整个应用会根据这个状态，**展现不同的样子**，但仅仅只是展现，而不是**做不同的操作**。

> 虽然可以根据不同的状态，去做不同的操作，例如在 componentWillReceiveProps 中对比新旧 props，但这并不是一个好的方案。

Redux 的 state 以及对 state 的应用，就是声明式编程。

而 redux 的 effect，从上面的对 effect 的解释中可以看出，effect 里的操作是有顺序的，所以它是命令式编程。

~~这里并不是要说 声明式编程 和 命令式编程 谁好谁不好 的问题。而是要探讨什么时候，什么地方，应该选择何种方式编程。~~

然后，实际编程中，我们会发现在很多时候，我们还需要 effect 的完成通知。我们会希望不仅 effect 函数内部是命令式编程，它的外部也可以是命令式编程那就更好了。于是 effect 函数可以返回一个 Promise：

```js
// effect 定义，以 mirrorx 为例
model({
  name: 'a',
  initialState: null,
  reducers: {
    set: (state, payload) => payload,
  },
  effects: {
    do_a: async (arg, getState) => {
      const res = await api.do_a(args);
      actions.a.set(res);
      return res;
    },
  }
})

// React Component code
class ABC extends Component {
  do_ab = async () => {
    const res = await actions.a.do_a(this.state.a);
    // ... do other things
  }
}
```

上面都是我们知道的，不过，把 `do_a` 换个名字，例如换成 `login`，缓存状态也加上。这个时候，这个 effect 定义是否有问题：

```js
model({
  name: 'auth',
  initialState: null,
  reducers: {
    set: (state, payload) => payload,
  },
  effects: {
    login: async ({ username, password }, getState) => {
      const old_auth = getState().auth;
      if (old_auth && old_auth.token && old_auth.user) {
        return old_auth;
      }
      const { token, user } = await api.login(username, password);
      const auth = { token, user };
      actions.auth.set(auth);
      return auth;
    },
  }
})
```

看起来似乎没有什么问题，其实是有问题的。假如有两段代码先后调用了`actions.auth.login`，但是第一次调用的异步过程尚未结束，第二次调用就开始了，那就会两次调用登录`api.login`了。

加上当前的异步状态？

```js
effects.login = async ({ username, password }, getState) => {
  const old_auth = getState().auth;
  if (old_auth && old_auth.token && old_auth.user) {
    return old_auth;
  }
  if (old_auth.loading) {
    return old_auth;
  }
  actions.auth.set({ ...old_auth, loading: true });
  const { token, user } = await api.login(username, password);
  const auth = { token, user };
  actions.auth.set(auth);
  return auth;
}
```

此时倒不会两次调用`api.login`，但是第二次调用`actions.auth.login`却不能得到真正有效的 Promise，仍然需要依赖监听 redux 里的 state。

----------

然后有次自己在一个微信小程序的项目中，因为微信小程序的页面是分离的，`app.wpy`并不能控制`pages/some_page.wpy`的载入，所以每个页面都需要写一些等待程序登录完成的代码。于是当时自己把这个登录过程放在一个 Promise 中，并且写了个工具函数来缓存成功的 Promise：

```js
/**
 * 用法是
 * const login_task = task(api.login)(username, password);
 * login_task().then(...);
 * 因为 微信小程序里的登录不需要用户输入任何东西，可以完全对用户透明，所以可以有包裹函数
 * const wrapped_login = async () => {
 *   const login_data = await wepy.login();
 *   const user_info = await wepy.getUserInfo();
 *   const { token, user } = await api.login(login_data.code, user_info.iv, user_info.encryptedData);
 *   const auth = { token, user };
 *   return auth;
 * }
 * const login_task = task(wrapped_login)();
 * login_task().then(...);
 */
export function task(fn) {
  return (...args) => {
    let p;
    return (refresh) => {
      if (refresh) {
        p = fn(...args);
        return p;
      }
      return (p || Promise.reject(false)).catch(e => {
        p = fn(...args);
        return p;
      });
    }
  }
}
```

这种方式能够缓存成功的 Promise，做到完成通知，并且可以做到同时最多只有一个请求在进行；而 redux effect 目前只能做到有完成通知(即返回 Promise)，也能缓存结果，但不能做到同时只有一个请求在进行。

但是 task 的逻辑实在是太简单了，最多只能强制 refresh；而 redux effect 函数则可以根据 getState 做不同的操作。

如果两者能融合就好了。**给 effect 函数加上缓存 Promise 的装饰器，甚至更彻底的加上限制并行数的装饰器**。

```js
function cache_pending_promise(fn) {
  let p = null;
  return (...args) => {
    if (!!p) {
      return p;
    }
    p = fn(...args).then(a => {
      p = null;
      return a;
    }).catch(e => {
      p = null;
      throw e;
    });
    return p;
  }
}

function limit(fn, count) {
  const ps = [];
  let working = 0;
  return (...args) => {
    return new Promise((resolve, reject) => {
      ps.push({ resolve, reject, args });
      work();
    });
  };
  function work() {
    if (working >= count) {
      return;
    }
    const next = ps.shift();
    if (next) {
      working++;
      fn(...next.args)
        .then(_ => {
          working--;
          work();
          next.resolve(_);
        })
        .catch(e => {
          working--;
          work();
          next.reject(e);
        });
    }
  }
}

effects.login = async ({ username, password }, getState) => {
  const old_auth = getState().auth;
  if (old_auth && old_auth.token && old_auth.user) {
    return old_auth;
  }
  const { token, user } = await api.login(username, password);
  const auth = { token, user };
  actions.auth.set(auth);
  return auth;
};

effects.login = cache_pending_promise(effects.login);
// ! or
effects.login = limit(effects.login, 1);
```

这样，effect 函数就成为了有完成通知，并且可以限制并行数，而且可以根据 getState 做不同操作的函数了。可以尽情地随处调用了。
