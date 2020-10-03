export default Axios => ({
  state: {
    shoppingList: null,
    id: null,
    settings: null,
  },
  getters: {
    shoppingList(state) {
      return state.shoppingList;
    },
    settings(state) {
      return state.settings;
    },
    id(state) {
      return state.id;
    },
  },
  mutations: {
    getShoppingList(state, list) {
      state.shoppingList = list;
    },
    getSettings(state, settings) {
      state.settings = settings;
    },
    getId(state, id) {
      state.id = id;
    },
  },
  actions: {
    getShoppingList(context, id) {
      return new Promise((resolve, reject) => {
        Axios.get(`/shoppingList/${id}`).then((response) => {
          context.commit('getShoppingList', response.data);
          context.commit('getId', id);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    addItem(context, item) {
      return new Promise((resolve, reject) => {
        Axios.put(`/shoppingList/${this.getters.id}`, item).then((response) => {
          context.commit('getShoppingList', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    removeItem(context, item) {
      return new Promise((resolve, reject) => {
        Axios.delete(`/shoppingList/${this.getters.id}`, { data: { codebar: item.codebar } }).then((response) => {
          context.commit('getShoppingList', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    updateItem(context, item) {
      return new Promise((resolve, reject) => {
        Axios.patch(`/shoppingList/${this.getters.id}`, item).then((response) => {
          context.commit('getShoppingList', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    setSettings(context, setting) {
      return new Promise((resolve, reject) => {
        Axios.post(`/shoppingList/settings/${this.getters.id}`, setting).then((response) => {
          context.commit('getSettings', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
    getSettings(context) {
      return new Promise((resolve, reject) => {
        Axios.get(`/shoppingList/settings/${this.getters.id}`).then((response) => {
          context.commit('getSettings', response.data);
          resolve(response);
        }).catch((err) => {
          reject(err.response);
        });
      });
    },
  },
});
