export default Axios => ({
  state: {
    publicBasketOfUser: null,
  },
  getters: {
    publicBasketOfUser(state) {
      return state.publicBpublicBasketOfUserasket;
    },
  },
  mutations: {
    getPublicBaskets(state, publicBasket) {
      state.publicBasketOfUser = publicBasket;
    },
  },
  actions: {
    // TODO i didn't know why with idUser in body that doesn't work
    getPublicBasketOfUser(context, idUser) {
      return new Promise((resolve, reject) => {
        Axios.get(`/publicBasketOfUser/${idUser}`).then((response) => {
          context.commit('getPublicBaskets');
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
});
