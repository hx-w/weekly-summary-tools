<template>
  <div>
    <a-row type="flex" justify="center" align="top" style="margin-top: 10px">
      <h1>多周汇总</h1>
    </a-row>

    <a-row justify="center" type="flex" style="margin-top: 10px">
      <!-- <a-col :span="18"> -->
      <a-form
        :model="mwForm"
        :wrapper-col="{ span: 18, offset: 0 }"
        labelAlign="left"
        style="width: 500px"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col :flex="1">
            <div style="display: inline-block; height: 200px; marginleft: 10px">
              <a-slider vertical range :default-value="[30, 45]" />
            </div>
          </a-col>
          <a-col :flex="2">
            <a-row justify="start" align="top">
              <a-form-item label="开始周次" :labelCol="{ span: 6, offset: 0 }">
                <a-select
                  mode="week"
                  :value="start_week"
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
            </a-row>
            <a-row justify="start" align="top">
              <a-form-item label="结束周次" :labelCol="{ span: 6, offset: 0 }">
                <a-select mode="week" :value="end_week" style="width: 100%">
                  <a-icon slot="suffixIcon" type="calendar" />
                  <a-select-option
                    v-for="week in end_week_list"
                    :key="week"
                    :value="week"
                  >
                    {{ week }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-row>
          </a-col>
          <a-col :flex="1"> </a-col>
          <!-- </div> -->
        </a-row>
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="12">
            <a-button
              type="primary"
              @click="mwSubmit"
              icon="branches"
              style="width: 110px"
              :disabled="btn_disable"
            >
              执行合并
            </a-button>
          </a-col>
        </a-row>
      </a-form>
      <!-- </a-col> -->
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
  name: "mw",
  data() {
    return {
      mwForm: this.$form.createForm(this, { name: "mwForm" }),
      week_list: [],
      end_week_list: [],
      start_week: "",
      end_week: "",
      week_loading: true,
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
          this.btn_disable = false;
        } else {
          this.btn_disable = true;
        }
      })
      .catch((error) => {
        this.btn_disable = true;
        this.$message.error(`获取周次失败：${error}`);
      });
  },
  methods: {
    weekChange(value) {},
    handleWarnOk(e) {
      this.warn_visible = false;
      this.execMerge(true);
    },
    handleWarnCancel(e) {
      this.warn_visible = false;
    },
    execMerge(force) {
      this.$http
        .get(`${apihost}/mw/exec_merge`, {
          params: {
            week: this.current_week,
            filelist: JSON.stringify(this.target_list),
            force: force,
          },
        })
        .then((resp) => {
          this.distpath = resp.data.res;
          this.ModalText = `<div><strong>${this.distpath}</strong>已存在<br />继续执行将会覆盖原文件，是否继续？</div>`;
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
    mwSubmit() {
      this.execMerge(false);
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
