<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/scan">Scan</router-link> |
      <span v-if="loggedIn"><a href="" @click="logout">Se déconnecter</a> |</span>
      <span v-if="loggedIn"><a href="" @click="basket">Mon panier</a> |</span>
      <span v-else>
        <router-link to="/login">Se connecter</router-link> |
        <router-link to="/signin">S'inscrire</router-link> |
      </span>
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
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login');
      });
    },
    basket() {
      this.$store.dispatch('basket').then(() => {
        this.$router.push('/login');
      });
    },
  },
};
</script>
