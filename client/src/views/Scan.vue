<template>
    <div id="scan">
        <h1>Scann products</h1>
        <shop-selector v-if="!shop"></shop-selector>
        <template v-else>
          <button @click="deselectShop">Changer de magasin</button>
          <scanner @scanned="onProductScanned" v-if="showScanner"></scanner>
          <price-setter v-else
            :product="product"
            :shop="shop"
            @canceled="onPriceCancel"
            @updated="onPriceUpdated"
            @errored="onPriceUpdateError">
          </price-setter>
        </template>
    </div>
</template>
<script>
import ShopSelector from '../components/scan/ShopSelector.vue';
import Scanner from '../components/scan/Scanner.vue';
import PriceSetter from '../components/scan/PriceSetter.vue';

export default {
  name: 'Scan',
  components: {
    ShopSelector,
    Scanner,
    PriceSetter,
  },
  data() {
    return {
      showScanner: true,
      product: null,
    };
  },
  methods: {
    onProductScanned(event) {
      this.showScanner = false;
      this.product = event;
    },
    onPriceCancel() {
      this.product = null;
      this.showScanner = true;
    },
    onPriceUpdated() {
      this.showScanner = true;
    },
    onPriceUpdateError(event) {
      console.log(event);
    },
    deselectShop() {
      this.$store.dispatch('unsetScanShop');
    },
  },
  computed: {
    shop() {
      return this.$store.getters.shop;
    },
  },
};
</script>
