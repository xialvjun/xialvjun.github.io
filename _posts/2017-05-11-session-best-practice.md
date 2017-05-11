---
layout: post
title: Session 最佳实践
---

# 由来

Session 的根本目的**增强** HTTP 的状态，这里说的是**增强**。HTTP 是无状态的，Cookie 才是赋予无状态的 HTTP 以有状态的功能。但是 Cookie 易被修改、易被冒用，于是出来个 JsonWebToken 修复了 Cookie 的缺点。[Cookie 与 Token 的区别与优缺点](http://stackoverflow.com/a/35059874)。。。但是把状态过多的存在客户端毕竟浪费流量，而且也不好控制。例如要实现多端登录，单端管理登录信息的功能，这就必须使用 session 了。

既然 Cookie/JWT 已经赋予了 HTTP 以状态，那么在某些仅需要已经在 Cookie/JWT 存储的状态，而且对安全性要求不是很严格的接口中，完全可以不去获取完整的 session，节约一次数据库请求。只在需要获取完整的状态，或者在需要绝对判断该认证是否有效，是否已经被删除的时候，才去做数据库请求获取完整的 session。因此，我们需要 **[Lazy Session](https://github.com/xialvjun/koa-lazy-multi-session)**。

# API 设计

因为是 **Lazy** 的，而且从数据库获取完整的 session 是一次异步操作，所以 `ctx.session` 应该是一个返回 Promise 的异步方法，我们也可以根据函数的参数的数量来决定 session 的初始化、修改、删除。另外，目前 koa/express 上的 session 中间件几乎全都是自动帮我们把 session_id(以下简称为 sid) 设置到 cookie 上，这样，使用起来方便倒是方便了，但是鉴于上面有说到的 **[Cookie 与 Token 的区别与优缺点](http://stackoverflow.com/a/35059874)**，有的人可能不希望把 sid 放在 cookie 上，希望把 sid 通过 jwt 甚至别的形式传给服务器，所以定死怎么从请求中得到该请求的 sid 的方法可能并不是很好。当然，既然 sid 并不一定存储在 cookie 中，中间件也就无法通过 Set-Cookie 来告诉客户端存储 sid，中间件同样也不能覆盖响应的 body 去告诉客户端存储 sid。所以，整体流程应该是：客户端登录，登陆成功，服务端返回响应，响应 body 中包含新建 session 中的 sid，然后客户端把 sid 放在对应的位置去发起新的请求。

# Session Store 设计

为了让应用能够横向扩展，session 显然应该存储在一个第三方服务中，例如 **redis 或者 关系数据库**，而不是直接存在内存中。但是如果我们要求的更多一点，比如需要能对 session 进行检索，例如要实现*实现多端登录，单端管理登录信息的功能*，就必须得根据 session 中的 user_id 进行检索，这里就需要把 session 存储在一个关系数据库中可能比较恰当。不过目前的使用关系数据库作为 `session store` 的 nodejs package 中，大部分的 session 表只有 `sid: string, sess: json, expired_at: Date` 这三个关键字段，无法对 sess 中的 user_id 进行检索。因此，我们需要 **[Schema Session](https://github.com/xialvjun/knex-schema-session-store)**，由使用者自定义 session 表的可检索列。

# 示例

```js
require('dotenv').config();

const knex = require('knex')(JSON.parse(process.env.KNEX_CONFIG));

function sign(payload, options) {
  return require('jsonwebtoken').sign(payload, process.env.JWT_SECRET, options);
}
function verify(token, options) {
  try {
    return require('jsonwebtoken').verify(token, process.env.JWT_SECRET, options);
  } catch (error) {
    return null;
  }
}
const jwt = { sign, verify };

const uuid = require('uuid');
const Koa = require('koa');
const route = require('koa-route');

const app = new Koa();
app.use(require('koa-body')());

app.use(async function parse_jwt(ctx, next) {
  let token = (ctx.request.headers['authorization'] || '').replace('Bearer ', '');
  ctx.state.jwt = jwt.verify(token);
  await next();
});

const { default: session } = require('koa-lazy-multi-session');
const { default: Store } = require('knex-schema-session-store');
const store = new Store(knex, {
  schemas: [
    { name: 'user_id', type: 'string', extra: cb=>cb.notNullable() }
  ]
});

app.use(session({
  get_sid: ctx => ctx.state.jwt && ctx.state.jwt.sid,
  store,
}));

// 初始化 session
app.use(route.post('/login', async function(ctx, next) {
  // 判断登录成功，得到 user 和一些其他的信息，例如 roles
  let sid = uuid();
  // 初始化必须要有个 sid
  await ctx.session({ sid, user_id: user._id, user, roles });
  let token = jwt.sign({sid, user_id: user._id}, { expiresIn: '7d' });
  ctx.body = { token, user };
}));

// 删除 session，需要把 sid 设置为空值
app.use(route.del('/logout', async function(ctx, next) {
  await ctx.session({ sid: undefined });
}));

// 获取该用户所有登录的客户端
app.use(route.get('/clients', async function(ctx, next) {
  let { user_id } = await ctx.session();
  // ctx.body = await knex('sessions').where({ user_id }).select();
  ctx.body = await store.repo().where({ user_id }).select();
}));

// 有时我们不需要获取完整的 session
app.use(route.get('/me', async function(ctx, next) {
  if (ctx.jwt.user_id) {
    return ctx.body = await knex('users').where({ user_id: ctx.jwt.user_id }).first();
  }
  return;
}));

app.listen(3000);
```
