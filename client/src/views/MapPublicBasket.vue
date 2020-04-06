<template>
  <v-container>
    <v-row
      align="start"
      justify="center">
      <v-dialog
        v-model="dialog"
        width="600">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">Details du pannier public</v-btn>
        </template>
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title>
            Détails du pannier public
          </v-card-title>
          <v-simple-table fixed-header v-if="publicBasket">
            <thead>
            <tr>
              <th class="text-left" width="66%">Produit</th>
              <th class="text-left">Quantité</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in publicBasket.shoppingList.list" :key="item._id">
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
                <v-list-item>{{item.quantity}}</v-list-item>
              </td>
            </tr>
            </tbody>
          </v-simple-table>
          <v-divider></v-divider>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      publicBasketId: null,
      dialog: false,
    };
  },
  components: {
  },
  computed: {
    idPublicBasket() {
      return this.$route.params.id;
    },
    publicBasket() {
      console.log(this.$store.getters.publicBasketById);
      return this.$store.getters.publicBasketById;
    },
  },
  created() {
  },
  mounted() {
    this.$store.dispatch('getPublicBasketsById', { id: this.idPublicBasket });
  },
  methods: {
  },
};
</script>
