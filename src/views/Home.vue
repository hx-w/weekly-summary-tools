<template>
  <a-space direction="vertical" size="large">
    <img alt="Vue logo" :src="logo_path" style="margin-top: 30px" />
    <h1>
      欢迎使用
      <a-tag
        color="cyan"
        style="
          font-size: 30px;
          line-height: 30px;
          background: #fff;
          border: 0px;
        "
        >周报汇总工具<a-icon
          theme="twoTone"
          two-tone-color="#eb2f96"
          type="like"
          @click="clicked"
      /></a-tag>
    </h1>
    <h3 style="color: #c0c0c0">在使用工具前，请先确定仓库已经更新至最新状态</h3>
    <a-spin :spinning="loading">
      <a-button type="primary" @click="goToWork">
        前往工作台<a-icon type="right" />
      </a-button>
    </a-spin>
    <br />
  </a-space>
</template>

<script>
import logo from "../assets/logo.png";
import logo_test from "../assets/logo_test.png";
const { ipcRenderer } = require("electron");

export default {
  name: "Home",
  data() {
    return {
      count: 0,
      logo_path: logo,
      loading: true,
    };
  },
  mounted() {
    ipcRenderer.on("api-init", (event, arg) => {
      this.loading = false;
    });
  },
  methods: {
    goToWork() {
      this.$router.push("/workspace");
    },
    clicked() {
      this.count += 1;
      if (this.count % 2 === 0) {
        this.logo_path = logo;
      } else {
        this.logo_path = logo_test;
      }
    },
  },
};
</script>
