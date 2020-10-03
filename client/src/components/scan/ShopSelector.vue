<template>
  <div class="leaflet-wrapper">
    <leaflet
      @viewChange="getShops"
      :items="shops"
      @markerClick="selectShop"
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
      @click="createShop"
    >
      <v-icon color="white">fa-plus</v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title primary-title>{{selected ? selected.name : ''}}</v-card-title>
        <v-card-text>{{selected ? selected.address: ''}}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined @click="cancelSelect">Annuler</v-btn>
          <v-btn color="red accent-4 white--text" @click="confirmSelect">Choisir</v-btn>
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
      options: {
        view: {
          lat: 48.5,
          lng: 0.5,
          zoom: 3,
        },
      },
      dialog: false,
      shopId: '',
      shops: [],
      selected: {
        _id: '',
        name: '',
        address: '',
      },
    };
  },
  methods: {
    getLocalisation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(this.watchLocation);
      } else {
        console.log('impossible to get position');
      }
    },
    watchLocation(e) {
      this.positionUser = [{
        position: {
          lat: e.coords.latitude,
          lng: e.coords.longitude,
        },
      }];
    },
    selectShop(event) {
      // eslint-disable-next-line no-underscore-dangle
      this.selected.id = event.marker._id;
      this.selected.name = event.marker.name;
      this.selected.address = event.marker.address;
      this.dialog = true;
    },
    getShops(event) {
      if (!event) return;
      this.$http
        .get(`/shops?NW=${event.view.NW}&SE=${event.view.SE}`)
        .then((response) => {
          this.shops = response.data.shops;
        });
    },
    cancelSelect() {
      this.dialog = false;
      this.selected = {
        id: '',
        name: '',
        address: '',
      };
    },
    confirmSelect() {
      this.$store.dispatch('changeScanShop', this.selected);
      this.dialog = false;
      this.selected = {
        id: '',
        name: '',
        address: '',
      };
    },
    createShop() {
      this.$router.push({ name: 'newshop' });
    },
  },
};
</script>

<style scoped>
#leaflet {
  height: calc(95vh - 56px) !important;
}
</style>
