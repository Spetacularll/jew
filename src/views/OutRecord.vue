<template>
  <div>
    <!-- 展示所有目的地 -->
    <h2>目的地列表</h2>
    <ul>
      <li 
        v-for="item in destinationsWithStats" 
        :key="item.destination" 
        @click="selectDestination(item.destination)"
      >
        {{ item.destination }} 
        <span style="color: gray;">(数量: {{ item.totalProducts }}, 总价: {{ item.totalPrice }})</span>
      </li>
    </ul>

    <!-- 展示选中的目的地货物 -->
    <h2 v-if="selectedDestination">货物列表 ({{ selectedDestination }})</h2>
    <div v-if="isLoading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="product in products" :key="product.productId">
        {{ product.barcode }} - {{ product.price }}
      </li>
    </ul>
    <h2>已售出统计</h2>
    <ul>
      <li v-for="stat in soldStatistics" :key="stat.destination">
        {{ stat.destination }} - 数量: {{ stat.totalProducts }}, 总价: {{ stat.totalPrice.toFixed(2) }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import axios from '../router/axios';

export default {
  setup() {
    const destinations = ref([]); // 所有目的地
    const statistics = ref([]); // 统计信息
    const products = ref([]); // 当前选中的货物
    const selectedDestination = ref(null); // 当前选中的目的地
    const isLoading = ref(false); // 加载状态
    const error = ref(null); // 错误信息
    const soldStatistics = ref([]); // 已售出统计信息
    // 获取所有目的地
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('/api/products/destinations');
        if (response.data.success && Array.isArray(response.data.data)) {
          destinations.value = response.data.data;
          console.log("destinations value :" , destinations.value);
        } else {
          console.error('获取目的地失败:', response.data.message);
        }
      } catch (err) {
        console.error('获取目的地失败:', err);
      }
    };
    const fetchSoldStatistics = async () => {
  try {
    const response = await axios.get('/api/statistics/sold');
    if (response.data.success && Array.isArray(response.data.data)) {
      soldStatistics.value = response.data.data;
    } else {
      console.error('获取已售出统计信息失败:', response.data.message);
    }
  } catch (err) {
    console.error('获取已售出统计信息失败:', err);
  }
};
    // 获取统计信息
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/api/statistics/destinations');
        if (response.data.success && Array.isArray(response.data.data)) {
          statistics.value = response.data.data;
      //    console.log("response:" , response.data.data);
          console.log("statistics value :" , statistics.value);
        } else {
          console.error('获取统计信息失败:', response.data.message);
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
        const response = await axios.get('/api/products/by-destination', {
          params: { destination },
        });
        console.log(response.data); 
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

    // 计算属性：将目的地和统计信息合并
    const destinationsWithStats = computed(() => {
      
      return destinations.value.map(destination => {
        const stat = statistics.value.find(s => s.destination === destination);
        return {
          destination,
          totalProducts: stat?.totalProducts || 0,
          totalPrice: stat?.totalPrice || 0
        };
      });
    });

    // 页面加载时获取数据
    onMounted(async () => {
      await Promise.all([fetchDestinations(), fetchStatistics(), fetchSoldStatistics()]);
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

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  cursor: pointer;
  margin: 5px 0;
}
li:hover {
  color: blue;
}
</style>