<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>

<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh; display: flex; flex-direction: column">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a> All By Jaron </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  max-width: 1200px;
  padding: 1.5rem;
  flex-grow: 1;
  margin-left: auto;
  margin-right: auto;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  text-align: center;
}
</style>
