<template>
  <div>
    <app-container>
      <app-block>个人信息</app-block>
      <app-block>
        <div style="float:left">
          <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
            <div>Hello</div>
            {{ displayName(user.role) }}
          </pan-thumb>
        </div>
        <div class="box-right" style="float:left;text-align:center;margin-left:180px">
          <div class="user-name text-center" style="font-size:70px;margin-bottom:10px">{{ user.name }}</div>
          <div class="user-role text-center text-muted">职务:{{ displayName(user.role) }}</div>
        </div>
        <div class="fix" />
      </app-block>
    </app-container>
    <app-container>
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="账户">{{ username }}</el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleUpdate">修改密码</el-button>
        </el-form-item>
      </el-form>
    </app-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import { update } from '@/api/setting/personal-center'

export default {
  components: { PanThumb },
  data() {
    return {
      form: {
        password: ''
      },
      user: {},
      activeIndex: '1',
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        username: this.username,
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }, displayName(val) {
      let value
      switch (val) {
        case 'admin':
          value = '管理员'
          break
        case 'storekeeper':
          value = '仓库管理员'
          break
        case 'salesman':
          value = '业务员'
          break
        default:
          break
      }
      return value
    },

    // 异步请求
    handleUpdate() {
      update(this.form, this.username).then(response => {
        alert('修改成功')
      })
        .catch(() => {
          alert('修改失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .fix{
    clear: both;
  }

 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>
