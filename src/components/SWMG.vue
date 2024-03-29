<template>
  <div>
    <a-row type="flex" justify="center" align="top" style="margin-top: 10px">
      <h1>每周小组间汇总</h1>
    </a-row>

    <a-row justify="center" type="flex" style="margin-top: 10px">
      <a-col :span="18">
        <a-form
          :model="swmgForm"
          :wrapper-col="{ span: 17, offset: 0 }"
          labelAlign="left"
        >
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
            <a-form-item :wrapperCol="{ offset: 0 }">
              <a-transfer
                :data-source="group_list"
                :target-keys="target_list"
                :titles="['不合并列表', '待合并列表']"
                :show-search="show_search"
                :filter-option="filterOption"
                :render="(item) => item.title"
                @change="handleTransferChange"
                :operations="['右移', '左移']"
                :list-style="{
                  width: '210px',
                  height: '261px',
                }"
                :locale="{
                  itemUnit: '组',
                  itemsUnit: '组',
                }"
              >
              </a-transfer>
              <a-switch
                size="small"
                checked-children="搜索框开启"
                style="float: left; margin-top: 10px"
                un-checked-children="搜索框关闭"
                default-unchecked
                @change="changeShowSearch"
              />
            </a-form-item>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col :span="12">
              <a-button
                type="primary"
                @click="swmgSubmit"
                icon="branches"
                style="width: 110px"
                :disabled="btn_disable"
              >
                执行合并
              </a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
    </a-row>
    <a-modal
      title="文件已存在"
      :visible="warn_visible"
      @ok="handleWarnOk"
      @cancel="handleWarnCancel"
      okText="确定覆盖"
      okType="danger"
      cancelText="取消执行"
    >
      <span v-html="ModalText">{{ ModalText }}</span>
    </a-modal>
    <br />
  </div>
</template>

<script>
const apihost = "http://localhost:54321";

export default {
  name: "SWMG",
  data() {
    return {
      swmgForm: this.$form.createForm(this, { name: "swmgForm" }),
      week_list: [],
      group_list: [],
      target_list: [],
      current_week: "",
      week_loading: true,
      show_search: false,
      warn_visible: false,
      distpath: "",
      ModalText: "",
      btn_disable: false,
    };
  },
  mounted() {
    this.$http
      .get(`${apihost}/info/week_list`, {
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
          this.btn_disable = false;
        } else {
          this.btn_disable = true;
        }
        this.getGroupList(this.current_week);
      })
      .catch((error) => {
        this.btn_disable = true;
        this.$message.error(`获取周次失败：${error}`);
      });
  },
  methods: {
    handleWarnOk(e) {
      this.warn_visible = false;
      this.execMerge(true);
    },
    handleWarnCancel(e) {
      this.warn_visible = false;
    },
    execMerge(force) {
      this.$http
        .get(`${apihost}/swmg/exec_merge`, {
          params: {
            week: this.current_week,
            filelist: JSON.stringify(this.target_list),
            force: force,
          },
        })
        .then((resp) => {
          this.distpath = resp.data.res;
          this.ModalText = `<div><p><strong>${this.distpath}</strong>已存在</p><p>继续执行将会覆盖原文件，是否继续？</p></div>`;
          if (resp.data.success) {
            this.$success({
              title: "周报合并成功",
              // JSX support
              content: (
                <div>
                  <p>文件合并在</p>
                  <p>
                    <strong>{this.distpath}</strong>
                  </p>
                  <p>请及时交验</p>
                </div>
              ),
            });
          } else {
            this.warn_visible = true;
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.$message.error(
              `执行合并文件失败：${error.response.data.detail}`
            );
          } else {
            this.$message.error(`执行合并文件失败：${error.response}`);
          }
        });
    },
    swmgSubmit() {
      this.execMerge(false);
    },
    weekChange(value) {
      this.current_week = value;
      this.getGroupList(this.current_week);
    },
    filterOption(inputValue, option) {
      return option.title.indexOf(inputValue) > -1;
    },
    handleTransferChange(targetKeys, direction, moveKeys) {
      this.target_list = targetKeys;
    },
    changeShowSearch(checked) {
      this.show_search = checked;
    },
    getGroupList(week) {
      if (!this.week_loading) {
        this.$http
          .get(`${apihost}/swmg/group_list`, {
            params: {
              week: week,
            },
          })
          .then((resp) => {
            console.log(this.group_list);
            this.group_list = resp.data;
            this.target_list = this.group_list
              .filter((item) => !item.disabled)
              .map((item) => item.key);
            this.btn_disable = this.target_list.length === 0;
          })
          .catch((error) => {
            this.group_list = [];
            this.btn_disable = true;
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
