<template>
  <div id='app'>
    <leaflet
      @ready="ready"
      :items="allPoints"
      :radius="radius"
      @viewChange="getAir"
      @click="enableClick"
    ></leaflet>
   <input type='number' v-model="distance" min="1" max="500" placeholder="en km">
   <v-btn @click="saveSetting">Valider la zone</v-btn>
  </div>
</template>

<script>
//
import Leaflet from '../components/leaflet/Leaflet.vue';

export default {
  name: 'app',
  components: {
    Leaflet,
  },
  data() {
    return {
      position: null,
      center: null,
      distance: 2,
      shops: [],
    };
  },
  methods: {
    ready() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(this.watchLoc);
      } else {
        console.log('impossible to get position');
      }
    },
    watchLoc(e) {
      this.position = [{
        position: {
          lat: e.coords.latitude,
          lng: e.coords.longitude,
        },
      }];
    },
    getAir(event) {
      const url = this.center
        ? `&center=${this.center.position.lat},${this.center.position.lng}
      &radius=${this.distance}` : '';
      this.$http.get(`/shops?NW=${event.view[0]}&SE=${event.view[1]}${url}`).then((response) => {
        this.shops = response.data.shops;
      });
    },
    enableClick(event) {
      this.center = { position: event.latlng };
    },
    saveSetting() {
      this.$store.dispatch('setSettings', { center: this.center, radius: this.distance }).then(() => {
        this.$router.push({ path: 'shoppingList' });
      });
    },
  },
  mounted() {
    this.$store.dispatch('getSettings').then(() => {
      this.distance = this.$store.getters.settings.radius;
      this.center = this.$store.getters.settings.center;
    });
  },
  computed: {
    radius() {
      if (!this.center) return null;
      return { position: this.center.position, radius: this.distance * 1000 };
    },
    allPoints() {
      if (this.position) return this.shops.concat(this.position);
      return this.shops;
    },
  },
};
</script>

<style>
  #mymap {
    position: relative;
    padding: 0;
    width: 100%;
    height: 600px;
    z-index: 0;
  }
</style>
