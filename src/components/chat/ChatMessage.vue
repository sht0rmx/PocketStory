<script setup>
import { useHoldAction } from "@/lib/HoldAction.js";

const props = defineProps({
  line: Object,
  character: Object,
  isSystem: Boolean,
  sceneId: String,
});

const emit = defineEmits(["edit", "delete"]);

const { start, cancel } = useHoldAction(
  () => emit("edit", props.line, props.sceneId),
  () => emit("delete", props.line.id),
);
</script>

<template>
  <div
    v-if="isSystem"
    class="flex justify-center w-full my-1 cursor-pointer active:opacity-50 transition-opacity"
    @mousedown="start"
    @mouseup="cancel"
    @touchend="cancel"
    @touchstart.prevent="start"
  >
    <div
      class="text-base-content/40 px-3 py-0.5 text-[14px] italic text-center max-w-[90%] select-none"
    >
      {{ line.text }}
    </div>
  </div>

  <div v-else class="chat chat-start">
    <div class="chat-image avatar">
      <div
        :style="{ backgroundColor: character?.color || '#555' }"
        class="w-8 h-8 rounded-full shadow-sm"
      >
        <span
          class="text-white text-[10px] font-bold flex items-center justify-center h-full capitalize"
        >
          {{ character?.name?.[0] }}
        </span>
      </div>
    </div>

    <div
      class="chat-header opacity-40 text-[10px] ml-1 mb-0.5 flex gap-1 items-baseline"
    >
      <span class="font-bold">{{ character?.name }}</span>
    </div>

    <div
      class="chat-bubble bg-base-100 text-[14px] min-h-0 cursor-pointer active:scale-[0.98] transition-transform select-none"
      @mousedown="start"
      @mouseup="cancel"
      @touchend="cancel"
      @touchstart.prevent="start"
    >
      {{ line.text }}
    </div>
  </div>
</template>

<style scoped>
.select-none {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>
