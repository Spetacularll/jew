<template>
  <div class="container">
    <h1>更新产品信息</h1>

    <!-- 搜索产品 -->
    <div class="search-section">
      <label for="barcode">条码：</label>
      <input v-model="barcode" id="barcode" placeholder="输入条码" />
      <button @click="searchProduct">搜索</button>
    </div>

    <!-- 产品信息表单 -->
    <div v-if="product" class="product-form">
      <h2>编辑产品</h2>
      <label>分类：</label>
      <input v-model="product.category" />
      <label>价格：</label>
      <input v-model.number="product.price" type="number" />
      <label>描述：</label>
      <textarea v-model="product.description"></textarea>
      <label>上传图片：</label>
      <input type="file" @change="handleFileUpload" />
      <img v-if="product.imageUrl" :src="getImageUrl(product.imageUrl)" alt="产品图片" class="product-image" />

      <button @click="updateProduct">更新产品</button>
    </div>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { getProductByBarcode, updateProductByBarcode } from '../router/api';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const barcode = ref('');
const product = ref(null);
const errorMessage = ref('');
const selectedFile = ref(null);
const serverBaseUrl = 'http://localhost:8080/'; // 这里替换成你的后端 URL



onMounted(() => {
  // 从路由 query 中获取 barcode
  if (route.query.barcode) {
    barcode.value = route.query.barcode;
    searchProduct(); // 自动搜索产品
  }
});


const searchProduct = async () => {
  errorMessage.value = ''; // 清空旧错误
  if (!barcode.value) {
    errorMessage.value = '条码不能为空';
    return;
  }

  try {
    const response = await getProductByBarcode(barcode.value);
    if (response.code === 200) {
      product.value = response.data;
    } else {
      errorMessage.value = response.message || '未找到产品';
    }
  } catch (error) {
    errorMessage.value = '搜索产品失败，请稍后再试';
  }
};

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const updateProduct = async () => {
  if (!product.value) {
    errorMessage.value = '请先搜索产品';
    return;
  }

  // 处理条形码：如果以 "1234" 开头，则替换为 "7693"
  let processedBarcode = barcode.value.replace(/^1234/, '7693');

  const formData = new FormData();
  formData.append('barcode', processedBarcode);
  formData.append('category', product.value.category);
  formData.append('price', product.value.price);
  formData.append('description', product.value.description);

  // 只有在用户选择了图片时，才添加 imageFile
  if (selectedFile.value) {
    formData.append('imageFile', selectedFile.value);
  }

  try {
    const response = await updateProductByBarcode(formData);
    if (response.code === 200) {
      product.value = response.data;
    } else {
      errorMessage.value = response.message || '更新失败';
    }
  } catch (error) {
    errorMessage.value = '更新产品失败，请稍后再试';
  }
};

const getImageUrl = (path) => {
  if (path && !path.startsWith('http')) {
    return serverBaseUrl + path;
  }
  return path;
};
</script>

<style>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}
.search-section {
  margin-bottom: 20px;
}
.product-form label {
  display: block;
  margin-top: 10px;
}
.product-form input, .product-form textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.product-image {
  max-width: 300px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
