<script setup>
import { computed, inject, reactive, ref } from "vue";
import { useSavesStore } from "@/stores/saves.js";

const savesStore = useSavesStore();
const emit = defineEmits(["created", "updated", "closed"]);

let currentStoryId = "";
let currentSceneId = "";

const lockPage = ref(false);
const editState = ref(false);
const viewMode = ref(false);

const sceneDraft = reactive({
  title: "",
  description: "",
  characters: [],
});

let story = computed(() => savesStore.getStory(currentStoryId));
let characters = computed(() => story.value?.characters ?? {});

const resetDraft = () => {
  Object.assign(sceneDraft, {
    title: "",
    description: "",
    characters: [],
  });
  editState.value = false;
  viewMode.value = false;
};

const loadScene = () => {
  if (!currentStoryId || !currentSceneId) return;
  const scene = savesStore.getScene(currentStoryId, currentSceneId);
  if (!scene) return;

  Object.assign(sceneDraft, scene);
  editState.value = true;
};

const saveScene = () => {
  if (!sceneDraft.title.trim()) return;

  if (!editState.value) {
    let id = savesStore.createScene(currentStoryId, sceneDraft);
    emit("created", id);
  } else {
    savesStore.updateScene(currentStoryId, currentSceneId, sceneDraft);
    emit("updated", currentSceneId);
  }

  closeModal();
};

const toggleCharacter = (id) => {
  if (viewMode.value) return;
  const idx = sceneDraft.characters.indexOf(id);
  idx === -1
    ? sceneDraft.characters.push(id)
    : sceneDraft.characters.splice(idx, 1);
};

const showModal = (storyId, sceneId = null, viewer) => {
  story = computed(() => savesStore.getStory(currentStoryId));
  characters = computed(() => story.value?.characters ?? {});

  resetDraft();
  currentStoryId = storyId;
  currentSceneId = sceneId;

  viewMode.value = viewer;
  lockPage.value = true;

  if (sceneId) loadScene();
};

const closeModal = () => {
  lockPage.value = false;
  emit("closed");
};

const openCharacterEditor = inject("openCharacterEditor");

defineExpose({ showModal, closeModal });
</script>

<template>
  <div :class="{ 'modal-open': lockPage }" class="modal" role="dialog">
    <div class="modal-box max-w-md max-h-[90vh] flex flex-col z-500">
      <h3 class="text-lg font-bold mb-2">
        {{
          viewMode
            ? "Сцена"
            : editState
              ? "Редактирование сцены"
              : "Создание сцены"
        }}
      </h3>

      <div class="flex-1 overflow-y-auto space-y-3 px-2">
        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Название</legend>
          <input
            v-model="sceneDraft.title"
            class="input w-full"
            placeholder="Темный лес..."
          />
        </fieldset>
        <h4 v-else class="text-2xl font-black uppercase tracking-tighter">
          {{ sceneDraft.title || "Без названия" }}
        </h4>

        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Описание</legend>
          <textarea
            v-model="sceneDraft.description"
            class="textarea w-full"
            placeholder="Ничего примечательного"
          />
        </fieldset>
        <p
          v-else
          class="whitespace-pre-line opacity-70 text-sm leading-relaxed italic border-l-2 border-primary/20 pl-4"
        >
          {{ sceneDraft.description || "Описание отсутствует" }}
        </p>

        <div class="pb-4">
          <span class="font-medium">Персонажи сцены</span>

          <div class="flex flex-wrap gap-2 mt-2">
            <div v-for="(char, id) in characters" :key="id">
              <button
                v-if="!viewMode"
                :class="
                  sceneDraft.characters.includes(id)
                    ? 'btn-primary'
                    : 'btn-outline'
                "
                class="btn btn-sm"
                type="button"
                @click="toggleCharacter(id)"
              >
                <span class="truncate max-w-25">{{ char.name }}</span>
              </button>

              <span
                v-else-if="sceneDraft.characters.includes(id)"
                class="badge badge-outline p-3"
              >
                {{ char.name }}
              </span>
            </div>

            <button
              v-if="!viewMode"
              class="btn btn-sm btn-ghost border-dashed"
              @click="openCharacterEditor(currentStoryId)"
            >
              <i class="ri-add-line"></i>
            </button>
          </div>

          <div
            v-if="viewMode && sceneDraft.characters.length === 0"
            class="text-xs opacity-30 italic mt-2"
          >
            Персонажи не указаны
          </div>
        </div>

        <div class="flex gap-2 pt-4">
          <button
            v-if="!viewMode"
            class="btn btn-primary flex-1"
            @click="saveScene"
          >
            {{ editState ? "Сохранить" : "Создать" }}
          </button>

          <button class="btn btn-secondary flex-1" @click="closeModal">
            {{ viewMode ? "Закрыть" : "Отмена" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
