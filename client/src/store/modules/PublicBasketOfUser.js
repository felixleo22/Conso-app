export default Axios => ({
  state: {
    publicBasketsOfUser: null,
    settingsBasketOfUser: null,
  },
  getters: {
    publicBasketsOfUser(state) {
      return state.publicBasketsOfUser;
    },
    settingsBasketOfUser(state) {
      return state.settingsBasketOfUser;
    },
  },
  mutations: {
    getPublicBasketsOfUser(state, publicBasket) {
      state.publicBasketOfUser = publicBasket;
    },
    getSettingsBasketOfUser(state, settingsBasketOfUser) {
      state.settingsBasketOfUser = settingsBasketOfUser;
    },
  },
  actions: {
    getPublicBasketsOfUser(context) {
      return new Promise((resolve, reject) => {
        Axios.get('/publicbaskets/user').then((response) => {
          context.commit('getPublicBasketsOfUser', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getSettingsBasketOfUser(context, id) {
      return new Promise((resolve, reject) => {
        Axios.get(`/publicbasket/settings/${id.id}/user`).then((response) => {
          context.commit('getSettingsBasketOfUser', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    deletePublicBasketUser(context, id) {
      return new Promise((resolve, reject) => {
        Axios.delete(`/publicbasket/${id}/user`).then((response) => {
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
});
