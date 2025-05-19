import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import main_page from '../views/main_page.vue'
import trip_info_page from '../views/trip_info_page.vue'
import about from '../views/AboutView.vue'
import MainPage01 from '@/views/mainPage01.vue'
import boardPage from '@/views/boardPage.vue'


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
      path: '/info',
      name: 'info',
      component: trip_info_page,
    },
    {
      path: '/main',
      name: 'main',
      component: MainPage01,
    },
    {
      path: '/board',
      name: 'board',
      component: boardPage,
    },
  ],
})

export default router