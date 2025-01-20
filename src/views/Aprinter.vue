<template>
  <div>
    <div>
      <label for="displayText">Enter Display Text:</label>
      <input type="text" id="displayText" v-model="displayText" />
    </div>
    <div>
      <label for="barcodeNumber">Enter Barcode Number:</label>
      <input type="text" id="barcodeNumber" />
    </div>
    <button @click="generateBarcode" class="no-print">Generate Barcode</button>
    <button @click="handlePrint" class="no-print">Print Barcode</button>

    <!-- On-Screen Display -->
    <div class="barcode-container">
      <svg ref="barcodeSvg"></svg>
      <p>{{ displayText }}</p>
    </div>

    <!-- Hidden Print Area -->
    <div class="print-container" ref="printContainer">
      <div class="print-content">
        <svg ref="printBarcodeSvg"></svg>
        <p>{{ displayText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import JsBarcode from "jsbarcode";

const displayText = ref("");
const barcodeNumber = ref("00000001"); // Initial barcode number
const barcodeSvg = ref(null);
const printBarcodeSvg = ref(null);
const printContainer = ref(null);

const generateBarcode = () => {
  if (barcodeNumber.value && barcodeSvg.value) {
    try {
      JsBarcode(barcodeSvg.value, barcodeNumber.value, {
        format: "CODE128",
        width: 2,
        height: 40,
        margin: 0,
      });
      // Also generate the print version
      JsBarcode(printBarcodeSvg.value, barcodeNumber.value, {
        format: "CODE128",
        width: 2,
        height: 40,
        margin: 0,
      });
    } catch (error) {
      console.error("Error generating barcode:", error);
    }
  }
};

const handlePrint = () => {
  const printElement = printContainer.value;

  // Temporarily show print container
  const originalDisplay = printElement.style.display;
  printElement.style.display = "block";

  window.print();

  // Revert to hidden after print
  printElement.style.display = originalDisplay;
};
</script>

<style scoped>
/* On-screen barcode display */
.barcode-container {
  text-align: center;
  margin: 20px;
}

/* Print container (hidden during normal operation) */
.print-container {
  display: none; /* Hidden by default */
}

/* Hide buttons during printing */
.no-print {
  display: inline-block; /* Show buttons by default */
}

@media print {
  body {
    margin: 0 !important;
    padding: 0 !important;
  }

  .print-container {
    visibility: visible !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  @page {
    size: 40mm 30mm !important;
    margin: 5mm !important;
    orientation: portrait !important;
  }
}
</style>