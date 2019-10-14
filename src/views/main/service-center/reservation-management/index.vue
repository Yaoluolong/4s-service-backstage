<template>
  <app-container>
    <app-block>预约受理</app-block>
    <app-block>
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="预约号" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="客户姓名" prop="userName">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="手机号" prop="contact">
          <el-input v-model="form.contact" />
        </el-form-item>
        <el-form-item label="保养时间" prop="upKeepTime">
          <el-date-picker
            v-model="form.upKeepTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
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
        <el-tab-pane label="未确认" name="未确认" />
        <el-tab-pane label="已确认" name="已确认" />
        <el-tab-pane label="已完成" name="已完成" />
        <el-tab-pane label="已取消" name="已取消" />
        <el-tab-pane label="已过期" name="已过期" />
      </el-tabs>
      <el-table
        :data="tableData"
        style="width: 100%"
        align="center"
      >
        <el-table-column
          label="预约号"
          align="center"
          width="140"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          align="center"
          width="140"
        >
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.upKeepTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="客户姓名"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车牌号"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.carPlate }}</span>
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
          label="保养项目"
          align="center"
          width="240"
        >
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.projects" :key="index">{{ item.projectName }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span :style="{color:displayState(scope.row.orderState).color}">{{ displayState(scope.row.orderState).text }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.orderState=='未确认'"
              size="mini"
              type="success"
              @click="handleDeal(scope.row.id,'已确认')"
            >确认</el-button>
            <el-button
              v-if="scope.row.orderState=='未确认'"
              size="mini"
              type="danger"
              @click="handleDeal(scope.row.id,'已取消')"
            >取消</el-button>
            <el-button
              v-else-if="scope.row.orderState=='已确认'"
              size="mini"
              type="danger"
              @click="handleDeal(scope.row.id,'已完成')"
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
    </app-block>

    <!--弹窗-->
    <el-dialog
      title="预约详情"
      :visible.sync="dialogFormVisible"
      @close="handleCancel"
    >
      <el-form :model="dialogForm">
        <el-form-item label="预约号:" :label-width="formLabelWidth">{{ dialogForm.id }}</el-form-item>
        <el-form-item label="创建日期:" :label-width="formLabelWidth">{{ dialogForm.createDate }}</el-form-item>
        <el-form-item label="预约日期:" :label-width="formLabelWidth">
          <el-date-picker
            v-if="editState"
            v-model="selectDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          />
          <span v-else>{{ dialogForm.upKeepTime }}</span>
        </el-form-item>
        <el-form-item label="客户姓名:" :label-width="formLabelWidth">{{ dialogForm.userName }}</el-form-item>
        <el-form-item label="联系方式:" :label-width="formLabelWidth">{{ dialogForm.phone }}</el-form-item>
        <el-form-item label="预约项目:" :label-width="formLabelWidth">
          <span v-for="(item,index) in dialogForm.projects" :key="index">{{ item.projectName }} </span>
          <!-- <span v-if="editState">
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-select
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="selectValue"
              size="mini"
              filterable
              placeholder="请输入需要添加的项目"
              @change="handleInputConfirm"
            >
              <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-option-group>
            </el-select>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </span>
          <span v-else>
            <span v-for="(item,index) in dialogForm.item" :key="index">{{ item }} </span>
          </span> -->
        </el-form-item>
        <el-form-item label="车牌号:" :label-width="formLabelWidth">{{ dialogForm.carModel }}</el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth">{{ dialogForm.carPlate }}</el-form-item>
        <el-form-item label="预计金额:" :label-width="formLabelWidth">{{ dialogForm.totalCost }}</el-form-item>
        <el-form-item label="预约状态:" :label-width="formLabelWidth">{{ dialogForm.orderState }}</el-form-item>
        <!-- <el-form-item label="审核员工:" :label-width="formLabelWidth">{{ dialogForm.employeeId }}</el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="editState" @click="handleCancel">取消</el-button>
        <el-button
          v-if="dialogForm.orderState=='未确认'"
          type="success"
          @click="handleEdit"
        >{{ editButton }}</el-button>
      </div>
    </el-dialog>
  </app-container>
</template>

<script>
import { query, modifyDate, deal } from '@/api/service-center/reservation-management'

