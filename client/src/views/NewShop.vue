<template>
    <div id="newShop">
        <h1 class="text-center">Ajouter un magasin</h1>
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col>
                  <v-text-field
                    v-model="name"
                    :rules="[v => !!v || 'Veuillez renseigner le nom du magasin']"
                    label="Nom du magasin"
                    required
                  ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                  <v-text-field
                    v-model="address"
                    :rules="[v => !!v || 'Veuillez renseigner une adresse']"
                    label="Adresse"
                    required
                  ></v-text-field>
              </v-col>
            </v-row>
            <v-row>

            </v-row>
            <v-row>
              <v-col cols="12">
                <p>Position du magasin</p>
                <small>
                  Cliquer sur la carte pour définir une position
                </small>
              </v-col>
              <v-col>
                <leaflet
                  :options="options"
                  @mapclick="mapclick"
                  :markers="markers"
                ></leaflet>
              </v-col>
            </v-row>
            <v-row class="text-center">
              <v-col>
                <v-btn :disabled="!valid || !position || loading" dark
                  color="red accent-4"
                  @click="addShop"
                >
                  <v-icon left>fa-plus</v-icon> Ajouter ce magasin
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
    </div>
</template>

<script>
import Leaflet from 'easy-vue-leaflet';

export default {
  components: {
    Leaflet,
  },
  data() {
    return {
      valid: false,
      name: '',
      address: '',
      options: {
        view: {
          lat: 48.5,
          lng: 6,
          zoom: 5,
        },
      },
      position: null,
    };
  },
  methods: {
    mapclick(event) {
      this.position = event.position;
    },
    addShop() {
      this.$store.dispatch('setLoading', true);
      this.$http.post('/shop', {
        name: this.name,
        address: this.address,
        position: this.position,
      })
        .then(() => {
          this.$router.push('/scan');
        })
        .catch(() => {
          // AFFICHER UNE ERREUR
        })
        .finally(() => {
          this.$store.dispatch('setLoading', false);
        });
    },
  },
  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },
    markers() {
      if (!this.position) return [];
      return [{ position: this.position }];
    },
  },
};
</script>

<style>
    @import url('https://unpkg.com/leaflet@1.6.0/dist/leaflet.css');
</style>
