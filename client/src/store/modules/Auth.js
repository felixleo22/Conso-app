export default Axios => ({
  state: {
    token: localStorage.getItem('access_token') || null,
  },
  getters: {
    loggedIn(state) {
      return !!state.token;
    },
  },
  mutations: {
    retrieveToken(state, token) {
      state.token = token;
    },
    destroyToken(state) {
      state.token = null;
    },
  },
  actions: {
    retrieveToken(context, credentials) {
      return new Promise((resolve, reject) => {
        Axios.post('/login', {
          email: credentials.email,
          password: credentials.password,
        })
          .then((response) => {
            const { token } = response.data;
            localStorage.setItem('access_token', token);
            context.commit('retrieveToken', token);
            resolve(response);
          })
          .catch((error) => {
            const { response } = error;
            reject(response);
          });
      });
    },
    destroyToken(context) {
      return new Promise((resolve) => {
        if (context.getters.loggedIn) {
          localStorage.removeItem('access_token');
          context.commit('destroyToken');
          resolve();
        }
      });
    },
  },
});
