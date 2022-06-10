
export const useTreeCheck = (
  computedTreeData: ComputedRef<any[]>,
  computedIdName: ComputedRef<string>,
  computedChildrenName: ComputedRef<string>,
  onCheck?: (checks: Record<string, OrgvehtreeChecked>, item: any, to: OrgvehtreeChecked) => any
) => {
  const checked = shallowRef<Record<string, OrgvehtreeChecked>>({});
  const computed_parent_map = computed(() => {
    const idName = computedIdName.value;
    const childrenName = computedChildrenName.value;
    const parent: Record<string, any> = {};
    const traverse = (item: any, _parent?: any) => {
      parent[item[idName]] = _parent;
      item[childrenName]?.forEach((it: any) => traverse(it, item));
    };
    computedTreeData.value.forEach(t => traverse(t, undefined));
    return parent;
  });

  watch(
    [() => computedTreeData.value, () => computedIdName.value, () => computedChildrenName.value] as const,
    ([treeData, idName, childrenName]) => {
      const old_checked = checked.value;
      const new_checked: Record<string, OrgvehtreeChecked> = {};
      const traverse = (item: any) => {
        const item_id = item[idName];
        const item_children = item[childrenName];
        item_children?.forEach(traverse);
        if (!item_children || item_children.length === 0) {
          new_checked[item_id] = old_checked[item_id] || OrgvehtreeChecked.NOT;
          return;
        }
        new_checked[item_id] =
          [OrgvehtreeChecked.NOT, OrgvehtreeChecked.YES].find(to => item_children.every((it: any) => new_checked[it[idName]] === to)) ??
          OrgvehtreeChecked.PART;
      };
      treeData.forEach(traverse);
      checked.value = new_checked;
    },
    {
      immediate: true,
    }
  );
  const set = (item: any, to: OrgvehtreeChecked) => {
    const idName = computedIdName.value;
    const childrenName = computedChildrenName.value;
    const checks = !onCheck ? checked.value : Object.assign({}, checked.value);
    const traverse = (item: any) => {
      checks[item[idName]] = to;
      item[childrenName]?.forEach((it: any) => traverse(it));
    };
    traverse(item);
    const parent_map = computed_parent_map.value;
    let parent = parent_map[item[idName]];
    while (parent) {
      checks[parent[idName]] = parent[childrenName].every((it: any) => checks[it[idName]] === to) ? to : OrgvehtreeChecked.PART;
      parent = parent_map[parent[idName]];
    }
    if (!onCheck) return triggerRef(checked);
    // onCheck 在 不返回值 和 返回真值 时，都会确认改变 checked 的值，只有在 onCheck 明确返回 false 时才阻止改变 checked 的值
    if (onCheck(checks, item, to) === false) return;
    checked.value = checks;
  };
  const toggle = (item: any) => {
    const idName = computedIdName.value;
    // const childrenName = computedChildrenName.value;
    const checks = checked.value;
    if (checks[item[idName]] !== OrgvehtreeChecked.YES) return set(item, OrgvehtreeChecked.YES);
    if (checks[item[idName]] === OrgvehtreeChecked.YES) return set(item, OrgvehtreeChecked.NOT);
  };
  return { checked, toggle, set };
};

const rem2px = ref(20);
(() => {
  const computedStyle = getComputedStyle(document.documentElement);
  function refresh_rem() {
    const nv = parseFloat(computedStyle.fontSize);
    if (Math.abs(nv - rem2px.value) > 0.01) {
      rem2px.value = nv;
    }
    requestAnimationFrame(refresh_rem);
  }
  refresh_rem();
})();
// Virtualized.itemSize 需要传 px 数，对于 rem 布局的，可以用 refs.useRemPx(2)，参数里的 2 指的是 2rem
export const useRemPx = (rem: number) => computed(() => rem * rem2px.value);

export const useBlobUrl = () => {
  const urls: string[] = [];
  onUnmounted(() => urls.forEach(URL.revokeObjectURL));
  return (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    urls.push(url);
    return url;
  };
};

export const useApi = <F extends (...args: any[]) => PromiseLike<any>>(fn: F) => {
  let _args: Parameters<F> = null!;
  const state = shallowRef({
    loading: false,
    error: null,
    args: null as Parameters<F> | null,
    res: undefined as Awaited<ReturnType<F>>,
  });
  return {
    get value() {
      return state.value;
    },
    set value(v: typeof state.value) {
      state.value = v;
    },
    fn: ((...args: any) => {
      _args = args;
      state.value = { ...state.value, loading: true, error: null };
      return fn(...args).then(
        res => {
          if (_args !== args) return new Promise(_ => _);
          state.value = { ...state.value, loading: false, args, res };
          return res;
        },
        error => {
          if (_args !== args) return new Promise(_ => _);
          state.value = { ...state.value, loading: false, args, error };
          throw error;
        }
      );
    }) as F,
  };
};

export const useSafeActivatedDeactivated = (on_activated: () => any, on_deactivated: () => any) => {
  // ? 某些情况下会出现打开并显示组件时，触发了 onMounted，却没有触发 onActivated。原因似乎是因为 keep-alive.include 在打开组件时没有该组件
  let is_activating = false;
  const _on_activated = () => {
    if (is_activating) return;
    on_activated();
    is_activating = true;
  };
  const _on_deactivated = () => {
    if (!is_activating) return;
    on_deactivated();
    is_activating = false;
  };
  onMounted(_on_activated);
  onBeforeUnmount(_on_deactivated);
  onActivated(_on_activated);
  onDeactivated(_on_deactivated);
};

export const useSafeActivatedDeactivatedTimeout = (on_activated: () => any, on_deactivated: () => any, ms: number) => {
  let timeout = 0;
  useSafeActivatedDeactivated(
    () => {
      if (!timeout) {
        on_activated();
      } else {
        clearTimeout(timeout);
        timeout = 0;
      }
    },
    () => {
      timeout = setTimeout(() => {
        timeout = 0;
        on_deactivated();
      }, ms) as any;
    }
  );
};
