<template>
  <div>
    <el-button @click="fetchData">测试</el-button>
    <div>{{ data }}</div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'

export default {
  data() {
    return {
      data: null
    }
  },
  methods: {
    fetchData() {
      fetchList().then(response => {
        this.data = response.code
      })
    }
  }
}
</script>

<style>

</style>
