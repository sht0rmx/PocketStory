<script setup>
import {ref} from "vue";
import Menu from "@/components/ui/menu/Menu.vue";
import MenuButton from "@/components/ui/menu/Button.vue";
import MenuContent from "@/components/ui/menu/Content.vue";
import MenuDropdown from "@/components/ui/menu/Dropdown.vue";
import {currentTheme, setTheme} from "@/main";
import {useSavesStore, validate} from "@/stores/saves";

const savesStore = useSavesStore();

const themes = [
  {id: "system", label: "Системная", icon: "ri-computer-line"},
  {id: "dim", label: "Темная", icon: "ri-moon-line"},
  {id: "silk", label: "Светлая", icon: "ri-sun-line"},
];

const isResetModalOpen = ref(false);
const isImportModalOpen = ref(false);
const rawJsonInput = ref("");
const jsonError = ref("");
const importStories = ref([]);

const prettifyJson = () => {
  try {
    const obj = JSON.parse(rawJsonInput.value);
    rawJsonInput.value = JSON.stringify(obj, null, 2);
    jsonError.value = "";
  } catch (e) {
    jsonError.value = "Ошибка синтаксиса: не удалось отформатировать";
  }
};

const exportToFile = () => {
  const dataStr = savesStore.exportSaves();

  if (!dataStr) return;
  if (dataStr.trim() === "{}") {
    alert("Нет данных для экспорта");
    return;
  }

  const blob = new Blob([dataStr], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const date = new Date().toISOString().split("T")[0];
  a.download = `pocketstory_backup_${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 250);
};

const handleProcessInput = () => {
  jsonError.value = "";
  if (!rawJsonInput.value.trim()) return;

  try {
    const parsed = JSON.parse(rawJsonInput.value);
    const dataToValidate = parsed.allStories || parsed;

    const validEntries = [];

    Object.entries(dataToValidate).forEach(([id, storyData]) => {
      if (validate(storyData)) {
        validEntries.push({
          id,
          oldId: id,
          ...storyData,
          selected: true,
        });
      } else {
        console.warn("Ошибка валидации для истории:", id, validate.errors);
      }
    });

    if (validEntries.length === 0) {
      jsonError.value =
        "JSON корректен, но истории не прошли валидацию или пусты";
      return;
    }

    importStories.value = validEntries;
    isImportModalOpen.value = true;
  } catch (e) {
    console.error(e);
    jsonError.value = "Ошибка синтаксиса JSON: проверьте запятые и скобки";
  }
};

const onFileSelected = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  rawJsonInput.value = await file.text();
  handleProcessInput();
};

const applyImport = () => {
  const selectedStories = importStories.value.filter((s) => s.selected);

  if (selectedStories.length === 0) {
    alert("Выберите хотя бы одну историю для импорта");
    return;
  }

  selectedStories.forEach((story) => {
    const {oldId, selected, id, ...storyData} = story;
    console.log(storyData);
    savesStore.importStory(storyData);
  });

  isImportModalOpen.value = false;
  rawJsonInput.value = "";
  importStories.value = [];
};
</script>

<template>
  <Menu>
    <MenuDropdown>
      <MenuButton
        icon="ri-palette-line"
        text="Тема оформления"
        class="pl-1"
      >
        <span class="text-accent font-semibold uppercase">
          {{ themes.find((t) => t.id === currentTheme)?.label }}
        </span>
      </MenuButton>
      <MenuContent>
        <li class="flex flex-col gap-1">
          <button
            v-for="theme in themes"
            :key="theme.id"
            @click="setTheme(theme.id)"
            class="flex justify-between items-center py-2 px-4 rounded-lg"
            :class="
              currentTheme === theme.id
                ? 'bg-accent text-accent-content'
                : 'hover:bg-base-200'
            "
          >
            <div class="flex items-center gap-2">
              <i :class="theme.icon"/>
              <span class="font-medium">{{ theme.label }}</span>
            </div>
            <i v-if="currentTheme === theme.id" class="ri-check-line"/>
          </button>
        </li>
      </MenuContent>
    </MenuDropdown>
  </Menu>

  <Menu>
    <MenuButton
      class="pl-1"
      icon="ri-download-2-line"
      text="Экспорт данных"
      @click="exportToFile"
    />

    <div
      class="collapse collapse-arrow rounded-none first:rounded-t-2xl last:rounded-b-2xl border-none"
    >
      <input type="checkbox" class="peer"/>

      <div
        class="collapse-title flex items-center gap-3 text-sm font-medium min-h-12"
      >
        <i class="ri-code-box-line text-xl"></i>
        <span>Импорт данных</span>
      </div>

      <div class="collapse-content space-y-4">
        <div class="relative pt-2">
          <textarea
            v-model="rawJsonInput"
            class="textarea textarea-bordered textarea-ghost w-full h-48 font-mono leading-tight bg-base-300 text-xs"
            placeholder="Вставьте JSON данные историй..."
          ></textarea>
          <button
            v-if="rawJsonInput"
            class="btn btn-xs btn-ghost absolute top-4 right-2"
            @click="prettifyJson"
          >
            <i class="ri-magic-line"></i> Формат
          </button>
        </div>

        <div
          v-if="jsonError"
          class="alert alert-error text-xs py-2 shadow-sm"
        >
          <i class="ri-error-warning-line"></i> {{ jsonError }}
        </div>

        <div class="grid grid-cols-2 gap-2 pb-2">
          <button
            :disabled="!rawJsonInput"
            class="btn btn-primary btn-sm"
            @click="handleProcessInput"
          >
            Импортировать
          </button>
          <label class="btn btn-outline btn-sm">
            <i class="ri-file-upload-line"></i> Файл
            <input
              accept=".json"
              class="hidden"
              type="file"
              @change="onFileSelected"
            />
          </label>
        </div>
      </div>
    </div>

    <MenuButton
      class="bg-error text-error-content pl-1"
      icon="ri-delete-bin-7-line"
      text="Сбросить всё"
      @click="isResetModalOpen = true"
    />
  </Menu>

  <input v-model="isImportModalOpen" class="modal-toggle" type="checkbox"/>
  <div class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
        <i class="ri-download-cloud-line text-primary"></i> Обнаружены истории
      </h3>
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <label
          v-for="story in importStories"
          :key="story.id"
          class="flex items-center gap-3 p-4 bg-base-200 rounded-2xl cursor-pointer hover:bg-base-300 transition-colors"
        >
          <input
            v-model="story.selected"
            class="checkbox checkbox-primary"
            type="checkbox"
          />
          <div class="flex-1">
            <p class="font-bold text-sm">{{ story.name }}</p>
            <p class="text-[10px] opacity-50">
              {{ Object.keys(story.scenes || {}).length }} сцен ·
              {{ Object.keys(story.characters || {}).length }} перс.
            </p>
          </div>
        </label>
      </div>
      <div class="modal-action grid grid-cols-2 gap-2">
        <button class="btn btn-ghost" @click="isImportModalOpen = false">
          Отмена
        </button>
        <button class="btn btn-primary" @click="applyImport">
          Импортировать
        </button>
      </div>
    </div>
  </div>

  <input v-model="isResetModalOpen" class="modal-toggle" type="checkbox"/>
  <div class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg text-error">Полное удаление данных</h3>
      <p class="py-4 opacity-70 text-sm">
        Вы собираетесь удалить все истории и персонажей. Это действие невозможно
        отменить. Вы сделали экспорт важных данных?
      </p>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="isResetModalOpen = false">
          Назад
        </button>
        <button
          class="btn btn-error px-8"
          @click="
          () => {
            savesStore.clearState();
            isResetModalOpen = false;
          }
        "
        >
          Да, удалить всё
        </button>
      </div>
    </div>
  </div>
</template>

