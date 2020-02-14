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
    path: '/signup',
    name: 'signup',
    component() {
      return import('../views/SignUp.vue');
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
    path: '/shoppinglist',
    name: 'shoppingList',
    component() {
      return import('../views/ShoppingList.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    // TODO a supprimer
    path: '/leaflet',
    name: 'leaflet',
    component() {
      return import('../views/ViewShops.vue');
    },
  },
  {
    path: '/zoneshoppinglist',
    name: 'zoneshoppinglist',
    component() {
      return import('../views/ZoneShoppingList.vue');
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
