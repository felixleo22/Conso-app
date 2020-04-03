export default Axios => ({
  state: {
    shoppingList: null,
    settings: null,
  },
  getters: {
    shoppingList(state) {
      return state.shoppingList;
    },
    settings(state) {
      return state.settings;
    },
  },
  mutations: {
    getShoppingList(state, list) {
      state.shoppingList = list;
    },
    getSettings(state, settings) {
      state.settings = settings;
    },
  },
  actions: {
    getShoppingList(context) {
      return new Promise((resolve, reject) => {
        Axios.get('/shoppingList').then((response) => {
          context.commit('getShoppingList', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    addItem(context, item) {
      return new Promise((resolve, reject) => {
        Axios.post('/shoppingList', item).then((response) => {
          context.commit('getShoppingList', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    removeItem(context, item) {
      return new Promise((resolve, reject) => {
        Axios.delete('/shoppingList', { data: { codebar: item.codebar } }).then((response) => {
          context.commit('getShoppingList', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    updateItem(context, item) {
      return new Promise((resolve, reject) => {
        Axios.put('/shoppingList', item).then((response) => {
          context.commit('getShoppingList', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    setSettings(context, setting) {
      return new Promise((resolve, reject) => {
        Axios.post('/shoppingList/settings', setting).then((response) => {
          context.commit('getSettings', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    getSettings(context, setting) {
      return new Promise((resolve, reject) => {
        Axios.get('/shoppingList/settings', setting).then((response) => {
          context.commit('getSettings', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
  },
});
