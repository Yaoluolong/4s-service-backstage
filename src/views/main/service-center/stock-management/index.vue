yn<template>
  <app-container>
    <app-block>
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="备货号" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="预约号" prop="appointed">
          <el-input v-model="form.appointed" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchTable">查询</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </app-block>
    <app-block>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="未审核" name="未审核" />
        <el-tab-pane label="待备货" name="待备货" />
        <el-tab-pane label="已备货" name="已备货" />
        <el-tab-pane label="已延迟" name="延迟备货" />
        <!-- <el-tab-pane label="已取消" name="已取消" /> -->
      </el-tabs>
      <el-table
        :data="tableData"
        style="width: 100%"
        align="center"
      >
        <el-table-column
          label="备货号"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.stockUpId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="预约号"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.orderId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="涉及材料"
          align="center"
          width="400"
        >
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.projects" :key="index">
              <span v-for="(item2,index2) in item.materialList" :key="index2">{{ item2.material }} </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span :style="{color:displayState(scope.row.stockUpState).color}">{{ displayState(scope.row.stockUpState).text }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.stockUpState=='未审核'"
              size="mini"
              type="success"
              @click="handleDeal(scope.row,'待备货')"
            >通过</el-button>
            <el-button
              v-if="scope.row.stockUpState=='未审核'"
              size="mini"
              type="danger"
              @click="handleDeal(scope.row,'延迟备货')"
            >退回</el-button>
            <el-button
              v-else-if="scope.row.stockUpState=='待备货'"
              size="mini"
              type="success"
              @click="handleDeal(scope.row, '已备货')"
            >完成</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleDetail(scope.$index, scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="current"
        :page-size="size"
        layout="total, prev, pager, next, jumper"
        :total="total"
        align="center"
        @current-change="handleCurrentChange"
      />

      <el-dialog title="备货详情" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="备货号:" :label-width="formLabelWidth">{{ dialogForm.stockUpId }}</el-form-item>
          <el-form-item label="预约号:" :label-width="formLabelWidth">{{ dialogForm.orderId }}</el-form-item>
          <el-form-item label="备货状态:" :label-width="formLabelWidth">{{ dialogForm.stockUpState }}</el-form-item>
          <el-form-item label="审核人:" :label-width="formLabelWidth">{{ dialogForm.wareManagerId }}</el-form-item>
          <el-form-item label="备货项目" :label-width="formLabelWidth">
            <el-col v-for="(project,index) in dialogForm.projects" :key="index" :span="8" :offset="index > 0 ? 2 : 0">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header" class="clearfix">
                  <span>{{ project.projectName }}</span>
                </div>
                <div v-for="(item,index2) in project.materialList" :key="index2" class="text item">
                  {{ item.material }}
                </div>
              </el-card>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </app-block>
  </app-container>
</template>

<script>
import { query, deal } from '@/api/service-center/stock-management'

export default {
  data() {
    return {
      // 表单数据
      form: {
        stockUpId: '',
        orderId: '',
        stockUpState: ''
      },

      // 弹出框
      dialogFormVisible: false,
      formLabelWidth: '150px',
      dialogForm: {},

      // 表格数据
      tableData: [],

      // page
      total: 0,
      current: 1,
      size: 15,

      // 当前tab
      activeName: 'all'
    }
  },
  created: function() {
    this.fetchTable()
  },
  methods: {
    // 操作
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleDetail(index, row) {
      this.dialogFormVisible = true
      this.dialogForm = row
    },

    // tab切换
    handleClick(tab, event) {
      if (tab.name !== 'all') {
        this.form.stockUpState = tab.name
      } else {
        this.form.stockUpState = ''
      }
      this.fetchTable()
    },

    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.current = val
      this.fetchTable()
    },

    // 状态显示
    displayState(val) {
      let state
      switch (val) {
        case '未审核':
          state = { color: '#409EFF', text: '未审核' }
          break
        case '延迟备货':
          state = { color: '#F56C6C', text: '已延迟' }
          break
        case '待备货':
          state = { color: '#E6A23C', text: '待备货' }
          break
        case '已备货':
          state = { color: '#67C23A', text: '已备货' }
          break
        case '已取消':
          state = { color: '#F56C6C', text: '已取消' }
          break
        default:
          break
      }
      return state
    },

    // 异步请求
    fetchTable() {
      query(this.form, this.current, this.size).then(response => {
        this.tableData = response.records
        this.total = response.total
      })
        .catch(() => {
          this.tableData = []
        })
    },
    handleDeal(row, state) {
      deal(row.stockUpId, row.orderId, state).then(response => {
        alert('处理成功')
        this.fetchTable()
      })
        .catch(() => {
          alert('处理失败')
        })
    }

  }

}
</script>

<style scoped>

.text {
    font-size: 12px;
  }

  .item {
    padding-left:8px;
    line-height: 30px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
