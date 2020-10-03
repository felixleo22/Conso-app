<template>
  <div>
    Les paniers publics de l'utilisateurs
    <v-container>
    <alert-success v-if="success" :text="this.text"></alert-success>
    <alert-error v-if="error" :text="this.text"></alert-error>
      <v-row>
        <v-col md="4" lg="3" v-for="basket in publicBasket" :key="basket._id">
          <v-card>
            <v-card-title>{{basket._id}}</v-card-title>
            <v-card-actions>
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="setIdBeforeDelete(basket._id)"
                  color="red" text>Supprimer</v-btn>
                </template>
                <v-card>
                  <v-card-title
                    v-if="beforeDelete"
                    class="headline grey lighten-2"
                    primary-title
                  >Supprimer le panier {{beforeDelete}}</v-card-title>
                  <v-card-text>
                    Etes-vous sur de supprimer votre panier public ? Il n'apparaitra
                    plus pour les contributeurs mais les contributions efféctués seront toujours
                    sauvegardés.
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="primary" text @click="dialog=false">Non</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="deletePublicBasket">Oui</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn
                color="red"
                link
                :to="{name: 'mapPublicBasketOfUser', params: { id: basket._id } }"
                text
              >Voir</v-btn>
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
      publicBasket: [],
      dialog: false,
      beforeDelete: '',
    };
  },
  mounted() {
    this.$http.get('/publicbaskets/user').then((response) => {
      this.publicBasket = response.data;
    });
  },
  methods: {
    setIdBeforeDelete(id) {
      this.beforeDelete = id;
    },
    deletePublicBasket() {
      this.$http.delete(`/publicbasket/${this.beforeDelete}/user`).then(() => {
        this.text = `Le panier public ${this.beforeDelete} a été supprimé`;
        // eslint-disable-next-line no-underscore-dangle
        const index = this.publicBasket.findIndex(e => e._id === this.beforeDelete);
        this.publicBasket.splice(index, 1);
        this.success = true;
      }).catch((err) => {
        this.error = true;
        this.text = `Le panier public ${this.beforeDelete} n'a pas pu être surpprimé`;
        console.log(err);
      }).finally(() => {
        this.dialog = false;
      });
    },
  },
};
</script>
