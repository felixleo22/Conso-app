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
      const { email } = this;
      const { password } = this;
      this.$store
        .dispatch('login', { email, password })
        .then(() => this.$router.push('/'))
        .catch(err => console.log(err));
    },
  },
};
</script>
