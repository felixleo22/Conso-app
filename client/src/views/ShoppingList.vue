
<template>
  <v-container>
    <v-btn link :to="{name: 'zoneshoppinglist'}">
        <v-icon>fas fa-map-marked-alt</v-icon>
    </v-btn>
    <search-bar></search-bar>
    <list></list>
  </v-container>
</template>

<script>
import List from '../components/shoppingList/List.vue';
import SearchBar from '../components/shoppingList/SearchBar.vue';

export default {
  name: 'shoppingList',
  components: {
    SearchBar,
    List,
  },
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
  },
  computed: {
  },
};

</script>
