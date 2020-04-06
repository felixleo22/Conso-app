<template>
  <v-container>
    <v-row
      align="start"
      justify="center">
      <v-dialog
        v-model="dialog"
        width="600">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">Details du pannier public</v-btn>
        </template>
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title>
            Détails du pannier public
          </v-card-title>
          <v-simple-table fixed-header v-if="publicBasket">
            <thead>
            <tr>
              <th class="text-left" width="66%">Produit</th>
              <th class="text-left">Quantité</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in publicBasket.shoppingList.list" :key="item._id">
              <td>
                <v-list-item>
                  <v-list-item-avatar tile>
                    <v-responsive :aspect-ratio="1/1">
                      <img :src="item.icon">
                    </v-responsive>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{item.name}}</v-list-item-title>
                    <v-list-item-subtitle>{{item.brand}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </td>
              <td>
                <v-list-item>{{item.quantity}}</v-list-item>
              </td>
            </tr>
            </tbody>
          </v-simple-table>
          <v-divider></v-divider>
        </v-card>
      </v-dialog>
    </v-row>

    <leaflet
      v-if="circle"
      :options="options"
      @ready="ready"
      :circles="[circle]"
      @viewChange="getAir"
    ></leaflet>
  </v-container>
</template>

<script>
import Leaflet from 'easy-vue-leaflet';

export default {
  data() {
    return {
      publicBasketId: null,
      dialog: false,
      positionUser: null,
      shops: [],
      distance: 1,
      circle: null,
    };
  },
  components: {
    Leaflet,
  },
  computed: {
    idPublicBasket() {
      return this.$route.params.id;
    },
    publicBasket() {
      console.log(this.$store.getters.publicBasketById);
      return this.$store.getters.publicBasketById;
    },
    options() {
      return {
        view: {
          lat: this.circle.position.lat,
          lng: this.circle.position.lng,
          zoom: 12,
        },
      };
    },
  },
  mounted() {
    this.$store.dispatch('getPublicBasketsById', { id: this.idPublicBasket })
      .then(() => {
        this.circle = {
          position: {
            lat: this.$store.getters.publicBasketById.shoppingList.settings.position.lat,
            lng: this.$store.getters.publicBasketById.shoppingList.settings.position.lng,
          },
          radius: this.$store.getters.publicBasketById.shoppingList.settings.radius,
        };
        this.distance = this.$store.getters.publicBasketById.shoppingList.settings.radius / 1000;
      });
  },
  methods: {
    ready() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(this.watchLocation);
      } else {
        console.log('impossible to get position');
      }
    },
    watchLocation(e) {
      this.positionUser = [{
        position: {
          lat: e.coords.latitude,
          lng: e.coords.longitude,
        },
      }];
    },
    getAir(event) {
      const url = this.circle
        ? `&center=${this.circle.position.lat},${this.circle.position.lng}
      &radius=${this.distance}` : '';
      this.$http.get(`/shops?NW=${event.view[0]}&SE=${event.view[1]}${url}`).then((response) => {
        this.shops = response.data.shops;
      });
    },
  },
};
</script>
<style>
  @import url('https://unpkg.com/leaflet@1.6.0/dist/leaflet.css');
</style>
