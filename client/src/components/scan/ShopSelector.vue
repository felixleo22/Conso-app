<template>
  <div class="leaflet-wrapper">
    <leaflet
      :options=" {view : {lat: 48.5,lng: 0.5, zoom: 3}}"
      :markers="shops"
      @viewchanged="getShops"
      @markerclick="selectShop"
    >
    </leaflet>

    <v-btn
      fixed
      fab
      bottom
      right
      title="Ajouter un magasin"
      color="red accent-4"
      style="bottom: 6vh; right: 24px;"
    >
      <v-icon color="white">fa-plus</v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title
          primary-title
        >
          {{selected ? selected.name : ''}}
        </v-card-title>

        <v-card-text>
          {{selected ? selected.address: ''}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            @click="cancelSelect">
              Annuler
          </v-btn>
          <v-btn
            color="red accent-4 white--text"
            @click="confirmSelect">
              Choisir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Leaflet from 'easy-vue-leaflet';

export default {
  name: 'ShopSelector',
  components: {
    Leaflet,
  },
  data() {
    return {
      dialog: false,
      shopId: '',
      shops: [],
      selected: null,
      create: false,
    };
  },
  methods: {
    selectShop(event) {
      const { marker } = event;
      this.selected = marker;

      this.dialog = true;
    },
    getShops(event) {
      this.$http.get(`/shops?NW=${event.view.NW}&SE=${event.view.SE}`).then((response) => {
        this.shops = response.data.shops;
      });
    },
    cancelSelect() {
      this.dialog = false;
      this.selected = null;
    },
    confirmSelect() {
      this.$store.dispatch('changeScanShop', this.selected);
      this.dialog = false;
      this.selected = null;
    },
  },
};
</script>

<style scoped>
  @import url('https://unpkg.com/leaflet@1.6.0/dist/leaflet.css');
  #leaflet {
    height: calc(95vh - 56px) !important;
  }
</style>
