<template>
  <v-app id="app">
    <v-navigation-drawer app clipped v-model="drawer">
      <v-list>
        <v-list-item>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="red accent-4" dark clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">
          <v-icon>fa-bars</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title class="font-weight-bold">Conso App</v-toolbar-title>
    </v-app-bar>

    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <template v-if="loggedIn">
        <router-link :to="{name : 'scan'}">Scan</router-link> |
        <router-link :to="{name : 'logout'}">Déconnexion</router-link> |
        <router-link :to="{name : 'leaflet'}">Map</router-link> |
        <router-link :to="{name : 'shoppingList'}">Liste</router-link> |
      </template>
      <template v-else>
        <router-link :to="{name : 'login'}">Connexion</router-link> |
        <router-link :to="{name : 'signin'}">Inscription</router-link> |
      </template>
    </div> -->
    <v-content>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
  methods: {
  },
};
</script>
