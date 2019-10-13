yn<template>
  <app-container>
    <app-block>
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="订单号" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="客户姓名" prop="appointed">
          <el-input v-model="form.appointed" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchTable">查询</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </app-block>
    <app-block>
      <el-table
        :data="tableData"
        style="width: 100%"
        align="center"
      >
        <el-table-column
          label="订单号"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.stockUpId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="客户姓名"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.orderId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="项目"
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
import { query } from '@/api/reservation-center/stock-management'

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

    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.current = val
      this.fetchTable()
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
