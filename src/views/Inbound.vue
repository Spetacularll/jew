<template>
  <div class="container">
    <h1>入库产品</h1>
    <form @submit.prevent="submitProduct" enctype="multipart/form-data">
      <div>
        <label for="owner">产品名称:</label>
        <input v-model="product.owner" type="text" id="owner" required />
      </div>
      <div>
        <label for="barcode">条形码:</label>
        <input v-model="product.barcode" type="text" id="barcode" required />
      </div>
      <div>
        <label for="category">类别:</label>
        <input v-model="product.category" type="text" id="category" />
      </div>
      <div>
        <label for="price">价格:</label>
        <input v-model="product.price" type="number" step="0.01" id="price" required />
      </div>
      <div>
        <label for="description">描述:</label>
        <textarea v-model="product.description" id="description"></textarea>
      </div>
      <div>
        <label for="supplierId">供应商ID:</label>
        <input v-model="product.supplierId" type="number" id="supplierId" required />
      </div>
      <div>
        <label for="image">商品图片:</label>
        <input @change="onFileChange" type="file" id="image" accept="image/*" />
      </div>
      <div>
        <button type="submit">提交</button>
      </div>
    </form>
    <router-link to="/">返回主页</router-link>

    <form @submit.prevent="logout">
      <button type="submit">登出</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from '../router/axios';

// 定义响应式的 product 对象
const product = ref({
  owner: '',
  barcode: '',
  category: '',
  price: 0,
  description: '',
  supplierId: 0,
  imageFile: null as File | null, // 使用 TypeScript 类型确保初始化正确
});

// 文件选择事件处理
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    product.value.imageFile = target.files[0];
  } else {
    product.value.imageFile = null;
  }
};

// 提交表单数据
const submitProduct = async () => {
  try {
    const formData = new FormData();
    formData.append('owner', product.value.owner);
    formData.append('barcode', product.value.barcode);
    formData.append('category', product.value.category);
    formData.append('price', product.value.price.toString());
    formData.append('description', product.value.description);
    formData.append('supplierId', product.value.supplierId.toString());

    if (product.value.imageFile) {
      formData.append('imageFile', product.value.imageFile);
    }

    const response = await axios.post('api/barcode/create-product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('产品提交成功:', response.data);
  } catch (error) {
    console.error('提交产品失败:', error);
  }
};

// 登出函数
const logout = async () => {
  try {
    console.log('已成功登出');
  } catch (error) {
    console.error('登出失败:', error);
  }
};
</script>


<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
}

div {
  margin-bottom: 1em;
}

label {
  display: inline-block;
  width: 500px;
  font-weight: bold;
}

input, textarea, button {
  padding: 5px;
  font-size: 1em;
}

button {
  cursor: pointer;
}
</style>
