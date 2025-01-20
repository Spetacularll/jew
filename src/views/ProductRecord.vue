<template>
    <div>
      <h1>产品记录</h1>
  
      <h2>产品详情</h2>
      <p>产品名称: {{ product.productName }}</p>
      <p>条形码: {{ product.barcode }}</p>
      <p>类别: {{ product.category }}</p>
      <p>价格: {{ product.price }}</p>
      <p>描述: {{ product.description }}</p>
      <p>库存: {{ product.stock }}</p>
  
      <h2>入库记录</h2>
      <table>
        <thead>
          <tr>
            <th>入库ID</th>
            <th>供应商</th>
            <th>数量</th>
            <th>日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in inboundRecords" :key="record.Id">
            <td>{{ record.Id }}</td>
            <td>{{ record.supplier.supplierName }}</td>
            <td>{{ record.quantity }}</td>
            <td>{{ record.inboundDate }}</td>
          </tr>
        </tbody>
      </table>
  
      <h2>出库记录</h2>
      <table>
        <thead>
          <tr>
            <th>出库ID</th>
            <th>数量</th>
            <th>日期</th>
            <th>去向</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in outboundRecords" :key="record.Id">
            <td>{{ record.Id }}</td>
            <td>{{ record.quantity }}</td>
            <td>{{ record.outboundDate }}</td>
            <td>{{ record.destination }}</td>
          </tr>
        </tbody>
      </table>
  
      <router-link to="/">返回主页</router-link>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from '../router/axios';
  
  export default defineComponent({
    name: 'ProductRecords',
    setup() {
      const product = ref<any>({});
      const inboundRecords = ref<Array<any>>([]);
      const outboundRecords = ref<Array<any>>([]);
  
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get('/api/products/barcode');
          product.value = response.data.product;
          inboundRecords.value = response.data.inboundRecords;
          outboundRecords.value = response.data.outboundRecords;
        } catch (error) {
          console.error('Failed to fetch product details:', error);
        }
      };
  
      onMounted(() => {
        fetchProductDetails(); // 页面加载时获取产品详情和记录
      });
  
      return {
        product,
        inboundRecords,
        outboundRecords,
      };
    },
  });
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
    text-align: left;
  }
  </style>
  