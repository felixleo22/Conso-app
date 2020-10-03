const user = [
  {
    path: '/shoppinglist',
    name: 'shoppingLists',
    component() {
      return import('../views/user/ListOfShoppingList.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/shoppinglist/:id',
    name: 'shoppingList',
    component() {
      return import('../views/user/ShoppingList.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/zoneshoppinglist',
    name: 'zoneshoppinglist',
    component() {
      return import('../views/user/ZoneShoppingList.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/publicBasketOfUser',
    name: 'publicBasketOfUser',
    component() {
      return import('../views/user/PublicBasketOfUser.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/mapPublicBasketOfUser/:id',
    name: 'mapPublicBasketOfUser',
    component() {
      return import('../views/user/MapPublicBasketOfUser.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
];
module.exports = user;
