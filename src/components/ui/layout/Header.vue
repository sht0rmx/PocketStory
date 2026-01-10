<script lang="ts" setup>
import { backButton } from "@/main";

defineProps({
  title: String,
});
</script>

<template>
  <div
    class="fixed items-center justify-between flex w-full top-0 left-0 z-50 py-2 bg-base-300/60 backdrop-blur-md transition-all"
  >
    <div class="flex space-x-2 gap-2 px-4 py-2">
      <button
        v-if="backButton && $route.path !== '/story/new'"
        class="hover:opacity-70"
        @click="$router.back()"
      >
        <i class="ri-arrow-left-line text-2xl" />
      </button>
      <slot name="content">
        <h1
          class="text-2xl font-semibold flex-1 text-center truncate max-w-[70vw]"
        >
          {{ title }}
        </h1>
      </slot>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
