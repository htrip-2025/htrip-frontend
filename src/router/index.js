import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import main_page from '../views/main_page.vue'
import test_login from '../views/test_login.vue'
import about from '../views/AboutView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: main_page,
    },
    {
      path: '/about',
      name: 'about',
      component: about,
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: test_login,
    },
  ],
})

export default router