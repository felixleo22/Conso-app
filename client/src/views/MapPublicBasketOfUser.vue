<template>
  <div>
    <leaflet
      v-if="settings"
      @ready="ready"
      :items="allPoints"
      :radius="radius"
      @viewChange="getAir"
    ></leaflet>
  </div>
</template>

<script>
import Leaflet from '../components/leaflet/Leaflet.vue';

export default {
  components: {
    Leaflet,
  },
  data() {
    return {
      settings: null,
      shops: null,
    };
  },
  computed: {
    idPublicBasket() {
      return this.$route.params.id;
    },
    allPoints() {
      if (this.position) return this.shops.concat(this.position);
      return this.shops;
    },
    radius() {
      if (!this.settings) return null;
      return { position: this.settings.center.position, radius: this.settings.radius * 1000 };
    },
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
        ? `&center=${this.settings.position.lat},${this.settings.position.lng}
      &radius=${this.settings.radius}` : '';
      this.$http.get(`/shops?NW=${event.view[0]}&SE=${event.view[1]}${url}`).then((response) => {
        this.shops = response.data.shops;
      });
    },
  },
  mounted() {
    this.$store
      // eslint-disable-next-line no-underscore-dangle
      .dispatch('getSettings', this.idPublicBasket)
      .then((response) => {
        this.settings = response.data;
      });
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
