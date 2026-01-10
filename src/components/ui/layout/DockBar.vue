<script setup>
import { inject } from "vue";

const navItems = [
  { label: "Создать", icon: "ri-add-large-fill", action: "newStory" },
  { label: "Коллекция", icon: "ri-stack-line", to: "/stories" },
  { label: "Настройки", icon: "ri-settings-3-line", to: "/settings" },
];

const openStoryEditor = inject("openStoryEditor");
</script>

<template>
  <div id="navbar" class="dock dock-sm">
    <button
      v-for="i in navItems"
      :key="i.label"
      :class="{
        'dock-active text-primary': i.to
          ? $route.path !== '/'
            ? $route.path.includes(i.to)
            : $route.path === i.to
          : false,
      }"
      @click="i.action === 'newStory' ? openStoryEditor() : $router.push(i.to)"
    >
      <i :class="[i.icon, 'text-xl leading-none']"></i>
      <span class="dock-label">{{ i.label }}</span>
    </button>
  </div>
</template>

<style scoped>
#navbar {
  bottom: 3px;
}

#navbar::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 3px;
  background-color: inherit;
}
</style>
