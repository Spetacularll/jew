<template>
  <el-form :model="form" label-width="120px" @submit.prevent="submitForm">
    <el-form-item label="产品名称">
      <el-input v-model="form.product.name" placeholder="请输入产品名称"></el-input>
    </el-form-item>

    <el-form-item label="产品图片">
      <el-upload
        action="#"
        :on-change="handleImageChange"
        :auto-upload="false"
        :show-file-list="false"
      >
        <el-button type="primary">上传图片</el-button>
      </el-upload>
    </el-form-item>

    <el-form-item label="供应商ID">
      <el-input v-model="form.supplierId" placeholder="请输入供应商ID"></el-input>
    </el-form-item>

    <el-form-item label="条形码样式">
      <el-input v-model="form.barcode.style" placeholder="请输入条形码样式"></el-input>
    </el-form-item>

    <el-form-item label="所有者">
      <el-input v-model="form.barcode.owner" placeholder="请输入所有者"></el-input>
    </el-form-item>

    <el-form-item label="时间">
      <el-input v-model="form.barcode.time" placeholder="请输入时间"></el-input>
    </el-form-item>

    <el-form-item label="序列号">
      <el-input v-model="form.barcode.serialNumber" placeholder="请输入序列号"></el-input>
    </el-form-item>

    <el-form-item label="圆环尺寸">
      <el-input v-model="form.barcode.circleSize" placeholder="请输入圆环尺寸"></el-input>
    </el-form-item>

    <el-form-item label="宽度">
      <el-input v-model="form.barcode.width" placeholder="请输入宽度"></el-input>
    </el-form-item>

    <el-form-item label="价格">
      <el-input v-model="form.barcode.price" placeholder="请输入价格"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" native-type="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import axios from '../router/axios';
import { ElMessage } from 'element-plus';

// 表单数据
const form = ref({
  product: {
    name: '',
    imageUrl: ''
  },
  supplierId: null,
  barcode: {
    style: '',
    owner: '',
    time: '',
    serialNumber: '',
    circleSize: '',
    width: '',
    price: ''
  },
  imageFile: null
});

// 处理图片上传
const handleImageChange = (file) => {
  form.value.imageFile = file.raw;
};

// 提交表单
const submitForm = async () => {
  const formData = new FormData();
  formData.append('imageFile', form.value.imageFile);
  formData.append('supplierId', form.value.supplierId);
  formData.append('product', JSON.stringify(form.value.product));
  formData.append('inputData', JSON.stringify(form.value.barcode));

  try {
    const response = await axios.post('/product/with-barcode', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      ElMessage.success('产品创建成功');
    } else {
      ElMessage.error('产品创建失败: ' + response.data.message);
    }
  } catch (error) {
    ElMessage.error('请求失败: ' + error.message);
  }
};
</script>

<style scoped>
.el-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>