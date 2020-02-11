<template>
  <div id='app'>
    <div id='mymap'></div>
  </div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'app',
  data() {
    return {
      carte: '',
      air: [],
      shops: '',
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const mymap = L.map('mymap').setView([48.6880756, 6.1384176, 6.1384176], 13);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
      }).addTo(mymap);
      this.carte = mymap;
      this.carte.on('zoomend', () => {
        this.air[0] = this.carte.getBounds().getNorthWest().toString();
        this.air[1] = this.carte.getBounds().getSouthEast().toString();
        this.$http.get(`/shops?NW=${this.air[0]}&SE=${this.air[0]}`).then((response) => {
          this.result = response.data;
          console.log(`res = ${this.result}`);
        });
      });
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
