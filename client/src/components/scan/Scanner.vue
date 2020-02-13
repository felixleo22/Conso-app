<template>
    <div>
      <StreamBarcodeReader
        @decode="scanned"
      ></StreamBarcodeReader>
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

    };
  },
  methods: {
    scanned(event) {
      const barcode = event;
      this.$http.get(`/product/${barcode}`)
        .then((response) => {
          const product = { code: response.data.code, name: response.data.product_name };
          this.$emit('scanned', product, this.setReady);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>
