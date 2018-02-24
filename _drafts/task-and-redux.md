记录：微信小程序的音效。。。

首先，总结就是微信小程序就是个垃圾。。。
其次，是音效也可以在微信小程序内实现。。

音效，说的当然不是普通音频，而是要能够快速响应代码的音频。自然，这需要打包进程序中。

然后，微信小程序涉及到音频播放的 api 有

1. audio 标签（加 createAudioContext）
2. createInnerAudioContext
3. getBackgroundAudioManager
4. playBackgroundAudio

然后，尝试过

```js
// not ok
const ctx = wx.createInnerAudioContext();
ctx.src = '/audios/ring.aac';
ctx.play();

// not ok
const ctx = wx.createInnerAudioContext();
ctx.src = data_urls.ring_aac;
ctx.play();

// not ok
wx.playBackgroundAudio({ dataUrl: '/audios/ring.aac' });

// not ok
wx.playBackgroundAudio({ dataUrl: data_urls.ring_aac });

// not tried, but I think it's not ok
const audio_manager = wx.getBackgroundAudioManager();

// not ok
<audio src="/audios/ring.aac" id="audio_ring_aac"/>
const ring_aac = wx.createAudioContext('audio_ring_aac');
ring_aac.play();

// not ok
<audio id="audio_ring_aac"/>
const ring_aac = wx.createAudioContext('audio_ring_aac');
ring_aac.setSrc(data_urls.ring_aac);
ring_aac.play();

// ok
<audio src="{{data_urls.ring_aac}}" id="audio_ring_aac"/>
const ring_aac = wx.createAudioContext('audio_ring_aac');
ring_aac.play();
```
以上 not ok 的都只在 Android 上测试过，最后那条 ok 的在 Android 和 iOS 上都测试过。。。

千言万语汇成一句话：花❀Q，小程序。


缓存 promise，在当前 promise 没结束前，任何调用都是直接返回当前 promise，而不是 catch 后生成的 promise。。。即不会


```js
// ! task 的确能够在一定程度上代替 redux，但是 task 的逻辑实在是太简单。redux effect 中能够根据 getState 做不同的操作，而 task 最多只能强制 refresh
// ! 但是 task 能够缓存 promise，可以做到同时最多只有一个请求在进行，并且做到完成通知(effect 也能做到完成通知，但不能做到同时只有一个请求在进行)。。。
// ! 也许给 effect 加个装饰器可以做到让 effect 做到同时只有一个请求在进行
// ! 对。。。就是只需要给 effect 加一个缓存当前 promise 的装饰器就行。。。不是缓存成功的 promise。。。因为成功与否可以看 redux store。。。也可以是加个限制并行数为 1 的装饰器，效率都很高
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
// ! task 和 better_task 得到的第一次的 promise 与 第二次的 promise 可能不一样。。。如果第一次的 promise throw 了，则第二次的是一个全新的 promise
// ! 还应有一种只要两次请求是连在一起的，则保证返回同一个 promise 。。。这两种应该区分开。。。
// ! 也就是说第一种只缓存正确的 promise，第二种则仅仅是缓存 promise 无论对错
export function better_task(fn) {
  return (...args) => {
    let p = null;
    return refresh => ((refresh || !p) ? Promise.reject(false) : p).catch(e => {
      p = fn(...args);
      return p;
    });
  }
}

export const login = task(async () => {
  const login_data = await wepy.login();
  const user_info = await wepy.getUserInfo();
  const { data: user_data } = await wepy.request({
    url: REST_ENDPOINT + '/jscode2session',
    method: 'POST',
    dataType: 'json',
    data: {
      jscode: login_data.code,
      iv: user_info.iv,
      encrypted_data: user_info.encryptedData
    }
  });
  return user_data;
})();

// VS

// ! to be verified
function dec(fn) {
  let p = null;
  return (...args) => {
    if (!!p) {
      return p;
    }
    p = fn(...args);
    return p.then(a => {
      p = null;
      return a;
    }).catch(e => {
      p = null;
      throw e;
    });
    // return (p || Promise.reject(false)).catch(e => {
    //   p = fn(...args);
    //   return p;
    // });
  }
}

// mirrorx
model({
  name: 'user_data',
  initialState: null,
  reducers: {
    set(state, payload) {
      return payload;
    },
  },
  effects: {
    async login(refresh, getState) {
      const old_user_data = getState().user_data;
      if (!refresh && !!old_user_data) {
        return old_user_data;
      }
      const login_data = await wepy.login();
      const user_info = await wepy.getUserInfo();
      const user_data = await wepy.request({
        url: REST_ENDPOINT + '/jscode2session',
        method: 'POST',
        dataType: 'json',
        data: {
          jscode: login_data.code,
          iv: user_info.iv,
          encrypted_data: user_info.encryptedData
        },
      });
      actions.user_data.set(user_data.data);
      return user_data.data;
    },
  },
});
```
