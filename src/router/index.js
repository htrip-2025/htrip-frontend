import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import test from '../views/test.vue'
import test01 from '../views/test01.vue'
import about from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: test01,
    },
    {
      path: '/about',
      name: 'about',
      component: about,
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: test,
    },
  ],
})

export default router
