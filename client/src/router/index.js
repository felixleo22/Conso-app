import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

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
    path: '/signin',
    name: 'signin',
    component() {
      return import('../views/SignIn.vue');
    },
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component() {
      return import('../views/LogIn.vue');
    },
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: '/logout',
    name: 'logout',
    component() {
      return import('../views/LogOut.vue');
    },
    meta: {
      requiresAuth: true,
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
  {
    path: '/shoppingList',
    name: 'shoppingList',
    component() {
      return import('../views/ShoppingList.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/leaflet',
    name: 'leaflet',
    component() {
      return import('../views/Leaflet.vue');
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

export default router;
