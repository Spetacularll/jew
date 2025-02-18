<script setup>
import { ref } from "vue";
import axios from "../router/axios";

// 初始化 BarcodeRequest 数据
const product = ref({
  style: "",         // 样式
  owner: "",         // 所有人
  time: "",          // 时间
  serialNumber: "",  // 编号
  circleSize: null,  // 圈口
  width: null,       // 宽度
  price: null,       // 价格
  supplier: null,    // 供应商ID
  imageFile: null,   // 图片文件
});

// 主色和次色选择
const primaryColor = ref("");
const secondaryColor = ref("");
const isFiftyFifty = ref(false);

// 加载状态
const isLoading = ref(false);
const isPrinting = ref(false);

// 提交表单
const submitForm = async () => {
  try {
    isLoading.value = true;
    isPrinting.value = false;

    const formData = new FormData();
    let styleWithFiftyFifty = isFiftyFifty.value ? "5" : "0";  // 五五分成
    const currentStyle = `${styleWithFiftyFifty}${product.value.style}${primaryColor.value}${secondaryColor.value}`;

    product.value.style = currentStyle;
    product.value.owner = "H";  // 默认所有人
    const { imageFile, ...dto } = product.value;
    formData.append("dto", JSON.stringify(dto));

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    // 创建两个请求的 URL
    const url1 = "https://japp.vip.cpolar.cn/api/barcode/create-product";
    const url2 = "/api/barcode/create-product";

    // 显示打印机处理提示
    isPrinting.value = true;
    alert("打印机正在处理，请耐心等待...");

    const [response1, response2] = await Promise.all([
      axios.post(url1, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      }),
      axios.post(url2, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000,
      })
    ]);

    if (response1.data.code === 200) {
      console.log("产品提交成功:", response1.data.message);
      alert("打印成功！");
    } else {
      alert(`打印操作失败: ${response1.data.message}`);
    }

    if (response2.data.code === 200) {
      alert(response2.data.message);
    } else {
      console.log("产品提交失败:", response2.data.message);
      alert(`图片上传操作失败: ${response2.data.message}`);
    }

  } catch (error) {
    console.error("提交失败:", error);
    if (error.code === 'ECONNABORTED') {
      alert("打印机响应超时，请检查打印机状态");
    } else if (error.response) {
      alert(`请求失败: ${error.response.data.message}`);
    } else {
      alert("网络异常，请检查网络连接");
    }
  } finally {
    isLoading.value = false;
    isPrinting.value = false;
  }
};

// 打印单独功能
const printOnly = async () => {
  try {
    isPrinting.value = true;
    const formData = new FormData();
    const currentStyle = `${isFiftyFifty.value ? "5" : "0"}${product.value.style}${primaryColor.value}${secondaryColor.value}`;
    product.value.style = currentStyle;
    product.value.owner = "H";  // 默认所有人
    const { imageFile, ...dto } = product.value;
    formData.append("dto", JSON.stringify(dto));

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const printUrl = "/api/barcode/print-only";  // 新增的打印功能URL
    const response = await axios.post(printUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 10000,
    });

    if (response.data.code === 200) {
      alert("打印成功！");
    } else {
      alert(`打印失败: ${response.data.message}`);
    }
  } catch (error) {
    console.error("打印失败:", error);
    alert("打印时发生错误，请稍后再试！");
  } finally {
    isPrinting.value = false;
  }
};
</script>

<template>
  <div class="form-container">
    <h1 class="form-title">商品创建表单</h1>
    <form class="form" @submit.prevent="submitForm">
      <!-- 表单内容... -->
      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="isLoading">
          {{ isLoading ? "提交中..." : "提交" }}
        </button>
        <button type="button" class="btn-print" @click="printOnly" :disabled="isPrinting">
          {{ isPrinting ? "打印中..." : "只打印" }}
        </button>
      </div>
    </form>

    <!-- 加载提示 -->
    <div v-if="isLoading" class="loading">正在提交，请稍候...</div>
    <div v-if="isPrinting" class="loading">打印机正在处理，请耐心等待...</div>
  </div>
</template>
