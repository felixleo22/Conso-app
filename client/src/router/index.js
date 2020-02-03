import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/signin',
    name: 'signin',
    component() {
      return import('../views/SignIn.vue');
    },
  },
  {
    path: '/login',
    name: 'login',
    component() {
      return import('../views/LogIn.vue');
    },
  },
  {
    path: '/scan',
    name: 'scan',
    component() {
      return import('../views/Scan.vue');
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.loggedIn) {
      next();
      return;
    }
    next('/login');
  } else {
    next();
  }
});

export default router;
