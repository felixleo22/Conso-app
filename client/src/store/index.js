/* eslint-disable no-restricted-globals */
import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

/* Modules */
import AuthModule from './modules/Auth';
import ScanModule from './modules/Scan';
import ShoppingList from './modules/ShoppingList';
import PublicBasket from './modules/PublicBasket';

Axios.defaults.baseURL = `//${location.hostname}:8080`;

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = token;
    }

    return config;
  },
  error => Promise.reject(error),
);
Vue.prototype.$http = Axios;
Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    auth: AuthModule(Axios),
    scan: ScanModule(),
    shoppingList: ShoppingList(Axios),
    PublicBasket: PublicBasket(Axios),
  },
});
