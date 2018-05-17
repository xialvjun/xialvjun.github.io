import redux from 'redux';
// redux.applyMiddleware
// redux.bindActionCreators
// redux.combineReducers
// redux.compose
// redux.createStore
redux.combineReducers({
  a(state, action) {

  }
})

// redux.createStore(reducer, initial, (createStore => ))

// function model({ name, initial, actions, effects }) {

// }
var a = {
  name: 'adff.rew',
  initial: null,
  actions: {
    b(payload, substate) {},
  },
  effects: {
    a(payload, getSubState) {},
  },
  // 可以 model 里面又有 model。。。
  models: [],
}

var b = {
  name: '',
  actions: {
    actions1(payload, totalState) {},
  },
  effects: {
    effect1(payload, getTotalState) {},
  }
}

const { store, actions } =  createStore(model1, model2, action1, effect1);

// 其实最根本的应该是把 name 作为 field_name
const _initial = Symbol('_initial');
const _actions = Symbol('_actions');
const _effects = Symbol('_effects');
// 可以不需要 _models， 因为其他的 field 都是 _models 。。。虽然加上 _models 也可以
const _models = Symbol('_models');
var all_model = {
  [_initial]: null,
  [_actions]: {},
  [_effects]: {},
  [_models]: {
    'a.b': {
      [_initial]: null,
      [_actions]: {},
      [_effects]: {},
      [_models]: {
        b: {
          [_initial]: null,
          [_actions]: {},
          [_effects]: {},
        },
      },
    },
    b: {
      [_initial]: null,
      [_actions]: {},
      [_effects]: {},
    },
  },
}

function get_model_initial(model) {
  if (model[_initial] !== undefined) {
    return model[_initial];
  }
  const sub_models = model[_models];
  const sub_model_keys = Object.keys(sub_models);
  if (sub_model_keys.length === 0) {
    return null;
  }
  const initial = {};
  sub_model_keys.forEach(key => initial[key] = get_model_initial(sub_models[key]));
  return initial;
  // for (const key in model[_models]) {
  //   ini[key] = get_model_initial(model[_models][key]);
  // }
  // return ini;
}

function set_path(obj, path, value) {}

function cre_sto(model, sep='/') {
  let initial = get_model_initial(model);
  const reducer = (state, action) => {
    const all_path = action.type.split(sep);
    const model_path = all_path.slice(0, -1);
    const substate = get(state, model_path);
    let sub_model = model;
    for (const p of model_path) {
      sub_model = sub_model[_models][p];
    }
    const reducer = sub_model[all_path.slice(-1)[0]];
    return set_path(state, model_path, reducer(action.data, substate));
  }
  const store = createStore(reducer, initial, ehencers);
  const actions = new Proxy({}, {
    get: (p, r) => {

    },
  })
}

function createStore(...models) {
  const reducers = {};
  const actions = {};
  const effects = {};
  models = models.map(m => {
    if (m.name) {
      if (reducers[m.name]) {
        throw '';
      }
      reducers[m.name] = (state, action) => {
        return m.actions[action.type](action.data, state);
      }
    }
  });

}
function actionCreator(modelName, actionName) {
  return data => (
    dispatch({
      type: `${modelName}${SEP}${actionName}`,
      data
    })
  )
}


Simple Authorization

假如 域名不可变 的话，那就直接就是 用户自己生成一个 uuid，然后网站调用函数 `get_uuid = () => hash(user.uuid + location.host)`，得到的 hash 值就是用户的 identity兼密码，然后之前的 authorization.md 中可以知道 密码如果是唯一的话，就可以不需要 username 了，密码可以充当 identity。。。当然，网站客户端还是需要一个用户 ID 的，但是为了用户的安全，肯定不能把这个 identity兼密码 作为 ID，所以服务端要生成另一个 ID。。。

如果域名可变，那么函数 `get_uuid = (app_id) => hash(user.uuid + app_id)` 就不行了，因为 app_id 是公开的，就造成了最后的 identity兼密码 公开了。。。
-- 但是用户可以先向网站要一个 random_code(random_code 被 jwt 授权) ，然后：
-- aa = a(user.uuid, app_id, random_code) // 在浏览器进行
-- id = b(aa, random_code) // 在服务器进行
-- 这里，坏网站的确可以使用想破解的网站的 app_id 从而得到 id，但是那又怎么样呢？它并不能反推到随时都会变化的 aa，也就是说破解者想用这个 被破解网站的 b 函数时，它预先获取的 random_code 跟他在自己钓鱼网站生成的 random_code 并不相同。。。假设 random_code 的时效是 1分钟，那么钓鱼网站只能先在正规网站申请一个 random_code，然后立即修改自己网站的 random_code 一直为获取到的那个 random_code，然后只有在这一分钟内在他的钓鱼网站里登录的用户，会被钓鱼网站站主破解登录，而且只有一次。
-- 然后 random_code 可以更严格些，就是用户在申请 random_code 的时候回发送 hash(user.uuid + app_id) 给网站，random_code 里有这个 hash 值，这样钓鱼网站站长甚至都不能提前获取正规网站的 random_code 了。。。
------- 不不不，上面的逻辑可以简单的用类似代理的方式破解。。。用户登录钓鱼网站，申请 random_code 的时候，钓鱼网站去正规网站申请一个 random_code，并把这个发给用户，自己也记下来，然后用户把 aa 发过来，钓鱼网站就可以登录这个用户了，虽然只有一次。。。。。。。。。。。。。。。。。。。。。。。也不是，如果 random_code 有网站域名的话，浏览器就可以校验了。这个校验并不需要 jwt secret，因为如果钓鱼网站修改了 random_code ，那也钓不了鱼了
所以:

uid = step_a(app_id); // run in browser, step_a = (app_id) => hash(user.uuid + app_id);
sig = jwt.sign({ uid, random: Math.random(), domain: 'www.google.com', expire_at: Date.now() + 60 * 1000, signed: false }); // run in server
verify = step_b(app_id, sig); // run in browser, step_b = (app_id, sig) => JSON.parse(atob(sig.split('.')[1])).domain === location.host && hash(user.uuid + app_id + sig)  .... 这里有点问题，不能从 hash 中验证 uid。。。
