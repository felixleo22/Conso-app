
<template>
  <v-container>
    <alert-success v-if="success" :text="this.text"></alert-success>
    <alert-error v-if="error" :text="this.text"></alert-error>
    <v-row>
      <v-dialog
        v-model="dialog"
        width="500">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">Publier</v-btn>
        </template>
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title>
            Rendre votre liste de course public
          </v-card-title>
          <v-card-text>
            Êtes-vous sur de mettre votre liste de course en panier public ?
            Si vous le faite, le panier sera anonyme et les autres utilisateurs
            pourront indiquer les prix de chaque produit dans les magasins de la
            zone de recherche que vous avez parametrée.
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="dialog=false">
              Je refuse
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="createPublicBasket">
              Je la publie
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-btn link :to="{name: 'publicBasketOfUser'}">
       Vos paniers publics
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn link :to="{name: 'zoneshoppinglist'}">
        <v-icon>fas fa-map-marked-alt</v-icon>
      </v-btn>
    </v-row>
    <search-bar></search-bar>
    <list></list>
  </v-container>
</template>

<script>

import alertSuccess from '../components/alerts/AlertSuccess.vue';
import alertError from '../components/alerts/AlertError.vue';
import SearchBar from '../components/shoppingList/SearchBar.vue';
import List from '../components/shoppingList/List.vue';

export default {
  name: 'shoppingList',
  components: {
    alertSuccess,
    alertError,
    SearchBar,
    List,
  },
  data() {
    return {
      success: false,
      error: false,
      text: '',
      dialog: false,
    };
  },
  mounted() {
  },
  methods: {
    createPublicBasket() {
      this.$store.dispatch('createPublicBasket').then(() => {
        this.text = 'Le panier public a été créé';
        this.success = true;
      }).catch((err) => {
        this.error = true;
        this.text = "Le panier est vide ou les settings n'ont pas été effecuté";
        console.log(err);
      }).finally(() => {
        this.dialog = false;
      });
    },
  },
};

</script>
