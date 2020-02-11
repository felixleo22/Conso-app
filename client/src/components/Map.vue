<template>

  <div >
    <l-map
      :zoom="zoom"
      :center="center"
      style="height: 500px; width: 100%"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-control
        :position="'bottomleft'"
        class="custom-control-watermark"
      >
        ConsoApp Nancy
      </l-control>
<!-- Create HTML icon (divIcon) by providing content inside the l-icon tag -->
      <l-marker :lat-lng="[48.682925, 6.160936]">
        <l-icon
          :icon-anchor="staticAnchor"
          class-name="someExtraClass"
        >
          <div class="headline">
            {{ customText }}
          </div>
          <img src="./test.png" style="width:20px; ">
        </l-icon>
      </l-marker>

      <l-marker :lat-lng="[48.682928, 6.2]">
        <l-icon
          :icon-anchor="staticAnchor"
          class-name="someExtraClass"
        >
          <div class="headline">
            O champ
          </div>
          <img src="./test.png" style="width:20px; ">
        </l-icon>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
/*eslint-disable */
import { latLng, icon } from "leaflet";
import { LMap, LTileLayer, LControl, LMarker, LIcon } from "vue2-leaflet";

export default {
  name: "Example",
  components: {
    LMap,
    LTileLayer,
    LControl,
    LMarker,
    LIcon
  },
  data() {
    return {
      zoom: 13,
      center: latLng(48.6833, 6.2),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      icon: icon({
        iconUrl: "",
        iconSize: [32, 37],
        iconAnchor: [16, 37]
      }),
      staticAnchor: [16, 37],
      customText: "Match",
      iconSize: 64
    };
  },
  methods: {
   
  }
};
</script>

<style>
.example-custom-control {
  background: #fff;
  padding: 0 0.5em;
  border: 1px solid #aaa;
  border-radius: 0.1em;
}
.custom-control-watermark {
  font-size: 200%;
  font-weight: bolder;
  color: rgb(0, 0, 0);
}
</style>