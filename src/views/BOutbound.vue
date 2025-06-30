<template>
  <div class="container" v-loading="isLoading" element-loading-text="正在处理，请稍候..." element-loading-spinner="el-icon-loading">
    <el-card>
      <h2>批量产品出库</h2>

      <el-form @submit.prevent="showConfirmDialog" label-width="80px">
        <!-- 批次名称 -->
        <el-form-item label="批次名称">
          <el-input v-model="batchName" placeholder="请输入批次名称，如 2025-04-11 下午出库" />
        </el-form-item>

        <!-- 条形码输入框 -->
        <el-form-item label="条形码">
          <el-input 
            type="textarea" 
            v-model="barcodes" 
            :rows="4"
            placeholder="扫描条形码（逗号或换行分隔）"
            @keydown="handleKeydown"
          />
          <el-text type="info">共输入 <strong>{{ totalBarcodes }}</strong> 条</el-text>
        </el-form-item>

        <!-- 目标去向 -->
        <el-form-item label="去向">
          <el-input v-model="destination" placeholder="请输入去向" />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" :loading="isLoading" @click="showConfirmDialog">
            确认出库
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 结果展示 -->
    <el-card v-if="totalBarcodes > 0" class="result-card">
      <p><strong>本次出库总计：</strong>{{ totalBarcodes }} 条</p>

      <el-divider />

      <div v-if="successBarcodes.length > 0">
        <p><el-text type="success">成功出库：{{ successBarcodes.length }} 条</el-text></p>
        <el-table :data="successBarcodes" border style="width: 100%">
          <el-table-column prop="barcode" label="成功条码" />
        </el-table>
      </div>

      <div v-if="failedBarcodes.length > 0">
        <p><el-text type="danger">失败出库：{{ failedBarcodes.length }} 条</el-text></p>
        <el-table :data="failedBarcodes" border style="width: 100%">
          <el-table-column prop="barcode" label="失败条码" />
        </el-table>
      </div>
    </el-card>

    <!-- 确认弹窗 -->
    <el-dialog v-model="dialogVisible" title="确认出库" width="400px">
      <p>即将以批次 <strong>{{ batchName }}</strong> 出库 <strong>{{ totalBarcodes }}</strong> 条产品，是否确认？</p>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="outboundProducts">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { ElMessage } from "element-plus";
import axios from "../router/axios";

export default defineComponent({
  name: "BulkOutboundProduct",
  setup() {
    const barcodes = ref<string>("");
    const batchName = ref<string>("");
    const destination = ref<string>("");
    const isLoading = ref<boolean>(false);
    const dialogVisible = ref<boolean>(false);
    const successBarcodes = ref<{ barcode: string }[]>([]);
    const failedBarcodes = ref<{ barcode: string }[]>([]);

    const totalBarcodes = computed(() => {
      return barcodes.value
        .split(/[\s,|\n]+/)
        .map((barcode) => barcode.trim())
        .filter((barcode) => barcode).length;
    });

    const showConfirmDialog = () => {
      if (!barcodes.value.trim()) {
        ElMessage.error("请至少输入一个有效的条形码");
        return;
      }
      if (!batchName.value.trim()) {
        ElMessage.error("请填写批次名称");
        return;
      }
      dialogVisible.value = true;
    };

    const outboundProducts = async () => {
      dialogVisible.value = false;
      isLoading.value = true;

      const barcodeList = barcodes.value
        .split(/[\s,|\n]+/)
        .map((barcode) => barcode.trim())
        .filter((barcode) => barcode)
        .map((barcode) => barcode.startsWith("1234") ? "7693" + barcode.slice(4) : barcode);

      try {
        const response = await axios.post("/api/outbound/bulk-with-batch", {
          productbarcodes: barcodeList,
          destination: destination.value,
          batchName: batchName.value,
        });

        if (String(response.data.code) !== "200") {
          throw new Error(response.data.message || "业务逻辑错误");
        }

        successBarcodes.value = (response.data.data.successBarcodes || []).map(barcode => ({ barcode }));
        failedBarcodes.value = (response.data.data.failedBarcodes || []).map(barcode => ({ barcode }));

        ElMessage.success(`批量出库成功，共处理 ${totalBarcodes.value} 条`);
      } catch (err: any) {
        console.error(err);
        ElMessage.error(err.message || "批量出库失败");
      } finally {
        isLoading.value = false;
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const textarea = event.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        barcodes.value =
          barcodes.value.substring(0, start) + "\n" + barcodes.value.substring(end);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    };

    return {
      barcodes,
      destination,
      batchName,
      isLoading,
      totalBarcodes,
      successBarcodes,
      failedBarcodes,
      dialogVisible,
      showConfirmDialog,
      outboundProducts,
      handleKeydown,
    };
  },
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
