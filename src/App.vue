<template>
  <!-- <router-view v-slot="{ Component }"> -->
    <!-- <keep-alive exclude="HomeView"> -->
      <!-- <component :is="Component" /> -->
    <!-- </keep-alive> -->
  <!-- </router-view> -->
  <router-view></router-view>
</template>
<script setup>

</script>
<style lang="scss">
[dv-bg]{
  cursor: pointer;
  &:hover {
    color: lightsalmon !important;
  }
}
</style>