export default {
  data() {
    return {
      // 表单数据
      form: {
        id: '',
        userName: '',
        phone: '',
        upKeepTime: '',
        orderState: ''
      },
      // 激活的Tab
      activeName: 'all',

      // 当前项目列表
      currentItems: [],

      // 弹窗
      editButton: '修改',
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '150px',
      editState: false,
      selectDate: '',

      dialogForm: {},

      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },

      // 选择器
      options: [{
        label: '已选项目',
        options: []
      }, {
        label: '可选项目',
        options: []
      }],
      selectValue: '',

      // 标签
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',

      // page
      total: 0,
      current: 1,
      size: 15,

      // 表格数据
      tableData: [
        // {
        //   id: '3161905119',
        //   date: '2016-05-02',
        //   name: '王小虎',
        //   contact: '137****5100',
        //   item: ['大保养', '小保养'],
        //   state: 'unconfirmed'
        // }
      ]

      // 保养项目数据
      // maintenance: ['大保养', '小保养', '大大保养', '小小保养']
    }
  },
  created: function() {
    this.fetchTable()
    // this.fetchMaintenance()
  },
  methods: {
    // 操作
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleDetail(index, row) {
      this.dialogFormVisible = true
      this.dialogForm = row
      this.selectDate = this.dialogForm.upKeepTime
      // this.dynamicTags = []
      // this.currentItems = []
      // this.options[0].options = []
      // this.options[1].options = []
      // row.projects.forEach((val) => {
      //   this.dynamicTags.push(val.projectName)
      //   this.currentItems.push(val.projectName)
      // })
      // this.maintenance.forEach((val) => {
      //   if (row.projects.includes(val)) {
      //     this.options[0].options.push({ value: val.projectName, label: val.projectName, disabled: true })
      //   } else {
      //     this.options[1].options.push({ value: val.projectName, label: val.projectName })
      //   }
      // })
    },
    handleEdit() {
      this.editState = true
      if (this.editState && this.editButton === '保存') {
        if (this.selectDate === this.dialogForm.appointDate) {
          alert('未做出修改,无法保存')
        } else if (this.selectDate === null) {
          alert('修改信息有误')
        } else {
          this.modifyDate()
        }
      }
      this.editButton = '保存'
      // this.editState = true
      // if (this.editState && this.editButton === '保存') {
      //   if (this.currentItems.sort().toString() === this.dynamicTags.sort().toString() && this.selectDate === this.dialogForm.appointDate) {
      //     alert('未做出修改,无法保存')
      //     return
      //   } else if (this.selectDate === null) {
      //     alert('修改信息有误')
      //     return
      //   } else {
      //     alert('修改成功')
      //     this.editButton = '修改'
      //     if (this.currentItems.toString() === this.dynamicTags.toString()) {
      //       this.dialogForm.appointDate = this.selectDate
      //       this.editState = false
      //       this.modifyDate()
      //       return
      //     } else if (this.selectDate === this.dialogForm.appointDate) {
      //       this.currentItems = []
      //       this.dynamicTags.forEach(
      //         (val) => {
      //           this.currentItems.push(val)
      //         })
      //       this.editState = false
      //       this.modifyItem()
      //       return
      //     }
      //     this.currentItems = []
      //     this.dynamicTags.forEach(
      //       (val) => {
      //         this.currentItems.push(val)
      //       })
      //     this.editState = false
      //     this.modifyDate()
      //     this.modifyItem()
      //     return
      //   }
      // }
      // this.editButton = '保存'
    },
    handleCancel() {
      this.inputVisible = false
      this.editState = false
      this.editButton = '修改'
      this.fetchTable()
    },

    // 标签
    // handleClose(tag) {
    //   this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    //   this.options[0].options.splice(this.options[0].options.indexOf(tag), 1)
    //   this.options[1].options.push({ value: tag, label: tag })
    //   this.inputVisible = false
    // },
    // showInput() {
    //   this.inputVisible = true
    //   this.$nextTick(_ => {
    //     this.$refs.saveTagInput.focus()
    //   })
    // },
    // handleInputConfirm() {
    //   const inputValue = this.selectValue
    //   if (inputValue) {
    //     this.dynamicTags.push(inputValue)
    //     this.inputVisible = false
    //   }
    //   this.inputValue = ''
    //   this.inputVisible = false
    // },

    // tab切换
    handleClick(tab, event) {
      if (tab.name !== 'all') {
        this.form.orderState = tab.name
      } else {
        this.form.orderState = ''
      }
      this.fetchTable()
    },

    // 分页
    handleCurrentChange(val) {
      this.current = val
      this.fetchTable()
    },

    // 状态显示
    displayState(val) {
      let state
      switch (val) {
        case '未确认':
          state = { color: '#409EFF', text: '未确认' }
          break
        case '未审核':
          state = { color: '#409EFF', text: '未审核' }
          break
        case '已确认':
          state = { color: '#E6A23C', text: '已确认' }
          break
        case '已完成':
          state = { color: '#67C23A', text: '已完成' }
          break
        case '已取消':
          state = { color: '#F56C6C', text: '已取消' }
          break
        case '延迟备货':
          state = { color: '#F56C6C', text: '已取消' }
          break
        case '已过期':
          state = { color: '#909399', text: '已过期' }
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

    handleDeal(id, state) {
      deal(id, state).then(response => {
        alert('处理成功')
        this.fetchTable()
      })
        .catch(() => {
          alert('处理失败')
        })
    },

    // fetchMaintenance() {
    //   queryItem().then(response => {
    //     console.log(response)
    //     this.maintenance = []
    //     response.forEach(val => {
    //       this.maintenance.push(val.projectName)
    //     })
    //     console.log(this.maintenance)
    //   }).catch(() => {
    //     console.log('数组未填')
    //   })
    // },

    modifyDate() {
      modifyDate(this.dialogForm.id, this.selectDate).then(response => {
        alert('修改成功')
        this.editButton = '修改'
        this.dialogForm.upKeepTime = this.selectDate
        this.editState = false
      })
        .catch(() => {
          alert('修改失败')
        })
    }

    // modifyItem() {
    //   modifyItem(this.currentItems,).then(response => {
    //     this.tableData = response.data
    //   })
    //     .catch(() => {
    //       this.tableData = []
    //     })
    // }

  }

}
</script>

<style>

</style>
