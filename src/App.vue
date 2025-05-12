<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <RouterView/>
</template>

<style>
/* 전체 화면 스타일 재설정 */
html, body {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  width: 100vw !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
}

@media (min-width: 1024px) {
  body {
    display: block !important;
    width: 100% !important;
    place-items: initial !important;
  }

  #app {
    display: block !important;
    grid-template-columns: none !important;
    width: 100vw !important;
    max-width: 100vw !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>