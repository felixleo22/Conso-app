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
    // TODO i didn't know why with idUser in body that doesn't work
    getPublicBasketsOfUser(context) {
      return new Promise((resolve, reject) => {
        Axios.get('/publicBaskets/user').then((response) => {
          context.commit('getPublicBasketsOfUser', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getSettingsBasketOfUser(context, id) {
      return new Promise((resolve, reject) => {
        // TODO if with put /publicBasketsOfUser/settings/:id that doesn't work
        Axios.get(`/publicBasket/settings/${id}/user`).then((response) => {
          context.commit('getSettingsBasketOfUser', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
});
