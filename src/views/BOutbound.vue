<template>
  <div class="container">
      <h1>批量产品出库</h1>
      <form @submit.prevent="outboundProducts">
          <div>
              <label for="barcodes">扫描条形码输入（多个条形码用逗号或换行分隔）:</label>
              <textarea 
                  id="barcodes" 
                  v-model="barcodes" 
                  required
                  @keydown="handleKeydown"
              ></textarea>
          </div>
          <div>
              <label for="destination">去向:</label>
              <input type="text" id="destination" v-model="destination" required />
          </div>
          <div>
              <button type="submit">批量出库</button>
          </div>
      </form>
  
      <!-- 错误信息展示 -->
      <div v-if="error" style="color: red;">
          <p>{{ error }}</p>
      </div>
      
      <!-- 成功信息展示 -->
      <div v-if="successMessage" style="color: green;">
          <p>{{ successMessage }}</p>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue';  // Import nextTick from Vue
import axios from '../router/axios';

export default defineComponent({
  name: 'BulkOutboundProduct',
  setup() {
      const barcodes = ref<string>('');  // 条形码输入
      const destination = ref<string>('');  // 去向
      const error = ref<string | null>(null);  // 错误信息
      const successMessage = ref<string | null>(null);  // 成功信息

      // 批量出库
      const outboundProducts = async () => {
          const barcodeList = barcodes.value
              .split(/[\s,|\n]+/)  // 使用空格、逗号或换行符为分隔符
              .map(barcode => barcode.trim())
              .filter(barcode => barcode)  // 过滤掉空条形码
              .map(barcode => barcode.replace(/^1234/, '7693')); // 替换条形码前缀
          
          if (barcodeList.length === 0) {
              error.value = '请至少输入一个有效的条形码';
              return;
          }

          try {
              // 调用后端API进行批量出库
              await axios.post('/api/outbound/bulk', {
                  productbarcodes: barcodeList,
                  destination: destination.value
              });
              successMessage.value = '批量出库成功';
              error.value = null;
              barcodes.value = '';  // 清空条形码输入
              destination.value = '';  // 清空去向输入
          } catch (err) {
              error.value = '批量出库失败';
              successMessage.value = null;
          }
      };

      // 处理 Tab 键插入换行符
      const handleKeydown = (event: KeyboardEvent) => {
          if (event.key === 'Tab') {
              event.preventDefault(); // 阻止默认行为（跳转到下一个输入框）
              const textarea = event.target as HTMLTextAreaElement;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;

              // 插入换行符
              barcodes.value =
                  barcodes.value.substring(0, start) +
                  '\n' +
                  barcodes.value.substring(end);

              // 将光标移动到新换行符之后
              nextTick(() => {
                  textarea.selectionStart = textarea.selectionEnd = start + 1;
              });
          }
      };

      return {
          barcodes,
          destination,
          error,
          successMessage,
          outboundProducts,
          handleKeydown
      };
  }
});
</script>
