<script setup>
import Header from "@/components/ui/layout/Header.vue";
import StoriesGrid from "@/components/stories/StoryList.vue";
</script>

<template>
  <Header title="Pocket Story" />
  <div class="pt-12">
    <StoriesGrid />
  </div>
</template>
