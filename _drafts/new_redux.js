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
