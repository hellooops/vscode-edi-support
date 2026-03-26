import { computed, ref, shallowRef, watch } from "vue";
import { nodeContainsKey, type PreviewNode } from "@/views/Inspector/previewTree";

export function usePreviewTreeNodeState(props: {
  node: PreviewNode;
  activeId?: string;
}) {
  const isOpen = ref(props.node.defaultExpanded);
  const childNodes = shallowRef<PreviewNode[]>([]);
  const hasLoadedChildren = ref(false);

  const hasExpandableContent = computed(() => props.node.details.length > 0 || props.node.hasChildren);
  const hasVisibleChildren = computed(() => childNodes.value.length > 0);
  const visibleDetails = computed(() => props.node.details);
  const hasBodyContent = computed(() => visibleDetails.value.length > 0 || props.node.hasChildren);
  const isActive = computed(() => props.node.key === props.activeId);
  const shouldAutoExpand = computed(() => props.node.kind !== "element" || props.node.hasChildren);
  const headerStyle = computed(() => ({
    top: `${props.node.stickyOffset}px`,
    zIndex: `${props.node.stickyLayer}`
  }));

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
      if (shouldAutoExpand.value && activeId && nodeContainsKey(props.node, activeId)) {
        isOpen.value = true;
        ensureChildrenLoaded();
      }
    },
    { immediate: true }
  );

  function toggleOpen() {
    if (!hasExpandableContent.value) {
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
    hasExpandableContent,
    hasVisibleChildren,
    visibleDetails,
    hasBodyContent,
    isActive,
    headerStyle,
    toggleOpen
  };
}