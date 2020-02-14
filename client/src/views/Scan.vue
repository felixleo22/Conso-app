<template>
    <div id="scan">
        <shop-selector v-if="!shop"></shop-selector>
        <template v-else>
          <v-toolbar flat dense width="100%" style="border-bottom: 1px solid #ffcdd2">
              <v-icon left>fa-map-marker-alt</v-icon>
              <div class="text-truncate" style="padding-right: 1em;">
                <div style="margin-bottom: -0.5em">{{ this.shop.name }}</div>
                <small>{{ this.shop.address }}</small>
              </div>
            <v-spacer></v-spacer>
            <v-btn @click="deselectShop" outlined color="red accent-4">Changer</v-btn>
          </v-toolbar>
          <v-container style="max-height: calc(95vh - 56px);">
            <template v-if="!showScanner">
              <price-setter
                :product="product"
                :shop="shop"
                @canceled="onPriceCancel"
                @updated="onPriceUpdated"
                @errored="onPriceUpdateError">
              </price-setter>
            </template>
            <template v-else>
              <scanner @scanned="onProductScanned"></scanner>
            </template>
          </v-container>
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
