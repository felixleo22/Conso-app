<template>
    <div>
        <leaflet
          @ready="getShops"
          @viewChange="getShops"
          @markerClick="onMarkerClick"
          :items="shops"></leaflet>
    </div>
</template>

<script>
import Leaflet from '../components/leaflet/Leaflet.vue';

export default {
  name: 'ViewShops',
  components: {
    Leaflet,
  },
  data() {
    return {
      shops: [],
    };
  },
  methods: {
    getShops(event) {
      this.$http.get(`/shops?NW=${event.view[0]}&SE=${event.view[1]}`).then((response) => {
        this.shops = response.data.shops;
      });
    },
    onMarkerClick(event) {
      console.log(event.point);
    },
  },
};
</script>
