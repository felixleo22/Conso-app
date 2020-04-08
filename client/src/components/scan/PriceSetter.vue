<template>
<div>

    <v-row>
      <v-spacer></v-spacer>
      <h4>Produit trouvé</h4>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <small>{{product.code}}</small>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <img :src="product.image" height="150px">
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
       <h3>{{product.name}}</h3>
      <v-spacer></v-spacer>
    </v-row>


    <v-row>
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Prix du produit"
              type="number"
              step="0.01"
              suffix="€"
              outlined
              v-model="price"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
            <v-btn outlined @click="onCancel">Annuler</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red accent-4 white--text" @click="onSave">Valider</v-btn>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-row>
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
      this.$http.put(`/shop/${this.shop.id}/product/${this.product.code}`, { price: this.price })
        .then((response) => {
          this.$emit('updated', response.data);
        })
        .catch((error) => {
          this.$emit('errored', error.response);
        });
    },
  },
  mounted() {
    console.log(this.product);
  },
};
</script>
