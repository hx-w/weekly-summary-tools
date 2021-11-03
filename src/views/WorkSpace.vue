<template>
  <div>
    <a-menu v-model="summary_model" mode="horizontal" @click="modelChangeHandle">
      <a-menu-item key="swsg">
        <a-icon type="branches" />单周单组汇总</a-menu-item
      >
      <a-menu-item key="swmg"> <a-icon type="inbox" />单周全组汇总</a-menu-item>
      <a-menu-item key="mw"> <a-icon type="dropbox" />多周汇总</a-menu-item>
    </a-menu>
    <SWSG v-if="summary_model[0] === 'swsg'"/>
    <SWMG v-else-if="summary_model[0] === 'swmg'"/>
    <MW v-else-if="summary_model[0] === 'mw'"/>
  </div>
</template>

<script>
import SWSG from '@/components/SWSG.vue'
import SWMG from '@/components/SWMG.vue'
import MW from '@/components/MW.vue'

export default {
  name: 'WorkSpace',
  components: { SWSG, SWMG, MW },
  data () {
    return {
      summary_model: ['swsg']
    }
  },
  methods: {
    modelChangeHandle (e) {
      console.log(this.summary_model)
    }
  }
}
</script>
