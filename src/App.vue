<script setup>
import { provide, ref, watch } from "vue";
import DockBar from "@/components/ui/layout/DockBar.vue";
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
    :class="{ 'h-screen': !isChatMode }"
    :style="{ height: isChatMode ? '100dvh' : 'h-full' }"
    class="flex flex-col bg-base-300 overflow-hidden app-container"
  >
    <main
      :class="{
        'px-5 pt-4': !$route.meta.hidePadding,
        'pb-27': !$route.meta.hideDock,
      }"
      class="w-full flex-1 flex flex-col overflow-y-auto"
    >
      <div class="w-full flex flex-col h-full">
        <router-view />
      </div>
    </main>

    <DockBar v-if="!isChatMode && !$route.meta.hideDock" />
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
  flex-direction: column;
}
</style>
