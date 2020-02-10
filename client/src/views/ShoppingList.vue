
<template>
  <div>
    <label>Nom de l'article</label>
    <input v-model="name" type="text" name="name" required />
    <label>Quantité</label>
    <input v-model="quantity" type="number" name="quantity" min="1" required />
    <button v-on:click="add">Ajouter</button>
     <div>
        <table>
            <thead>
            <tr>
                <th>Nom</th>
                <th>Quantité</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in shoppingList" :key="item.id">
                <td>{{item.name}}</td>
                <td><input v-on:change="update(item)" v-model="item.quantity"
                type="number" name="quantity" min="1" required/></td>
                <td><button v-on:click="del(item)"> close </button></td>
            </tr>
            </tbody>
        </table>
    </div>
    </div>
</template>

<script>
export default {
  name: 'shoppingList',
  data() {
    return {
      name: '',
      quantity: '1',
    };
  },
  mounted() {
    // eslint-disable-next-line no-return-assign
    this.$store.dispatch('getShoppingList');
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
    del(item) {
      this.$store.dispatch('removeItem', item);
    },
    update(item) {
      console.log('ss');
      this.$store.dispatch('updateItem', item);
    },
  },
  computed: {
    shoppingList() {
      return this.$store.getters.shoppingList || [];
    },
  },
};

</script>
