<template>
    <div>
      <h1>产品管理</h1>
  
      <!-- 搜索产品 -->
      <div>
        <label for="barcode">条码：</label>
        <input v-model="barcode" id="barcode" placeholder="输入条码" />
        <button @click="searchProduct">搜索</button>
      </div>
  
      <!-- 显示产品信息 -->
      <div v-if="product">
        <h2>产品信息</h2>
        <p><strong>名称:</strong> {{ product.owner }}</p>
        <p><strong>条码:</strong> {{ product.barcode }}</p>
        <p><strong>分类:</strong> {{ product.category }}</p>
        <p><strong>价格:</strong> ¥{{ product.price }}</p>
        <p><strong>描述:</strong> {{ product.description }}</p>
        <p><strong>库存:</strong> {{ product.stock }}</p>
        <p><strong>是否已售:</strong> {{ product.sell ? '是' : '否' }}</p>
        <p v-if="product.imageUrl">
          <strong>图片:</strong>
          <img :src="product.imageUrl" alt="产品图片" style="max-width: 300px; margin-top: 10px;" />
        </p>
  
        <!-- 卖出按钮 -->
        <button @click="sell" :disabled="product.sell">卖出</button>
  
        <!-- 入库按钮 -->
        <button @click="reinbound">入库</button>
      </div>
  
      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { getProductByBarcode, sellProduct, reinboundProduct } from '../router/api'; // 引入 API 函数
  
  // 定义响应式变量
  const barcode = ref('');
  const product = ref(null);
  const errorMessage = ref('');
  
  // 搜索产品
  const searchProduct = async () => {
    if (!barcode.value) {
      errorMessage.value = '条码不能为空';
      return;
    }
  
    try {
      errorMessage.value = ''; // 清空错误信息
      const response = await getProductByBarcode(barcode.value);
  
      // 检查响应数据格式
      if (response.code === 200) {
        product.value = response.data; // 设置产品信息
      } else {
        errorMessage.value = response.message || '未找到产品';
      }
    } catch (error) {
      console.error('搜索产品失败:', error);
      errorMessage.value = '搜索产品失败，请稍后再试';
    }
  };
  
  // 卖出产品
  const sell = async () => {
    try {
      const response = await sellProduct(product.value);
      if (response.code === 200) {
        product.value = response.data; // 更新产品信息
      } else {
        errorMessage.value = response.message || '卖出失败';
      }
    } catch (error) {
      console.error('卖出产品失败:', error);
      errorMessage.value = '卖出产品失败，请稍后再试';
    }
  };
  
  // 入库产品
  const reinbound = async () => {
    try {
      const response = await reinboundProduct(product.value);
      if (response.code === 200) {
        product.value = response.data; // 更新产品信息
      } else {
        errorMessage.value = response.message || '入库失败';
      }
    } catch (error) {
      console.error('入库产品失败:', error);
      errorMessage.value = '入库产品失败，请稍后再试';
    }
  };
  </script>
  
  <style>
  .error {
    color: red;
  }
  img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    max-width: 100%;
    height: auto;
  }
  </style>