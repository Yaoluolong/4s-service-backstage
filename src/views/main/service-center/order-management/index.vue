yn<template>
  <app-container>
    <app-block>
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="订单号" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="客户姓名" prop="userName">
          <el-input v-model="form.userName" />
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
        <el-tab-pane label="服务中" name="服务中" />
        <el-tab-pane label="待支付" name="待支付" />
        <el-tab-pane label="待评价" name="待评价" />
        <el-tab-pane label="已评价" name="已评价" />
      </el-tabs>
      <el-table
        :data="tableData"
        style="width: 100%"
        align="center"
      >
        <el-table-column
          label="订单号"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="客户姓名"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系方式"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车牌"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.carPlate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="支付金额"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="项目"
          align="center"
          width="400"
        >
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.projects" :key="index">
              <span
                v-for="(item2,index2) in item.projects"
                :key="index2"
              >
                {{ item2.projectName }}
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span :style="{color:displayState(scope.row.serviceState).color}">{{ displayState(scope.row.serviceState).text }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.serviceState=='服务中'"
              size="mini"
              type="danger"
              @click="handleDeal(scope.row, '待支付')"
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

      <el-dialog title="订单详情" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="订单号:" :label-width="formLabelWidth">{{ dialogForm.id }}</el-form-item>
          <el-form-item label="会员姓名:" :label-width="formLabelWidth">{{ dialogForm.userName }}</el-form-item>
          <el-form-item label="会员号:" :label-width="formLabelWidth">{{ dialogForm.userId }}</el-form-item>
          <el-form-item label="联系方式:" :label-width="formLabelWidth">{{ dialogForm.phone }}</el-form-item>
          <el-form-item label="车型:" :label-width="formLabelWidth">{{ dialogForm.carModel }}</el-form-item>
          <el-form-item label="车牌号:" :label-width="formLabelWidth">{{ dialogForm.carPlate }}</el-form-item>
          <el-form-item label="保养时长:" :label-width="formLabelWidth">{{ dialogForm.upKeepTime }}</el-form-item>
          <el-form-item label="订单状态:" :label-width="formLabelWidth">{{ dialogForm.serviceState }}</el-form-item>
          <el-form-item label="业务员:" :label-width="formLabelWidth">{{ dialogForm.employeeId }}</el-form-item>
          <el-form-item label="订单项目" :label-width="formLabelWidth">
            <el-col v-for="(project,index) in dialogForm.projects" :key="index" :span="8" :offset="index > 0 ? 2 : 0">
              <el-card :body-style="{ padding: '0px' }">
                <div slot="header" class="clearfix">
                  <span>{{ project.projectName }}</span>
                </div>
                <el-form-item label="维修费:">{{ project.upKeepCost }}元</el-form-item>
                <el-form-item label="总费用:">{{ project.totalCost }}元</el-form-item>
                <el-form-item label="准备周期:">{{ project.prepareCycle }}天</el-form-item>
                <el-form-item label="保养时长:">{{ project.duration }}小时</el-form-item>
              </el-card>
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </app-block>
  </app-container>
</template>

<script>
import { query, deal } from '@/api/service-center/order-management'

export default {
  data() {
    return {
      // 表单数据
      form: {
        id: '',
        userName: '',
        serviceState: ''
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
    console.log(this.tableData)
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
        this.form.serviceState = tab.name
      } else {
        this.form.serviceState = ''
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
        case '服务中':
          state = { color: '#409EFF', text: '服务中' }
          break
        case '待支付':
          state = { color: '#F56C6C', text: '待支付' }
          break
        case '待评价':
          state = { color: '#E6A23C', text: '待评价' }
          break
        case '已评价':
          state = { color: '#67C23A', text: '已评价' }
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
      deal(row.id, state).then(response => {
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
