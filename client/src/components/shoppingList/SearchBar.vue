<template>
<div>
    <label>Nom de l'article</label>
    <input v-model="name" @change="getResult" type="text" name="name" required />
    <div v-for="item in result" :key="item.name">
      <p>{{item.name}}</p>
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
    add() {
      const item = {
        // TODO code bar open food
        codebar: new Date().getTime(),
        name: this.name,
        quantity: this.quantity,
      };
      this.$store.dispatch('addItem', item);
    },
    getResult() {
      console.log('ss');
      this.$http.get(`/products?search?=${encodeURI(this.name)}`, { query: { search: this.name } }).then((response) => {
        console.log(response.data);
        this.result = response.data;
      });
    },
  },
};
</script>
