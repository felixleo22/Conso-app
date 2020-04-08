<template>
  <v-container>
    <v-row class="pa-3"
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
      :markers="shops"
    ></leaflet>
  </v-container>
</template>

<script>
import Leaflet from 'easy-vue-leaflet';
import axios from 'axios';

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
        this.getAir();
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
    async getData(item) {
      const zinzin = await axios.get(`/product/${item.product}`);
      return zinzin;
    },
    createPopup(shop, items) {
      let str = '';
      let tab = null;
      let str2 = '';
      items.forEach((item) => {
        let img = '';
        let name = '';
        tab = this.getData(item).then((res) => {
          // eslint-disable-next-line prefer-destructuring
          name = res.data.brands;
          img = res.data.image_thumb_url;
          // eslint-disable-next-line no-underscore-dangle
          if (shop._id === item.shop && item.product) {
            str2 = `${str2}
                        <tr>
                          <td><img src="${img}" style="height: 50px; width: auto"></td>
                          <td>${name}</td>
                          <td>${item.price}</td>
                      </tr>`;
            str = `
              <table class="tab">
                  <thead>
                      <tr>
                          <th>image</th>
                          <th>produit</th>
                          <th>prix</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${str2}
                  </tbody>
              </table>`;
          }
          return {
            content: str,
            show: false,
          };
        });
      });
      return tab;
    },

    getAir() {
      const url = `&position=${this.circle.position.lat},${this.circle.position.lng}&radius=${this.distance}`;
      this.$http.get(`/shops?${url}`).then((response) => {
        this.shops = response.data.shops;
        const tab1 = [];
        const body = {
          params: {
            shops: this.shops,
            list: {
              items: this.$store.getters.publicBasketById.shoppingList.list,
            },
          },
        };
        this.$store.dispatch('getPricesInShop', body).then((response1) => {
          // eslint-disable-next-line no-restricted-syntax
          for (const shop of this.shops) {
            this.createPopup(shop, response1).then((res) => {
              const shopWithPopup = {
                position: {
                  lat: shop.position.lat,
                  lng: shop.position.lng,
                },
                popup: res,
              };
              tab1.push(shopWithPopup);
            });
            this.shops = tab1;
          }
        });
      });
    },
  },
};

</script>
<style>
  @import url('https://unpkg.com/leaflet@1.6.0/dist/leaflet.css');
</style>
