<template>
  <v-container>
    <v-toolbar dense flat>
      <v-row>
        <v-col
          cols="10"
          md="7"
          offset-md="2"
          xl="4"
          offset-xl="4"
        >
          <v-autocomplete
            v-model="selection"
            :items="result"
            :loading="isLoading"
            :search-input.sync="search"
            hide-details
            hide-selected
            :hide-no-data="!search"
            label="Rechercher un produit ... "
            solo
            no-filter
            @keypress.enter="add"
            append-icon="fa-caret-down"
          >
            <template v-slot:no-data>
              <v-list-item-content>
                Aucun produit trouvé !
              </v-list-item-content>
            </template>

            <template v-slot:selection="{ item }">
              <v-list-item-avatar tile>
                 <v-responsive :aspect-ratio="1/1">
                  <img :src="item.icon">
                 </v-responsive>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle>{{item.brand}}</v-list-item-subtitle>
              </v-list-item-content>
            </template>

            <template v-slot:item="{ item }">
              <v-list-item-avatar tile>
                 <v-responsive :aspect-ratio="1/1">
                  <img :src="item.icon">
                 </v-responsive>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle>{{item.brand}}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col
          cols="2"
          md="1"
          xl="2"
        >
          <v-btn icon @click="add()">
            <v-icon color="primary" title="Ajouter">fa-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
  </v-container>
</template>

<script>
export default {
  name: 'searchbar',
  data() {
    return {
      selection: null,
      isLoading: false,
      result: [],
      search: null,
    };
  },
  methods: {
    add() {
      if (!this.selection) return;
      this.$store.dispatch('setLoading', true);
      const res = {
        codebar: this.selection.codebar,
        name: this.selection.name,
        icon: this.selection.icon,
        brand: this.selection.brand,
        quantity: 1,
      };
      this.$store.dispatch('addItem', res)
        .then(() => {
          this.selection = null;
        })
        .finally(() => {
          this.$store.dispatch('setLoading', false);
        });
    },
  },
  watch: {
    search(val) {
      if (this.isLoading || this.selection) return;
      this.isLoading = true;

      this.$http.get(`/products?search=${encodeURI(val)}`)
        .then((response) => {
          this.result = response.data.products;
        })
        .catch(() => {
          console.log('Can t get response from API');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
