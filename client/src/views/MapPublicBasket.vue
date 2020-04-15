<template>
  <v-container>
    <v-row class="pa-3" align="start" justify="center"></v-row>
    <leaflet
      v-if="circle"
      :options="options"
      @ready="ready"
      :circles="[circle]"
      :markers="shops"
      @markerclick="selectShop"
    ></leaflet>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title primary-title>{{selected ? selected.name : ''}}</v-card-title>
        <v-card-text>{{selected ? selected.address: ''}}</v-card-text>
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left">Image</th>
              <th class="text-left">Nom</th>
              <th class="text-left">Quantité</th>
              <th class="text-left">Prix unitaire</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in selected.products" :key="product.name">
              <td><v-img :src=product.icon width="30"></v-img></td>
              <td>{{ product.name }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.price }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn outlined>Scanner</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      products: [],
      distance: 1,
      circle: null,
      selected: {
        _id: '',
        name: '',
        address: '',
        products: [],
      },
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
    this.$store
      .dispatch('getPublicBasketsById', { id: this.idPublicBasket })
      .then(() => {
        this.circle = {
          position: {
            lat: this.$store.getters.publicBasketById.shoppingList.settings
              .position.lat,
            lng: this.$store.getters.publicBasketById.shoppingList.settings
              .position.lng,
          },
          radius: this.$store.getters.publicBasketById.shoppingList.settings
            .radius,
        };
        this.distance = this.$store.getters.publicBasketById.shoppingList.settings.radius
          / 1000;
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
      this.positionUser = [
        {
          position: {
            lat: e.coords.latitude,
            lng: e.coords.longitude,
          },
        },
      ];
    },
    selectShop(event) {
      // eslint-disable-next-line no-underscore-dangle
      this.selected.id = event.marker._id;
      this.selected.name = event.marker.name;
      this.selected.address = event.marker.address;
      this.updateContentDialog(this.selected.id);
      this.dialog = true;
    },
    updateContentDialog(id) {
      this.selected.products = [];
      const sorted = [];
      // sort products of id shop
      this.products.forEach((elem) => {
        if (elem.shop === id) {
          sorted.push(elem);
        }
      });
      // put informations on dialog
      this.$store.getters.publicBasketById.shoppingList.list.forEach((element) => {
        const product = sorted.find(elem => elem.product === String(element.codebar));
        // eslint-disable-next-line no-param-reassign
        element.price = product.price;
        this.selected.products.push(element);
      });
    },
    async getData(item) {
      const zinzin = await axios
        .get(`/product/${item.product}`)
        .then(res => res.data);
      return zinzin;
    },

    getAir() {
      const url = `&position=${this.circle.position.lat},${this.circle.position.lng}&radius=${this.distance}`;
      this.$http.get(`/shops?${url}`).then((response) => {
        this.shops = response.data.shops;
        const body = {
          params: {
            shops: this.shops,
            list: {
              items: this.$store.getters.publicBasketById.shoppingList.list,
            },
          },
        };
        axios
          .get('/products/shop/publicBasket/', body)
          .then((response2) => {
            this.products = response2.data;
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
  },
};
</script>
<style>
@import url("https://unpkg.com/leaflet@1.6.0/dist/leaflet.css");
</style>
