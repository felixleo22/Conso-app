const published = [
  {
    path: '/publicBaskets',
    name: 'publicBaskets',
    component() {
      return import('../views/published/PublicBaskets.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/mapPublicBasket/:id',
    name: 'mapPublicBasket',
    component() {
      return import('../views/published/MapPublicBasket.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
];

module.exports = published;
