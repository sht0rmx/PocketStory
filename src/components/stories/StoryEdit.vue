<script setup>
import { reactive, ref } from "vue";
import { useSavesStore } from "@/stores/saves.js";
import { useRouter } from "vue-router";

const savesStore = useSavesStore();
const router = useRouter();
const emit = defineEmits(["created", "updated", "closed"]);

const lockPage = ref(false);
const editState = ref(false);
const viewMode = ref(false);
const storyDraft = reactive({ name: "", description: "", cover: "" });

let currentStoryId = "";

const showModal = (id = null, view = false) => {
  currentStoryId = id;
  lockPage.value = true;
  viewMode.value = view;

  if (!id) {
    editState.value = false;
    Object.assign(storyDraft, { name: "", description: "", cover: "" });
    return;
  }

  const story = savesStore.getStory(id);
  if (!story) return;

  Object.assign(storyDraft, story);
  editState.value = true;
};

const closeModal = () => {
  lockPage.value = false;
  emit("closed");
};

const saveStory = () => {
  if (!storyDraft.name.trim()) return;

  if (!editState.value) {
    const id = savesStore.createStory(storyDraft);
    emit("created", id);
    router.push(`/story/${id}?tab=characters`);
  } else {
    savesStore.updateStory(currentStoryId, storyDraft);
    emit("updated", currentStoryId);
  }

  closeModal();
};

const onCoverChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    storyDraft.cover = reader.result;
  };
  reader.readAsDataURL(file);
};

defineExpose({ showModal, closeModal });
</script>

<template>
  <div :class="{ 'modal-open': lockPage }" class="modal" role="dialog">
    <div class="modal-box max-w-lg max-h-[90vh] p-4 flex flex-col z-100">
      <h3 class="text-lg font-bold mb-2">
        {{
          editState && !viewMode
            ? "Редактирование истории"
            : viewMode
              ? "Информация о истории"
              : "Создание новой истории"
        }}
      </h3>

      <div
        :class="{ 'gap-2': viewMode }"
        class="flex-1 flex flex-col gap-4 overflow-y-auto px-2"
      >
        <img
          v-if="storyDraft.cover && viewMode"
          :src="storyDraft.cover"
          alt="cover"
          class="rounded-lg w-full max-h-64 object-cover"
        />

        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Название</legend>
          <input
            v-model="storyDraft.name"
            class="input w-full"
            placeholder="Восстание небес"
            required
            type="text"
          />
        </fieldset>
        <h4 v-else class="text-2xl font-black uppercase tracking-tighter">
          {{ storyDraft.name || "Без названия" }}
        </h4>

        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Описание</legend>
          <textarea
            v-model="storyDraft.description"
            class="textarea w-full"
            placeholder="Однажды..."
          />
        </fieldset>
        <p
          v-else
          class="whitespace-pre-line opacity-70 text-sm leading-relaxed italic border-l-2 border-primary/20 pl-4"
        >
          {{ storyDraft.description || "Описание отсутствует" }}
        </p>

        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Обложка</legend>
          <input
            accept="image/*"
            class="file-input w-full"
            type="file"
            @change="onCoverChange"
          />
        </fieldset>
      </div>

      <div v-if="!viewMode" class="flex gap-2 pt-4">
        <button class="btn btn-primary flex-1" @click="saveStory">
          {{ editState ? "Сохранить" : "Создать" }}
        </button>
        <button class="btn btn-secondary flex-1" @click="closeModal">
          Отмена
        </button>
      </div>

      <div v-else class="flex justify-end pt-4">
        <button class="btn btn-secondary flex-1" @click="closeModal">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>
