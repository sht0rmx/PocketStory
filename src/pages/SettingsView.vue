<script setup>
import Header from "@/components/ui/layout/Header.vue";
import SettingsDataTab from "@/pages/settings/SettingsDataTab.vue";
import SettingsSchemaTab from "@/pages/settings/SettingsSchemaTab.vue";
import SettingsAboutTab from "@/pages/settings/SettingsAboutTab.vue";
</script>

<template>
  <Header title="Настройки"/>

  <div class="tabs tabs-border pt-10 flex justify-center">
    <input
      aria-label="Данные"
      checked="checked"
      class="tab"
      name="settings_tab"
      type="radio"
    />
    <div class="tab-content space-y-4">
      <SettingsDataTab/>
    </div>

    <input aria-label="Схема" class="tab" name="settings_tab" type="radio"/>
    <div class="tab-content">
      <SettingsSchemaTab/>
    </div>

    <input
      aria-label="О приложении"
      class="tab"
      name="settings_tab"
      type="radio"
    />
    <div class="tab-content">
      <SettingsAboutTab/>
    </div>
  </div>
</template>
