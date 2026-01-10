<script setup>
import { computed, inject, ref } from "vue";
import { useSavesStore } from "@/stores/saves.js";
import router from "@/router/index.js";
import draggable from "vuedraggable";
import { useHoldAction } from "@/lib/HoldAction.js";

const props = defineProps({
  storyId: { type: String, required: true },
});

const savesStore = useSavesStore();
const story = computed(() => savesStore.getStory(props.storyId));

const deleteDialog = ref(null);
const deleteTargetId = ref(null);

const { start, cancel } = useHoldAction(
  (id) => router.push(`/story/${props.storyId}/chat?scene=${id}`),
  (id) => openSceneEditor(props.storyId, id, false),
);

const openSceneEditor = inject("openSceneEditor");

const scenesArray = computed({
  get: () => {
    const scenes = story.value?.scenes ?? {};
    return Object.entries(scenes).map(([id, data]) => ({ id, ...data }));
  },
  set: (newOrder) => {
    const newScenesObject = {};
    newOrder.forEach((scene) => {
      const { id, ...data } = scene;
      newScenesObject[id] = data;
    });

    savesStore.updateStory(props.storyId, { scenes: newScenesObject });
  },
});

const removeScene = (sceneId) => {
  savesStore.deleteScene(props.storyId, sceneId);
};

const openDeleteDialog = (id) => {
  deleteTargetId.value = id;
  deleteDialog.value.showModal();
};

const closeDeleteDialog = () => {
  deleteTargetId.value = null;
  deleteDialog.value.close();
};

const confirmDelete = () => {
  removeScene(deleteTargetId.value);
  closeDeleteDialog();
};

const goToChat = (sceneId) => {
  router.push(`/story/${props.storyId}/chat?scene=${sceneId}`);
};
</script>

<template>
  <div class="max-w-2xl mx-auto w-full space-y-4 px-2">
    <draggable
      v-if="scenesArray.length > 0"
      v-model="scenesArray"
      class="space-y-3"
      handle=".drag-handle"
      item-key="id"
      tag="div"
    >
      <template #item="{ element }">
        <div
          class="group flex items-center gap-3 bg-base-200 p-3 rounded-xl border border-base-content/5 justify-between"
        >
          <div
            class="flex items-center gap-3 flex-1 min-w-0"
            @mousedown="start(element.id)"
            @mouseup="cancel(element.id)"
            @touchend="cancel(element.id)"
            @touchstart.prevent="start(element.id)"
          >
            <div class="drag-handle cursor-grab opacity-30 flex-shrink-0">
              <i class="ri-draggable text-sm"></i>
            </div>
            <div class="flex flex-col min-w-0">
              <h3 class="font-semibold truncate">
                {{ element.title || "Без названия" }}
              </h3>
              <p
                v-if="element.description"
                class="text-xs opacity-60 line-clamp-1"
              >
                {{ element.description }}
              </p>
            </div>
          </div>
          <button
            class="btn btn-sm btn-error btn-soft btn-square shrink-0"
            @click.stop="openDeleteDialog(element.id)"
          >
            <i class="ri-close-line"></i>
          </button>
        </div>
      </template>
    </draggable>

    <div
      v-else
      class="flex flex-col justify-center items-center text-center py-16 gap-3 opacity-40"
    >
      <i class="ri-inbox-line text-5xl"></i>
      <p class="text-sm font-medium">В этой истории еще нет сцен</p>
    </div>

    <div
      class="card bg-base-200 shadow p-4 cursor-pointer hover:bg-base-300 transition flex flex-row items-center justify-center"
      @click="openSceneEditor(props.storyId)"
    >
      <i class="ri-add-line text-2xl mr-2"></i>
      <span class="text-sm font-bold uppercase tracking-tight"
        >Добавить сцену</span
      >
    </div>

    <dialog ref="deleteDialog" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold text-error">Удалить сцену?</h3>
        <p class="py-4">
          Все сообщения в этой сцене будут безвозвратно удалены.
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="deleteDialog.close()">
            Отмена
          </button>
          <button class="btn btn-error px-8" @click="confirmDelete">
            Удалить
          </button>
        </div>
      </div>
      <label class="modal-backdrop" @click="deleteDialog.close()">Close</label>
    </dialog>
  </div>
</template>

<style scoped></style>
