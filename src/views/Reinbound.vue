<template>
  <div class="reinbound-page">
    <h1>商品重新入库</h1>
    <div class="input-section">
      <textarea
        v-model="barcodesInput"
        placeholder="请输入条形码，使用空格或 Tab 分隔"
        rows="5"
      ></textarea>
      <p class="line-count">已添加准备入库的商品: {{ lineCount }}</p>
    </div>
    <button @click="handleReinbound" :disabled="isLoading">
      {{ isLoading ? '处理中...' : '提交' }}
    </button>
    <div v-if="responseMessage" class="response-message">
      <p>{{ responseMessage }}</p>
    </div>
    <div v-if="processedCount > 0" class="statistics">
      <p>本次入库成功商品数量: {{ processedCount }} 条</p>
    </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from '../router/axios';
import { ElMessageBox } from 'element-plus';

// 定义状态
const barcodesInput = ref('');
const isLoading = ref(false);
const responseMessage = ref('');
// 修改点：用 processedCount 代替 updatedProducts 来存储成功数量
const processedCount = ref(0);

// 计算行数
const lineCount = computed(() => {
  const lines = barcodesInput.value.split('\n').filter(line => line.trim() !== '');
  return lines.length;
});

// 解析返回字符串中的数字
const parseCountFromString = (str) => {
  // 使用正则表达式匹配字符串末尾的数字
  const match = str.match(/:\s*(\d+)/);
  if (match && match[1]) {
    // 如果匹配成功，返回提取到的数字
    return parseInt(match[1], 10);
  }
  // 如果没有匹配到，返回0
  return 0;
};


// 处理重新入库逻辑
const handleReinbound = async () => {
  const currentLineCount = lineCount.value;

  try {
    await ElMessageBox.confirm(
      `是否确定提交？当前共有 ${currentLineCount} 个商品准备提交。`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    // 重置状态
    responseMessage.value = '';
    // 修改点：重置 processedCount
    processedCount.value = 0;
    
    let barcodes = barcodesInput.value
      .split(/\s+/)
      .map((barcode) => barcode.trim())
      .filter((barcode) => barcode);

    if (barcodes.length === 0) {
      responseMessage.value = '请输入至少一个条形码！';
      return;
    }

    barcodes = barcodes.map((barcode) => {
      if (barcode.startsWith('1234')) {
        return '7693' + barcode.slice(4);
      }
      return barcode;
    });

    try {
      isLoading.value = true;
      const response = await axios.post('/api/inbound/reinbounds', barcodes);
      
      if (response.data.success) {
        console.log('API 响应:', response.data);
        // 修改点：不再使用 updatedProducts
        // updatedProducts.value = response.data.data;

        // 设置成功的消息
        responseMessage.value = '商品重新入库成功！';
        
        // 从返回的字符串中解析出处理成功的数量
        processedCount.value = parseCountFromString(response.data.data);
        
      } else {
        responseMessage.value = response.data.message || '操作失败，请重试！';
      }
    } catch (error) {
      console.error('API 请求失败:', error);
      responseMessage.value = '请求失败，请检查网络或稍后再试！';
    } finally {
      barcodesInput.value = '';
      isLoading.value = false;
    }
  } catch {
    console.log('用户取消了提交');
  }
};
</script>

<style scoped>
.reinbound-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.input-section {
  margin-bottom: 20px;
  position: relative;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

.line-count {
  margin-top: 5px;
  font-size: 14px;
  color: #666;
  text-align: right;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.statistics {
  margin-top: 20px;
  font-size: 18px;
  color: green;
  font-weight: bold;
}

.response-message {
  margin-top: 20px;
  color: #333;
}

.product-list {
  margin-top: 20px;
}

.product-list ul {
  list-style-type: none;
  padding: 0;
}

.product-list li {
  background-color: #f9f9f9;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 4px;
}
</style>