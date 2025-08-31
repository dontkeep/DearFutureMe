import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import HomePage from '../pages/HomePage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/login', // Default route
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard for Auth
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token');
//   if (to.meta.requiresAuth && !token) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
