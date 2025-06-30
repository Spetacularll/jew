<template>
    <div class="barcode-search-wrapper">
      <div class="barcode-search-card">
        <h2 class="title">条码查找</h2>
        <div class="barcode-search-container">
          <el-input
            v-model="barcode"
            placeholder="请输入条码"
            size="large"
            clearable
            class="barcode-input"
          />
          <el-button
            type="primary"
            size="large"
            @click="goToDetail"
          >
            查找商品
          </el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  
  const barcode = ref('')
  const router = useRouter()
  
  const goToDetail = () => {
    if (!barcode.value) {
      ElMessage.warning('请输入条码')
      return
    }
  
    // 替换前缀逻辑
    if (barcode.value.startsWith('1234')) {
      barcode.value = barcode.value.replace(/^1234/, '7693')
    }
  
    router.push(`/product-details/${barcode.value}`)
  }
  </script>
  
  <style scoped>
.barcode-search-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 24px;
  background: linear-gradient(to right, #f0f4ff, #ffffff);
  border-radius: 16px;
  font-size: 18px; /* 全局字体加大 */
}

.barcode-search-card {
  background-color: white;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  font-size: 18px; /* 全局字体加大 */

}

.title {
  font-size: 28px; /* 标题放大 */
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
}

.barcode-search-container {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.barcode-input {
  flex: 1;
  min-width: 280px;
  font-size: 18px; /* 输入框文字放大 */
}

/* 让 el-button 更大一些的样式可选添加以下（Element Plus 的 large 已经比较大了） */
:deep(.el-button) {
  font-size: 18px;
  padding: 14px 24px;
}
  </style>
  