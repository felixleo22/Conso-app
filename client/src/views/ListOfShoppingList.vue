<template>
  <div>
    Les listes de course publics des utilisateurs
    <v-container>
      <alert-success v-if="success" :text="this.text"></alert-success>
      <alert-error v-if="error" :text="this.text"></alert-error>
      <v-dialog
        v-model="dialog"
        width="500">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">Créer</v-btn>
        </template>
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title>
            Créer une liste de course
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field
              v-model="name"
              label="Nom"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="dialog=false">
              Annuler
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="createShoppingList">
              Creer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row>
        <v-col
          md=4
          lg=3
          v-for="shoppingList in shoppingLists" :key="shoppingList._id">
          <v-card>
            <v-card-title>{{shoppingList.name}}</v-card-title>
            <v-card-actions>
              <v-btn color="red"
                     link :to="{name: 'shoppingList', params: {id: shoppingList._id}}"
                     text>
              Voir</v-btn>
              <v-btn color="red"
                     text>
              Supprimer</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import alertSuccess from '../components/alerts/AlertSuccess.vue';
import alertError from '../components/alerts/AlertError.vue';

export default {
  components: {
    alertSuccess,
    alertError,
  },
  data() {
    return {
      success: false,
      error: false,
      text: '',
      dialog: false,
      name: '',
      shoppingLists: null,
    };
  },
  methods: {
    createShoppingList() {
      this.$http.post('shoppinglist', { name: this.name }).then(() => {
        this.text = 'La liste de course a été créé';
        this.success = true;
        this.$http.get('/shoppinglist').then((response) => {
          this.shoppingLists = response.data;
        });
      }).catch((err) => {
        this.error = true;
        this.text = "La liste de course n'a pas pu être créé";
        console.log(err);
      }).finally(() => {
        this.dialog = false;
      });
    },
  },
  mounted() {
    this.$http.get('/shoppinglist').then((response) => {
      this.shoppingLists = response.data;
    });
  },
  computed: {
  },
};
</script>

<style>
</style>
