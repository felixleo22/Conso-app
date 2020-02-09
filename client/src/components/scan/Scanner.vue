<template>
    <div>
        <v-quagga
            :onDetected="scanned"
            :readerSize="readerSize"
            :readerTypes="['ean_reader']"
        >
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
      readyToScan: true,
    };
  },
  methods: {
    scanned(event) {
      if (!this.readyToScan) return;
      this.readyToScan = false;

      const barcode = event.codeResult.code;
      this.$http.get(`/product/${barcode}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>
