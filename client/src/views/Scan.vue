<template>
    <div id="scan">
        <h1>Scann products</h1>
        <shop-selector v-if="!shopSelected" @selected="onShopSelected"></shop-selector>
        <scanner v-else></scanner>
    </div>
</template>
<script>
import ShopSelector from '../components/scan/ShopSelector.vue';
import Scanner from '../components/scan/Scanner.vue';

export default {
  components: {
    ShopSelector,
    Scanner,
  },
  data() {
    return {
      shopSelected: !!this.shop,
    };
  },
  methods: {
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
