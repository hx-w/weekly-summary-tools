<template>
  <a-layout-content>
    <a-row type="flex" justify="center" align="top" style="margin-top: 10px">
      <h1>每周小组内汇总</h1>
    </a-row>

    <a-row justify="center" type="flex">
      <a-col :span="12">
      <a-form-model layout="horizontal" :model="swsgForm" labelAlign="left" @submit="swsgSubmit">
        <a-form-model-item label="选择小组" labelAlign="left" :labelCol="{ span:4, offset:0 }">
          <a-select
            mode="group_name"
            :value="current_group_name"
            style="width: 100%"
            @change="groupChange"
            :loading="group_loading"
          >
            <a-select-option v-for="group_name in group_list" :key="group_name" :value="group_name">
              {{ group_name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="选择周次" :labelCol="{ span:4, offset:0 }">
          <a-select
            mode="week"
            :value="current_week"
            style="width: 100%"
            @change="weekChange"
            :loading="week_loading"
          >
            <a-select-option v-for="week in week_list" :key="week" :value="week">
              {{ week }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" html-type="submit">
            执行
          </a-button>
        </a-form-model-item>
      </a-form-model>
      </a-col>
    </a-row>
    </a-layout-content>
</template>

<script>
export default {
  name: 'SWSG',
  data () {
    return {
      swsgForm: this.$form.createForm(this, { name: 'swsgForm' }),
      group_list: [],
      week_list: [],
      current_group_name: '',
      current_week: '',
      group_loading: true,
      week_loading: true
    }
  },
  mounted () {
    this.$http
      .get('http://127.0.0.1:4242/info/group_list')
      .then((resp) => {
        this.$message.success('获取小组名单成功')
        this.group_loading = false
        this.group_list = resp.data
        if (this.group_list.length > 0) {
          this.current_group_name = this.group_list[0]
        }
      })
      .catch((error) => {
        this.$message.error(`获取小组名单失败：${error}`)
      })

    this.$http
      .get('http://127.0.0.1:4242/info/week_list', {
        params: {
          reverse: true,
          single_week: true
        }
      })
      .then((resp) => {
        this.week_loading = false
        this.week_list = resp.data
        if (this.week_list.length > 0) {
          this.current_week = this.week_list[0]
        }
      })
      .catch((error) => {
        this.$message.error(`获取周次失败：${error}`)
      })
  },
  methods: {
    swsgSubmit () {

    },
    groupChange (value) {
      this.current_group_name = value
    },
    weekChange (value) {
      this.current_week = value
    }
  }
}
</script>
