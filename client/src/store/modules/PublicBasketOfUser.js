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
    getPublicBasketOfUser(state, publicBasket) {
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
          context.commit('getPublicBasketOfUser', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getSettingsOfUser(context, id) {
      console.log(id);
      return new Promise((resolve, reject) => {
        Axios.get('/publicBasketOfUser/settings', id).then((response) => {
          console.log(response.data);
          context.commit('getSettingsBasketOfUser', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
});
