<template>
  <div id='app'>
    <leaflet @ready="getLocation" :items="position"></leaflet>
    <v-select v-model="selected" :items="options" />
    <!-- <button @click="createCircle" type="submit">Valider</button> -->
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
      circle1: null,
      circle2: null,
      circle3: null,
      circleLayer: null,
      position: null,
      options: [
        '5km',
        '10km',
        '15km',
      ],
    };
  },
  methods: {
    // eslint-disable-next-line consistent-return
    // createCircle() {
    //   this.circle1 = L.circle([this.lat, this.long], { radius: 5000, metric: true });
    //   this.circle2 = L.circle([this.lat, this.long], { radius: 10000, metric: true });
    //   this.circle3 = L.circle([this.lat, this.long], { radius: 15000, metric: true });
    //   if (this.selected === '5km') {
    //     if (this.circleLayer) {
    //       this.circleLayer.clearLayers();
    //     }
    //     this.circleLayer = L.layerGroup([this.circle1]).addTo(this.carte);
    //   } if (this.selected === '10km') {
    //     if (this.circleLayer) {
    //       this.circleLayer.clearLayers();
    //     }
    //     this.circleLayer = L.layerGroup([this.circle2]).addTo(this.carte);
    //   } if (this.selected === '15km') {
    //     if (this.circleLayer) {
    //       this.circleLayer.clearLayers();
    //     }
    //     this.circleLayer = L.layerGroup([this.circle3]).addTo(this.carte);
    //   }
    // },
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
