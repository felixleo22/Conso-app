<template>
  <v-dialog v-model="visible" width="500">
    <v-card>
      <v-card-title
        v-if="idBeforeDelete"
        class="headline grey lighten-2"
        primary-title
      >Supprimer la liste de course {{nameBeforeDelete}}</v-card-title>
      <v-card-text>
        Etes-vous sur de supprimer cette liste de course ? Cette suppression
        est irréversible
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" text @click="visible=false">Non</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="deleteShoppingLists">Oui</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  props: ['nameBeforeDelete', 'idBeforeDelete', 'shoppingLists'],
  methods: {
    open() {
      this.visible = true;
    },
    deleteShoppingLists() {
      this.$http
        .delete(`/shoppinglist/${this.idBeforeDelete}`)
        .then(() => {
          this.text = `La liste de course " ${this.nameBeforeDelete} " a été supprimé`;
          const index = this.shoppingLists.findIndex(
            // eslint-disable-next-line no-underscore-dangle
            e => e._id === this.idBeforeDelete,
          );
          this.shoppingLists.splice(index, 1);
          this.success = true;
        })
        .catch((err) => {
          this.error = true;
          this.text = `La liste de course " ${this.nameBeforeDelete} " n'a pas pu être surpprimé`;
          console.log(err);
        })
        .finally(() => {
          this.visible = false;
        });
    },
  },
};
</script>
