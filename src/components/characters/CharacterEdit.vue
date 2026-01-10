<script setup>
import { reactive, ref } from "vue";
import { useSavesStore } from "@/stores/saves.js";

const savesStore = useSavesStore();
const emit = defineEmits(["created", "updated", "closed"]);

let currentStoryId = "";
let currentCharacterId = "";

const lockPage = ref(false);
const editState = ref(false);
const viewMode = ref(false);

const characterDraft = reactive({
  name: "",
  age: "",
  gender: "М",
  bio: "",
  color: "#9CA3AF",
});

const colors = [
  "#F87171",
  "#FBBF24",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
  "#FACC15",
  "#9CA3AF",
];

const resetDraft = () => {
  Object.assign(characterDraft, {
    name: "",
    age: "",
    gender: "М",
    bio: "",
    color: "#9CA3AF",
  });
  editState.value = false;
  viewMode.value = false;
};

const loadCharacter = () => {
  if (!currentStoryId || !currentCharacterId) return;
  const character = savesStore.getCharacter(currentStoryId, currentCharacterId);
  if (!character) return;
  Object.assign(characterDraft, character);
  editState.value = true;
};

const showModal = (storyId, characterId = null, viewer = null) => {
  resetDraft();

  currentStoryId = storyId;
  currentCharacterId = characterId;

  if (characterId) loadCharacter();

  viewMode.value = viewer;
  lockPage.value = true;
};

const closeModal = () => {
  lockPage.value = false;
  emit("closed");
};

const saveCharacter = () => {
  if (!characterDraft.name.trim() || !characterDraft.age) return;

  if (!editState.value) {
    let id = savesStore.createCharacter(currentStoryId, characterDraft);
    emit("created", id);
  } else {
    savesStore.updateCharacter(
      currentStoryId,
      currentCharacterId,
      characterDraft,
    );
    emit("updated", currentCharacterId);
  }

  closeModal();
};

defineExpose({ showModal, closeModal });
</script>

<template>
  <div :class="{ 'modal-open': lockPage }" class="modal" role="dialog">
    <div class="modal-box max-h-[90vh] flex flex-col z-1000">
      <h3 class="text-lg font-bold mb-2">
        {{
          editState && !viewMode
            ? "Редактирование персонажа"
            : viewMode
              ? "Персонаж"
              : "Создание персонажа"
        }}
      </h3>

      <div class="flex-1 overflow-y-auto space-y-3 px-2">
        <div v-if="viewMode" class="flex items-center gap-3">
          <div
            :style="{ backgroundColor: characterDraft.color }"
            class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          >
            {{ characterDraft.name?.[0] }}
          </div>
          <div>
            <div class="font-semibold">{{ characterDraft.name }}</div>
            <div class="text-xs opacity-50">
              {{ characterDraft.age }} лет, {{ characterDraft.gender }}
            </div>
          </div>
        </div>

        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Имя</legend>
          <input
            v-model="characterDraft.name"
            class="input w-full"
            placeholder="Очень интересное имя"
          />
        </fieldset>

        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Возраст</legend>
          <input
            v-model="characterDraft.age"
            class="input w-full"
            placeholder="24"
            type="number"
          />
        </fieldset>

        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Пол</legend>
          <div class="join">
            <input
              v-model="characterDraft.gender"
              aria-label="Мужчина"
              class="join-item btn"
              type="radio"
              value="М"
            />
            <input
              v-model="characterDraft.gender"
              aria-label="Женщина"
              class="join-item btn"
              type="radio"
              value="Ж"
            />
          </div>
        </fieldset>

        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Биография</legend>
          <textarea
            v-model="characterDraft.bio"
            class="textarea w-full"
            placeholder="взаимоотношения, характер и еще много чего интересного..."
          />
        </fieldset>

        <div v-if="viewMode" class="flex flex-col gap-1">
          <p
            class="whitespace-pre-line opacity-70 text-sm leading-relaxed italic border-l-2 border-primary/20 pl-4"
          >
            {{ characterDraft.bio || "Биография отсутствует" }}
          </p>
        </div>

        <fieldset v-if="!viewMode" class="fieldset">
          <legend class="fieldset-legend">Цвет</legend>

          <div
            class="grid grid-cols-4 overflow-hidden rounded-lg border border-base-300 w-40"
          >
            <button
              v-for="(color, index) in colors"
              :key="color"
              :class="{
                'border-r border-base-300': (index + 1) % 4 !== 0,
                'border-b border-base-300': index < colors.length - 4,
                'ring-2 ring-primary ring-inset':
                  characterDraft.color === color,
              }"
              :style="{ backgroundColor: color }"
              class="btn p-0 border-0 rounded-none"
              type="button"
              @click="characterDraft.color = color"
            />
          </div>
        </fieldset>

        <div class="pt-4 flex gap-2">
          <button
            v-if="!viewMode"
            class="btn btn-primary flex-1"
            @click="saveCharacter"
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
