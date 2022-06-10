<script lang="ts">
import { defineComponent, getCurrentInstance, PropType, shallowRef, onMounted, onBeforeUnmount } from '@vue/composition-api';

export default defineComponent({
  props: {
    // 有 initialSize 的时候会在初次渲染时就渲染 slot，没有的话就会在二次渲染时才渲染 slot
    initialSize: Object as PropType<{ width: number; height: number }>,
  },
  setup(props) {
    const size = shallowRef(props.initialSize);
    const observer = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      size.value = { width: cr.width, height: cr.height };
    });
    onMounted(() => {
      const el = getCurrentInstance()!.proxy.$el;
      observer.observe(el);
      onBeforeUnmount(() => observer.unobserve(el));
    });
    return { size };
  },
});
</script>

<template>
  <div style="width: 100%; height: 100%">
    <slot v-if="size" v-bind="size"></slot>
  </div>
</template>
