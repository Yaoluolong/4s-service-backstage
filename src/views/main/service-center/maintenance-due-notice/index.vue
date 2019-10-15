<template>
  <!--保养维护到期通知-->
  <div style="margin: 35px">
    <el-row :gutter="8">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <!--          <el-input v-model="inputData" placeholder="请输入条件" size="small" />-->
        </div>
      </el-col>
      <el-col :span="11">
        <!--        <div>-->
        <!--          <el-button icon="el-icon-search" type="primary" size="small" @click="searchData">搜索</el-button>-->
        <!--          <el-button icon="el-icon-delete" size="small">清空</el-button>-->
        <!--        </div>-->
      </el-col>
    </el-row>
    <el-row style="margin: 10px 0px" />
    <div>
      <div>
        <el-table
          v-loading="loading"
          :data="tableDataBlack.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          stripe
          border
          style="width: 100%"
          max-height="450"
        >
          <el-table-column type="index" label="ID" width="50" align="center"><template slot-scope="scope">{{ scope.row.userId }}</template></el-table-column>
          <el-table-column prop="custname" label="客户" align="center"><template slot-scope="scope">{{ scope.row.username }}</template></el-table-column>
          <el-table-column prop="finalservice" label="最后一次服务时间" align="center"><template slot-scope="scope">{{ scope.row.lastUpkeepTime }}</template></el-table-column>
          <el-table-column prop="custstate" label="通知状态" :formatter="formatPreState" align="center"><template slot-scope="scope">{{ scope.row.formState }}</template></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleClick(scope.row)">通知</el-button>
              <el-dialog
                title="是否通知该客户？"
                :visible.sync="dialogVisible2"
                center
                :append-to-body="true"
                :lock-scroll="false"
                width="20%"
              >
                <div>
                  <el-form>
                    <el-form-item align="center">
                      <el-row>
                        <el-button type="primary" @click="updateState1">是</el-button>
                        <el-button align="right" type="danger" @click="dialogVisible2=false">否</el-button>
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
import { selectByState, updateState } from '@/api/setting/maintenance-project-management'

export default {
  data() {
    return {
      tableDataBlack: [],
      currentPage: 1,
      pageSize: 5,
      inputData: '',
      dialogForm2: {},
      dialogVisible2: false,
      loading: true
    }
  },
  mounted() {
    selectByState({
    }).then(response => {
      console.log(321)
      console.log(response)
      this.tableDataBlack = response
      this.loading = false
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
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    searchData() {
      console.log(this.chooseTenant + ':' + this.chooseStatus + ':' + this.inputData)
    },
    openDialog2: function(row) {
      this.dialogForm2 = row
      this.dialogVisible2 = true
    },
    updateState1() {
      this.$message.success('通知成功！')
      this.dialogVisible = false
    },
    formatPreState: function(row, column) {
      return row.custstate === 1 ? '待提醒' : ''
    },
    handleClick(row) {
      updateState(row.userId, '正常').then(response => {
        alert('成功')
        selectByState({
        }).then(response => {
          console.log(321)
          console.log(response)
          this.tableDataBlack = response
          this.loading = false
        })
      })
        .catch(() => {
          alert('失败')
        })
    }
  }
}
</script>
