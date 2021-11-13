<template>
  <div id="app">
    <router-view />
    <a-layout-footer style="background: #fff; padding-bottom: 0">
      Copyright © 2021-2021 hx | MIT License
    </a-layout-footer>
  </div>
</template>

<script lang="ts">
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";

export default {
  data() {
    return {
      zh_CN,
    };
  },
};
</script>

<style lang="stylus">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background-color: #fff;
}

.a-layout-footer {
  position: absolute;
}
</style>
