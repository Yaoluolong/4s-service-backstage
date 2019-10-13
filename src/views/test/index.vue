<template>
  <div>
    <app-block>
      <el-button @click="fetchData">测试</el-button>
      <div>{{ data }}</div>
    </app-block>
    <app-block>
      <el-button @click="test">测试</el-button>
      <div>{{ data }}</div>
    </app-block>
    <app-block>
      <el-button @click="test2">数组json</el-button>
      <div>{{ data }}</div>
    </app-block>
    <app-block>
      <el-button @click="ls">ls</el-button>
      <div>{{ data }}</div>
    </app-block>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { fetch, table, ls } from '@/api/test'

export default {
  data() {
    return {
      data: null
    }
  },
  methods: {
    fetchData() {
      fetchList().then(response => {
        console.log(response)
        this.data = response.data.items
      })
        .catch(() => {
          this.data = '无返回数据'
        })
    },
    test() {
      fetch().then(response => {
        console.log(response)
        this.data = response
      })
        .catch(() => {
          this.data = '无返回数据'
        })
    },
    test2() {
      table().then(response => {
        console.log(response)
        this.data = response
      })
        .catch(() => {
          this.data = '无返回数据'
        })
    },
    ls() {
      ls().then(response => {
        console.log(response)
        this.data = response.data
      })
        .catch(() => {
          this.data = '无返回数据'
        })
    }
  }
}
</script>

<style>

</style>
