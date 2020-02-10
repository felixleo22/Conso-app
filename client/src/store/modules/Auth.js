export default Axios => ({
  state: {
    token: localStorage.getItem('access_token') || null,
    user: JSON.parse(localStorage.getItem('user_logged')) || null,
  },
  getters: {
    loggedIn(state) {
      return !!state.token;
    },
    loggedUser(state) {
      return state.user;
    },
  },
  mutations: {
    retrieveToken(state, token, user) {
      state.token = token;
      state.user = user;
    },
    destroyToken(state) {
      state.token = null;
      state.user = null;
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
            const { token, user } = response.data;
            localStorage.setItem('access_token', token);
            localStorage.setItem('user_logged', JSON.stringify(user));
            context.commit('retrieveToken', token, user);
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
          localStorage.removeItem('user_logged');
          context.commit('destroyToken');
          resolve();
        }
      });
    },
  },
});
