<template>
  <div>
    Les panniers publics des utilisateurs
    <v-container>
      <v-row>
        <v-col
          md=4
          lg=3
          v-for="basket in publicBasket" :key="basket._id">
          <v-card>
            <v-card-title>{{basket._id}}</v-card-title>
            <v-card-actions>
              <v-btn color="red"
                     link :to="{name: 'mapPublicBasket', params: {id: basket._id}}"
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

export default {
  data() {
    return {
      publicBasket: null,
    };
  },
  methods: {
  },
  mounted() {
    this.$store.dispatch('getPublicBaskets').then(() => {
      this.publicBasket = this.$store.getters.publicBasket;
      console.log(this.publicBasket);
    });
  },
  computed: {
  },
};
</script>

<style>
</style>
