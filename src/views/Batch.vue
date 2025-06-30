<template>
  <div class="container" v-loading="loading">
    <el-card>
      <h2>出库批次记录</h2>
      <BarcodeSearch />

      <!-- 筛选项 -->
      <el-form inline>
        <el-form-item label="归还状态">
          <el-select v-model="returnedFilter" placeholder="全部" @change="fetchBatches">
            <el-option label="全部" :value="null" />
            <el-option label="已归还" :value="true" />
            <el-option label="未归还" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="批次名">
          <el-input
            v-model="batchNameFilter"
            placeholder="请输入批次名"
            clearable
            @clear="fetchBatches"
          />
        </el-form-item>

        <el-form-item label="去向">
          <el-select
            v-model="destinationFilter"
            placeholder="全部"
            clearable
            @clear="fetchBatches"
          >
            <el-option
              v-for="item in destinationOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fetchBatches">搜索</el-button>
        </el-form-item>
      </el-form>


      <!-- 批次表格 -->
      <el-table :data="batches" style="width: 100%" border>
        <el-table-column prop="batchName" label="批次名" />
        <el-table-column prop="destination" label="去向" />
        <el-table-column prop="outboundDate" label="出库时间" :formatter="formatDate" />
        <el-table-column prop="returned" label="是否归还">
          <template #default="{ row }">
            <el-tag :type="row.returned ? 'success' : 'danger'">
              {{ row.returned ? '已归还' : '未归还' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" @click="toggleExpand(row)">查看详情</el-button>
            <el-button
              v-if="!row.returned"
              size="small"
              type="success"
              plain
              @click="markAsReturned(row)"
            >
              标记为已归还
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        class="mt-4"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />

      <!-- 展开项：显示出库记录 -->
      <el-card v-if="expandedBatch" class="mt-4">
        <h3>批次：{{ expandedBatch.batchName }} 的出库记录</h3>
        <p>总记录数：{{ expandedBatch.totalCount }}，已归还：{{ expandedBatch.returnedCount }}</p>
        <el-table :data="expandedBatch.records" border style="width: 100%">
          <el-table-column prop="barcode" label="条码" />
          <el-table-column prop="returned" label="是否归还">
            <template #default="{ row }">
              <el-tag :type="row.returned ? 'success' : 'danger'">
                {{ row.returned ? '已归还' : '未归还' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button size="small" @click="viewProductDetails(row.barcode)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../router/axios'
import { ElMessage } from 'element-plus'
import BarcodeSearch from '../components/BarcodeSearch.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const batches = ref([])
const loading = ref(false)
const expandedBatch = ref<any | null>(null)

const currentPage = ref(1)
const pageSize = 10
const total = ref(0)

const returnedFilter = ref<string | null>(null)
const destinationFilter = ref<string | null>(null)
const batchNameFilter = ref('')

const destinationOptions = ref<string[]>([])

const fetchBatches = async () => {
  loading.value = true
  try {
    // 统一转换为请求参数格式
    const params: any = {
      page: currentPage.value,
      size: pageSize,
    }

    if (returnedFilter.value !== null) {
      params.returned = returnedFilter.value === 'true'
    }

    if (batchNameFilter.value.trim()) {
      params.batchName = batchNameFilter.value.trim()
    }

    if (destinationFilter.value) {
      params.destination = destinationFilter.value
    }

    const res = await axios.get('/api/outbound/batches', { params })

    const pageData = res.data.data
    if (pageData && Array.isArray(pageData.content)) {
      batches.value = pageData.content
      total.value = pageData.totalElements || 0

      const allDestinations: string[] = pageData.content
        .map((b: any) => b.destination)
        .filter((d): d is string => typeof d === 'string') // 类型守卫，确保是 string
    destinationOptions.value = [...new Set(allDestinations)]
    } else {
      batches.value = []
      total.value = 0
    }
  } catch (e) {
    console.error(e)
    batches.value = []
    ElMessage.error('获取出库批次失败')
  } finally {
    loading.value = false
  }
}

const toggleExpand = async (batch: any) => {
  if (expandedBatch.value?.batchId === batch.batchId) {
    expandedBatch.value = null
    return
  }
  try {
    const res = await axios.get(`/api/outbound/batch/${batch.batchId}`)
    expandedBatch.value = res.data.data
  } catch (e) {
    ElMessage.error('获取详情失败')
  }
}

const markAsReturned = async (batch: any) => {
  try {
    await axios.patch(`/api/outbound/batch/${batch.batchId}/return`)
    ElMessage.success(`批次 ${batch.batchName} 已标记为归还`)
    fetchBatches()
    if (expandedBatch.value?.batchId === batch.batchId) {
      expandedBatch.value = null
    }
  } catch (e) {
    ElMessage.error('标记为已归还失败')
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchBatches()
}

const formatDate = (_: any, __: any, cellValue: string) => {
  return new Date(cellValue).toLocaleString()
}

const viewProductDetails = (barcode: string) => {
  router.push({ path: `/product-details/${barcode}` })
}

onMounted(fetchBatches)
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}
.mt-4 {
  margin-top: 20px;
}
</style>
