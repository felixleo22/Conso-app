<template>
  <div id='app'>
    <div v-bind="getLocation(this.carte)" id='mymap' ></div>
    <!-- <v-select v-model="selected" :options="options" /> -->
    <button @click="createCircle" type="submit">Valider</button>
  </div>
</template>

<script>
import L from 'leaflet';
// import vSelect from 'vue-select';

export default {
  name: 'app',
  components: {
    // 'v-select': vSelect,
  },
  data() {
    return {
      selected: null,
      carte: null,
      circle1: null,
      circle2: null,
      circle3: null,
      circleLayer: null,
      lat: null,
      long: null,
      options: [
        '5km',
        '10km',
        '15km',
      ],
    };
  },
  methods: {
    // eslint-disable-next-line consistent-return
    createCircle() {
      this.circle1 = L.circle([this.lat, this.long], { radius: 5000, metric: true });
      this.circle2 = L.circle([this.lat, this.long], { radius: 10000, metric: true });
      this.circle3 = L.circle([this.lat, this.long], { radius: 15000, metric: true });
      if (this.selected === '5km') {
        if (this.circleLayer) {
          this.circleLayer.clearLayers();
        }
        this.circleLayer = L.layerGroup([this.circle1]).addTo(this.carte);
      } if (this.selected === '10km') {
        if (this.circleLayer) {
          this.circleLayer.clearLayers();
        }
        this.circleLayer = L.layerGroup([this.circle2]).addTo(this.carte);
      } if (this.selected === '15km') {
        if (this.circleLayer) {
          this.circleLayer.clearLayers();
        }
        this.circleLayer = L.layerGroup([this.circle3]).addTo(this.carte);
      }
    },
    initMap() {
      this.carte = L.map('mymap').setView([this.lat, this.long, this.long], 13);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
      }).addTo(this.carte);
      L.marker([this.lat, this.long]).addTo(this.carte);
      // eslint-disable-next-line no-unused-expressions
      L.control.scale().addTo(this.carte);
    },
    getLocation(carte) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // eslint-disable-next-line no-console
          this.lat = position.coords.latitude;
          // eslint-disable-next-line no-console
          this.long = position.coords.longitude;
          this.initMap(carte);
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
  #app,
  #mymap {
    position: relative;
    padding: 0;
    width: 100%;
    height: 600px;
  }
</style>
