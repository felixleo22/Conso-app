/* eslint-disable no-restricted-globals */
import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

/* Modules */
import AuthModule from './modules/Auth';
import ScanModule from './modules/Scan';

Axios.defaults.baseURL = `//${location.hostname}:8080`;
Vue.prototype.$http = Axios;
Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    auth: AuthModule(Axios),
    scan: ScanModule(),
  },
});
