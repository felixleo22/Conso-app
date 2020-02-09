<template>
  <div>
    <form @submit.prevent="login">
      <h1>Login in</h1>
      <label>Email</label>
      <input v-model="email" type="text" placeholder="Email" />
      <label>Mot de passe</label>
      <input v-model="password" type="password" placeholder="Mot de passe" />
      <hr />
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
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
