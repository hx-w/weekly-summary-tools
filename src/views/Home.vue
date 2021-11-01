<template>
  <a-space direction="vertical" size="large">
      <img alt="Vue logo" src="../assets/logo.png" style="margin-top:30px" />
      <h1>欢迎使用 [周报汇总工具]</h1>
      <h3>在使用工具前，请先确定仓库已经更新至最新状态</h3>
      <a-button type="primary" @click="goToWork">前往工作台<a-icon type="right" /> </a-button>
      <br/>
  </a-space>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goToWork () {
      this.$router.push('/workspace')
    }
  }
}
</script>
