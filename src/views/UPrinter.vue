<template>
  <div>
    <h1>Barcode Printer</h1>
    <div>
      <label for="textInput">Enter Text:</label>
      <input
        type="text"
        id="textInput"
        v-model="inputText"
        placeholder="Enter display text"
      />
      <button @click="generateAndPrint">Print Barcode</button>
    </div>
    <div v-show="showPrintArea" class="print-area">
      <p>{{ inputText }}</p>
      <canvas ref="barcodeCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import JsBarcode from 'jsbarcode';

// Define refs
const inputText = ref('');
const showPrintArea = ref(false);
const barcodeCanvas = ref(null);  // Use ref for barcodeCanvas

// Function to generate and print the barcode
const generateAndPrint = () => {
  if (!inputText.value.trim()) {
    alert('Please enter some text.');
    return;
  }

  // Now access the canvas using the barcodeCanvas ref
  const canvas = barcodeCanvas.value;

  // Generate Barcode
  JsBarcode(canvas, "12345678", {
    format: "CODE128",
    width: 2,
    height: 40,
    displayValue: false,
    margin: 0
  });

  showPrintArea.value = true;

  // Wait for the barcode to be rendered and then print
  nextTick(() => {
    printContent();
    showPrintArea.value = false;
  });
};

// Function to open a new print window and print the content
const printContent = () => {
  const printWindow = window.open('', '', 'height=400,width=600');

  // Add styles and content to the print window
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Barcode</title>
        <style>
          @page {
            size: 40mm 30mm horizontal !important;
            margin: 0 !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .print-area {
            width: 100% !important;
            height: 100% !important;
            page-break-before: always !important;
            text-align: center;
          }
          .print-area canvas {
            display: block;
            margin: 0 auto;
          }
        </style>
      </head>
      <body>
        ${document.querySelector('.print-area').outerHTML}
      </body>
    </html>
  `);
  printWindow.document.close(); // Necessary for IE >= 10
  printWindow.print(); // Trigger the print dialog
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
}

.print-area {
  text-align: center;
  margin: 0;
  padding: 0;
  width: 40mm;
  height: 30mm;
}

.print-area canvas {
  display: block;
  margin: 0 auto;
}
</style>
