<script lang="ts" setup>
defineProps<{
  text: string;
  icon: string;
}>();
</script>

<template>
  <li class="rounded-lg">
    <button class="w-full flex items-center gap-3" icon="" text="">
      <div class="flex w-full items-center">
        <slot name="content">
          <div class="flex items-center gap-2">
            <i :class="icon" class="text-xl"></i>
            <span>{{ text }}</span>
          </div>
        </slot>

        <div class="flex-1 flex justify-end">
          <slot />
        </div>
      </div>
    </button>
  </li>
</template>
