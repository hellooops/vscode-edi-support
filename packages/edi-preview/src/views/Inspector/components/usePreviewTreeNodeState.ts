import { computed, ref, shallowRef, watch } from "vue";
import { nodeContainsNodeKey, type PreviewNode } from "@/views/Inspector/previewTree";
import { usePreviewTreeControls } from "@/views/Inspector/components/previewTreeControls";

export function usePreviewTreeNodeState(props: {
  node: PreviewNode;
  activeId?: string;
}) {
  const isOpen = ref(props.node.defaultExpanded);
  const childNodes = shallowRef<PreviewNode[]>([]);
  const hasLoadedChildren = ref(false);
  const controls = usePreviewTreeControls();

  const hasBodyContent = computed(() => props.node.kind === "element"
    || Boolean(props.node.meta || props.node.purpose || props.node.hasChildren));
  const hasVisibleChildren = computed(() => childNodes.value.length > 0);
  const isActive = computed(() => props.node.nodeKey === props.activeId);
  const shouldAutoExpand = computed(() => props.node.kind !== "element" || props.node.hasChildren);
  const isFilteredOut = computed(() => {
    const result = controls.searchResult.value;
    return Boolean(result && !result.visible.has(props.node.nodeKey));
  });

  watch(
    isOpen,
    open => {
      if (open) {
        ensureChildrenLoaded();
      }
    },
    { immediate: true }
  );

  watch(
    () => props.activeId,
    activeId => {
      if (shouldAutoExpand.value && activeId && nodeContainsNodeKey(props.node, activeId)) {
        isOpen.value = true;
        ensureChildrenLoaded();
      }
    },
    { immediate: true }
  );

  watch(
    () => controls.searchResult.value,
    result => {
      if (result?.expand.has(props.node.nodeKey)) {
        isOpen.value = true;
        ensureChildrenLoaded();
      }
    },
    { immediate: true }
  );

  watch(controls.expandSignal, () => {
    if (props.node.kind !== "element" && hasBodyContent.value) {
      isOpen.value = true;
      ensureChildrenLoaded();
    }
  });

  watch(controls.collapseSignal, () => {
    isOpen.value = false;
  });

  function toggleOpen() {
    if (!hasBodyContent.value) {
      return;
    }

    isOpen.value = !isOpen.value;
  }

  function ensureChildrenLoaded() {
    if (hasLoadedChildren.value || !props.node.hasChildren) {
      return;
    }

    childNodes.value = props.node.loadChildren?.() ?? [];
    hasLoadedChildren.value = true;
  }

  return {
    isOpen,
    childNodes,
    hasVisibleChildren,
    hasBodyContent,
    isActive,
    isFilteredOut,
    toggleOpen
  };
}
