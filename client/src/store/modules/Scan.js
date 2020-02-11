export default () => ({
  state: {
    shop: JSON.parse(localStorage.getItem('current_shop')) || null,
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
        localStorage.setItem('current_shop', JSON.stringify(shopInfo));
        context.commit('changeScanShop', shopInfo);
        resolve();
      });
    },
    unsetScanShop(context) {
      return new Promise((resolve) => {
        localStorage.removeItem('current_shop');
        context.commit('changeScanShop', null);
        resolve();
      });
    },
  },
});
