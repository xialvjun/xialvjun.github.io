<script lang="ts">
import { defineComponent, getCurrentInstance, PropType, ref, computed, onActivated } from '@vue/composition-api';

export default defineComponent({
  props: {
    height: {
      type: Number,
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
      default: 0,
    },
    itemSize: {
      type: [Number, Function] as PropType<number | ((i: number) => number)>,
      required: true,
      default: 0,
    },
    paddingPage: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  setup(props) {
    const insp = getCurrentInstance()!.proxy;
    const listTop = ref<number>(0);

    const calculateItemsTop = () => {
      const itemCount = props.itemCount;
      const items = [0];
      let top = 0;
      for (let i = 0; i < itemCount; i++) {
        if (typeof props.itemSize === 'number') {
          top += props.itemSize;
        } else if (typeof props.itemSize === 'function') {
          top += props.itemSize(i);
        }
        items.push(top);
      }
      return items;
    };
    const itemsTop = computed(calculateItemsTop);

    const renderItems = (scrollTop: number) => {
      const itemCount = props.itemCount;
      const items = [];
      const pageBottom = scrollTop + (1 + props.paddingPage) * props.height;
      const pageTop = scrollTop - props.paddingPage * props.height;
      for (let i = 0; i < itemCount; i++) {
        const curTop = itemsTop.value[i];
        const curBottom = itemsTop.value[i + 1];
        if (curTop < pageBottom && curBottom > pageTop) {
          items.push({
            index: i,
            style: { position: 'absolute' as const, top: `${curTop}px` },
          });
        } else if (items.length > 0) {
          break;
        }
      }
      return items;
    };
    const renderingItems = computed(() => renderItems(listTop.value));

    // TODO: https://github.com/vuejs/core/issues/1518 and change onDeactivated to onBeforeDeactivate
    let scroll_top_on_deactivated = 0;
    // onDeactivated(() => (scroll_top_on_deactivated = insp.$el.scrollTop));
    onActivated(() => {
      insp.$el.scrollTo({ top: scroll_top_on_deactivated });
    });

    const handleScroll = (e: UIEvent) => {
      /// @ts-ignore
      const curListTop = e.target?.scrollTop ?? 0;
      scroll_top_on_deactivated = curListTop;
      const prevListTop = listTop.value;
      const diff = curListTop - prevListTop;
      const maxDiff = props.height / 2;
      if (diff < maxDiff && diff > -maxDiff) return;
      listTop.value = curListTop;
    };
    return {
      handleScroll,
      itemsTop,
      renderingItems,
    };
  },
});
// Virtualized 不可以使用横向滚动，因为它都是 position:absolute，导致上层不知道 content 长度，不能所有元素共享长度，于是出现 background 时会不平整
</script>

<template>
  <div :style="{ height: height + 'px', overflow: 'auto' }" @scroll.passive="handleScroll">
    <div
      :style="{
        position: 'relative',
        height: `${itemsTop[itemsTop.length - 1]}px`,
        overflow: 'hidden',
      }">
      <slot v-for="it in renderingItems" v-bind="it"></slot>
    </div>
  </div>
</template>
