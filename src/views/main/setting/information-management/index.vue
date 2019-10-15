<template>
  <!--客户资料查询-->
  <div style="margin: 35px">
    <el-row :gutter="8">
      <el-col :span="6">
        <div class="grid-content bg-purple" />
      </el-col>
      <el-col :span="11" />
    </el-row>
    <el-row style="margin: 10px 0px">
      <el-button type="primary" size="small" @click="openDialog2">新增</el-button>

    </el-row>
    <div>
      <div>
        <el-form>
          <el-form-item label="客户："><el-input v-model="form.username" /></el-form-item>
          <el-form-item label="电话："><el-input v-model="form.phone" /></el-form-item>
          <el-form-item label="车型："><el-input v-model="form.carModel" /></el-form-item>
          <el-form-item label="车牌："><el-input v-model="form.carPlate" /></el-form-item>
          <el-form-item align="center">
            <el-row>
              <el-button type="primary" @click="handleClick">提交</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { insert } from '@/api/setting/maintenance-project-management'

export default {
  data() {
    return {
      form: {
        username: '',
        phone: '',
        carModel: '',
        carPlate: ''
      },

      tableDataBlack: [
        {
          username: 'abc',
          phone: 'asdasdasdasd',
          carModel: 'sdasdasd',
          carPlate: 'sdadasd',
          lastuUpkeepTime: 'asdasdasd'
        }
      ], // 表格数组
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
      dialogVisible2: false
    }
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
    createCustomer() {
      this.$message.success('提交成功！')
      this.dialogVisible2 = false
    },
    handleClick() {
      insert(this.form).then(() => {
        alert('成功')
      })
        .catch(() => {
          alert('失败')
        })
    }
  }
}
</script>
