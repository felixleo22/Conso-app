
<template>
<div>
    <label for="email">Adresse Email</label>
    <input v-model="email" id="email" type="email" placeholder="Email" />

    <label for="password1">Mot de passe</label>
    <input v-model="password1" id="password1" type="password" placeholder="Mot de passe" />

    <label for="password2">Confirmez votre mot de passe</label>
    <input v-model="password2" id="password2" type="password" placeholder="Mot de passe" />
    <button v-on:click="signIn" role="button">S'inscrire</button>
</div>
</template>

<script>
/* eslint-disable no-restricted-globals */
import axios from 'axios';

export default {
  name: 'signIn',
  data: () => ({
    email: '',
    password1: '',
    password2: '',
  }),
  methods: {
    signIn() {
      axios.post(`//${location.host}:8080/signIn`,
        {
          email: this.email,
          password1: this.password1,
          password2: this.password2,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }).then((response) => {
        if (!response.status === 201) {
          // TODO afficher le message d'erreur
          return;
        }
        console.log(response.data);
        this.$router.push('about');
      });
    },
  },
};
</script>
