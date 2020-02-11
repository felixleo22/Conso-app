<template>
  <div id='app'>
    <div id='mymap' @click="test"></div>
  </div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'app',
  data() {
    return {
      carte: '',
      air: '',
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
        this.air = this.carte.getBounds();
        this.$http.get('/shop', {
          bound: this.carte.getBounds(),
        }).then((response) => {
          this.result = response.data;
        });
      });
    },
    test() {
      console.log(this.air);
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
