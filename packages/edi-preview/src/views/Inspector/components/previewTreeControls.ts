import { computed, inject, nextTick, provide, ref, watch, type ComputedRef, type InjectionKey, type Ref } from "vue";
import type { PreviewNode } from "@/views/Inspector/previewTree";

export interface PreviewTreeSearchResult {
  /** Node keys that stay visible: matches plus their ancestors. */
  visible: Set<string>;
  /** Node keys that are ancestors of a match and must be expanded to reveal it. */
  expand: Set<string>;
}

export interface PreviewTreeControls {
  query: Ref<string>;
  searchResult: ComputedRef<PreviewTreeSearchResult | null>;
  expandSignal: Ref<number>;
  collapseSignal: Ref<number>;
  expandAll: () => void;
  collapseAll: () => void;
}

const SEARCH_DEBOUNCE_MS = 120;
const DEEP_TREE_PASSES = 8;

const controlsKey: InjectionKey<PreviewTreeControls> = Symbol("previewTreeControls");

const emptyControls: PreviewTreeControls = {
  query: ref(""),
  searchResult: computed(() => null),
  expandSignal: ref(0),
  collapseSignal: ref(0),
  expandAll: () => {},
  collapseAll: () => {}
};

export function providePreviewTreeControls(nodes: Ref<PreviewNode[]>): PreviewTreeControls {
  const query = ref("");
  const activeQuery = ref("");
  const expandSignal = ref(0);
  const collapseSignal = ref(0);
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  watch(query, value => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      activeQuery.value = value;
    }, SEARCH_DEBOUNCE_MS);
  });

  const searchResult = computed<PreviewTreeSearchResult | null>(() => {
    const needle = activeQuery.value.trim().toLowerCase();
    if (!needle) {
      return null;
    }

    const result: PreviewTreeSearchResult = { visible: new Set(), expand: new Set() };
    for (const node of nodes.value) {
      collectMatches(node, needle, result);
    }

    return result;
  });

  const controls: PreviewTreeControls = {
    query,
    searchResult,
    expandSignal,
    collapseSignal,
    expandAll: () => broadcast(expandSignal),
    collapseAll: () => broadcast(collapseSignal)
  };

  provide(controlsKey, controls);
  return controls;
}

export function usePreviewTreeControls(): PreviewTreeControls {
  return inject(controlsKey, emptyControls);
}

/**
 * Children only mount after their parent expands, so a single broadcast misses
 * the deeper levels that appear afterwards. Re-broadcast for a few frames.
 */
async function broadcast(signal: Ref<number>) {
  for (let attempt = 0; attempt < DEEP_TREE_PASSES; attempt++) {
    signal.value += 1;
    await nextTick();
  }
}

function collectMatches(node: PreviewNode, needle: string, result: PreviewTreeSearchResult): boolean {
  let childMatched = false;
  for (const child of node.loadChildren?.() ?? []) {
    if (collectMatches(child, needle, result)) {
      childMatched = true;
    }
  }

  const selfMatched = searchableText(node).includes(needle);
  if (selfMatched || childMatched) {
    result.visible.add(node.nodeKey);
  }

  if (childMatched) {
    result.expand.add(node.nodeKey);
  }

  return selfMatched || childMatched;
}

function searchableText(node: PreviewNode): string {
  return [
    node.title,
    node.codeTag,
    node.elementDesignator,
    node.meta,
    node.subtitle,
    node.purpose,
    node.elementValue,
    node.elementMeaning,
    node.trailing
  ]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLowerCase();
}
