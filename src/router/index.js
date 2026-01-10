import { createRouter, createWebHistory } from "vue-router";

import StoriesView from "@/pages/StoriesView.vue";
import SettingsView from "@/pages/SettingsView.vue";

import StoryView from "@/pages/story/StoryView.vue";
import StoryReaderView from "@/pages/story/StoryReaderView.vue";

import NotFound from "@/pages/NotFound.vue";
import { backButton } from "@/main.js";

const routes = [
  { path: "/", redirect: "/stories" },
  { path: "/stories", component: StoriesView },
  { path: "/settings", component: SettingsView },
  {
    path: "/story/:storyId",
    component: StoryView,
    props: true,
  },
  {
    path: "/story/:storyId/chat",
    component: StoryReaderView,
    meta: { hideDock: true, hidePadding: true },
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  backButton.value = to.path.split("/").length > 2;
});

export default router;
