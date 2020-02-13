<template>
  <div id='app'>
    <leaflet
      @ready="getLocation"
      :items="allPoints"
      :radius="radius"
      @viewChange="getAir"
    ></leaflet>
   <input v-model="distance" min="1" max="500" placeholder="en km">
  </div>
</template>

<script>
import Leaflet from '../components/leaflet/Leaflet.vue';

export default {
  name: 'app',
  components: {
    Leaflet,
  },
  data() {
    return {
      position: null,
      distance: 10,
      shops: [],
    };
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // eslint-disable-next-line no-console
          const lat = position.coords.latitude;
          // eslint-disable-next-line no-console
          const lng = position.coords.longitude;

          this.position = [{ position: { lng, lat } }];
        });
      } else {
        // eslint-disable-next-line no-console
        console.log('Geolocation is not supported by this browser.');
      }
    },
    getAir(event) {
      const url = this.position
        ? `&center=${this.position[0].position.lat},${this.position[0].position.lng}
      &radius=${this.distance}` : '';
      this.$http.get(`/shops?NW=${event.view[0]}&SE=${event.view[1]}${url}`).then((response) => {
        this.shops = response.data.shops;
      });
    },
  },
  computed: {
    radius() {
      if (!this.position) return null;
      return { position: this.position[0].position, radius: this.distance * 1000 };
    },
    allPoints() {
      if (!this.position) {
        return null;
      }
      if (this.shops.lenght === 0) {
        return this.position;
      }
      return this.shops.concat(this.position);
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
