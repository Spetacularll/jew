<template>
  <div class="container">
    <h1>产品出库</h1>
    <form @submit.prevent="searchProduct">
      <div>
        <label for="barcode">扫描条形码输入:</label>
        <input type="text" id="barcode" v-model="barcode" required />
      </div>
      <div>
        <button type="submit">搜索</button>
      </div>
    </form>

    <!-- 错误信息展示 -->
    <div v-if="error" style="color: red;">
      <p>{{ error }}</p>
    </div>

    <!-- 成功信息展示 -->
    <div v-if="successMessage" style="color: green;">
      <p>{{ successMessage }}</p>
    </div>

    <!-- 产品详情展示 -->
    <div v-if="product">
      <h2>产品详情</h2>
      <p>名称: {{ product.productName }}</p>
      <p>条形码: {{ product.barcode }}</p>
      <p>类别: {{ product.category }}</p>
      <p>价格: {{ product.price }}</p>
      <p>描述: {{ product.description }}</p>

      <form @submit.prevent="outboundProduct">
        <input type="hidden" v-model="productId" />
        <div>
          <label for="destination">去向:</label>
          <input type="text" id="destination" v-model="destination" required />
        </div>
        <div>
          <button type="submit">出库</button>
        </div>
      </form>
    </div>

    <!-- 登出按钮 -->
    <form @submit.prevent="logout">
      <button type="submit">登出</button>
    </form>

    <router-link to="/">返回主页</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from '../router/axios';

export default defineComponent({
  name: 'OutboundProduct',
  setup() {
    const barcode = ref<string>('');  // 条形码输入
    const product = ref<any>(null);  // 产品信息
    const error = ref<string | null>(null);  // 错误信息
    const successMessage = ref<string | null>(null);  // 成功信息
    const destination = ref<string>('');  // 去向
    const productId = ref<number | null>(null);  // 产品ID

    // 搜索产品
    const searchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/barcode`, {
          params: { barcode: barcode.value }
        });

        if (response.data.success) {
          console.log(response.data.data);
          product.value = response.data.data;  // 从 ApiResponse 中获取实际的产品数据
          error.value = null;
        } else {
          error.value = response.data.message;  // 显示错误信息
          product.value = null;
        }
      } catch (err) {
        error.value = '未找到产品';
        product.value = null;
      }
    };

    // 产品出库
    const outboundProduct = async () => {
      if (product.value) {
        try {
          await axios.post('/api/outbound', {
            productbarcode: product.value.barcode,
            destination: destination.value
          });
          successMessage.value = '出库成功';  // 设置成功信息
          product.value = null;  // 清空产品信息
          destination.value = '';  // 清空去向输入
        } catch (err) {
          console.log(error.value);
          error.value = '出库失败';
        }
      }
    };

    // 登出
    const logout = async () => {
      try {
        await axios.post('/logout');
        window.location.href = '/login';  // 重定向到登录页面
      } catch (err) {
        console.error('登出失败', err);
      }
    };

    return {
      barcode,
      product,
      error,
      successMessage,
      destination,
      productId,
      searchProduct,
      outboundProduct,
      logout
    };
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
}
</style>
