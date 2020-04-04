export default Axios => ({
  state: {
    settingsPublic: null,
    publicBasket: null,
  },
  getters: {
    settingsPublicBasket(state) {
      return state.settingsPublic;
    },
    publicBasket(state) {
      return state.publicBasket;
    },
  },
  mutations: {
    getSettingsPublic(state, settings) {
      state.settingsPublic = settings;
    },
    getPublicBaskets(state, settings) {
      state.publicBasket = settings;
    },
  },
  actions: {
    getSettingsPublicBasket(context) {
      return new Promise((resolve, reject) => {
        Axios.get('/publicBasket/settings').then((response) => {
          context.commit('getSettingsPublic', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getPublicBasket(context) {
      return new Promise((resolve, reject) => {
        Axios.get('/publicBasket').then((response) => {
          context.commit('getPublicBaskets', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
});
