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
    getSettingsPublicBasket(context, setting) {
      return new Promise((resolve, reject) => {
        Axios.get('/publicBasket/settings', setting).then((response) => {
          context.commit('getSettingsPublic', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    getPublicBasket(context) {
      return new Promise((resolve, reject) => {
        Axios.get('/publicBasket').then((response) => {
          context.commit('getPublicBaskets');
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
});
