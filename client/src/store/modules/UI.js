export default () => ({
  state: {
    isLoading: false,
  },
  getters: {
    isLoading(state) {
      return state.isLoading;
    },
  },
  mutations: {
    setLoading(state, loadingStatus) {
      state.isLoading = loadingStatus;
    },
  },
  actions: {
    setLoading(context, loadingStatus) {
      return new Promise((resolve) => {
        context.commit('setLoading', loadingStatus);
        resolve();
      });
    },
  },
});
