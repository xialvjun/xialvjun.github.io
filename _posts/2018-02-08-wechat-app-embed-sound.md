## 微信小程序的音效实现

~~首先，总结就是微信小程序就是个垃圾。。。~~
其次，是音效也可以在微信小程序内实现。。

音效，说的当然不是普通音频，而是要能够快速响应代码的音频。自然，这需要把音频打包进程序中。

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

以上 not ok 的都只在 Android 上测试过（2018年2月份），最后那条 ok 的在 Android 和 iOS 上都测试过。。。

千言万语汇成一句话：花❀Q（KizunaAI 好可爱😙），微信小程序。
