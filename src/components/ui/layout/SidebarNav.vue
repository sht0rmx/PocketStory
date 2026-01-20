<script setup>
  import { inject } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import { appVersion } from "@/main.js"


  const route = useRoute()
  const router = useRouter()
  
  const navItems = [
    { label: "Создать", icon: "ri-add-large-fill", action: "newStory" },
    { label: "Коллекция", icon: "ri-stack-line", to: "/stories" },
    { label: "Настройки", icon: "ri-settings-3-line", to: "/settings" },
  ]
  
  const openStoryEditor = inject("openStoryEditor")
  
  const isActive = (to) => {
    if (!to) return false
    if (route.path === "/") return route.path === to
    return route.path === to || route.path.startsWith(to)
  }
  
  const buttonClass = (item) => {
    if (item.action === "newStory") {
      return "btn btn-accent justify-center mt-2 mb-3 btn-soft"
    }
  
    return isActive(item.to)
      ? "bg-primary text-primary-content"
      : "hover:bg-base-200"
  }
  
  const onClick = (item) => {
    if (item.action === "newStory") {
      openStoryEditor()
      return
    }
  
    router.push(item.to)
  }
  </script>
  

  <template>
    <nav class="flex flex-col h-full w-full py-6 px-4 gap-2 justify-between">
      <div class="flex flex-col gap-1">
        <div class="px-2 pb-6 flex items-center gap-3">
          <img
            src="/favicon.ico"
            alt="PocketStory"
            class="w-10 h-10 rounded-2xl bg-base-300"
          />
          <div>
            <h1 class="text-xl font-black tracking-tight italic">PocketStory</h1>
            <p class="text-xs opacity-50 mt-1">Редактор историй</p>
          </div>
        </div>
  
        <div class="w-full flex flex-col gap-1">
          <button
            v-for="item in navItems"
            :key="item.label"
            class="flex items-center min-w-full gap-3 px-3 py-2 text-sm transition-colors rounded-xl"
            :class="buttonClass(item)"
            @click="onClick(item)"
          >
            <i :class="[item.icon, 'text-lg']" />
  
            <span
              v-if="item.to"
              class="font-medium"
            >
              {{ item.label }}
            </span>
  
            <span
              v-else
              class="font-semibold uppercase text-xs"
            >
              {{ item.label }}
            </span>
          </button>
        </div>
      </div>
  
      <div class="pt-4 text-[10px] opacity-40 w-full shrink-0">
        <p>{{ appVersion }}</p>
      </div>
    </nav>
  </template>
  