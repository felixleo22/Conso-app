<template>
    <div>
        <leaflet @ready="getShops" @viewChange="getShops" :items="shops"></leaflet>
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
      console.log('get');
      this.$http.get(`/shops?NW=${event.view[0]}&SE=${event.view[1]}`).then((response) => {
        this.shops = response.data.shops;
      });
    },
  },
};
</script>
