<script setup>
import {computed} from "vue";
import storySchema from "@/stores/shema.json";

const schemaLines = computed(() => {
  return JSON.stringify(storySchema, null, 2).split("\n");
});

const copySchema = () => {
  navigator.clipboard.writeText(JSON.stringify(storySchema, null, 2));
  alert("Схема скопирована в буфер обмена");
};
</script>

<template>
  <div class="flex items-center justify-between px-2 mb-2">
    <span class="text-xs font-bold opacity-50 uppercase tracking-widest"
    >JSON Schema v2.0</span
    >
    <button class="btn btn-xs btn-soft" @click="copySchema">
      <i class="ri-file-copy-line"></i> Копировать
    </button>
  </div>
  <div
    class="mockup-code bg-base-200 max-h-[65vh] overflow-y-auto custom-scrollbar text-sm"
  >
    <pre
      v-for="(line, index) in schemaLines"
      :key="index"
      :data-prefix="index + 1"
    ><code>{{ line }}</code></pre>
  </div>
  <p class="text-xs opacity-50 pt-5 italic text-center">
    Используйте эту схему для подготовки внешних файлов к импорту.
  </p>
</template>

