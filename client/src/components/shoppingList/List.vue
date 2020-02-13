<template>
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
</template>

<script>
export default {
  name: 'list',
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
    del(item) {
      this.$store.dispatch('removeItem', item);
    },
    update(item) {
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
