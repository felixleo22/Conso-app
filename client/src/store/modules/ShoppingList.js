export default Axios => ({
  state: {
    shoppingList: null,
  },
  getters: {
    shoppingList(state) {
      return state.shoppingList;
    },
  },
  mutations: {
    getShoppingList(state, list) {
      state.shoppingList = list;
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
    setSetting(context, setting) {
      console.log(setting);
      return new Promise((resolve, reject) => {
        Axios.post('/shoppingList/setting', setting).then((response) => {
          context.commit('getShoppingList', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
  },
});
