<template>
    <div>
        <v-quagga
            :onDetected="scanned"
            :readerSize="readerSize"
            :readerTypes="['ean_reader']">
        </v-quagga>
    </div>
</template>

<script>
import Vue from 'vue';
import VueQuagga from 'vue-quaggajs';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  name: 'scanner',
  data() {
    return {
      readerSize: {
        width: 640,
        height: 480,
      },
    };
  },
  methods: {
    scanned(event) {
      const barcode = event.codeResult.code;
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
