<template>
  <div class="container">
    <h1>字符串拼接器</h1>

    <!-- 圈口 -->
    <div class="form-group">
      <label for="circleSize">圈口 (48.0 - 66.0):</label>
      <input
        id="circleSize"
        v-model.number="circleSize"
        class="input"
        type="number"
        step="0.1"
        min="48.0"
        max="66.0"
        placeholder="请输入圈口"
      />
    </div>

    <!-- 宽度 -->
    <div class="form-group">
      <label for="width">宽度 (5 - 18):</label>
      <input
        id="width"
        v-model.number="width"
        class="input"
        type="number"
        step="1"
        min="5"
        max="18"
        placeholder="请输入宽度"
      />
    </div>

    <!-- 所有人 -->
    <div class="form-group">
      <label for="owner">所有者:</label>
      <select id="owner" v-model="owner" class="select">
        <option value="">请选择</option>
        <option value="AB">AB</option>
        <option value="CD">CD</option>
        <option value="EF">EF</option>
      </select>
    </div>

    <!-- 样式 -->
    <div class="form-group">
      <label for="style">样式:</label>
      <select id="style" v-model="style" class="select">
        <option value="">请选择</option>
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="03">03</option>
      </select>
    </div>

    <!-- 编号 -->
    <div class="form-group">
      <label for="serialNumber">编号 (4位数):</label>
      <input
        id="serialNumber"
        v-model="serialNumber"
        class="input"
        type="text"
        maxlength="4"
        placeholder="请输入编号"
      />
    </div>

    <!-- 时间 -->
    <div class="form-group">
      <label for="time">时间 (4位数):</label>
      <input
        id="time"
        v-model="time"
        class="input"
        type="text"
        maxlength="4"
        placeholder="请输入时间"
      />
    </div>

    <!-- 价格 -->
    <div class="form-group">
      <label for="price">价格 (1000 - 500000):</label>
      <input
        id="price"
        v-model.number="price"
        class="input"
        type="number"
        step="1000"
        min="1000"
        max="500000"
        placeholder="请输入价格"
      />
    </div>

    <!-- 提交按钮 -->
    <div class="form-group">
      <button @click="submitString" class="button" :disabled="loading">
        {{ loading ? "提交中..." : "提交" }}
      </button>
    </div>

    <!-- 拼接结果 -->
    <div v-if="resultString" class="response">
      <p>拼接结果: {{ resultString }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "../router/axios";

const circleSize = ref(null); // 圈口
const width = ref(null); // 宽度
const owner = ref(""); // 所有人
const style = ref(""); // 样式
const serialNumber = ref(""); // 编号
const time = ref(""); // 时间
const price = ref(null); // 新增价格字段
const resultString = ref(""); // 拼接结果
const loading = ref(false); // 加载状态

const submitString = async () => {
  // 校验表单完整性
  if (
    !circleSize.value ||
    !width.value ||
    !owner.value ||
    !style.value ||
    !serialNumber.value ||
    !time.value
  ) {
    alert("请完整填写所有选项和输入框！");
    return;
  }

  const inputData = {
    style: style.value,
    owner: owner.value,
    time: time.value,
    serialNumber: serialNumber.value,
    circleSize: circleSize.value,
    width: width.value,
    price: price.value, // 添加价格字段
  };

  try {
    loading.value = true;
    const response = await axios.post("/api/barcode/generateString", inputData);
    resultString.value = response.data;
  } catch (error) {
    console.error(error);
    alert("提交失败，请检查后重试！");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background: #fff;
}
h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
}
.input,
.select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.button {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}
.button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.button:hover {
  background-color: #0056b3;
}
.response {
  margin-top: 20px;
  font-size: 14px;
  color: green;
  text-align: center;
}
</style>
