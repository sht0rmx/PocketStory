<script setup>
import { appVersion } from "@/main.js"
</script>

<template>
  <div class="p-6 flex flex-col items-center text-center gap-8">
    <div
      class="mt-4 w-24 h-24 bg-primary rounded-4xl flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 transition-transform hover:rotate-0 duration-500">
      <i class="ri-quill-pen-line text-5xl text-primary-content -rotate-3"></i>
    </div>

    <div class="space-y-1">
      <h1 class="text-3xl font-black tracking-tighter italic">PocketStory</h1>
      <p class="badge badge-outline badge-sm font-mono opacity-50">
        {{ appVersion }}
      </p>
    </div>

    <div
      class="card bg-base-200 p-6 w-full max-w-md text-sm leading-relaxed text-left space-y-4 border border-base-content/5 shadow-inner">
      <p>
        <strong class="text-primary">PocketStory</strong> — это оффлайн-редактор для сюжетов текстовых
        ролевых игр. Ваши истории никогда не покинут это устройство, пока вы
        сами не решите их экспортировать.
      </p>
      <div class="divider opacity-10 my-0"></div>
      <p class="opacity-70 text-xs">
        Разработано с использованием Vue 3, DaisyUI, RemixIcons. Все данные
        хранятся в <span class="font-mono font-semibold">LocalStorage</span> вашего браузера.
      </p>
    </div>

    <div class="flex flex-col gap-2 w-full max-w-md">
      <a
        class="btn btn-ghost justify-between"
        href="https://github.com/sht0rmx/PocketStory"
        target="_blank">
        <span class="flex items-center gap-3">
          <i class="ri-github-line text-2xl"></i>
          <span class="text-xs tracking-widest">Исходный код</span>
        </span>
        <i class="ri-arrow-right-s-line opacity-30"></i>
      </a>
    </div>
  </div>
</template>

