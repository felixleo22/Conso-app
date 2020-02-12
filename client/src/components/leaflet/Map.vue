<template>
  <div>
    <div id='mymap'></div>
  </div>
</template>
<script>
import L from 'leaflet';

export default {
  name: 'MapShop',
  data() {
    return {
      carte: '',
      markers: '',
      air: [],
      points: null,
    };
  },
  mounted() {
    this.carte = L.map('mymap').setView([48.6880756, 6.1384176, 6.1384176], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
          "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(this.carte);

    this.carte.on('zoomend', this.showPoints);
    this.carte.on('moveend', this.showPoints);

    this.$emit('ready', this.carte);

    this.showPoints();
  },
  methods: {
    showPoints() {
      this.filterLatLng();
      this.$http.get(`/shops?NW=${this.air[0]}&SE=${this.air[1]}`).then((response) => {
        this.result = response.data.shops;
        const tab = [];
        this.result.forEach((point) => {
          if (this.points) this.points.clearLayers();

          tab.push(L.marker([point.position.lng, point.position.lat]).addTo(this.carte));
          this.points = L.layerGroup(tab).addTo(this.carte);
        });
      });

      this.$emit('pointsLoaded', this.points);
    },
    filterLatLng() {
      this.air[0] = this.carte.getBounds().getNorthWest().toString().match(/\d+[.]?\d+/g)
        .join(',');
      this.air[1] = this.carte.getBounds().getSouthEast().toString().match(/\d+[.]?\d+/g)
        .join(',');
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
