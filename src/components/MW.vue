<template>
  <div>
    <a-row type="flex" justify="center" align="top" style="margin-top: 10px">
      <h1>多周汇总</h1>
    </a-row>

    <a-row justify="center" type="flex" align="top" style="margin-top: 10px">
      <a-col :span="18">
        <a-form
          :model="mwForm"
          :wrapper-col="{ span: 17, offset: 0 }"
        >
          <a-row justify="center" align="top" style="margin-top: 0px">
            <a-form-item
              label="开始周次"
              :labelCol="{ span: 3, offset: 2 }"
            >
              <a-select
                mode="week"
                :value="start_week"
                style="width: 100%"
                @change="startWeekChange"
                :loading="week_loading"
              >
                <a-icon slot="suffixIcon" type="rise" />
                <a-select-option
                  v-for="week in start_week_list"
                  :key="week"
                  :value="week"
                >
                  {{ week }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row justify="center" align="top" style="margin-top: 10px">
            <a-form-item
              label="结束周次"
              :labelCol="{ span: 3, offset: 2 }"
            >
              <a-select
                mode="week"
                :value="end_week"
                style="width: 100%"
                @change="endWeekChange"
              >
                <a-icon slot="suffixIcon" type="fall" />
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
          <a-row justify="start" align="top" style="margin-top: 10px">
            <a-form-item
              label="总计周数"
              :labelCol="{ span: 3, offset: 2 }"
              :wrapperCol="{ span: 1 }"
            >
              <a-tag color="blue">
                {{ end_week_idx - start_week_idx + 1 }}周
              </a-tag>
            </a-form-item>
          </a-row>
          <a-row justify="start" align="top" style="margin-top: 10">
            <a-form-item
              label="目标文件"
              :labelCol="{ span: 3, offset: 2 }"
              :wrapperCol="{ span: 1 }"
            >
              <a-input :addon-before="prefix" addon-after=".xlsx" :value="distname" style="width: 423px" />
            </a-form-item>
          </a-row>
        </a-form>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="middle">
      <a-collapse default-active-key="0" :bordered="false">
        <a-collapse-panel
          key="1"
          header="高级筛选"
          :style="customStyle"
          :show-arrow="false"
          disabled
        >
          <a-select
            mode="multiple"
            :value="picked_week_idx"
            style="width: 100%"
            placeholder="未选择周次"
          >
            <a-select-option
              v-for="i in end_week_idx - start_week_idx + 1"
              :key="start_week_idx + i - 1"
            >
              {{ week_list[start_week_idx + i - 1] }}
            </a-select-option>
          </a-select>
        </a-collapse-panel>
      </a-collapse>
    </a-row>
    <a-row type="flex" justify="center" align="middle" style="margin-top: 36px">
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
      start_week_list: [],
      end_week_list: [],
      start_week: "",
      end_week: "",
      start_week_idx: 0,
      end_week_idx: 0,
      week_loading: true,
      warn_visible: false,
      distpath: "",
      ModalText: "",
      btn_disable: false,
      picked_week_idx: [],
      prefix: '通用网格生成软件',
      distname: '项目工作报告',
      customStyle:
        "background: #fff;border-radius: 4px;margin-bottom: 0px;border: 0;overflow: hidden; width:510px",
    };
  },
  mounted() {
    this.$http
      .get(`${apihost}/info/prefix`)
      .then((resp) => {
        this.prefix = resp.data;
      })
      .catch((error) => {
        this.$message.error(`获取文件前缀失败：${error}`);
      })
    this.$http
      .get(`${apihost}/info/week_list`, {
        params: {
          reverse: false,
          single_week: false,
        },
      })
      .then((resp) => {
        this.week_loading = false;
        this.week_list = resp.data;
        if (this.week_list.length > 0) {
          this.start_week_list = JSON.parse(JSON.stringify(this.week_list));
          this.end_week_list = JSON.parse(JSON.stringify(this.week_list));
          this.end_week_list.reverse();
          this.start_week = this.start_week_list[0];
          this.end_week = this.end_week_list[0];
          this.start_week_idx = 0;
          this.end_week_idx = this.week_list.length - 1;
          this.btn_disable = false;
          this.picked_week_idx = [...Array(this.end_week_idx + 1).keys()];
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
    changeDistName() {
      if (this.start_week_idx === 0 && this.end_week_idx === this.week_list.length - 1) {
        this.distname = '项目工作报告';
        return;
      }
      const end_split = this.week_list[this.end_week_idx].split('-');
      this.distname = [
        "项目工作报告",
        this.week_list[this.start_week_idx].split('-').slice(0, 2).join(''),
        [end_split[0], end_split[2]].join(''),
      ].join('-');
    },
    startWeekChange(value) {
      this.start_week = value;
      this.start_week_idx = this.week_list.indexOf(value);
      if (this.end_week_idx < this.start_week_idx) {
        this.end_week_idx = this.start_week_idx;
        this.end_week = this.week_list[this.end_week_idx];
      }
      this.end_week_list = JSON.parse(JSON.stringify(this.week_list));
      this.end_week_list.reverse();
      if (this.start_week_idx > 0) {
        this.end_week_list = this.end_week_list.slice(0, -this.start_week_idx);
      }
      this.changeDistName();
    },
    endWeekChange(value) {
      this.end_week = value;
      this.end_week_idx = this.week_list.indexOf(value);
      if (this.end_week_idx < this.start_week_idx) {
        this.start_week_idx = this.end_week_idx;
        this.start_week = this.week_list[this.start_week_idx];
      }
      this.start_week_list = JSON.parse(JSON.stringify(this.week_list));
      if (this.end_week_idx >= 0) {
        this.start_week_list = this.start_week_list.slice(
          0,
          this.end_week_idx + 1
        );
      }
      this.changeDistName();
    },
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
            start_week_idx: this.start_week_idx,
            end_week_idx: this.end_week_idx,
            distname: this.prefix + this.distname + '.xlsx',
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
