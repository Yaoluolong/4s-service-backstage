<template>
  <app-container>
    <app-block>
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="工号" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="username">
          <el-input v-model="form.username" />
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
          label="工号"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="员工姓名"
          align="center"
          width="240"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="职务"
          align="center"
          width="240"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="editFormVisible=true;editForm=scope.row"
            >修改</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="confirmFormVisible=true;confirmForm=scope.row"
            >移除</el-button>
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
      <el-dialog title="是否移除该员工?" :visible.sync="confirmFormVisible">
        <div style="text-align:center">
          <div class="confirm">工号:{{ confirmForm.id }}</div>
          <div class="confirm">姓名:{{ confirmForm.name }}</div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="confirmFormVisible=false">取消</el-button>
          <el-button type="danger" @click="handleDelete">移除</el-button>
        </div>
      </el-dialog>
      <el-dialog title="职务修改" :visible.sync="editFormVisible">
        <el-form
          ref="addForm"
          :rules="rules"
          :model="addForm"
          label-width="80px"
          size="mini"
        >
          <el-form-item label="员工姓名:" :label-width="formLabelWidth">{{ editForm.name }}</el-form-item>
          <el-form-item label="工号:" :label-width="formLabelWidth">{{ editForm.id }}</el-form-item>
          <el-form-item
            label="姓名:"
            :label-width="formLabelWidth"
          >
            <el-input v-model="editForm.role" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible=false">取消</el-button>
          <el-button type="danger" @click="handleUpdate">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增员工" :visible.sync="addFormVisible">
        <el-form
          ref="addForm"
          :rules="rules"
          :model="addForm"
          label-width="80px"
          size="mini"
        >
          <el-form-item
            label="姓名:"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item
            label="账号:"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input v-model="addForm.username" />
          </el-form-item>
          <el-form-item
            label="默认密码:"
            :label-width="formLabelWidth"
          >{{ addForm.password }}
          </el-form-item>
          <el-form-item
            label="职务:"
            :label-width="formLabelWidth"
            prop="role"
          >
            <el-input v-model="addForm.role" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('addForm')">重置</el-button>
          <el-button type="primary" @click="handleAdd">增加</el-button>
        </div>
      </el-dialog>
    </app-block>
  </app-container>
</template>

<script>
import { query, remove, update, add } from '@/api/setting/staff-management'

export default {
  data() {
    return {
      // 表单数据
      form: {
        id: '',
        username: ''
      },

      // 弹出框
      dialogFormVisible: false,
      formLabelWidth: '150px',
      dialogForm: {},

      // 新增框
      addFormVisible: false,
      rules: {
        name: [{ required: true, message: '姓名不能为空' }],
        username: [{ required: true, message: '账号不能为空' }],
        role: [{ required: true, message: '职务不能为空' }]
      },
      addForm: {
        name: '',
        username: '',
        password: '123456',
        role: ''
      },

      // 移除确认
      confirmFormVisible: false,
      confirmForm: {},

      // 修改窗
      editFormVisible: false,
      editForm: {},

      // 表格数据
      tableData: [],

      // page
      total: 0,
      current: 1,
      size: 15
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
        console.log(this.tableData)
      })
        .catch(() => {
          this.tableData = []
        })
    },
    handleDelete() {
      remove(this.confirmForm.id).then(response => {
        alert('移除成功')
        this.confirmFormVisible = false
        this.fetchTable()
      })
        .catch(() => {
          alert('移除失败')
        })
    },
    handleUpdate() {
      update(this.editForm.id, this.editForm.password, this.editForm.role).then(response => {
        alert('修改成功')
        this.editFormVisible = false
        this.fetchTable()
      })
        .catch(() => {
          alert('修改失败')
        })
    },
    handleAdd() {
      add(this.addForm).then(response => {
        alert('增加成功')
        this.addFormVisible = false
        this.fetchTable()
      })
        .catch(() => {
          alert('增加失败')
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

.confirm{
  margin: 10px 10px
}
</style>
