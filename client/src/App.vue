<template>
  <div id="app">
    <div id="nav">
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
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
  methods: {
  },
};
</script>
