<template>
  <div>
    <a-row type="flex" justify="center" align="top" style="margin-top: 10px">
      <h1>每周小组内汇总</h1>
    </a-row>

    <a-row justify="center" type="flex">
      <a-col :span="18">
      <a-form :model="swsgForm"  :wrapper-col="{ span: 18 }" labelAlign="left" @submit="swsgSubmit">
        <a-form-item label="选择小组" labelAlign="left" :labelCol="{ span:3, offset:1 }">
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
        </a-form-item>
        <a-form-item label="选择周次" :labelCol="{ span:3, offset:1 }">
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
        </a-form-item>
        <a-form-item :wrapperCol="{ offset:1, span:18 }">
          <a-transfer
            :data-source="name_list"
            :target-keys="target_list"
            :titles="['不合并列表', '待合并列表']"
            show-search
            :filter-option="filterOption"
            :render="item => item.title"
            @change="handleTransferChange"
            pagination
            :list-style="{
              width: '200px',
              height: '200px'
            }"
          />
        </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              执行
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    </div>
</template>

<script>
export default {
  name: 'SWSG',
  data () {
    return {
      swsgForm: this.$form.createForm(this, { name: 'swsgForm' }),
      group_list: [],
      week_list: [],
      name_list: [],
      target_list: [],
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
        this.getNameList(this.current_group_name, this.current_week)
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
      this.getNameList(this.current_group_name, this.current_week)
    },
    weekChange (value) {
      this.current_week = value
      this.getNameList(this.current_group_name, this.current_week)
    },
    filterOption (inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    getNameList (group, week) {
      if (!this.week_loading && !this.group_loading) {
        this.$http
          .get('http://127.0.0.1:4242/swsg/name_list', {
            params: {
              group_name: group,
              week: week
            }
          })
          .then((resp) => {
            this.name_list = resp.data
            this.target_list = this.name_list.map(item => item.key)
          })
          .catch((error) => {
            this.$message.error(`获取成员名单失败：${error}`)
          })
      }
    },
    handleTransferChange (targetKeys, direction, moveKeys) {
      this.target_list = targetKeys
    }
  }
}
</script>

<style lang="stylus">
.ant-transfer-list-header {
  text-align: left;
}
.ant-transfer-list-content {
  text-align: left;
  padding-left: 10px;
}
</style>
