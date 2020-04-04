<template>
  <div id='app'>
    <leaflet
      @ready="ready"
      :items="allPoints"
      :radius="radius"
      @viewChange="getAir"
      @click="enableClick"
    ></leaflet>
    <div>
      <p>Vous n'avez pas de pannier public veuillez en créer un avec votre liste de course</p>
    </div>
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
      shops: [],
      publicBasket: null,
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
  },

  mounted() {
    this.$store.dispatch('getPublicBasket').then(() => {
      this.publicBasket = this.store.getters.publicBasket;
    });
    this.$store.dispatch('getSettingsPublicBasket').then(() => {
      this.distance = this.$store.getters.settings.radius;
      this.center = this.$store.getters.settings.center;
    });
  },
  computed: {
    publicBaskets() {
      return this.publicBasket;
    },
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
