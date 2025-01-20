<template>
  <div class="container">
    <h1>出库记录</h1>
    <table>
      <thead>
        <tr>
          <th>去处</th>
          <th>名称</th>
          <th>条形码</th>
          <th>出库日期</th>
          <th>价格</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in outboundRecords" :key="index">
          <td>{{ record.destination }}</td>
          <td>{{ record.productName }}</td>
          <td>{{ record.barcode }}</td>
          <td>{{ record.outboundDate }}</td>
          <td>{{ record.price }}</td>
        </tr>
      </tbody>
    </table>
    <router-link to="/">返回主页</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from '../router/axios';

export default defineComponent({
  name: 'OutboundRecords',
  setup() {
    const outboundRecords = ref<any[]>([]); // 用于存储出库记录数据

    // 在组件挂载时获取出库记录
    onMounted(async () => {
      try {
        const response = await axios.get('/api/outbound/outbound-records'); // 替换为实际 API 路径
        outboundRecords.value = response.data.data;
        console.log(response.data.data)
      } catch (err) {
        console.error('获取出库记录失败', err);
      }
    });

    return {
      outboundRecords,
    };
  },
});
</script>
  
  <style scoped>
  .container {
    width: 80%;
    margin: 0 auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 8px 12px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #f4f4f4;
  }
  </style>
  