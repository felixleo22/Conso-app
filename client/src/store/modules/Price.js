export default Axios => ({
  state: {
    prices: null,
  },
  getters: {
    products(state) {
      return state.prices;
    },
  },
  mutations: {
    setPrices(state, settings) {
      state.prices = settings;
    },
  },
  actions: {
    getPricesInShop(context, body) {
      console.log(body);
      return new Promise((resolve, reject) => {
        Axios.get('/products/shop/publicBasket/', body).then((response) => {
          context.commit('setPrices', response.data);
          resolve(response.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
});
