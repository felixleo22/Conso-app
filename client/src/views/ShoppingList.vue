
<template>
  <v-container>
    <v-alert
      v-if="success"
      v-model="success"
      border="left"
      close-text="Close Alert"
      type=success
      dismissible>
    Le panier public a été créé
    </v-alert>
    <v-alert
      v-if="error"
      v-model="error"
      border="left"
      close-text="Close Alert"
      type="error"
      dismissible>
      Votre liste de course est vide ou n'a pas de paramètres
    </v-alert>
    <v-row>
      <v-dialog
        v-model="dialog"
        width="500">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">Rendre public</v-btn>
        </template>
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title>
            Rendre votre liste de course public
          </v-card-title>
          <v-card-text>
            Etes-vous sur de mettre votre liste de couse en panier public ?
            Si vous le faites, le panier sera anonyme et les autres utilisateurs
            pourront indiqué les prix de chaque produits dans les magasins de la
            zone de recherche que vous avez parametré
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
              Je l'a publie
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import List from '../components/shoppingList/List.vue';
import SearchBar from '../components/shoppingList/SearchBar.vue';

export default {
  name: 'shoppingList',
  components: {
    SearchBar,
    List,
  },
  data() {
    return {
      success: false,
      error: false,
      dialog: false,
    };
  },
  mounted() {
  },
  methods: {
    createPublicBasket() {
      this.$store.dispatch('createPublicBasket').then(() => {
        this.success = true;
      }).catch((err) => {
        this.error = true;
        console.log(err);
      }).finally(() => {
        this.dialog = false;
      });
    },
  },
};

</script>
