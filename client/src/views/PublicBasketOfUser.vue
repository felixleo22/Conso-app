<template>
  <div>
    Les paniers publics de l'utilisateurs
    <v-container>
      <v-row>
        <v-col
          md=4
          lg=3
          v-for="basket in publicBasket" :key="basket._id">
          <v-card>
            <v-card-title>{{basket._id}}</v-card-title>
            <v-card-actions>
              <v-btn color="red" text>Supprimer</v-btn>
              <v-btn color="red"
                     link :to="{name: 'mapPublicBasketOfUser', params: { id: basket._id } }"
              text>Voir</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      publicBasket: [],
    };
  },
  mounted() {
    this.$store
      // eslint-disable-next-line no-underscore-dangle
      .dispatch('getPublicBasketOfUser', this.$store.getters.loggedUser._id)
      .then((response) => {
        this.publicBasket = response;
      });
  },
};
</script>
