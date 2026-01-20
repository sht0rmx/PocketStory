<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Удалить?",
  },
  description: {
    type: String,
    default: "Это действие нельзя будет отменить. Вы уверены?",
  },
  confirmText: {
    type: String,
    default: "Удалить",
  },
  cancelText: {
    type: String,
    default: "Отмена",
  },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const close = () => {
  emit("update:modelValue", false);
  emit("cancel");
};

const handleConfirm = () => {
  emit("confirm");
};
</script>

<template>
  <input
    class="modal-toggle"
    type="checkbox"
    :checked="modelValue"
    @change="emit('update:modelValue', !modelValue)"
  />
  <div class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold text-error flex items-center gap-2">
        <i class="ri-delete-bin-line"></i> {{ title }}
      </h3>
      <p class="py-4 opacity-70">
        {{ description }}
      </p>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="close">
          {{ cancelText }}
        </button>
        <button class="btn btn-error px-8" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
    <div class="modal-backdrop" @click="close"></div>
  </div>
</template>

