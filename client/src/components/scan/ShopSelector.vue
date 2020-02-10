<template>
  <div>
    <label>Entrer l'id de votre magasin : </label>
    <input type="text" placeholder="Magasin" v-model="shopId">
    <button @click="selectShop">Séléctionner</button>
  </div>
</template>

<script>
export default {
  name: 'ShopSelector',
  data() {
    return {
      shopId: '',
    };
  },
  methods: {
    selectShop() {
      this.$store.dispatch('changeScanShop', { _id: this.shopId });
    },
  },
};
</script>
