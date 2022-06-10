<script lang="ts">
import { defineComponent, getCurrentInstance, PropType, shallowRef, watch, computed, triggerRef } from '@vue/composition-api';
import AutoSizer from './AutoSizer.vue';
import Virtualized from './Virtualized.vue';

// type TreeData = { children?: TreeData[] };

export default defineComponent({
  components: { AutoSizer, Virtualized },
  props: {
    treeData: {
      // 支持多顶层元素，想要是单顶层元素，只传单个就是
      type: Array as PropType<any[]>,
      required: true,
    },
    // itemSize 需要传 px 数，对于 rem 布局的，可以用 refs.useRemPx(2)，参数里的 2 指的是 2rem
    itemSize: {
      type: Number,
      default: 26,
    },
    idName: {
      type: String,
      default: 'id',
    },
    childrenName: {
      type: String,
      default: 'children',
    },
    // 这只是控制显示的 filter，需要注意外层组件如果加 checkbox，对应的勾选逻辑也要有响应的改变，避免数据出错
    filterFn: {
      type: Function as PropType<(item: any) => boolean>,
      default: () => true,
    },
  },
  setup(props) {
    const ins = getCurrentInstance()!;
    const insp = ins.proxy;

    const _meta = computed(() => {
      const indent: Record<string, number> = {};
      const parent: Record<string, any> = {};
      const traverse = (tree: any, _indent = 0, _parent?: any) => {
        indent[tree[props.idName]] = _indent;
        parent[tree[props.idName]] = _parent;
        tree[props.childrenName]?.forEach((t: any) => traverse(t, _indent + 1, tree));
      };
      props.treeData.forEach(t => traverse(t, 0, undefined));
      return { indent, parent };
    });
    const _indent = computed(() => _meta.value.indent);
    const _parent = computed(() => _meta.value.parent);

    const _expand = shallowRef<Record<string, boolean>>({});
    watch(
      [() => props.treeData, () => props.childrenName, () => props.idName] as const,
      ([treeData, childrenName, idName]) => {
        const old_expand = _expand.value;
        const new_expand: any = {};
        const traverse = (tree: any) => {
          const id = tree[idName];
          new_expand[id] = old_expand[id] || false;
          tree[childrenName]?.forEach((t: any) => traverse(t));
        };
        treeData.forEach(t => traverse(t));
        _expand.value = new_expand;
      },
      { immediate: true }
    );

    const _tree_list = computed(() => {
      const { filterFn, idName, childrenName } = props;
      const list: any[] = [];
      const exp = _expand.value;
      const traverse = (tree: any) => {
        if (!filterFn(tree)) return;
        list.push(tree);
        exp[tree[idName]] && tree[childrenName]?.forEach((t: any) => traverse(t));
      };
      props.treeData.forEach(t => traverse(t));
      return list;
    });

    return {
      _indent,
      _parent,
      _expand,
      _tree_list,
      setExpand: (item: any, to: boolean) => {
        _expand.value[item[props.idName]] = to;
        triggerRef(_expand);
      },
      toggleExpand: (item: any) => {
        const id = item[props.idName];
        _expand.value[id] = !_expand.value[id];
        triggerRef(_expand);
      },
      scroolTo: async (item: any) => {
        let p: any | undefined;
        const idName = props.idName;
        const parent = _parent.value;
        p = item;
        while ((p = parent[p[idName]])) {
          _expand.value[p[idName]] = true;
        }
        triggerRef(_expand);
        await insp.$nextTick();
        insp.$el.children[0].scrollTo({
          top: _tree_list.value.indexOf(item) * props.itemSize,
          // behavior: 'smooth',
        });
        // 不清楚 scrollTo 的动画耗时
        // await new Promise(res => setTimeout(res, 300));
      },
    };
  },
});
</script>

<template>
  <AutoSizer :initialSize="{ width: 100, height: 100 }" v-slot="{ height }">
    <Virtualized :height="height" :itemCount="_tree_list.length" :itemSize="itemSize" :paddingPage="1" v-slot="{ index, style }">
      <slot
        v-bind="{
          style,
          item: _tree_list[index],
          indent: _indent[_tree_list[index][idName]] || 0,
          expand: _expand[_tree_list[index][idName]] || false,
          toggle: () => toggleExpand(_tree_list[index]),
        }"></slot>
    </Virtualized>
  </AutoSizer>
</template>
