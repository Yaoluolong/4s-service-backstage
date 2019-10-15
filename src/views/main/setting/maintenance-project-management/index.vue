<template>
  <app-container>
    <app-block>
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="项目号" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchTable">查询</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button type="success" @click="addFormVisible=true">增加</el-button>
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
          label="项目号"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="项目名称"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="服务费"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.upKeepCost }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="总费用"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.totalCost }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="准备周期"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.prepareCycle }}</span>
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

      <el-dialog title="项目详情" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="项目号:" :label-width="formLabelWidth">{{ dialogForm.id }}</el-form-item>
          <el-form-item label="项目名称:" :label-width="formLabelWidth">{{ dialogForm.projectName }}</el-form-item>
          <el-form-item label="服务费:" :label-width="formLabelWidth">{{ dialogForm.upKeepCost }}</el-form-item>
          <el-form-item label="总费用:" :label-width="formLabelWidth">{{ dialogForm.totalCost }}</el-form-item>
          <el-form-item label="准备周期:" :label-width="formLabelWidth">{{ dialogForm.prepareCycle }} </el-form-item>
          <el-form-item label="保养时长:" :label-width="formLabelWidth">{{ dialogForm.duration }} </el-form-item>
          <el-form-item label="项目描述:" :label-width="formLabelWidth">{{ dialogForm.description }} </el-form-item>
          <el-form-item label="原材料:" :label-width="formLabelWidth">
            <el-row v-for="(item,index) in dialogForm.materialList" :key="index">
              <span>{{ item.material }}</span>
              <span>{{ item.materialCost }}元</span>
            </el-row>
          </el-form-item>
        </el-form>
        <el-dialog
          width="30%"
          title="确认删除该项目?"
          :visible.sync="innerVisible"
          append-to-body
        >
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible=false">取消</el-button>
            <el-button type="primary" @click="handleDelete">确定</el-button>
          </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="innerVisible=true">删除</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增项目" :visible.sync="addFormVisible">
        <el-form
          ref="addForm"
          :rules="rules"
          :model="addForm"
          label-width="80px"
          size="mini"
        >
          <el-form-item
            label="项目名称:"
            :label-width="formLabelWidth"
            prop="projectName"
          >
            <el-input v-model="addForm.projectName" />
          </el-form-item>
          <el-form-item
            label="服务费:"
            :label-width="formLabelWidth"
            prop="upKeepCost"
          >
            <el-input v-model.number="addForm.upKeepCost" />
          </el-form-item>
          <el-form-item
            label="总费用:"
            :label-width="formLabelWidth"
          >
            {{ totalCost }}
          </el-form-item>
          <el-form-item
            label="准备周期:"
            :label-width="formLabelWidth"
            prop="prepareCycle"
          >
            <el-input v-model.number="addForm.prepareCycle" />天
          </el-form-item>
          <el-form-item
            label="保养时长:"
            :label-width="formLabelWidth"
            prop="duration"
          >
            <el-input v-model.number="addForm.duration" />小时
          </el-form-item>
          <el-form-item
            label="项目描述:"
            :label-width="formLabelWidth"
            prop="description"
          >
            <el-input v-model="addForm.description" type="textarea" />
          </el-form-item>
          <el-form-item
            v-for="(item, index) in addForm.materialList"
            :key="item.key"
            :label="'材料' + index"
            :label-width="formLabelWidth"
            :prop="'materialList.' + index + '.name'"
            :rules="{
              required: true, message: '材料信息不能为空'
            }"
          >
            <el-input v-model="item.name" placeholder="名称" />
            <el-input v-model.number="item.cost" placeholder="费用" class="cost" />元
            <el-button @click.prevent="removeDomain(item)">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="addDomain">新增材料</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('addForm')">重置</el-button>
          <el-button type="primary" @click="addItem('addForm')">增加</el-button>
        </div>
      </el-dialog>
    </app-block>
  </app-container>
</template>

<script>
import { query, add, addM, deleteProject } from '@/api/setting/maintenance-project-management'

export default {
  data() {
    return {
      // 表单数据
      form: {
        id: '',
        projectName: ''
      },

      // 弹出框
      innerVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '150px',
      dialogForm: {},

      // 新增框
      addFormVisible: false,
      rules: {
        projectName: [{ required: true, message: '项目名称不能为空' }],
        upKeepCost: [{ required: true, message: '服务费不能为空' }, { type: 'number', message: '维修费必须为数字值' }],
        prepareCycle: [{ required: true, message: '准备周期不能为空' }, { type: 'number', message: '准备周期必须为数字值' }],
        description: [{ required: true, message: '描述不能为空' }],
        duration: [{ required: true, message: '保养时长不能为空' }, { type: 'number', message: '保养时长必须为数字值' }]
      },
      addForm: {
        projectName: '',
        upKeepCost: '',
        prepareCycle: '',
        description: '',
        duration: '',
        materialList: []
      },

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
  computed: {
    totalCost: function() {
      let sum = 0
      if (this.addForm.upKeepCost !== '') {
        sum += this.addForm.upKeepCost
      }
      if (this.addForm.materialList !== []) {
        this.addForm.materialList.forEach(val => {
          sum += val.cost
        })
      }
      return sum
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
    handleEdit(index, row) {
      this.dialogFormVisible = false
      this.addFormVisible = true
      this.addForm.projectName = row.projectName
      this.addForm.upKeepCost = row.upKeepCost
      this.addForm.prepareCycle = row.prepareCycle
      this.addForm.description = row.description
      this.addForm.duration = row.duration
      row.materialList.forEach(val => {
        this.addForm.materialList.push({
          name: val.projectName,
          cost: val.materialCost
        })
      })
    },

    removeDomain(item) {
      var index = this.addForm.materialList.indexOf(item)
      if (index !== -1) {
        this.addForm.materialList.splice(index, 1)
      }
    },
    addDomain() {
      this.addForm.materialList.push({
        name: '',
        cost: 0
        // key: Date.now()
      })
    },

    // 分页
    handleCurrentChange(val) {
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
    },
    handleDelete() {
      deleteProject(this.dialogForm.id).then(response => {
        alert('删除成功')
        this.innerVisible = false
        this.dialogFormVisible = false
        this.fetchTable()
      })
        .catch(() => {
          alert('删除失败')
        })
    },
    addItem(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          add(this.addForm, this.totalCost).then(response => {
            if (this.addForm.materialList.length !== 0) {
              this.addForm.materialList.forEach(val => {
                addM(response.data.projectId, val).then(r => {
                  if (this.addForm.materialList[this.addForm.materialList.length - 1] === val) {
                    alert('增加成功')
                    this.resetForm('addForm')
                    this.fetchTable()
                  }
                })
                  .catch(() => {
                    alert('增加失败')
                  })
              })
            } else {
              alert('增加成功')
              this.resetForm('addForm')
            }
          })
            .catch(() => {
              alert('增加失败')
            })
        } else {
          return false
        }
      })
    }

  }

}
</script>

<style scoped>
.el-input{
  width:200px;
  margin-right:10px;
}

.cost{
  width:60px;
}
</style>
