<template>
    <div>
      <h1>条形码生成器</h1>
      <input v-model="displayText" placeholder="请输入显示文本" />
      <button @click="generateBarcode">生成条形码</button>
      <button @click="printBarcode" v-if="barcodeImage">打印条形码</button>
      <div v-if="barcodeImage">
        <img :src="barcodeImage" alt="条形码" />
      </div>
    </div>
  </template>
  
  <script>
  import JsBarcode from 'jsbarcode';
  import { ref } from 'vue';
  
  export default {
    setup() {
      const displayText = ref('');
      const barcodeImage = ref(null);
  
      const generateBarcode = () => {
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, displayText.value, {
          format: 'CODE128',
          displayValue: true,
          fontSize: 12,
          margin: 0,
          width: 2,
          height: 40,
        });
  
        barcodeImage.value = canvas.toDataURL('image/png');
      };
  
      const printBarcode = () => {
        window.print();
      };
  
      return {
        displayText,
        barcodeImage,
        generateBarcode,
        printBarcode,
      };
    },
  };
  </script>
  
  <style scoped>
  /* 添加样式 */
  </style>