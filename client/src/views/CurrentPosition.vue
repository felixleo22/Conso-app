<template>
  <div id='app'>
    <leaflet
      @ready="getLocation"
      :items="position"
      :radius="radius"
    ></leaflet>
    <v-select v-model="selected" :items="options" />
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
      selected: null,
      carte: null,
      position: null,
      options: [
        '5km',
        '10km',
        '15km',
      ],
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
  },
  computed: {
    radius() {
      if (!this.position) return null;
      return { position: this.position[0].position, radius: 1000 };
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
