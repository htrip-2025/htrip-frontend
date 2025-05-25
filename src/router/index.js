import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import main_page from '../views/MainPage.vue'
import trip_info_page from '../views/TripInfoPage.vue'
import MainPage01 from '@/views/mainPage01.vue'
import boardPage from '@/views/boardPage.vue'
import PostWriteView from '@/views/PostWriteView.vue'  // 글 작성 페이지
import PostDetailView from '@/views/PostDetailView.vue'  // 글 보기 페이지
import PostEditView from '@/views/PostEditView.vue' // 글 수정 페이지
import loginPage from '@/views/loginPage.vue'
import myPage from '@/views/myPage.vue'
import TripPlanPage from '@/views/TripPlanPage.vue'
import TripPlanMainPage from '@/views/TripPlanMainPage.vue'
import TripDetail from '@/views/TripDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: main_page,
    },
    {
      path: '/info',
      name: 'info',
      component: trip_info_page,
    },
    {
      path: '/plan',
      name: 'plan',
      component: TripPlanPage,
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
    {
      path: '/board/write',
      name: 'post-write',
      component: PostWriteView,
    },
    {
      path: '/board/:id',
      name: 'post-detail',
      component: PostDetailView,
      props: true
    },
    {
      path: '/board/:id/edit',
      name: 'post-edit',
      component: PostEditView,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: loginPage,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: myPage,
    },
    {
      path: '/tripmain',
      name: 'tripmain',
      component: TripPlanMainPage,
    },
    {
  path: '/tripdetail',
  name: 'tripdetail',
  component: TripDetail,
  props: (route) => ({ placeId: route.query.id })
}
  ],
})

export default router