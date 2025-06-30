<template>
    <div>
      <h2>Sorted Products</h2>
      <ul>
        <li v-for="product in products" :key="product.id">
          {{ product.productCode }} - Barcode: {{ product.barcode }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from '../router/axios';
  
  export default {
    data() {
      return {
        products: [],
      };
    },
    mounted() {
      this.fetchProducts();
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await axios.get('/api/products/missing-barcodes');
          this.products = response.data;
          console.log("products value :" , this.products);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      }
    }
  };
  </script>