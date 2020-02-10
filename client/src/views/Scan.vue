<template>
    <div id="scan">
        <h1>Scann products</h1>
        <input type="text" v-model="barcode"><button v-on:click="showScanner">Scanner</button>
        <div v-if="scanning">
            <v-quagga
                :onDetected="scan"
                :readerSize="readerSize"
                :readerTypes="['ean_reader']">
            </v-quagga>
        </div>
        <div v-if="product">
            {{product.name}}
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
// eslint-disable-next-line import/no-unresolved
// TODO ISSOU ÇA MARCHE PAS POUR MOI
import VueQuagga from 'vue-quaggajs';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  data() {
    return {
      readerSize: {
        width: 640,
        height: 480,
      },
      barcode: '',
      product: null,
      scanning: false,
    };
  },
  methods: {
    scan(data) {
      this.barcode = data.codeResult.code;
      this.scanning = false;
    },
    showScanner() {
      this.scanning = true;
    },
  },
};
</script>
