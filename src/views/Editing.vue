<template>
  <div class="edit-product">
    <h1>编辑产品</h1>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <label for="barcode">条码:</label>
      <input v-model="barcode" placeholder="输入产品条码" />
      <button @click="searchProductByBarcode">搜索产品</button>
    </div>

    <!-- 错误信息 -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>

    <!-- 编辑产品表单 -->
    <div v-if="product" class="product-form">
  <form @submit.prevent="updateProduct">
    <!-- 图片部分 -->
    <div class="form-group image-center">
      <img v-if="product.imageUrl" :src="product.imageUrl" alt="Product Image" class="product-image" />
      <input id="image" type="file" @change="onImageChange" />
    </div>

    <!-- 其他表单字段 -->
    <div class="form-group">
      <label for="productName">产品名称:</label>
      <input id="productName" v-model="product.productName" required />
    </div>

    <div class="form-group">
      <label for="category">类别:</label>
      <input id="category" v-model="product.category" />
    </div>

    <div class="form-group">
      <label for="price">价格:</label>
      <input id="price" type="number" v-model="product.price" required />
    </div>

    <div class="form-group">
      <label for="description">描述:</label>
      <textarea id="description" v-model="product.description"></textarea>
    </div>

    <button type="submit">更新产品</button>
  </form>
</div>

    <!-- 返回主页链接 -->
    <router-link to="/">返回主页</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../router/axios';

const route = useRoute();
const router = useRouter();
const barcode = ref(route.query.barcode || '');
const product = ref<any>(null);
const errorMessage = ref('');
const successMessage = ref('');
const imageFile = ref<File | null>(null);

// 获取产品信息
const searchProductByBarcode = async () => {
  if (!barcode.value) {
    errorMessage.value = '条码不能为空';
    return;
  }

  try {
    const response = await axios.get(`/api/products/barcode?barcode=${barcode.value}`);
    product.value = response.data.data;
    errorMessage.value = '';
    successMessage.value = '产品找到';
  } catch (error) {
    errorMessage.value = '未找到该条形码对应的产品';
    successMessage.value = '';
  }
};

// 更新产品信息
const updateProduct = async () => {
  if (!product.value) return;

  const formData = new FormData();
  formData.append('barcode', product.value.barcode);
  formData.append('productName', product.value.productName);
  formData.append('category', product.value.category || '');
  formData.append('price', product.value.price.toString());
  formData.append('description', product.value.description || '');
  
  if (imageFile.value) {
    formData.append('imageFile', imageFile.value);
  }

  try {
    await axios.post('/api/products/barcode', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    successMessage.value = '产品更新成功';
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = '产品更新失败';
    successMessage.value = '';
  }
};

// 处理图片文件更改
const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];
  }
};

// 页面加载时搜索产品
onMounted(() => {
  if (barcode.value) {
    searchProductByBarcode();
  }
});
</script>

<style scoped>
.edit-product {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.search-bar,
.product-form .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 4px;
}

.form-group input,
.form-group textarea,
button {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
}

.success {
  color: green;
}

.product-image {
  max-width: 300px;
  max-height: 300px;
  margin: 16px auto;
  display: block;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.image-center {
  text-align: center;
}

.image-center input[type="file"] {
  margin-top: 8px;
}

.product-image {
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .product-image {
    max-width: 100%;
    height: auto;
  }
}
</style>
