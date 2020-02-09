<template>
    <div id="scan">
        <h1>Scann products</h1>
        <shop-selector v-if="!shopSelected" @selected="onShopSelected"></shop-selector>
        <template v-else>
          <button @click="shopSelected = false">Changer de magasin</button>
            <v-quagga
                :onDetected="scanned"
                :readerSize="readerSize"
                :readerTypes="['ean_reader']">
            </v-quagga>
        </template>
    </div>
</template>
<script>
import Vue from 'vue';
import VueQuagga from 'vue-quaggajs';
import ShopSelector from '../components/scan/ShopSelector.vue';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  components: {
    ShopSelector,
  },
  data() {
    return {
      readerSize: {
        width: 640,
        height: 480,
      },
      shopSelected: !!this.shop,
    };
  },
  methods: {
    scanned(data) {
      this.barcode = data.codeResult.code;
    },
    onShopSelected(event) {
      this.$store.dispatch('changeScanShop', event).then(() => {
        this.shopSelected = true;
      });
    },
  },
  computed: {
    shop() {
      return this.$store.getters.shop;
    },
  },
};
</script>
