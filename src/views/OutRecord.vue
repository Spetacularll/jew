<script>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import axios from '../router/axios';
import BarcodeSearch from '@/components/BarcodeSearch.vue';

export default {
  components: {
    BarcodeSearch
  },
  setup() {
    const destinations = ref([]);
    const statistics = ref([]);
    const products = ref([]);
    const selectedDestination = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const soldStatistics = ref([]);

    // 获取所有目的地
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('/api/products/destinations');
        if (response.data.success && Array.isArray(response.data.data)) {
          console.log('获取的目的地:', response.data.data);
          destinations.value = response.data.data;
          console.log(destinations.value);
        }
      } catch (err) {
        console.error('获取目的地失败:', err);
      }
    };



    // 获取统计信息
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/api/statistics/destinations');
        if (response.data.success && Array.isArray(response.data.data)) {
          console.log('获取statistics:', response.data.data);
          statistics.value = response.data.data;
          console.log(statistics.value);

        }
      } catch (err) {
        console.error('获取统计信息失败:', err);
      }
    };

    // 根据目的地获取货物
    const fetchProductsByDestination = async (destination) => {
      isLoading.value = true;
      error.value = null;
      try {
        const response = await axios.get('/api/products/by-destination', { params: { destination } });
        if (response.data.success && Array.isArray(response.data.data)) {
          products.value = response.data.data;
        } else {
          throw new Error(response.data.message || '获取货物失败');
        }
      } catch (err) {
        error.value = err.message;
        products.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // 用户选择某个目的地
    const selectDestination = (destination) => {
      selectedDestination.value = destination;
      fetchProductsByDestination(destination);
    };

    // 计算属性：将目的地和统计信息合并，并过滤掉数量为 0 的目的地
    const destinationsWithStats = computed(() => {
      return statistics.value.map(stat => ({
        destination: stat.destination.trim(),
        totalProducts: stat.totalProducts,
        totalPrice: stat.totalPrice
  })).filter(item => item.totalProducts > 0);
});



    // 页面加载时获取数据
    onMounted(async () => {
      await Promise.all([fetchDestinations(), fetchStatistics()]);
    });

    // 清理状态
    onUnmounted(() => {
      destinations.value = [];
      statistics.value = [];
      products.value = [];
      selectedDestination.value = null;
    });

    return {
      destinationsWithStats,
      products,
      selectedDestination,
      selectDestination,
      isLoading,
      error,
      soldStatistics
      };
  },
};
</script>


<template>
  <div class="container">
    <!-- 条码搜索 -->
    <div class="search-section">
      <BarcodeSearch />
    </div>

    <!-- 展示所有目的地 -->
    <div class="card">
      <h2 class="section-title">📦 可用目的地</h2>
      <ul class="destination-list">
        <li 
          v-for="item in destinationsWithStats" 
          :key="item.destination" 
          @click="selectDestination(item.destination)"
          :class="{ selected: selectedDestination === item.destination }"
        >
          <div class="destination-name">{{ item.destination }}</div>
          <div class="stats">
            数量: {{ item.totalProducts }} | 总价: ￥{{ (item.totalPrice) }}
          </div>
        </li>
      </ul>
    </div>

    <!-- 展示选中的目的地货物 -->
    <div v-if="selectedDestination" class="card">
      <h2 class="section-title">📋 货物列表 - {{ selectedDestination }}</h2>
      <div v-if="isLoading" class="loading">正在加载...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="products.length > 0" class="product-list">
        <ul>
          <li v-for="product in products" :key="product.productId" class="product-item">
            <router-link :to="'/search/' + product.barcode" class="product-link">
              {{ product.barcode }} - ￥{{ (product.price) }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>



<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(to bottom right, #f9fbff, #ffffff);
  border-radius: 12px;
  font-size: 18px;
}

.search-section {
  margin-bottom: 30px;
}

.card {
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.destination-list {
  list-style-type: none;
  padding: 0;
}

.destination-list li {
  cursor: pointer;
  padding: 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #f6faff;
  transition: all 0.3s ease;
  border: 1px solid #d0e3ff;
}

.destination-list li:hover {
  background-color: #e6f2ff;
}

.destination-list li.selected {
  background-color: #d2e9ff;
  border-color: #409eff;
  font-weight: 600;
}

.destination-name {
  font-size: 16px;
  color: #333;
}

.stats {
  font-size: 20px; /* 原来是 14px，稍微加大 */
  color: #444;     /* 从灰色提亮一点 */
  font-weight: 500;
  margin-top: 6px;
}

.loading,
.error {
  text-align: center;
  font-size: 16px;
  padding: 20px;
}

.loading {
  color: #409eff;
}

.error {
  color: #e74c3c;
}

.product-list ul {
  list-style-type: none;
  padding: 0;
}

.product-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.product-link {
  text-decoration: none;
  color: #007bff;
  transition: color 0.2s;
  font-size: 18px;
}

.product-link:hover {
  color: #0056b3;
}
</style>
