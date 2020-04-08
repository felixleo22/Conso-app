<template>
  <div id='app'>
    <leaflet
      v-if="circle"
      :options="options"
      :markers="shops"
      @ready="getLocalisation"
      :circles="[circle]"
      @viewchanged="getAir"
      @mapclick="saveLatLngClick"
    ></leaflet>
    <v-text-field
      v-if="circle"
      type="number"
      label="Distance maximum (en km)"
      @keyup="updateRadiusCircle"
       v-model="distance"
       min="1"
       max="500"
    >
    </v-text-field>
   <v-btn @click="saveSetting">Valider la zone</v-btn>
  </div>
</template>

<script>

import Leaflet from 'easy-vue-leaflet';

export default {
  name: 'app',
  components: {
    Leaflet,
  },
  data() {
    return {
      positionUser: null,
      shops: [],
      distance: 1,
      circle: null,
    };
  },
  computed: {
    options() {
      return {
        view: {
          lat: this.circle.position.lat,
          lng: this.circle.position.lng,
          zoom: 12,
        },
      };
    },
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
    getAir(event) {
      if (event) {
        this.$http.get(`/shops?NW=${event.view.NW}&SE=${event.view.SE}`).then((response) => {
          const tab1 = [];
          this.shops = response.data.shops;
          this.shops.forEach((shop) => {
            const shopWithPopup = {
              position: {
                lat: shop.position.lat,
                lng: shop.position.lng,
              },
              popup: {
                content: shop.name,
                show: false,
              },
            };
            tab1.push(shopWithPopup);
          });
          this.shops = tab1;
        });
      }
    },
    saveLatLngClick(event) {
      this.circle = {
        position: {
          lat: event.position.lat,
          lng: event.position.lng,
        },
        radius: this.circle.radius,
      };
      this.getAir();
    },
    updateRadiusCircle() {
      this.circle = {
        position: {
          lat: this.circle.position.lat,
          lng: this.circle.position.lng,
        },
        radius: this.distance * 1000,
      };
    },
    saveSetting() {
      this.$store.dispatch('setSettings', { position: this.circle.position, radius: this.circle.radius }).then(() => {
        this.$router.push({ path: 'shoppingList' });
      });
    },
  },
  mounted() {
    this.$store.dispatch('getSettings').then(() => {
      this.circle = {
        position: {
          lat: this.$store.getters.settings.position.lat,
          lng: this.$store.getters.settings.position.lng,
        },
        radius: this.$store.getters.settings.radius,
      };
      this.distance = this.$store.getters.settings.radius / 1000;
    });
  },
};
</script>

<style>
  @import url('https://unpkg.com/leaflet@1.6.0/dist/leaflet.css');
</style>
