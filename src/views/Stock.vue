<template>
  <div class="container">
    <h1>库存中的产品</h1>

    <!-- 查询表单 -->
    <div class="search-form">
      <label for="owner">所有人:</label>
      <input v-model="search.owner" type="text" id="owner" class="search-input" />

      <label for="category">类别:</label>
      <input v-model="search.category" type="text" id="category" class="search-input" />

      <label for="priceMin">最小价格:</label>
      <input v-model="search.priceMin" type="number" id="priceMin" class="search-input" />

      <label for="priceMax">最大价格:</label>
      <input v-model="search.priceMax" type="number" id="priceMax" class="search-input" />

      <button @click="onSearch" class="search-button">查询</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">加载中...</div>

    <!-- 产品列表 -->
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>图片</th>
            <th>所有人</th>
            <th>类别</th>
            <th>价格</th>
            <th>圈口信息+厚度</th>
            <th>操作</th>
            <th>查看</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products.content" :key="product.barcode">
            <td>
              <img v-lazy="product.imageUrl" alt="Product Image" class="product-image" />
            </td>
            <td>{{ product.owner }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.description }}</td>
            <td>
              <button @click="deleteProduct(product.barcode)">删除</button>
            </td>
            <td>
              <button @click="editProduct(product.barcode)">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 显示库存商品的总价格 -->
    <div class="total-price">
      <h2>库存商品总价格: {{ totalPrice }} 元</h2>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button :disabled="products.number === 0" @click="onPageChange(products.number - 1)">上一页</button>
      <span>页码 {{ products.number + 1 }} / {{ products.totalPages }}</span>
      <button :disabled="products.number + 1 >= products.totalPages" @click="onPageChange(products.number + 1)">下一页</button>
      
      <!-- 跳转到指定页 -->
      <input v-model="jumpPage" type="number" min="1" :max="products.totalPages" class="page-jump-input" />
      <button @click="onPageJump">跳转</button>
    </div>

    <button @click="logout">登出</button>
    <router-link to="/">返回主页</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../router/axios';

// 初始化查询条件
const search = ref({
  owner: '',
  category: '',
  priceMin: null,
  priceMax: null,
});

const products = ref({
  content: [], // 产品列表
  totalElements: 0, // 总条目数
  totalPages: 0, // 总页数
  number: 0, // 当前页码（从 0 开始）
});
const totalPrice = ref(0); // 用于存储价格总和
const isLoading = ref(false); // 加载状态
const jumpPage = ref(1); // 默认页码从 1 开始（UI 显示），实际请求时会减 1 转为 0 开始
const router = useRouter();

// 查询参数清理，删除无效的查询参数
const cleanSearchParams = (params: any) => {
  const cleaned = { ...params };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === null || cleaned[key] === '') {
      delete cleaned[key];
    }
  });
  return cleaned;
};

// 获取产品列表的查询方法
const searchProducts = async (searchParams = {}) => {
  try {
    isLoading.value = true; // 设置加载状态
    const cleanedParams = cleanSearchParams(searchParams);
    const response = await axios.get('/api/products/search', {
      params: cleanedParams,
    });
    products.value = response.data.data;
    console.log('Products:', products.value);
  } catch (error) {
    console.error('Failed to search products:', error);
  } finally {
    isLoading.value = false; // 请求结束，重置加载状态
  }
};

// 删除产品
const deleteProduct = async (barcode: string) => {
  try {
    await axios.post('/api/products/delete', { barcode });
    console.log('删除成功:', barcode);
    searchProducts(); // 删除后重新查询
  } catch (error) {
    console.error('删除失败:', error);
  }
};

// 编辑产品
const editProduct = (barcode: string) => {
  router.push({ path: '/editproduct', query: { barcode } });
};

// 登出
const logout = async () => {
  try {
    await axios.post('/logout');
    window.location.href = '/login';
  } catch (error) {
    console.error('登出失败:', error);
  }
};

const fetchTotalPrice = async () => {
  try {
    const response = await axios.get('/api/products/totalPrice');
    totalPrice.value = (response.data.data || 0);
    console.log('Total Price:', totalPrice.value);
  } catch (error) {
    console.error('获取总价格失败:', error);
  }
};

// 组件加载时获取所有产品
onMounted(() => {
  searchProducts();
  fetchTotalPrice(); // 获取库存总价格
});

// 搜索事件
const onSearch = () => {
  searchProducts({
    owner: search.value.owner || null,
    category: search.value.category || null,
    priceMin: search.value.priceMin || null,
    priceMax: search.value.priceMax || null,
    page: 0, // 重置为第一页
    pageSize: 10, // 每页大小为 10
  });
};

// 分页功能
const onPageChange = (page: number) => {
  searchProducts({
    ...search.value,
    page: page, // 将前端的页码（从 0 开始）转换为后端的页码（从 1 开始）
    pageSize: 10, // 每页条目数
  });
};

// 跳转到指定页
const onPageJump = () => {
  if (jumpPage.value < 1 || jumpPage.value > products.value.totalPages) {
    alert(`请输入有效的页码，范围是 1 到 ${products.value.totalPages}`);
    return;
  }
  searchProducts({
    ...search.value,
    page: jumpPage.value , 
    pageSize: 10,
  });
};
</script>

<style scoped>
.product-image {
  max-width: 150px; /* 限制图片的最大宽度 */
  max-height: 100px; /* 限制图片的最大高度 */
  width: auto; /* 保持图片比例 */
  height: auto;
  object-fit: cover; /* 保证图片被裁剪而不变形 */
  border-radius: 4px; /* 可选：为图片添加圆角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 可选：为图片添加阴影 */
}

/* 让表格居中对齐 */
table {
  width: 100%;
  border-collapse: collapse;
}

td, th {
  text-align: center; /* 单元格内容居中 */
  vertical-align: middle; /* 垂直方向居中 */
  padding: 10px;
}

th {
  background-color: #f8f8f8;
  font-weight: bold;
}

.table-container {
  overflow-x: auto; /* 如果表格宽度过大，允许水平滚动 */
}

@media screen and (max-width: 768px) {
  .product-image {
    max-width: 100px; /* 针对小屏幕进一步调整图片大小 */
    max-height: 80px;
  }
}
</style>
