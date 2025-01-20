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

// 五五分成勾选框
const isFiftyFifty = ref(false);

// 加载状态
const isLoading = ref(false);
const isPrinting = ref(false);

// 提交表单
const submitForm = async () => {
  try {
    isLoading.value = true; // 开始加载
    isPrinting.value = false; // 重置打印机状态

    const formData = new FormData();

    // 拼接样式，考虑五五分成、主色和次色
    let styleWithFiftyFifty = isFiftyFifty.value ? "5" : "0";  // 根据勾选决定前缀
    const currentStyle = `${styleWithFiftyFifty}${product.value.style}${primaryColor.value}${secondaryColor.value}`;

    // 将拼接后的样式赋值给 product.style
    product.value.style = currentStyle;
    product.value.owner = "H";  // 所有人默认为 H
    // 将 DTO 转为 JSON 字符串并添加到 FormData
    const { imageFile, ...dto } = product.value; // 拆分文件与其他字段
    formData.append("dto", JSON.stringify(dto));

    // 添加图片文件到 FormData（如果有文件）
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    // 创建两个请求的 URL
    const url1 = "https://japp.vip.cpolar.cn/api/barcode/create-product";
    const url2 = "/api/barcode/create-product";  // 替换为第二个请求的 URL

    // 显示打印机处理提示
    isPrinting.value = true;
    alert("打印机正在处理，请耐心等待...");

    // 使用 Promise.all 并行发送两个请求
    const [response1, response2] = await Promise.all([
      axios.post(url1, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 设置超时时间为 60 秒
      }),
      axios.post(url2, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000, // 第二个请求的超时时间可以保持较短
      })
    ]);

    // 处理返回结果
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
    isLoading.value = false; // 结束加载
    isPrinting.value = false; // 重置打印机状态
  }
};
</script>



<template>
  <div class="form-container">
    <h1 class="form-title">商品创建表单</h1>
    <form class="form" @submit.prevent="submitForm">
      <!-- 五五分成 -->
      <div class="form-group">
        <label for="isFiftyFifty">是否五五分成:</label>
        <input
          type="checkbox"
          id="isFiftyFifty"
          v-model="isFiftyFifty"
        />
      </div>
      <!-- 样式 -->
      <div class="form-group">
        <label for="style">样式:</label>
        <select id="style" v-model="product.style" class="input select">
          <option value="">请选择</option>
          <option value="1">正圈</option>
          <option value="2">圆条</option>
          <option value="3">贵妃</option>
        </select>
      </div>
      <!-- 主色 -->
      <div class="form-group">
        <label for="primaryColor">主色:</label>
        <select id="primaryColor" v-model="primaryColor" class="input select">
          <option value="">请选择主色</option>
          <option value="1">种水</option>
          <option value="2">绿色</option>
          <option value="3">紫色</option>
          <option value="4">飘花</option>
          <option value="5">黄色</option>
          <option value="6">油青 兰水湖</option>
          <option value="7">特色</option>
        </select>
      </div>

      <!-- 次色 -->
      <div class="form-group">
        <label for="secondaryColor">次色:</label>
        <select id="secondaryColor" v-model="secondaryColor" class="input select">
          <option value="">请选择次色</option>
          <option value="0">无</option>
          <option value="1">种水</option>
          <option value="2">绿色</option>
          <option value="3">紫色</option>
          <option value="4">飘花</option>
          <option value="5">黄色</option>
          <option value="6">油青 兰水湖</option>
          <option value="7">特色</option>
        </select>
      </div>

      <!-- 时间 -->
      <div class="form-group">
        <label for="time">时间:</label>
        <input id="time" v-model="product.time" type="string" class="input" required />
      </div>

      <!-- 编号 -->
      <div class="form-group">
        <label for="serialNumber">编号:</label>
        <input
          id="serialNumber"
          v-model="product.serialNumber"
          type="text"
          class="input"
          placeholder="请输入编号"
          required
        />
      </div>

      <!-- 圈口 -->
      <div class="form-group">
        <label for="circleSize">圈口:</label>
        <input
          id="circleSize"
          v-model.number="product.circleSize"
          type="number"
          step="0.1"
          min="48.0"
          max="66.0"
          class="input"
          placeholder="请输入圈口 (48.0 - 66.0)"
          required
        />
      </div>

      <!-- 宽度 -->
      <div class="form-group">
        <label for="width">宽度:</label>
        <input
          id="width"
          v-model.number="product.width"
          type="number"
          class="input"
          step="0.1"
          min="5"
          max="21"
          placeholder="请输入宽度 (5 - 21)"
          required
        />
      </div>

      <!-- 价格 -->
      <div class="form-group">
        <label for="price">价格:</label>
        <input
          id="price"
          v-model.number="product.price"
          type="number"
          class="input"
          step="100"
          min="1000"
          max="500000"
          placeholder="请输入价格 (1000 - 1000000)"
          required
        />
      </div>

      <!-- 供应商 -->
      <div class="form-group">
        <label for="supplier">供应商:</label>
        <input
          id="supplier"
          v-model="product.supplier"
          type="number"
          class="input"
          placeholder="请输入供应商 ID"
          required
        />
      </div>

      <!-- 图片文件 -->
      <div class="form-group">
        <label for="imageFile">图片文件:</label>
        <input
          id="imageFile"
          type="file"
          class="input file-input"
          @change="e => (product.imageFile = e.target.files[0])"
        />
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="isLoading">
          {{ isLoading ? "提交中..." : "提交" }}
        </button>
      </div>

      <!-- 加载提示 -->
      <div v-if="isLoading" class="loading">正在提交，请稍候...</div>
      <div v-if="isPrinting" class="loading">打印机正在处理，请耐心等待...</div>
    </form>
  </div>
</template>

<style >
/* 全局变量 */
:root {
  --primary-color: #4caf50;
  --secondary-color: #ffffff;
  --background-gradient: linear-gradient(135deg, #d7e8fa, #f7d9d9);
  --input-border-color: #ddd;
  --btn-hover-color: #45a049;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

/* 主容器 */
.form-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: var(--secondary-color);
  border-radius: 15px;
  box-shadow: 0 8px 20px var(--shadow-color);
  background: var(--background-gradient);
}

/* 标题 */
.form-title {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

/* 表单布局 */
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 表单组 */
.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #444;
}

/* 输入框 */
.input {
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid var(--input-border-color);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.4);
}

/* 文件输入 */
.file-input {
  padding: 8px;
  background-color: var(--secondary-color);
  cursor: pointer;
}

/* 按钮组 */
.form-actions {
  text-align: center;
}

.btn-submit {
  background-color: var(--primary-color);
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.btn-submit:hover {
  background-color: var(--btn-hover-color);
  transform: translateY(-2px);
}

.btn-submit:active {
  transform: translateY(0);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}
</style>
  