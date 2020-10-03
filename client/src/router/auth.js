const auth = [
  {
    path: '/signup',
    name: 'signup',
    component() {
      return import('../views/auth/SignUp.vue');
    },
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component() {
      return import('../views/auth/LogIn.vue');
    },
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: '/logout',
    name: 'logout',
    component() {
      return import('../views/auth/LogOut.vue');
    },
    meta: {
      requiresAuth: true,
    },
  },
];

module.exports = auth;
