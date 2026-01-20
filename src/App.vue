<script setup>
import { provide, ref, watch } from "vue";
import DockBar from "@/components/ui/layout/DockBar.vue";
import SidebarNav from "@/components/ui/layout/SidebarNav.vue";
import CharacterEditModal from "@/components/characters/CharacterEdit.vue";
import SceneEditModal from "@/components/scenes/SceneEdit.vue";
import StoryEditModal from "@/components/stories/StoryEdit.vue";

const characterModalRef = ref(null);
const sceneModalRef = ref(null);
const storyModalRef = ref(null);

const openCharacterEditor = (sId, cId = null, view = null) =>
  characterModalRef.value?.showModal(sId, cId, view);
const openSceneEditor = (sId, scId = null, view = null) =>
  sceneModalRef.value?.showModal(sId, scId, view);
const openStoryEditor = (sId = null, view = null) =>
  storyModalRef.value?.showModal(sId, view);

provide("openCharacterEditor", openCharacterEditor);
provide("openSceneEditor", openSceneEditor);
provide("openStoryEditor", openStoryEditor);

const viewportHeight = ref(window.innerHeight);
const isChatMode = ref(false);

const setInteractiveWidget = (mode) => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute(
      "content",
      `width=device-width, initial-scale=1.0, interactive-widget=${mode}`,
    );
  }
};

provide("setChatMode", (v) => {
  isChatMode.value = v;
  if (!v) viewportHeight.value = window.innerHeight;
});

watch(isChatMode, (newValue) => {
  const mode = newValue ? "resizes-content" : "overlays-content";
  setInteractiveWidget(mode);
});
</script>

<template>
  <div
    class="bg-base-300"
    :class="['drawer lg:drawer-open', { 'h-screen': !isChatMode }]"
    :style="{ height: isChatMode ? '100dvh' : 'h-full' }"
  >
    <input
      id="app-drawer"
      type="checkbox"
      class="drawer-toggle"
      :checked="false"
      :class="{ hidden: isChatMode || $route.meta.hideDock }"
    />

    <div
      class="drawer-content flex overflow-hidden app-container"
    >
      <div class="flex flex-col flex-1 overflow-hidden">
        <main
          class="w-full flex-1 flex flex-col overflow-y-auto"
          :class="[
            !$route.meta.hidePadding && 'px-5 pt-4',
            !$route.meta.hideDock && 'pb-40 lg:pb-6',
          ]"
        >
          <div class="w-full flex flex-col h-full">
            <router-view />
          </div>
        </main>

        <DockBar
          v-if="!isChatMode && !$route.meta.hideDock"
          class="lg:hidden"
        />
      </div>
    </div>

    <div
      v-if="!isChatMode && !$route.meta.hideDock"
      class="drawer-side h-full"
      style="height: 100vh;"
    >
      <label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <aside
        class="w-72 lg:w-64 bg-base-200/90 backdrop-blur-md border-r border-base-200 flex h-full"
        style="height: 100vh;"
      >
        <SidebarNav />
      </aside>
    </div>
  </div>
  <StoryEditModal ref="storyModalRef" />
  <SceneEditModal ref="sceneModalRef" />
  <CharacterEditModal ref="characterModalRef" />
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  overscroll-behavior: none;
}

.app-container {
  transition: height 0.1s ease-out;
  display: flex;
}
</style>
