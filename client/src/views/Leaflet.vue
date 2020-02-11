<template>
  <div id='app'>
    <div id='mymap'>

    </div>
  </div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'app',
  data() {
    return {
      carte: '',
      markers: '',
      air: [],
      shops: '',
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.carte = L.map('mymap').setView([48.6880756, 6.1384176, 6.1384176], 13);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution:
          "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
      }).addTo(this.carte);

      this.air[0] = this.carte.getBounds().getNorthWest().toString().match(/\d+[.]?\d+/g)
        .join(',');
      this.air[1] = this.carte.getBounds().getSouthEast().toString().match(/\d+[.]?\d+/g)
        .join(',');
      this.$http.get(`/shops?NW=${this.air[0]}&SE=${this.air[1]}`).then((response) => {
        this.result = response.data.shops;
        const tab = [];
        this.result.forEach((shop) => {
          tab.push(L.marker([shop.position.lng, shop.position.lat]).addTo(this.carte));
          this.shops = L.layerGroup(tab).addTo(this.carte);
        });
      });
      this.carte.on('zoomend', this.showShops);
      this.carte.on('moveend', this.showShops);
    },
    showShops() {
      this.air[0] = this.carte.getBounds().getNorthWest().toString().match(/\d+[.]?\d+/g)
        .join(',');
      this.air[1] = this.carte.getBounds().getSouthEast().toString().match(/\d+[.]?\d+/g)
        .join(',');
      this.$http.get(`/shops?NW=${this.air[0]}&SE=${this.air[1]}`).then((response) => {
        this.result = response.data.shops;
        const tab = [];
        this.result.forEach((shop) => {
          this.shops.clearLayers();
          tab.push(L.marker([shop.position.lng, shop.position.lat]).addTo(this.carte));
          this.shops = L.layerGroup(tab).addTo(this.carte);
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
