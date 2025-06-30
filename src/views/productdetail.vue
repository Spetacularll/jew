<template>
  <div class="p-6">
    <el-card>
      <div class="flex items-center gap-4">
        <el-input
          v-model="barcode"
          placeholder="请输入商品条码"
          clearable
          size="large"
          style="width: 300px"
        />
        <el-button type="primary" @click="fetchRecords">查询</el-button>
      </div>
    </el-card>

<div v-if="outboundRecords.length" class="mt-6">
  <el-card>
    <template #header>
      <div class="flex items-center justify-between">
        <span>出库记录</span>
      </div>
    </template>
    <el-table :data="outboundRecords" style="width: 100%">
      <el-table-column prop="outboundId" label="记录ID" width="100" />
      <el-table-column prop="quantity" label="数量" width="100" />
      <el-table-column prop="outboundDate" label="出库日期" />
      <el-table-column prop="destination" label="目的地" />
      <el-table-column prop="returned" label="是否归还">
        <template #default="{ row }">
          <el-tag :type="row.returned ? 'success' : 'danger'">
            {{ row.returned ? '已归还' : '未归还' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>


    <div v-if="inboundRecords.length" class="mt-6">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span>入库记录</span>
          </div>
        </template>
        <el-table :data="inboundRecords" style="width: 100%">
          <el-table-column prop="id" label="记录ID" width="100" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="inboundDate" label="入库日期" />
          <!-- 根据你的 InboundRecord 结构再加别的字段 -->
        </el-table>
      </el-card>
    </div>

    <div v-if="loaded && !inboundRecords.length && !outboundRecords.length" class="mt-6">
      <el-empty description="该商品暂无入出库记录" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import axios from "../router/axios";

const route = useRoute();
const barcode = ref(route.params.barcode);
const product = ref(null);
const inboundRecords = ref([]);
const outboundRecords = ref([]);
const loaded = ref(false);

const fetchRecords = async () => {
  if (!barcode.value) {
    ElMessage.warning("请输入条码！");
    return;
  }

  try {
    const res = await axios.get(`/api/products/${barcode.value}/records`);
    const data = res.data.data;
    console.log("Fetched records:", data);
    product.value = data.product;
    inboundRecords.value = data.inboundRecords || [];
    outboundRecords.value = data.outboundRecords || [];
    loaded.value = true;
  } catch (error) {
    console.error(error);
    ElMessage.error("查询失败，请检查条码是否正确！");
    product.value = null;
    inboundRecords.value = [];
    outboundRecords.value = [];
    loaded.value = false;
  }
};

onMounted(fetchRecords);
</script>

<style scoped>
/* 简单留白 */
.mt-6 {
  margin-top: 24px;
}
/* 统一字体变大 */
.p-6 {
  font-size: 18px;
}

/* 表格内容字体加大 */
:deep(.el-table__cell) {
  font-size: 18px;
}

/* 表头字体加大 */
:deep(.el-table__header-wrapper th) {
  font-size: 18px;
  font-weight: 600;
}

/* 输入框字体加大 */
:deep(.el-input__inner) {
  font-size: 18px;
  height: 42px;
}

/* 按钮字体加大 */
:deep(.el-button) {
  font-size: 18px;
  height: 42px;
  padding: 10px 20px;
}

/* 卡片标题加大 */
:deep(.el-card__header) {
  font-size: 20px;
  font-weight: 600;
}

</style>
