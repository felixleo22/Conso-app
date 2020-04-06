export default Axios => ({
  state: {
    publicBasketsOfUser: null,
    settingsBasketOfUser: null,
  },
  getters: {
    publicBasketOfUser(state) {
      return state.publicBpublicBasketOfUserasket;
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
    getPublicBasketOfUser(context, idUser) {
      return new Promise((resolve, reject) => {
        Axios.get(`/publicBasketOfUser/${idUser}`).then((response) => {
          context.commit('getPublicBasketsOfUser');
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getSettingsOfUser(context, id) {
      return new Promise((resolve, reject) => {
        Axios.get('/publicBasketOfUser/settings', id).then((response) => {
          context.commit('getSettingsBasketOfUser');
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
});
