<template>
<div>
  <v-container>
    <alert-error v-if="error" :text="this.text"></alert-error>
    <v-row>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="barcode"
        outlined
        dense
        label="Tapez code barre"
        :append-icon="barcode ? 'fa-arrow-circle-right' : ''"
        @click:append="onScanned(barcode)"
        @keypress.enter="onScanned(barcode)"
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-spacer></v-spacer>
        <div class="scanner-wrapper">
          <StreamBarcodeReader
            @decode="onScanned"
          ></StreamBarcodeReader>
        </div>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</div>
</template>

<script>
import { StreamBarcodeReader } from 'vue-barcode-reader';
import alertError from '../alerts/AlertError.vue';

export default {
  name: 'scanner',
  components: {
    StreamBarcodeReader,
    alertError,
  },
  data() {
    return {
      barcode: '',
      error: false,
      text: '',
    };
  },
  methods: {
    onScanned(event) {
      if (this.$store.getters.isLoading) return;
      this.$store.dispatch('setLoading', true);

      const barcode = event;
      this.$http.get(`/product/${barcode}`)
        .then((response) => {
          const product = {
            code: response.data.code,
            name: response.data.product_name,
            image: response.data.image_front_url,
          };
          this.$emit('scanned', product, this.setReady);
          this.barcode = '';
        })
        .catch((error) => {
          this.error = true;
          this.text = 'le code bar ne correspond à aucun produit';
          console.log(error.response);
        })
        .finally(() => {
          this.$store.dispatch('setLoading', false);
        });
    },
  },
};
</script>

<style scoped>
.scanner-wrapper {
  display: inline-block;
}

.scanner-container {
  max-width: 100%;
}
</style>
