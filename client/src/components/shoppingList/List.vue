<template>
     <v-container>
       <v-row>
         <v-col
          cols="12"
          md="8"
          offset-md="2"
          offset-xl="3"
          xl="6"
         >
          <v-simple-table fixed-header>
            <thead>
              <tr>
                <th class="text-left">Produit</th>
                <th class="text-left">Quantité</th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in shoppingList" :key="item.id">
                <td>{{ item.name }}</td>
                <td>
                  <v-text-field
                    @change="update(item)" v-model="item.quantity"
                    type="number" name="quantity" min="1" required>
                  </v-text-field>
                </td>
                <td>
                  <v-btn color="red accent-4" v-on:click="del(item)">
                    <v-icon color="white">fa-trash</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
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
