<template>
    <div>
        <h4>Produit scanné :</h4>
        <p>Code barre : {{product.code}}</p>
        <p>Nom : {{product.name}}</p>

        <label>Entrez le prix du produit : </label>
        <input type="number" step="0.01" min="0" v-model="price">
        <div>
          <button @click="onCancel">Annuler</button>
          <button @click="onSave">Valider</button>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */

export default {
  name: 'PriceSetter',
  props: ['product', 'shop'],
  data() {
    return {
      price: '',
    };
  },
  methods: {
    onCancel() {
      this.$emit('canceled');
    },
    onSave() {
      this.$http.put(`/shop/${this.shop._id}/product/${this.product.code}`, { price: this.price })
        .then((response) => {
          this.$emit('updated', response.data);
        })
        .catch((error) => {
          this.$emit('errored', error.response);
        });
    },
  },
};
</script>
