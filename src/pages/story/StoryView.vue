<script setup>
import { computed, inject, ref, watch } from "vue";
import { useSavesStore } from "@/stores/saves.js";
import ScenesGrid from "@/components/scenes/SceneList.vue";
import CharactersGrid from "@/components/characters/CharacterList.vue";
import Header from "@/components/ui/layout/Header.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  storyId: { type: String, required: true },
});

const openStoryEditor = inject("openStoryEditor");

const HOLD_DELAY = 300;
let holdTimer = null;
const isHolding = ref(false);

const savesStore = useSavesStore();
const story = computed(() => savesStore.getStory(props.storyId) || {});
const selectedTab = ref(route.query.tab || "scenes");

watch(selectedTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

const startHold = (id) => {
  isHolding.value = false;
  holdTimer = setTimeout(() => {
    isHolding.value = true;
    onHold(id);
  }, HOLD_DELAY);
};

const cancelHold = (id) => {
  clearTimeout(holdTimer);
  holdTimer = null;

  if (!isHolding.value) {
    onClick(id);
  }
};

const onClick = (id) => {
  openStoryEditor(props.storyId, true);
};

const onHold = (id) => {
  openStoryEditor(props.storyId, id, false);
};
</script>

<template>
  <Header :title="story.name" />

  <div class="pt-12 space-y-6">
    <div
      class="bg-base-200 rounded-lg shadow overflow-hidden max-w-sm"
      @mousedown="startHold(story.id)"
      @mouseup="cancelHold(story.id)"
      @touchend="cancelHold(story.id)"
      @touchstart.prevent="startHold(story.id)"
    >
      <img
        v-if="story.cover"
        :src="story.cover"
        alt="cover"
        class="w-full object-cover max-h-40"
        style="aspect-ratio: 3 / 4"
      />

      <div class="p-4 flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold">{{ story.name }}</h2>
            <div class="flex gap-3 text-sm opacity-50">
              <div class="flex flex-row gap-2">
                <i class="ri-fullscreen-exit-line"></i>
                <span>{{
                  story.scenes ? Object.keys(story.scenes).length : 0
                }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <i class="ri-user-line"></i>
                <span>{{
                  story.characters ? Object.keys(story.characters).length : 0
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm opacity-80 mt-2 line-clamp-4">
          {{ story.description }}
        </p>
      </div>
    </div>

    <div class="tabs tabs-border">
      <input
        id="scenes"
        v-model="selectedTab"
        aria-label="Сцены"
        class="tab"
        name="story_data"
        type="radio"
        value="scenes"
      />
      <div v-show="selectedTab === 'scenes'" class="tab-content p-3">
        <ScenesGrid :story-id="props.storyId" />
      </div>
      <input
        id="characters"
        v-model="selectedTab"
        aria-label="Персонажи"
        class="tab"
        name="story_data"
        type="radio"
        value="characters"
      />

      <div v-show="selectedTab === 'characters'" class="tab-content p-3">
        <CharactersGrid :story-id="props.storyId" />
      </div>
    </div>
  </div>
</template>
