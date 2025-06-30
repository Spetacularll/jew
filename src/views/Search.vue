<template>
  <div>
    <h1>产品管理</h1>


    <p> 
      输入条码后可以对商品进行卖出和再入库操作 
    </p>


    <!-- 搜索产品 -->
    <div>
      <label for="barcode">条码：</label>
      <input v-model="barcode" id="barcode" placeholder="输入条码" />
      <button @click="searchProduct" :disabled="loading">搜索</button>
    </div>

    <!-- 显示加载中 -->
    <div v-if="loading" class="info">加载中...</div>

    <!-- 显示产品信息 -->
    <div v-if="product">
      <h2>产品信息</h2>
      <p><strong>条码:</strong> {{ product.barcode }}</p>
      <p><strong>分类:</strong> {{ product.category }}</p>
      <p><strong>价格:</strong> ¥{{ product.price }}</p>
      <p><strong>描述:</strong> {{ product.description }}</p>
      <p><strong>库存:</strong> {{ product.stock }}</p>
      <p><strong>是否已售:</strong> {{ product.sell ? "是" : "否" }}</p>
      <p v-if="product.imageUrl">
        <strong>图片:</strong>
        <img :src="product.imageUrl" alt="产品图片" style="max-width: 300px; margin-top: 10px;" />
      </p>

      <!-- 卖出部分 -->
      <div v-if="!product.sell">
        <label for="sellPrice">销售价格：</label>
        <input v-model="sellPrice" id="sellPrice" type="number" placeholder="输入销售价格" />

        <label for="sellTime">销售时间：</label>
        <input v-model="sellTime" id="sellTime" type="datetime-local" />

        <button @click="sell" :disabled="!sellPrice || loading">卖出</button>
      </div>

      <!-- 入库按钮 -->
      <button @click="reinbound" v-if="product.sell" :disabled="loading">入库</button>
    </div>

    <!-- 成功/错误提示 -->
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getProductByBarcode, sellProduct, reinboundProduct } from "../router/api";

const route = useRoute();
const barcode = ref("");
const product = ref(null);
const sellPrice = ref(null);
const sellTime = ref(null);

const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

// 自动清除提示信息
const showMessage = (msg, isError = false) => {
  if (isError) {
    errorMessage.value = msg;
    successMessage.value = "";
  } else {
    successMessage.value = msg;
    errorMessage.value = "";
  }
  setTimeout(() => {
    successMessage.value = "";
    errorMessage.value = "";
  }, 3000);
};

// 搜索产品
const searchProduct = async () => {
  if (!barcode.value) {
    showMessage("条码不能为空", true);
    return;
  }

  try {
    loading.value = true;
    const response = await getProductByBarcode(barcode.value);
    if (response.code === 200) {
      product.value = response.data;
      showMessage("产品加载成功");
    } else {
      showMessage(response.message || "未找到产品", true);
    }
  } catch (error) {
    console.error("搜索产品失败:", error);
    showMessage("搜索产品失败，请稍后再试", true);
  } finally {
    loading.value = false;
  }
};

// 卖出产品
const sell = async () => {
  if (!sellPrice.value) {
    showMessage("请填写销售价格", true);
    return;
  }

  try {
    loading.value = true;
    const payload = {
      barcode: product.value.barcode,
      sellPrice: sellPrice.value,
      sellTime: sellTime.value ? new Date(sellTime.value).toISOString() : null,
    };

    const response = await sellProduct(payload);
    if (response.code === 200) {
      product.value = response.data;
      showMessage("卖出成功");
    } else {
      showMessage(response.message || "卖出失败", true);
    }
  } catch (error) {
    console.error("卖出产品失败:", error);
    showMessage("卖出产品失败，请稍后再试", true);
  } finally {
    loading.value = false;
  }
};

// 入库产品
const reinbound = async () => {
  try {
    loading.value = true;
    const response = await reinboundProduct([product.value.barcode]);
    if (response.code === 200) {
      product.value = response.data[0];
      showMessage("入库成功");
    } else {
      showMessage(response.message || "入库失败", true);
    }
  } catch (error) {
    console.error("入库产品失败:", error);
    showMessage("入库产品失败，请稍后再试", true);
  } finally {
    loading.value = false;
  }
};

// 页面加载后自动获取条码
onMounted(() => {
  if (route.params.barcode) {
    barcode.value = route.params.barcode;
    searchProduct();
  }
});
</script>

<style>
.error {
  color: red;
  margin-top: 10px;
}
.success {
  color: green;
  margin-top: 10px;
}
.info {
  color: #666;
  margin-top: 10px;
}
img {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  max-width: 100%;
  height: auto;
}
</style>
