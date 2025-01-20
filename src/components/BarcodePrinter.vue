<template>
  <div>
    <!-- Display barcode for on-screen viewing -->
    <div class="barcode-container">
      <svg ref="barcode"></svg>
      <p>{{ displayText }}</p>
      <button class="no-print" @click="handlePrint">Print Barcode</button>
    </div>

    <!-- Hidden print area -->
    <div class="print-container" ref="printContainer">
      <svg ref="printBarcodeSvg"></svg>
      <p>{{ displayText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import JsBarcode from "jsbarcode";

const props = defineProps({
  barcodeNumber: {
    type: String,
    required: true,
  },
  displayText: {
    type: String,
    default: "",
  },
});

const barcode = ref(null);
const printBarcodeSvg = ref(null);
const printContainer = ref(null);

const generateBarcode = (element, barcodeNumber) => {
  if (element) {
    JsBarcode(element, barcodeNumber, {
      format: "CODE128",
      width: 2,
      height: 40,
      margin: 0,
    });
  }
};

watch(
  () => props.barcodeNumber,
  (newVal) => {
    if (newVal && barcode.value) {
      try {
        generateBarcode(barcode.value, newVal);
        generateBarcode(printBarcodeSvg.value, newVal);
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }
);

const handlePrint = () => {
  const printElement = printContainer.value;
  const originalDisplay = printElement.style.display;

  printElement.style.display = "block";
  window.print();

  printElement.style.display = originalDisplay;
};

onMounted(() => {
  if (props.barcodeNumber) {
    generateBarcode(barcode.value, props.barcodeNumber);
    generateBarcode(printBarcodeSvg.value, props.barcodeNumber);
  }
});
</script>

<style scoped>
/* For on-screen display */
.barcode-container {
  text-align: center;
  margin-top: 50px;
}

.print-container {
  display: none; /* Hide the print-specific container */
  text-align: center;
}

/* Styling for elements not needed in print */
.no-print {
  display: none !important;
}

@media print {
  body * {
    visibility: hidden; /* Hide everything initially */
  }

  .print-container {
    visibility: visible; /* Only show the print-container */
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    text-align: center;
    page-break-after: always; /* Start a new page for each print */
  }

  /* Customize margins, orientation, and DPI */
  @page {
    size: A4 portrait; /* Adjust page size if needed */
    margin: 10mm;
  }

  /* Ensure SVG scales appropriately */
  svg {
    width: 200px;
    height: auto;
  }
}
</style>
