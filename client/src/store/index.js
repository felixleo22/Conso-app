/* eslint-disable no-restricted-globals */
import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

Axios.defaults.baseURL = `//${location.hostname}:8080`;
Vue.prototype.$http = Axios;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('access_token') || null,
  },
  getters: {
    loggedIn(state) {
      return !!state.token;
    },
  },
  mutations: {
    retrieveToken(state, token) {
      state.token = token;
    },
    destroyToken(state) {
      state.token = null;
    },
  },
  actions: {
    retrieveToken(context, credentials) {
      return new Promise((resolve, reject) => {
        Axios.post('/login', {
          email: credentials.email,
          password: credentials.password,
        })
          .then((response) => {
            const { token } = response.data;
            localStorage.setItem('access_token', token);
            context.commit('retrieveToken', token);
            resolve(response);
          })
          .catch((error) => {
            const { response } = error;
            reject(response);
          });
      });
    },
    destroyToken(context) {
      return new Promise((resolve) => {
        if (context.getters.loggedIn) {
          localStorage.removeItem('access_token');
          context.commit('destroyToken');
          resolve();
        }
      });
    },
  },
});
