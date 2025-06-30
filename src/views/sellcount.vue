<template>
  <div class="sold-stats-page">
    <el-card class="card">
      <h2>销售统计</h2>

      <el-form :inline="true" class="filter-form">
        <el-form-item label="选择日期范围">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="到"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"        
            value-format="YYYY-MM-DDTHH:mm:ss"  
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchSoldStats">查询</el-button>
        </el-form-item>
      </el-form>

      <div v-if="stats">
        <el-divider />
        <p>售出数量：<strong>{{ stats.soldCount }}</strong> 件</p>
        <p>销售总金额：<strong>{{ stats.totalRevenue }}</strong> 元</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '../router/axios'
import dayjs from 'dayjs'

const dateRange = ref<[string, string] | null>(null)

const stats = ref<{ soldCount: number; totalRevenue: number } | null>(null)

const fetchSoldStats = async () => {
  if (!dateRange.value || dateRange.value.length !== 2) {
    ElMessage.warning('请先选择日期范围')
    return
  }

  const [startDate, endDate] = dateRange.value

  try {
    const response = await axios.get('/api/products/sold-stats', {
      params: {
        startDate,
        endDate,
      },
    })
    stats.value = response.data
  } catch (error) {
    console.error('查询失败', error)
    ElMessage.error('查询失败，请稍后重试')
  }
}

// 默认加载本月数据
onMounted(() => {
  const start = dayjs().startOf('month').format('YYYY-MM-DDTHH:mm:ss')
  const end = dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
  dateRange.value = [start, end]
  fetchSoldStats()
})
</script>

<style scoped>
.sold-stats-page {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
}

.card {
  padding: 20px;
}

.filter-form {
  margin-bottom: 20px;
}
</style>
