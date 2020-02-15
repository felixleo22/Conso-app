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
                <th></th>
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
          <v-container v-if="!shoppingList">
            <v-row>
              <v-spacer></v-spacer>
                <v-progress-circular
                  indeterminate
                  color="red accent-4"
                >
                </v-progress-circular>
              <v-spacer></v-spacer>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
export default {
  name: 'list',
  data() {
    return {
    };
  },
  mounted() {
    // eslint-disable-next-line no-return-assign
    this.$store.dispatch('getShoppingList');
  },
  methods: {
    del(item) {
      this.$store.dispatch('setLoading', true);

      this.$store.dispatch('removeItem', item)
        .finally(() => {
          this.$store.dispatch('setLoading', false);
        });
    },
    update(item) {
      if (item.quantity < 1) {
        // eslint-disable-next-line no-param-reassign
        return;
      }
      this.$store.dispatch('setLoading', true);
      this.$store.dispatch('updateItem', item)
        .finally(() => {
          this.$store.dispatch('setLoading', false);
        });
    },
  },
  computed: {
    shoppingList() {
      return this.$store.getters.shoppingList;
    },
  },
};

</script>
