<template>
  <v-container>
    <h2 class="text-center">Se connecter à Conso App</h2>

    <v-form>
      <v-row>
        <v-col
          cols="12"
          md="8"
          offset-md="2"
        >
          <v-text-field
            v-model="email"
            label="Email"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="8"
          offset-md="2"
        >
          <v-text-field
            v-model="password"
            :append-icon="showPw ? 'fa-eye' : 'fa-eye-slash'"
            :type="showPw ? 'text' : 'password'"
            @click:append="showPw = !showPw"
            label="Mot de passe"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn color="primary" @click="login">
            Se connecter
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      showPw: false,
    };
  },
  methods: {
    login() {
      this.$store.dispatch('retrieveToken', {
        email: this.email,
        password: this.password,
      })
        .then(() => {
          const destination = this.$route.query.redirect;
          if (destination) {
            this.$router.push(destination);
          } else {
            this.$router.push({ name: 'home' });
          }
        }).catch((error) => {
          if (error.status === 400) {
            console.log('Email ou mot de passe incorrecte ! ');
          }
        });
    },
  },
};
</script>
