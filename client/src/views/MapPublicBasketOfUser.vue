<template>
  <div>
    <leaflet
      v-if="circle"
      :options="options"
      @ready="ready"
      :circles="[circle]"
      @viewChange="getAir"
    ></leaflet>
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
      positionUser: null,
      shops: [],
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
    idPublicBasket() {
      return this.$route.params.id;
    },
  },
  methods: {
    ready() {
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
      const url = this.circle
        ? `&center=${this.circle.position.lat},${this.circle.position.lng}
      &radius=${this.distance}` : '';
      this.$http.get(`/shops?NW=${event.view[0]}&SE=${event.view[1]}${url}`).then((response) => {
        this.shops = response.data.shops;
      });
    },
  },
  mounted() {
    this.$http.get(`/publicbasket/settings/${this.idPublicBasket}/user`).then((response) => {
      this.circle = {
        position: {
          lat: response.data.position.lat,
          lng: response.data.position.lng,
        },
        radius: response.data.radius,
      };
    });
  },
};
</script>

<style>
  @import url('https://unpkg.com/leaflet@1.6.0/dist/leaflet.css');
</style>
