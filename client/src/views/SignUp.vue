<template>
<v-container>
<h2 class="text-center">Rejoindre Conso App</h2>

<v-form
  v-model="valid"
  :lazy-validation="valid"
>
    <v-row>
      <v-col
        cols="12"
        md="8"
        offset-md="2"
      >
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          requiered>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="4"
        offset-md="2"
      >
        <v-text-field
          v-model="password1"
          :append-icon="showPw1 ? 'fa-eye' : 'fa-eye-slash'"
          :type="showPw1 ? 'text' : 'password'"
          :rules="passwordRules"
          @click:append="showPw1 = !showPw1"
          label="Mot de passe"
          requiered
        >
        </v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="password2"
          :append-icon="showPw2 ? 'fa-eye' : 'fa-eye-slash'"
          :type="showPw2 ? 'text' : 'password'"
          :rules="[password1 === password2 || 'Les mots de passe doivent correspondre']"
          @click:append="showPw2 = !showPw2"
          label="Confirmer le mot de passe"
          requiered
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" :disabled="!valid" @click="signUp">
          S'inscrire
        </v-btn>
      </v-col>
    </v-row>
</v-form>
</v-container>
</template>

<script>
/* eslint-disable no-restricted-globals */

export default {
  name: 'signUp',
  data: () => ({
    email: '',
    password1: '',
    password2: '',
    valid: true,
    showPw1: false,
    showPw2: false,
    emailRules: [
      v => !!v || 'L\'email est obligatoire',
      v => /.+@.+\..+/.test(v) || 'L\'email n\'est pas valide',
    ],
    passwordRules: [
      v => !!v || 'Le mot de passe est obligatoire',
    ],
  }),
  methods: {
    signUp() {
      this.$http.post('/user',
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
        this.$router.push('login');
      });
    },
  },
};
</script>
