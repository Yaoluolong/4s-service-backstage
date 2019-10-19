<template>
  <!--客户项目预约-->
  <div style="margin: 35px">
    <el-row :gutter="8">
      <el-col :span="6">
        <div class="grid-content bg-purple" />
      </el-col>
      <el-col :span="11" />
    </el-row>
    <el-row style="margin: 10px 0px" />
    <div>
      <div>
        <el-table
          :data="tableDataBlack.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          stripe
          border
          style="width: 100%"
          max-height="450"
        >
          <el-table-column type="index" label="ID" width="50" align="center" />
          <el-table-column prop="projectName" label="服务项目" align="center" />
          <el-table-column prop="description" label="项目描述" align="center" />
          <el-table-column prop="prepareCycle" label="准备时长" align="center" />
          <el-table-column prop="totalCost" label="金额" align="center" />
          <el-table-column fixed="right" label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="openDialog2(scope.row)">预约</el-button>
              <el-dialog
                title="创建预约订单"
                :visible.sync="dialogVisible2"
                center
                :append-to-body="true"
                :lock-scroll="false"
                width="20%"
              >
                <div>
                  <el-form>
                    <el-form-item label="预约项目：">{{ dialogForm2.projectName }}</el-form-item>
                    <el-form-item label="项目描述：">{{ dialogForm2.description }}</el-form-item>
                    <el-form-item label="准备时长：">{{ dialogForm2.prepareCycle }}</el-form-item>
                    <el-form-item label="客户：">{{ inputvalue1 }}</el-form-item>
                    <el-form-item label="电话：">
                      <el-select v-model="inputvalue2" filterable placeholder="请选择" @change="handleQuery">
                        <el-option
                          v-for="(item,index) in users"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select></el-form-item>
                    <el-form-item label="车型：">{{ inputvalue3 }}</el-form-item>
                    <el-form-item label="车牌：">{{ inputvalue4 }}</el-form-item>
                    <el-form-item label="服务时间：">
                      <el-date-picker v-model="pickervalue" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" />
                    </el-form-item>
                    <el-form-item label="总金额:">{{ dialogForm2.totalCost }}</el-form-item>
                    <el-form-item align="center">
                      <el-row>
                        <el-button type="primary" @click="createOrder">确认预约</el-button>
                        <el-button align="right" type="danger" @click="dialogVisible2=false">取消</el-button>
                      </el-row>
                    </el-form-item>
                  </el-form>
                </div>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
        <div align="right">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total,prev, pager, next, jumper"
            :total="tableDataBlack.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProject } from '@/api/service-center/order-management'
import { orderInsert, queryCustomer, queryInfo } from '@/api/service-center/order-management'
export default {
  data() {
    return {
      users: [],
      tableDataBlack: [], // 表格数组
      currentPage: 1,
      pageSize: 5,
      pickervalue: '', // 日期控件绑定值
      pickerOptions: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          // 如果函数处理比较简单,可以直接在这里写逻辑方法
          return time.getTime() < Date.now() - 8.64e7

          // 如果函数里处理的数据比较麻烦,也可以单独放在一个函数里,避免data数据太臃肿
          // return this.dealDisabledDate(time)
        }
      }, // 日期设置对象
      dialogForm2: {}, // 获取当前行的项目数据传到对话框
      dialogForm3: {
        userId: '',
        username: '',
        phone: '',
        carModel: '',
        carPlate: '',
        upKeepTime: '',
        projectId: ''
      },
      dialogForm4: {},
      dialogVisible2: false,
      inputvalue1: '',
      inputvalue2: '',
      inputvalue3: '',
      inputvalue4: '',
      inputvalue5: ''
    }
  },
  mounted() {
    getProject({
    }).then(response => {
      console.log(response)
      this.tableDataBlack = response
    })
    queryCustomer().then(response => {
      console.log(response)
      this.users = []
      response.data.forEach(val => {
        this.users.push({ value: val.phone, label: val.phone })
      })
    })
      .catch(() => {
        this.users = []
      })
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    openDialog2: function(row) {
      this.dialogForm2 = row
      this.dialogVisible2 = true
    },
    createOrder() {
      this.dialogForm3.username = this.inputvalue1
      this.dialogForm3.phone = this.inputvalue2
      this.dialogForm3.carModel = this.inputvalue3
      this.dialogForm3.carPlate = this.inputvalue4
      this.dialogForm3.userId = this.inputvalue5
      this.dialogForm3.upKeepTime = this.pickervalue
      this.dialogForm3.projectId = this.dialogForm2.id
      var test = this.dialogForm3
      orderInsert(test).then(response => {
        console.log(response)
      })
      this.$message.success('预约成功！')
      this.dialogVisible2 = false
    },
    handleQuery() {
      console.log(312321)
      console.log(this.inputvalue2)
      queryInfo(this.inputvalue2).then(response => {
        this.inputvalue1 = response.username
        this.inputvalue3 = response.carModel
        this.inputvalue4 = response.carPlate
        this.inputvalue5 = response.userId
      })
        .catch(() => {
          alert('处理失败')
        })
    }
  }
}
</script>
