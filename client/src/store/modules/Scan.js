export default () => ({
  state: {
    shop: null,
  },
  getters: {
    shop(state) {
      return state.shop;
    },
  },
  mutations: {
    changeScanShop(state, shopInfo) {
      state.shop = shopInfo;
    },
  },
  actions: {
    changeScanShop(context, shopInfo) {
      return new Promise((resolve) => {
        context.commit('changeScanShop', shopInfo);
        resolve();
      });
    },
  },
});
