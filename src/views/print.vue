<template>
    <div>
        <h1>产品管理</h1>

        <!-- 搜索产品 -->
        <div>
            <label for="barcode">条码：</label>
            <input v-model="barcode" id="barcode" placeholder="输入条码" />
            <button @click="searchProduct">搜索</button>
        </div>

        <!-- 显示产品信息 -->
        <div v-if="product">
            <h2>产品信息</h2>
            <p><strong>条码:</strong> {{ product.barcode }}</p>
            <p><strong>分类:</strong> {{ product.category }}</p>
            <p><strong>价格:</strong> ¥{{ product.price }}</p>
            <p><strong>描述:</strong> {{ product.description }}</p>
            <p><strong>库存:</strong> {{ product.stock }}</p>
            <p><strong>是否已售:</strong> {{ product.sell ? '是' : '否' }}</p>

            <p v-if="product.imageUrl">
                <strong>图片:</strong>
                <img :src="product.imageUrl" alt="产品图片" style="max-width: 300px; margin-top: 10px;" />
            </p>

            <!-- 让用户输入时间 -->
            <label for="time">输入时间：</label>
            <input v-model="inputTime" id="time" placeholder="请输入时间 (YYYY-MM-DD)" />

            <!-- 按钮 -->
            <button @click="printProduct">打印</button>
        </div>

        <!-- 成功提示 -->
        <div v-if="successMessage" class="success">{{ successMessage }}</div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getProductByBarcode, updateProductTime } from "../router/api"; // ✅ 导入 API
import axios from "../router/axios";

const route = useRoute();
const barcode = ref("");
const product = ref(null);
const errorMessage = ref("");
const successMessage = ref("");
const inputTime = ref("");

// 搜索产品
const searchProduct = async () => {
    if (!barcode.value) {
        errorMessage.value = "条码不能为空";
        return;
    }

    try {
        errorMessage.value = "";
        const response = await getProductByBarcode(barcode.value);

        if (response.code === 200) {
            product.value = response.data;
        } else {
            errorMessage.value = response.message || "未找到产品";
        }
    } catch (error) {
        console.error("搜索产品失败:", error);
        errorMessage.value = "搜索产品失败，请稍后再试";
    }
};

// ✅ 更新产品时间
const updateTime = async () => {
    if (!product.value) {
        errorMessage.value = "请先搜索产品";
        return;
    }
    if (!inputTime.value) {
        errorMessage.value = "请输入时间";
        return;
    }

    try {
        const response = await updateProductTime(product.value.barcode, inputTime.value);
        console.log("时间更新成功:", response.data);
        successMessage.value = "时间更新成功！";
        setTimeout(() => (successMessage.value = ""), 3000);
    } catch (error) {
        console.error("时间更新失败:", error);
        errorMessage.value = "时间更新失败，请稍后再试";
    }
};

// 打印产品（先更新时间）
async function printProduct() {
    try {
        if (!product.value) {
            console.error("Product not found");
            return;
        }

        // ✅ 先更新时间
        await updateTime();

        // 解析 serialNumber
        const serialNumber = product.value.barcode.startsWith("7693") 
            ? product.value.barcode.substring(4) 
            : product.value.barcode;

        // 解析 circleSize 和 width
        const [circleSize, width] = product.value.description ? product.value.description.split("/") : ["", ""];

        // 构造 BarcodeRequest
        const barcodeRequest = {
            style: product.value.category,
            owner: "H",
            time: inputTime.value || "", // ✅ 确保使用最新的时间
            serialNumber: serialNumber,
            circleSize: circleSize,
            width: width,
            price: product.value.price,
            supplier: product.value.supplier || "1",
        };

        console.log("BarcodeRequest:", barcodeRequest);

        // 构造 FormData
        const formData = new FormData();
        formData.append("dto", JSON.stringify(barcodeRequest));

        // 发送请求
        const response = await axios.post("https://japp.vip.cpolar.cn/api/barcode/create-product", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Print response:", response.data);

        // ✅ 设置成功提示信息
        successMessage.value = "打印成功！";
        setTimeout(() => (successMessage.value = ""), 3000);

    } catch (error) {
        console.error("Print error:", error);
        errorMessage.value = "打印失败，请稍后重试";
    }
}

// 自动获取条码并搜索
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
    font-weight: bold;
}
img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    max-width: 100%;
    height: auto;
}
</style>
