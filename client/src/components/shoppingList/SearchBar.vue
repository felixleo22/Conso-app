<template>
<div>
    <label>Nom de l'article</label>
    <input v-model="name" @keyup="getResult" type="text" name="name" required />
    <div v-for="item in result" :key="item.name">
      <p @click="add(item)">{{item.name}} </p>
    </div>
    <label>Quantité</label>
    <input v-model="quantity" type="number" name="quantity" min="1" required />
    <button v-on:click="add">Ajouter</button>
</div>
</template>

<script>
export default {
  name: 'searchbar',
  data() {
    return {
      name: '',
      quantity: '1',
      result: [],
    };
  },
  methods: {
    add(item) {
      console.log(item.codebar);
      const res = {
        codebar: item.codebar,
        name: item.name,
        quantity: this.quantity,
      };
      this.$store.dispatch('addItem', res);
    },
    getResult() {
      console.log(this.name);
      this.$http.get(`/products?search=${encodeURI(this.name)}`).then((response) => {
        console.log(response.data);
        this.result = response.data;
      });
    },
  },
};
</script>
