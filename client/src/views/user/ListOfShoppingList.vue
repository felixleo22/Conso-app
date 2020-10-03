<template>
  <div>
    Les listes de course publics des utilisateurs
    <v-container>
      <!-- aLERTE -->
      <alert-success v-if="success" :text="this.text"></alert-success>
      <alert-error v-if="error" :text="this.text"></alert-error>
      <!-- DIALOG -->
      <dialog-delete
                ref="beforeDeleteList"
                :nameBeforeDelete="this.nameBeforeDelete"
                :idBeforeDelete="this.idBeforeDelete"
                :shoppingLists="this.shoppingLists"
               />
      <v-dialog
        v-model="dialogCreateShoppingList"
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
              @click="dialogCreateShoppingList=false">
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
              <v-btn
                       @click="setBeforeDelete(shoppingList._id, shoppingList.name)" color="red"
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
const alertError = require('../../components/alerts/AlertError');
const alertSuccess = require('../../components/alerts/AlertSuccess.vue');
const dialogDelete = require('../../components/dialog/BeforeDeleteList.vue');

export default {
  components: {
    alertSuccess,
    alertError,
    dialogDelete,
  },
  data() {
    return {
      success: false,
      error: false,
      text: '',
      dialogCreateShoppingList: false,
      dialogDeleteShoppingList: false,
      name: '',
      shoppingLists: null,
      idBeforeDelete: '',
      nameBeforeDelete: '',
    };
  },
  methods: {
    createShoppingList() {
      this.$http.post('shoppinglist', { name: this.name }).then(() => {
        this.text = `La liste de course " ${this.name} " a été créé`;
        this.success = true;
        this.$http.get('/shoppinglist').then((response) => {
          this.shoppingLists = response.data;
        });
      }).catch((err) => {
        this.error = true;
        this.text = "La liste de course n'a pas pu être créé";
        console.log(err);
      }).finally(() => {
        this.dialogCreateShoppingList = false;
        this.name = '';
      });
    },
    async setBeforeDelete(id, name) {
      this.idBeforeDelete = id;
      this.nameBeforeDelete = name;
      this.$refs.beforeDeleteList.open();
    },
    deleteShoppingLists() {
      this.$http.delete(`/shoppinglist/${this.idBeforeDelete}`).then(() => {
        this.text = `La liste de course " ${this.nameBeforeDelete} " a été supprimé`;
        // eslint-disable-next-line no-underscore-dangle
        const index = this.shoppingLists.findIndex(e => e._id === this.idBeforeDelete);
        this.shoppingLists.splice(index, 1);
        this.success = true;
      }).catch((err) => {
        this.error = true;
        this.text = `La liste de course " ${this.nameBeforeDelete} " n'a pas pu être surpprimé`;
        console.log(err);
      }).finally(() => {
        this.dialogDeleteShoppingList = false;
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
