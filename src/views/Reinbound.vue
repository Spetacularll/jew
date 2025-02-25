<template>
    <div class="reinbound-page">
      <h1>商品重新入库</h1>
  
      <!-- 输入条形码 -->
      <div class="input-section">
        <textarea
          v-model="barcodesInput"
          placeholder="请输入条形码，使用空格或 Tab 分隔"
          rows="5"
        ></textarea>
      </div>
  
      <!-- 提交按钮 -->
      <button @click="handleReinbound" :disabled="isLoading">
        {{ isLoading ? '处理中...' : '提交' }}
      </button>
  
      <!-- 显示结果 -->
      <div v-if="responseMessage" class="response-message">
        <p>{{ responseMessage }}</p>
      </div>
  
      <!-- 显示更新后的商品列表 -->
      <div v-if="updatedProducts.length > 0" class="product-list">
        <h2>更新后的商品列表</h2>
        <ul>
          <li v-for="product in updatedProducts" :key="product.id">
            商品ID: {{ product.id }}, 条形码: {{ product.barcode }}, 库存: {{ product.stock }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from '../router/axios';
  
  // 定义状态
  const barcodesInput = ref('');
  const isLoading = ref(false);
  const responseMessage = ref('');
  const updatedProducts = ref([]);
  
  // 处理重新入库逻辑
  const handleReinbound = async () => {
    // 清空之前的响应信息和商品列表
    responseMessage.value = '';
    updatedProducts.value = [];
  
    // 将输入的条形码按空格或 Tab 分割成数组
    let barcodes = barcodesInput.value
      .split(/\s+/) // 使用正则表达式匹配空格或 Tab
      .map((barcode) => barcode.trim())
      .filter((barcode) => barcode);
  
    if (barcodes.length === 0) {
      responseMessage.value = '请输入至少一个条形码！';
      return;
    }
  
    // 替换条形码前缀
    barcodes = barcodes.map((barcode) => {
      if (barcode.startsWith('1234')) {
        return '7693' + barcode.slice(4); // 替换前缀
      }
      return barcode; // 如果不以 1234 开头，则保持原样
    });
  
    try {
      isLoading.value = true;
  
      // 调用后端 API
      const response = await axios.post('/api/inbound/reinbounds', barcodes);
  
      // 检查响应状态
      if (response.data.success) {
        updatedProducts.value = response.data.data; // 更新商品列表
        responseMessage.value = '商品重新入库成功！';
      } else {
        responseMessage.value = response.data.message || '操作失败，请重试！';
      }
    } catch (error) {
      console.error('API 请求失败:', error);
      responseMessage.value = '请求失败，请检查网络或稍后再试！';
    } finally {
      isLoading.value = false;
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
  }
  
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
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