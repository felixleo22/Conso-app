<template>
  <div>
    <div id='mymap'></div>
  </div>
</template>
<script>
import L from 'leaflet';

export default {
  name: 'Leaflet',
  props: ['items', 'radius'],
  data() {
    return {
      carte: '',
      markers: null,
      circle: null,
    };
  },
  mounted() {
    this.carte = L.map('mymap').setView([48.6880756, 6.1384176, 6.1384176], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
          "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(this.carte);
    this.carte.on('zoomend', this.haveToBeRefresh);
    this.carte.on('dragend', this.haveToBeRefresh);
    this.carte.on('click', (event) => {
      this.$emit('click', event);
    });
    this.$emit('ready', { map: this.carte, view: this.getAir() });
    this.haveToBeRefresh();
  },
  methods: {
    createCircle() {
      if (this.circle) this.circle.clearLayers();
      const circle = L.circle(
        [this.radius.position.lat, this.radius.position.lng],
        { radius: this.radius.radius, metric: true },
      );
      this.circle = L.layerGroup([circle]).addTo(this.carte);
      this.haveToBeRefresh();
    },
    showPoints() {
      const tab = [];
      this.points.forEach((point) => {
        if (this.markers) this.markers.clearLayers();

        tab.push(L.marker([point.position.lat, point.position.lng]).on('click', () => {
          this.$emit('markerClick', { map: this.carte, point });
        }));
        this.markers = L.layerGroup(tab).addTo(this.carte);
      });

      this.$emit('pointsLoaded', this.points);
    },
    haveToBeRefresh() {
      this.$emit('viewChange', { map: this.carte, view: this.getAir() });
    },
    getAir() {
      const res = [];
      res[0] = this.carte.getBounds().getNorthWest().toString().match(/\d+[.]?\d+/g)
        .join(',');
      res[1] = this.carte.getBounds().getSouthEast().toString().match(/\d+[.]?\d+/g)
        .join(',');
      return res;
    },
  },
  computed: {
    points: {
      get() {
        if (!this.items) return [];
        return this.items;
      },
      set() {},
    },
  },
  watch: {
    items(items) {
      if (!items) return;
      this.showPoints();
    },
    radius(radius) {
      if (!radius) return;
      this.createCircle();
      this.showPoints();
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
  z-index: 0;
}

</style>
