<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useSavesStore } from "@/stores/saves.js";

const props = defineProps({
  storyId: { type: String, required: true },
  sceneId: { type: String, required: true },
});

const emit = defineEmits(["send"]);
const draftText = ref("");
const inputRef = ref(null);
const hasText = computed(() => draftText.value.trim().length > 0);
const isSystemMode = ref(false);

const savesStore = useSavesStore();
const story = computed(() => savesStore.getStory(props.storyId));
const scene = computed(() => story.value?.scenes?.[props.sceneId]);

const sceneCharacters = computed(() => {
  if (!scene.value || !story.value) return [];
  return scene.value.characters
    .map((id) => ({ id, ...story.value.characters[id] }))
    .filter((c) => c.name);
});

const activeCharacterId = ref(null);

watch(
  sceneCharacters,
  (chars) => {
    if (!activeCharacterId.value && chars.length)
      activeCharacterId.value = chars[0].id;
  },
  { immediate: true },
);

const submit = () => {
  if (!draftText.value.trim()) return;

  emit("send", {
    text: draftText.value,
    characterId: isSystemMode.value ? null : activeCharacterId.value,
  });

  draftText.value = "";
  nextTick(() => inputRef.value?.focus());
};

const selectCharacter = (id) => {
  isSystemMode.value = false;
  activeCharacterId.value = id;
};

const toggleSystemMode = () => {
  isSystemMode.value = !isSystemMode.value;
};

const MAX_ROWS = 5;
const LINE_HEIGHT = 24;

const resizeTextarea = () => {
  const el = inputRef.value;
  if (!el) return;

  el.style.height = "auto";

  const maxHeight = LINE_HEIGHT * MAX_ROWS;
  el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
};

watch(draftText, () => nextTick(resizeTextarea));
</script>

<template>
  <div
    class="fixed w-full flex left-0 bottom-0 flex-col p-3 bg-base-100/80 backdrop-blur-md border-t border-base-300 rounded-t-3xl shadow-2xl z-20"
  >
    <div class="w-full flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1">
      <button
        :class="isSystemMode ? 'btn-secondary' : 'btn-ghost opacity-60'"
        class="btn btn-xs rounded-full border-dashed flex items-center justify-center"
        @mousedown.prevent="toggleSystemMode"
      >
        <i class="ri-settings-line"></i>
      </button>

      <div class="divider divider-horizontal mx-0 w-1"></div>

      <button
        v-for="char in sceneCharacters"
        :key="char.id"
        :class="
          !isSystemMode && activeCharacterId === char.id
            ? 'btn-primary px-4'
            : 'btn-ghost opacity-60'
        "
        class="btn btn-xs rounded-full transition-all"
        @mousedown.prevent="selectCharacter(char.id)"
      >
        <div
          v-if="!isSystemMode && activeCharacterId === char.id"
          class="w-2 h-2 rounded-full bg-white mr-1 animate-pulse"
        ></div>
        {{ char.name }}
      </button>
    </div>

    <div class="flex items-end gap-2">
      <div class="flex-1 relative">
        <textarea
          ref="inputRef"
          v-model="draftText"
          :class="{ 'bg-secondary/5': isSystemMode }"
          :placeholder="
            isSystemMode
              ? 'Напишите что-нибудь от имени автора...'
              : 'Напишите что-нибудь...'
          "
          class="w-full resize-none rounded-2xl bg-base-100 px-4 py-2 focus:outline-none transition-all overflow-hidden"
          rows="1"
          @input="resizeTextarea"
          @keydown.enter.exact.prevent="submit"
          @keydown.ctrl.enter.stop
        ></textarea>
      </div>
      <transition
        enter-active-class="transition-all duration-150"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-100"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <button
          v-if="hasText"
          :class="isSystemMode ? 'btn-secondary' : 'btn-primary'"
          class="btn btn-square shadow-lg"
          @click="submit"
        >
          <i class="ri-send-plane-2-fill text-xl"></i>
        </button>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
