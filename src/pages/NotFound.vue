<template>
  <div class="h-full flex items-center justify-center">
    <div class="flex flex-col items-center justify-center text-center gap-3">
      <h1 class="text-7xl font-bold text-error">404</h1>
      <div class="mb-3">
        <p class="text-xl">Ой... Страница не найдена</p>
        <p class="text-sm max-w-xs opacity-70">
          Страница, к которой вы пытаетесь получить доступ, не существует.
        </p>
      </div>
      <button class="btn btn-soft btn-primary" @click="$router.push('/')">
        <i class="ri-arrow-left-line" />
        На главную
      </button>
    </div>
  </div>
</template>
