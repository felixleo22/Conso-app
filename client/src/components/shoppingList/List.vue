<template>
     <v-container>
       <v-row>
         <v-col
          cols="12"
          md="10"
          offset-md="1"
          offset-xl="3"
          xl="6"
         >
          <v-simple-table fixed-header>
            <thead>
              <tr>
                <th class="text-left" width="66%">Produit</th>
                <th class="text-left">Quantité</th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in shoppingList" :key="item.id">
                <td>
                  <v-list-item>
                    <v-list-item-avatar tile>
                      <v-responsive :aspect-ratio="1/1">
                        <img :src="item.icon">
                      </v-responsive>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{item.name}}</v-list-item-title>
                      <v-list-item-subtitle>{{item.brand}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>
                  <v-text-field
                    @input="update(item)" v-model="item.quantity"
                    type="number" name="quantity" min="1" required single-line>
                  </v-text-field>
                </td>
                <td>
                  <v-btn color="red accent-4 text-white white--text" v-on:click="del(item)">
                    <v-icon>fa-trash</v-icon>
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
  props: ['idShoppingList'],
  name: 'list',
  data() {
    return {
    };
  },
  mounted() {
    this.$store.dispatch('getShoppingList', this.idShoppingList);
  },
  methods: {
    del(item) {
      this.$store.dispatch('removeItem', item);
    },
    update(item) {
      if (item.quantity < 1) {
        return;
      }
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
