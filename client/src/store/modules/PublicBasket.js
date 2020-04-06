export default Axios => ({
  state: {
    settingsPublic: null,
    publicBasket: null,
    publicBasketById: null,
  },
  getters: {
    settingsPublicBasket(state) {
      return state.settingsPublic;
    },
    publicBasket(state) {
      return state.publicBasket;
    },
    publicBasketById(state) {
      return state.publicBasketById;
    },
  },
  mutations: {
    getSettingsPublic(state, settings) {
      state.settingsPublic = settings;
    },
    getPublicBaskets(state, settings) {
      state.publicBasket = settings;
    },
    getPublicBasketById(state, settings) {
      state.publicBasketById = settings;
    },
  },
  actions: {
    createPublicBasket() {
      return new Promise((resolve, reject) => {
        Axios.post('publicBasket').then(() => {
          resolve();
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    getPublicBaskets(context) {
      return new Promise((resolve, reject) => {
        Axios.get('/publicBaskets').then((response) => {
          context.commit('getPublicBaskets', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getPublicBasketsById(context, params) {
      return new Promise((resolve, reject) => {
        console.log(params.id);
        Axios.get(`/publicBasket/${params.id}`).then((response) => {
          context.commit('getPublicBasketById', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
});
