<script lang="ts">
import { defineComponent, getCurrentInstance, ref, shallowRef, PropType } from '@vue/composition-api';

// 把声明式样式状态 转为 命令式编程
// 使用方式：
// <TransitionsVue ref="test_ani" :init_states="{a:{from:{left:'0'},to:{left:'300px'}}, b:{from:{top:'0'},to:{top:'300px'}}}" v-slot="{slot_ref,slot_style}">
//   <TestAniVue :init_ref="slot_ref" :style="[{position:'absolute',transition:'all 1s ease'},slot_style]" />
// </TransitionsVue>
// TestAniVue 里面会调用 props.init_ref() 来把元素暴露出来，例如 props.init_ref(getCurrentInstance())
// 然后命令式调用是 insp.$refs.test_ani.a(); 即出现 a 动画
// 还可以 insp.$refs.test_ani.delete();  insp.$refs.test_ani.create();  来销毁或创建元素
export default defineComponent({
  props: {
    init_states: Object as PropType<Record<string, { from?: any; to: any; duration?: number }>>,
    init_exist: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const insp = getCurrentInstance()!.proxy;

    const styl = shallowRef();
    const claz = ref('');
    const states = props.init_states || {};
    Object.keys(states).forEach(key => {
      const state = states[key];
      insp[key] = async () => {
        if (state.from) {
          // styl.value = state.from;
          if (typeof state.from === 'string') claz.value = state.from;
          else styl.value = state.from;
          // 先用 nextTick 保证 dom 属性被修改，然后用 requestAnimationFrame 保证修改后的 dom 属性被渲染，之后再去修改 dom 属性的时候才会生成动画
          // 至于为什么用三个 requestAnimationFrame 是因为不清楚为什么 chrome 里需要两个 raf 才能生成动画，为了保险，这里干脆用三个得了
          await insp.$nextTick();
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
        }
        // styl.value = state.to;
        if (typeof state.to === 'string') claz.value = state.to;
        else styl.value = state.to;
        if (state.duration) {
          await new Promise(res => setTimeout(res, state.duration));
        }
      };
    });

    const exist = ref(props.init_exist);

    const iref = (ins: any) => (insp['ref'] = ins);

    return { exist, claz, styl, iref };
  },
});
</script>

<template>
  <div>
    <slot v-if="exist" :claz="claz" :styl="styl" :iref="iref"></slot>
  </div>
</template>
