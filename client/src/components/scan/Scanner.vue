<template>
  <div>
    <input type="text" v-model="barcode" placeholder="tapez votre code barre">
    <div class="scanner-wrapper">
      <StreamBarcodeReader
        @decode="onScanned"
      ></StreamBarcodeReader>
    </div>
  </div>
</template>

<script>
import { StreamBarcodeReader } from 'vue-barcode-reader';

export default {
  name: 'scanner',
  components: {
    StreamBarcodeReader,
  },
  data() {
    return {
      barcode: '',
    };
  },
  methods: {
    onScanned(event) {
      const barcode = event;
      this.$http.get(`/product/${barcode}`)
        .then((response) => {
          const product = { code: response.data.code, name: response.data.product_name };
          this.$emit('scanned', product, this.setReady);
          this.barcode = '';
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
  watch: {
    barcode(code) {
      if (code.length < 13) return;
      this.onScanned(code);
    },
  },
};
</script>

<style scoped>
.scanner-wrapper {
  display: inline-block;
}

.scanner-container {
  max-width: 100%;
  max-width: 100%;
}
</style>
