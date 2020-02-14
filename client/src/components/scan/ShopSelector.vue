<template>
  <div class="leaflet-wrapper">
    <leaflet
      @ready="getShops"
      @viewChange="getShops"
      :items="shops"
      @markerClick="selectShop"
    >
    </leaflet>

    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title
          primary-title
        >
          {{selected ? selected.name : ''}}
        </v-card-title>

        <v-card-text>
          {{selected ? selected.address: ''}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            @click="cancelSelect">
              Annuler
          </v-btn>
          <v-btn
            color="red accent-4 white--text"
            @click="confirmSelect">
              Choisir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Leaflet from '../leaflet/Leaflet.vue';

export default {
  name: 'ShopSelector',
  components: {
    Leaflet,
  },
  data() {
    return {
      dialog: false,
      shopId: '',
      shops: [],
      selected: null,
    };
  },
  methods: {
    selectShop(event) {
      const { point } = event;
      this.selected = point;

      this.dialog = true;
    },
    getShops(event) {
      this.$http.get(`/shops?NW=${event.view[0]}&SE=${event.view[1]}`).then((response) => {
        this.shops = response.data.shops;
      });
    },
    cancelSelect() {
      this.dialog = false;
      this.selected = null;
    },
    confirmSelect() {
      this.$store.dispatch('changeScanShop', this.selected);
      this.dialog = false;
      this.selected = null;
    },
  },
};
</script>

<style scoped>
  #leaflet {
    height: calc(95vh - 56px) !important;
  }
</style>
