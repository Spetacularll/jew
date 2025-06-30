<template>
    <div class="container" v-loading="loading">
      <el-card>
        <h2>未归还出库记录</h2>
  
        <el-table
          :data="records"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="product.productName" label="商品名称" />
          <el-table-column prop="barcode" label="条码" />
          <el-table-column prop="destination" label="去向" />
          <el-table-column prop="outboundDate" label="出库时间" :formatter="formatDate" />
        </el-table>
  
        <div class="mt-2">
          <el-button type="primary" @click="confirmReturn" :disabled="selected.length === 0">
            批量归还
          </el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from '../router/axios'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  const records = ref([])
  const selected = ref<any[]>([])
  const loading = ref(false)
  
  const fetchRecords = async () => {
    loading.value = true
    try {
      const res = await axios.get('/api/outbound/unreturned')
      records.value = res.data
    } catch (err) {
      ElMessage.error('获取未归还记录失败')
    } finally {
      loading.value = false
    }
  }
  
  const handleSelectionChange = (val: any[]) => {
    selected.value = val
  }
  
  const confirmReturn = async () => {
    try {
      await ElMessageBox.confirm(
        `确认归还 ${selected.value.length} 条记录？`,
        '确认归还',
        { type: 'warning' }
      )
      const ids = selected.value.map(r => r.outboundId)
      await axios.post('/api/return', ids)
      ElMessage.success('归还成功')
      fetchRecords()
    } catch (e) {
      if (e !== 'cancel') ElMessage.error('归还失败')
    }
  }
  
  const formatDate = (_: any, __: any, val: string) => {
    return new Date(val).toLocaleString()
  }
  
  onMounted(fetchRecords)
  </script>
  
  <style scoped>
  .container {
    max-width: 1000px;
    margin: 20px auto;
    padding: 20px;
  }
  .mt-2 {
    margin-top: 20px;
  }
  </style>
  