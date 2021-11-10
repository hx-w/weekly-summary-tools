<template>
  <div>
    <a-row type="flex" justify="center" align="top" style="margin-top: 10px">
      <h1>每周小组内汇总</h1>
    </a-row>

    <a-row justify="center" type="flex">
      <a-col :span="18">
        <a-form
          :model="swsgForm"
          :wrapper-col="{ span: 17, offset: 0 }"
          labelAlign="left"
        >
          <a-form-item
            label="选择小组"
            labelAlign="left"
            :labelCol="{ span: 3, offset: 2 }"
          >
            <a-select
              mode="group_name"
              :value="current_group_name"
              style="width: 100%"
              @change="groupChange"
              :loading="group_loading"
            >
              <a-icon slot="suffixIcon" type="team" />
              <a-select-option
                v-for="group_name in group_list"
                :key="group_name"
                :value="group_name"
              >
                {{ group_name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="选择周次" :labelCol="{ span: 3, offset: 2 }">
            <a-select
              mode="week"
              :value="current_week"
              style="width: 100%"
              @change="weekChange"
              :loading="week_loading"
            >
              <a-icon slot="suffixIcon" type="calendar" />
              <a-select-option
                v-for="week in week_list"
                :key="week"
                :value="week"
              >
                {{ week }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-row justify="center" type="flex">
            <a-form-item :wrapperCol="{ offset:0 }">
              <a-transfer
                :data-source="name_list"
                :target-keys="target_list"
                :titles="['不合并列表', '待合并列表']"
                :show-search="show_search"
                :filter-option="filterOption"
                :render="(item) => item.title"
                @change="handleTransferChange"
                :operations="['右移', '左移']"
                :list-style="{
                  width: '210px',
                  height: '220px',
                }"
                :locale="{
                  itemUnit: '人',
                  itemsUnit: '人',
                }"
              >
              </a-transfer>
              <a-switch
                size="small"
                checked-children="搜索框开启"
                style="float:left; margin-top:10px"
                un-checked-children="搜索框关闭"
                default-unchecked
                @change="changeShowSearch"
              />
            </a-form-item>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col :span="12">
            <a-button type="primary" @click="swsgSubmit" icon="branches" style="width:110px"> 执行合并 </a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
    </a-row>
    <br/>
  </div>
</template>

<script>
export default {
  name: "SWSG",
  data() {
    return {
      swsgForm: this.$form.createForm(this, { name: "swsgForm" }),
      group_list: [],
      week_list: [],
      name_list: [],
      target_list: [],
      current_group_name: "",
      current_week: "",
      group_loading: true,
      week_loading: true,
      show_search: false,
    };
  },
  mounted() {
    this.$http
      .get("http://127.0.0.1:54321/info/group_list")
      .then((resp) => {
        this.$message.success("获取小组名单成功");
        this.group_loading = false;
        this.group_list = resp.data;
        if (this.group_list.length > 0) {
          this.current_group_name = this.group_list[0];
        }
      })
      .catch((error) => {
        this.$message.error(`获取小组名单失败：${error}`);
      });

    this.$http
      .get("http://127.0.0.1:54321/info/week_list", {
        params: {
          reverse: true,
          single_week: true,
        },
      })
      .then((resp) => {
        this.week_loading = false;
        this.week_list = resp.data;
        if (this.week_list.length > 0) {
          this.current_week = this.week_list[0];
        }
        this.getNameList(this.current_group_name, this.current_week);
      })
      .catch((error) => {
        this.$message.error(`获取周次失败：${error}`);
      });
  },
  methods: {
    swsgSubmit() {
      console.log('??')
    },
    groupChange(value) {
      this.current_group_name = value;
      this.getNameList(this.current_group_name, this.current_week);
    },
    weekChange(value) {
      this.current_week = value;
      this.getNameList(this.current_group_name, this.current_week);
    },
    filterOption(inputValue, option) {
      return option.title.indexOf(inputValue) > -1;
    },
    getNameList(group, week) {
      if (!this.week_loading && !this.group_loading) {
        this.$http
          .get("http://127.0.0.1:54321/swsg/name_list", {
            params: {
              group_name: group,
              week: week,
            },
          })
          .then((resp) => {
            this.name_list = resp.data;
            console.log(resp.data);
            this.target_list = this.name_list.map((item) => item.key);
          })
          .catch((error) => {
            this.name_list = [];
            if (error.response.status === 403) {
              this.$message.error(
                `获取成员名单失败：${error.response.data.detail}`
              );
            } else {
              this.$message.error(`获取成员名单失败：${error.response}`);
            }
          });
      }
    },
    handleTransferChange(targetKeys, direction, moveKeys) {
      this.target_list = targetKeys;
    },
    changeShowSearch(checked) {
      this.show_search = checked;
    },
  },
};
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
