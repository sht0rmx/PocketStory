<script setup>
import { computed, inject, ref } from "vue";
import { useSavesStore } from "@/stores/saves.js";
import { useHoldAction } from "@/lib/HoldAction.js";

const props = defineProps({
  storyId: { type: String, required: true },
});

const savesStore = useSavesStore();
const story = computed(() => savesStore.getStory(props.storyId));
const characters = computed(() => story.value?.characters ?? {});

// Превращаем объект в массив для удобного вывода в столбец
const charactersArray = computed(() => {
  return Object.entries(characters.value).map(([id, data]) => ({
    id,
    ...data,
  }));
});

const deleteDialog = ref(null);
const deleteTargetId = ref(null);

const openCharacterEditor = inject("openCharacterEditor");

const openDeleteDialog = (id) => {
  deleteTargetId.value = id;
  deleteDialog.value.showModal();
};

const closeDeleteDialog = () => {
  deleteTargetId.value = null;
  deleteDialog.value.close();
};

const confirmDelete = () => {
  savesStore.deleteCharacter(props.storyId, deleteTargetId.value);
  closeDeleteDialog();
};

const { start, cancel } = useHoldAction(
  (id) => openCharacterEditor(props.storyId, id, true), // Короткий клик -> Просмотр
  (id) => openCharacterEditor(props.storyId, id, false), // Удержание -> Редактирование
);
</script>

<template>
  <div class="max-w-2xl mx-auto w-full space-y-4 px-2">
    <div v-if="charactersArray.length > 0" class="space-y-3">
      <div
        v-for="char in charactersArray"
        :key="char.id"
        class="group flex items-center gap-3 bg-base-200 p-3 rounded-xl border border-base-content/5 justify-between transition hover:bg-base-300"
      >
        <div
          class="flex items-center gap-3 flex-1 cursor-pointer select-none min-w-0"
          @mousedown="start(char.id)"
          @mouseup="cancel(char.id)"
          @touchend="cancel(char.id)"
          @touchstart.prevent="start(char.id)"
        >
          <div
            :style="{
              backgroundColor: char.color ? `${char.color}66` : '#666666',
            }"
            class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-lg"
          >
            {{ char.name?.[0] || "?" }}
          </div>
          <div class="flex flex-col min-w-0">
            <h3 class="font-semibold truncate">
              {{ char.name || "Без имени" }}
            </h3>
            <p class="text-xs opacity-60">
              {{ char.age ? char.age + " лет" : "Возраст не указан" }}
              <span v-if="char.gender">· {{ char.gender }}</span>
            </p>
          </div>
        </div>
        <button
          class="btn btn-sm btn-error btn-soft btn-square shrink-0"
          @click.stop="openDeleteDialog(char.id)"
        >
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col justify-center items-center text-center py-16 gap-3 opacity-40"
    >
      <i class="ri-account-circle-2-line text-5xl"></i>
      <p class="text-sm font-medium">Персонажи еще не созданы</p>
    </div>

    <div
      class="card bg-base-200 shadow p-4 cursor-pointer hover:bg-base-300 transition flex flex-row items-center justify-center"
      @click="openCharacterEditor(props.storyId)"
    >
      <i class="ri-add-line text-2xl mr-2"></i>
      <span class="text-sm font-bold uppercase tracking-tight"
        >Добавить персонажа</span
      >
    </div>

    <dialog ref="deleteDialog" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold text-error flex items-center gap-2">
          <i class="ri-delete-bin-line"></i> Удалить персонажа?
        </h3>
        <p class="py-4 opacity-70">
          Это действие нельзя будет отменить. Вы уверены?
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closeDeleteDialog">
            Отмена
          </button>
          <button class="btn btn-error px-8" @click="confirmDelete">
            Удалить
          </button>
        </div>
      </div>
      <label class="modal-backdrop" @click="closeDeleteDialog">Close</label>
    </dialog>
  </div>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
