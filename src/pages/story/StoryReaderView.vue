<script setup>
import { computed, inject, nextTick, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useSavesStore } from "@/stores/saves.js";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import InputBar from "@/components/chat/InputBar.vue";
import Header from "@/components/ui/layout/Header.vue";
import router from "@/router/index.js";
import MenuButton from "@/components/ui/menu/Button.vue";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal.vue";

const props = defineProps({
  storyId: { type: String, required: true },
});

const route = useRoute();
const savesStore = useSavesStore();
const setChatMode = inject("setChatMode");
const scrollContainer = ref(null);

const story = computed(() => savesStore.getStory(props.storyId));

const currentSceneId = computed(() => route.query.scene || "");
const selectScene = (sceneId) => {
  router.replace({ query: { ...route.query, scene: sceneId } });
};

const fullChatFeed = computed(() => {
  if (!story.value?.scenes) return [];
  const feed = [];

  Object.entries(story.value.scenes).forEach(([sId, scene]) => {
    feed.push({
      type: "scene-header",
      id: `header-${sId}`,
      sceneId: sId,
      name: scene.title,
      about: scene.description,
      chars: scene.characters
        .map((id) => story.value.characters[id]?.name)
        .filter(Boolean),
    });

    if (scene.messages) {
      const lines = Object.entries(scene.messages)
        .map(([lId, data]) => ({
          type: "message",
          id: lId,
          sceneId: sId,
          ...data,
        }))
        .sort((a, b) => a.createdAt - b.createdAt);

      feed.push(...lines);
    }
  });
  return feed;
});

const scrollToBottom = async (behavior = "smooth") => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior,
    });
  }
};

watch(fullChatFeed, () => scrollToBottom("smooth"), { deep: true });

onMounted(() => {
  setChatMode(true);
  scrollToBottom("auto");
});

const handleSendMessage = (data) => {
  if (!currentSceneId.value) {
    console.error("Нет активной сцены для сохранения!");
    return;
  }

  savesStore.addMessage(props.storyId, currentSceneId.value, {
    by: data.characterId,
    text: data.text,
  });
};

const editingLine = ref(null);
const editModalRef = ref(null);

const lineToDeleteId = ref(null);
const isDeleteModalOpen = ref(false);

const handleEditClick = (line, sid) => {
  editingLine.value = { ...line, sceneId: sid };
  editModalRef.value.checked = true;
};

const saveEdit = () => {
  if (!editingLine.value?.text.trim()) return;
  savesStore.updateMessage(
    props.storyId,
    editingLine.value.sceneId,
    editingLine.value.id,
    { text: editingLine.value.text },
  );
  closeEdit();
};

const closeEdit = () => {
  editModalRef.value.checked = false;
  editingLine.value = null;
};
const handleDeleteClick = (messageId) => {
  lineToDeleteId.value = messageId;
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (lineToDeleteId.value) {
    savesStore.deleteMessage(
      props.storyId,
      currentSceneId.value,
      lineToDeleteId.value,
    );
    closeDelete();
  }
};

const closeDelete = () => {
  isDeleteModalOpen.value = false;
  lineToDeleteId.value = null;
};
const openSceneEditor = inject("openSceneEditor");
const openCharacterEditor = inject("openCharacterEditor");

const handleSceneClick = (header) => {
  if (currentSceneId.value === header.sceneId) {
    openSceneEditor(props.storyId, header.sceneId, true);
  } else {
    selectScene(header.sceneId);
  }
};

onMounted(() => {
  setChatMode(true);
});

onBeforeRouteLeave(() => {
  setChatMode(false);
});
</script>

<template>
  <Header :title="story?.name || 'Чат'">
    <div class="dropdown dropdown-end mr-3">
      <div class="btn btn-square btn-ghost mr-3" role="button" tabindex="0">
        <i class="ri-more-fill text-xl"></i>
      </div>
      <ul
        class="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-xl gap-2 mr-3"
      >
        <MenuButton
          icon="ri-user-add-line"
          text="Новый персонаж"
          @click="openCharacterEditor(props.storyId)"
        />
        <MenuButton
          icon="ri-edit-box-line"
          text="Изменить сцену"
          @click="openSceneEditor(props.storyId, currentSceneId)"
        />
        <MenuButton
          icon="ri-function-add-line"
          text="Создать сцену"
          @click="openSceneEditor(props.storyId)"
        />
        <div class="divider my-0"></div>
        <MenuButton
          icon="ri-arrow-left-line"
          text="Выйти из чата"
          @click="$router.push(`/story/${props.storyId}`)"
        />
      </ul>
    </div>
  </Header>

  <div class="flex flex-col h-full w-full overflow-hidden bg-base-300 pt-10">
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto px-4 py-2 space-y-1 scroll-smooth"
    >
      <div v-for="item in fullChatFeed" :key="item.id">
        <div
          v-if="item.type === 'scene-header'"
          class="flex flex-col items-center py-5 cursor-pointer group active:scale-95 transition-all"
          @click="handleSceneClick(item)"
        >
          <div class="flex flex-row gap-2 items-center">
            <div
              v-if="currentSceneId === item.sceneId"
              class="status status-primary tracking-widest animate-pulse"
            ></div>

            <div
              :class="
                currentSceneId === item.sceneId
                  ? 'text-primary'
                  : 'opacity-20 group-hover:opacity-50'
              "
              class="text-lg font-black tracking-tighter transition-colors select-none"
            >
              {{ item.name }}
            </div>
          </div>

          <p
            v-if="item.about"
            class="mt-2 text-xs text-center opacity-40 italic max-w-[75%] line-clamp-3 select-none"
          >
            {{ item.about }}
          </p>

          <div class="mt-2 flex gap-1.5 opacity-30">
            <span
              v-for="cName in item.chars"
              :key="cName"
              class="text-[9px] border border-current px-1.5 py-0.5 rounded uppercase font-bold select-none"
            >
              {{ cName }}
            </span>
          </div>
        </div>

        <ChatMessage
          v-else
          :character="story.characters[item.by]"
          :is-system="!item.by"
          :line="item"
          :sceneId="item.sceneId"
          @delete="handleDeleteClick"
          @edit="handleEditClick"
        />
      </div>

      <div class="h-32"></div>
    </div>

    <input
      id="edit-modal"
      ref="editModalRef"
      class="modal-toggle"
      type="checkbox"
    />

    <div class="modal" role="dialog">
      <div class="modal-box bg-base-200 shadow-2xl border border-base-100">
        <h3 class="text-sm font-bold opacity-50 uppercase mb-4">
          Редактировать сообщение
        </h3>

        <textarea
          v-if="editingLine"
          v-model="editingLine.text"
          class="textarea textarea-bordered w-full h-32 focus:outline-none"
          placeholder="Текст сообщения..."
        ></textarea>

        <div class="modal-action">
          <button class="btn btn-ghost btn-sm" @click="closeEdit">
            Отмена
          </button>
          <button class="btn btn-primary btn-sm px-8" @click="saveEdit">
            Сохранить
          </button>
        </div>
      </div>
      <label class="modal-backdrop" @click="closeEdit">Close</label>
    </div>

    <ConfirmDeleteModal
      v-model="isDeleteModalOpen"
      title="Удалить сообщение?"
      description="Это действие нельзя будет отменить. Вы уверены?"
      @confirm="confirmDelete"
      @cancel="closeDelete"
    />
    <InputBar
      :scene-id="currentSceneId"
      :story-id="props.storyId"
      @send="handleSendMessage"
    />
  </div>
</template>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

.overflow-y-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.select-none {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>
