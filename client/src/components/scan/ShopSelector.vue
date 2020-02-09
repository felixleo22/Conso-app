<template>
  <div>
    <label>Entrer l'id de votre magasin : </label>
    <input type="text" placeholder="Magasin" v-model="shop">
    <button @click="selectShop">Séléctionner</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shop: '',
    };
  },
  methods: {
    selectShop() {
      this.$emit('selected', { _id: this.shop });
    },
  },
};
</script>
