<template>
<div>
    <label>Nom de l'article</label>
    <input v-model="name" @keyup="getResult" type="text" name="name" required />
    <div v-for="item in result" :key="item.name">
      <p @click="add(item)">{{item.name}} </p>
    </div>
</div>
</template>

<script>
export default {
  name: 'searchbar',
  data() {
    return {
      name: '',
      result: [],
    };
  },
  methods: {
    add(item) {
      const res = {
        codebar: item.codebar,
        name: item.name,
        quantity: 1,
      };
      this.$store.dispatch('addItem', res);
    },
    getResult() {
      this.$http.get(`/products?search=${encodeURI(this.name)}`).then((response) => {
        this.result = response.data;
      });
    },
  },
};
</script>
