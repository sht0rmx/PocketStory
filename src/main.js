import "remixicon/fonts/remixicon.css";
import "./assets/main.css";

import { createApp, ref } from "vue";
import { createPinia } from "pinia";
import { useSavesStore } from "@/stores/saves.js";
import router from "@/router";
import App from "@/App.vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

//globals
export let storyId = ref(null);
export let characterId = ref(null);

export let backButton = ref(false);

export const currentTheme = ref("system");
const THEME_KEY = "theme";

export const applyTheme = (theme) => {
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dim"
        : "default"
      : theme;

  document.documentElement.setAttribute("data-theme", resolved);
};

export const setTheme = (theme) => {
  currentTheme.value = theme;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
};

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(pinia).use(router).mount("#app");

const saved = localStorage.getItem(THEME_KEY) || "system";
setTheme(saved);
useSavesStore();
