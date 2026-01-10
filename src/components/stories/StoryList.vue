<script setup>
import { computed, inject, ref } from "vue";
import { useSavesStore } from "@/stores/saves.js";
import { useRouter } from "vue-router";
import { useHoldAction } from "@/lib/HoldAction.js";

const router = useRouter();
const savesStore = useSavesStore();
const stories = computed(() => savesStore.storiesList);

const { start, cancel } = useHoldAction(
  (id) => router.push(`/story/${id}`),
  (id) => {
    storyToDelete.value = id;
    isDeleteModalOpen.value = true;
  },
);

const storyToDelete = ref(null);
const isDeleteModalOpen = ref(false);

const openStoryEditor = inject("openStoryEditor");

const confirmDelete = () => {
  if (storyToDelete.value) {
    savesStore.deleteStory(storyToDelete.value);
  }
  storyToDelete.value = null;
  isDeleteModalOpen.value = false;
};

const cancelDelete = () => {
  storyToDelete.value = null;
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div v-if="stories.length === 0" class="flex justify-center py-20">
    <div class="card card-bordered bg-base-100 w-96 shadow-lg">
      <div class="card-body text-center">
        <h2 class="text-xl card-title justify-center font-semibold">
          Нет историй
        </h2>
        <p class="text-gray-500">
          У вас ещё нет историй, но вы можете создать новую, нажав на кнопку
          ниже или выбрав соответствующий пункт в нижнем меню
        </p>
        <div class="card-actions justify-center mt-4">
          <button class="btn btn-primary" @click="openStoryEditor()">
            Создать историю
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    class="grid grid-cols-2 lg:grid-cols-8 sm:grid-cols-2 gap-6 justify-center"
  >
    <div
      v-for="story in stories"
      :key="story.id"
      class="overflow-hidden card bg-base-200 shadow cursor-pointer hover:shadow-lg transition"
      @mousedown="start(story.id)"
      @mouseup="cancel(story.id)"
      @touchend="cancel(story.id)"
      @touchstart.prevent="start(story.id)"
    >
      <div
        class="flex items-center justify-center h-32 bg-primary/20 text-white text-4xl font-bold"
      >
        {{ story.name[0].toUpperCase() }}
      </div>

      <div class="card-body">
        <h2 class="card-title text-sm">{{ story.name }}</h2>
        <p class="text-sm text-gray-500">
          {{
            savesStore.getStory(story.id)?.scenes
              ? Object.keys(savesStore.getStory(story.id).scenes).length
              : 0
          }}
          глав
        </p>
      </div>
    </div>
  </div>
  <input v-model="isDeleteModalOpen" class="modal-toggle" type="checkbox" />
  <div class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Подтверждение удаления</h3>
      <p class="py-4">
        Вы действительно хотите удалить историю. Это действие нельзя будет
        отменить.
      </p>
      <div class="modal-action">
        <button class="btn" @click="cancelDelete">Отмена</button>
        <button class="btn btn-error" @click="confirmDelete">Удалить</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
