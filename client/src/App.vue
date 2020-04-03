<template>
  <v-app id="app">
    <v-navigation-drawer app clipped v-model="drawer">
      <v-list>
        <!-- Route accueil -->
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>fa-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Accueil
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- IF USER IS LOGGED IN -->
        <template v-if="loggedIn">
          <!-- Route scan -->
          <v-list-item link :to="{name: 'scan'}">
            <v-list-item-action>
              <v-icon>fa-barcode</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Scan
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Route scan -->
          <v-list-item link :to="{name: 'shoppingList'}">
            <v-list-item-action>
              <v-icon>fa-list</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Liste de course
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Public basket -->
          <v-list-item link :to="{name: 'publicBasket'}">
            <v-list-item-action>
              <v-icon>fa-globe-europe</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Paniers publics
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Route scan -->
          <v-list-item link :to="{name: 'logout'}">
            <v-list-item-action>
              <v-icon>fa-sign-out-alt</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Se déconnecter
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- IF USER IS NOT LOGGED IN -->
        <template v-else>
          <!-- Route login -->
          <v-list-item link :to="{name: 'login'}">
            <v-list-item-action>
              <v-icon>fa-sign-in-alt</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Se connecter
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Route signup -->
          <v-list-item link :to="{name: 'signup'}">
            <v-list-item-action>
              <v-icon>fa-user-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                S'inscrire
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="red accent-4" dark clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">
          <v-icon>fa-bars</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title class="font-weight-bold">Conso App</v-toolbar-title>
    </v-app-bar>

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
