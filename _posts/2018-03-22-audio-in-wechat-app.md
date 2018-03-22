## 微信小程序的音频播放 API 测试

```html
<style type="less">
</style>

<template>
<view class="main-content">
  <audio id="my_audio"/>

  <view>wx_local_file: {{wx_local_file || 'none'}}</view>
  <button loading="{{wx_recording}}" @tap.stop="on_wx_record">wx_recording {{wx_recording}}</button>

  <view>rm_local_file: {{rm_local_file || 'none'}}</view>
  <button loading="{{rm_recording}}" @tap.stop="on_rm_record">rm_recording {{rm_recording}}</button>

  <view>
    <button @tap.stop="on_wx_playvoice_local_slk">on_wx_playvoice_local_slk</button>
    <button @tap.stop="on_wx_playvoice_local_aac">on_wx_playvoice_local_aac</button>
    <button @tap.stop="on_wx_playvoice_remote_slk">on_wx_playvoice_remote_slk</button>
    <button @tap.stop="on_wx_playvoice_remote_aac">on_wx_playvoice_remote_aac</button>
  </view>

  <view>
    <button @tap.stop="on_wx_playaudio_local_slk">on_wx_playaudio_local_slk</button>
    <button @tap.stop="on_wx_playaudio_local_aac">on_wx_playaudio_local_aac</button>
    <button @tap.stop="on_wx_playaudio_remote_slk">on_wx_playaudio_remote_slk</button>
    <button @tap.stop="on_wx_playaudio_remote_aac">on_wx_playaudio_remote_aac</button>
  </view>

  <view>
    <button @tap.stop="on_audio_manager_local_slk">on_audio_manager_local_slk</button>
    <button @tap.stop="on_audio_manager_local_aac">on_audio_manager_local_aac</button>
    <button @tap.stop="on_audio_manager_remote_slk">on_audio_manager_remote_slk</button>
    <button @tap.stop="on_audio_manager_remote_aac">on_audio_manager_remote_aac</button>
  </view>

  <view>
    <button @tap.stop="on_audio_context_local_slk">on_audio_context_local_slk</button>
    <button @tap.stop="on_audio_context_local_aac">on_audio_context_local_aac</button>
    <button @tap.stop="on_audio_context_remote_slk">on_audio_context_remote_slk</button>
    <button @tap.stop="on_audio_context_remote_aac">on_audio_context_remote_aac</button>
  </view>

  <view>
    <button @tap.stop="on_inner_audio_context_local_slk">on_inner_audio_context_local_slk</button>
    <button @tap.stop="on_inner_audio_context_local_aac">on_inner_audio_context_local_aac</button>
    <button @tap.stop="on_inner_audio_context_remote_slk">on_inner_audio_context_remote_slk</button>
    <button @tap.stop="on_inner_audio_context_remote_aac">on_inner_audio_context_remote_aac</button>
  </view>

</view>
</template>

<script>
import wepy from 'wepy';
/* global wx */

const remote_aac = `https://pandavoix.infihis.cn/8306c4e9-0bc2-11e8-8686-477c23d636ed.aac`;
const remote_slk = `https://pandavoix.infihis.cn/2f9ddf25-8db2-11e7-9aec-477c23d636ed.slk`;
const recorder_manager = wx.getRecorderManager();
const background_audio_manager = wx.getBackgroundAudioManager();
let audio_context = null;
const inner_audio_context = wx.createInnerAudioContext();

export default class TestAudio extends wepy.page {
  data = {
    wx_recording: false,
    wx_local_file: '',
    // rm_recording: recorder_manager_recording
    rm_recording: false,
    rm_local_file: '',
  };
  methods = {
    on_wx_record: e => {
      if (this.wx_recording) {
        this.wx_recording = false;
        return wx.stopRecord();
      }
      this.wx_recording = true;
      // ! 只能是 slk
      wx.startRecord({
        success: (...args) => {
          console.log(args); // [{errMsg, tempFilePath}]
          this.wx_local_file = args[0].tempFilePath;
          this.$apply();
        },
        fail: (...args) => {
          console.log(args);
        },
        complete: (...args) => {
          console.log(args); // [{errMsg, tempFilePath}]
        },
      });
    },
    on_rm_record: e => {
      if (this.rm_recording) {
        this.rm_recording = false;
        return recorder_manager.stop();
      }
      this.rm_recording = true;
      recorder_manager.start({
        format: 'aac'
      });
      recorder_manager.onStop((...args) => {
        console.log(args); // [{duration, fileSize, tempFilePath}]
        this.rm_local_file = args[0].tempFilePath;
        this.$apply();
      });
    },
    // playVoice 只支持 local slk。而且没有各种事件
    on_wx_playvoice_local_slk: e => {
      wx.playVoice({ filePath: this.wx_local_file }); // OK
    },
    on_wx_playvoice_local_aac: e => {
      wx.playVoice({ filePath: this.rm_local_file });
    },
    on_wx_playvoice_remote_slk: e => {
      wx.playVoice({ filePath: remote_slk });
    },
    on_wx_playvoice_remote_aac: e => {
      wx.playVoice({ filePath: remote_aac });
    },
    // playBackgroundAudio 只支持 remote aac
    on_wx_playaudio_local_slk: e => {
      wx.playBackgroundAudio({ dataUrl: this.wx_local_file });
    },
    on_wx_playaudio_local_aac: e => {
      wx.playBackgroundAudio({ dataUrl: this.rm_local_file });
    },
    on_wx_playaudio_remote_slk: e => {
      wx.playBackgroundAudio({ dataUrl: remote_slk });
    },
    on_wx_playaudio_remote_aac: e => {
      wx.playBackgroundAudio({ dataUrl: remote_aac }); // OK
    },
    //background_audio_manager 全都不支持
    on_audio_manager_local_slk: e => {
      background_audio_manager.src = this.wx_local_file;
    },
    on_audio_manager_local_aac: e => {
      background_audio_manager.src = this.rm_local_file;
    },
    on_audio_manager_remote_slk: e => {
      background_audio_manager.src = remote_slk;
    },
    on_audio_manager_remote_aac: e => {
      background_audio_manager.src = remote_aac;
    },
    // audio_context 在安卓上只支持 local aac 和 remote aac，在苹果上只支持 remote aac
    on_audio_context_local_slk: e => {
      audio_context.setSrc(this.wx_local_file);
      audio_context.play();
    },
    on_audio_context_local_aac: e => {
      audio_context.setSrc(this.rm_local_file);
      audio_context.play();
    },
    on_audio_context_remote_slk: e => {
      audio_context.setSrc(remote_slk);
      audio_context.play();
    },
    on_audio_context_remote_aac: e => {
      audio_context.setSrc(remote_aac);
      audio_context.play();
    },
    // inner_audio_context 全都不支持
    on_inner_audio_context_local_slk: e => {
      inner_audio_context.src = this.wx_local_file;
      inner_audio_context.play();
    },
    on_inner_audio_context_local_aac: e => {
      inner_audio_context.src = this.rm_local_file;
      inner_audio_context.play();
    },
    on_inner_audio_context_remote_slk: e => {
      inner_audio_context.src = remote_slk;
      inner_audio_context.play();
    },
    on_inner_audio_context_remote_aac: e => {
      inner_audio_context.src = remote_aac;
      inner_audio_context.play();
    },
    // ! 最终，放弃播放 local aac...然后 audio_context 还不支持事件，于是选用 playBackgroundAudio
  };
  async onLoad(options) {
    audio_context = wx.createAudioContext('my_audio');
  }
}
</script>
```

对此，我只想说一句：我屮艸芔茻。
