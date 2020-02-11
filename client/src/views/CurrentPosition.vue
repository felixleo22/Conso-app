<template>
  <div id='app'>
    <div id='mymap' ></div>
  </div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'app',
  data() {
    return {
      carte: '',
      lat: null,
      long: null,
    };
  },
  mounted() {
    this.getLocation();
  },
  methods: {
    initMap() {
      const mymap = L.map('mymap').setView([this.lat, this.long, this.long], 13);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
      }).addTo(mymap);
      L.marker([this.lat, this.long]).addTo(mymap);
      this.carte = mymap;
    },
    getLocation() {
      this.lat = null;
      this.long = null;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // eslint-disable-next-line no-console
          this.lat = position.coords.latitude;
          // eslint-disable-next-line no-console
          this.long = position.coords.longitude;
          console.log(this.lat);
          this.initMap();
        });
      } else {
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
