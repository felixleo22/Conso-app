
<template>
<div>
    <label for="email">Adresse Email</label>
    <input v-model="email" id="email" type="email" placeholder="Email" />

    <label for="password1">Mot de passe</label>
    <input v-model="password1" id="password1" type="password" placeholder="Mot de passe" />

    <button v-on:click="Connexion" role="button">Se connecter</button>
</div>
</template>

<script>
/* eslint-disable no-restricted-globals */
import axios from 'axios';

export default {
  name: 'connexion',
  data: () => ({
    email: '',
    password1: '',
    password2: '',
  }),
  methods: {
    Connexion() {
      // TODO la bonne route
      axios.get(`//${location.host}:8080/login`,
        {
          email: this.email,
          password1: this.password1,
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
      });
    },
  },
};
</script>
