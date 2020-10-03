import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

const auth = require('./auth');
const user = require('./user');
const published = require('./published');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component() {
      return import('../views/Home.vue');
    },
  },
  {
    path: '/scan',
    name: 'scan',
    component() {
      return import('../views/Scan.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
];

routes.concat(auth);
routes.concat(user);
routes.concat(published);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // show loading bar
  store.dispatch('setLoading', true);

  // view metas
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // when route require to be logged in
    if (!store.getters.loggedIn) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    // when route require to be anonymous
    if (store.getters.loggedIn) {
      next({
        name: 'home',
      });
    } else {
      next();
    }
  } else {
    // when no meta are specified
    next();
  }
});

router.afterEach(() => {
  // hide loading bar
  setTimeout(() => { store.dispatch('setLoading', false); }, 500);
});

export default router;
