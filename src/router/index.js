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
import AITripRecommendation from '@/views/AITripRecommendation.vue'
import MainPage from '../views/MainPage.vue'
import TripInfoPage from '../views/TripInfoPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPage,
    },
    {
      path: '/info',
      name: 'info',
      component: TripInfoPage,
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
      path: '/ai',
      name: 'ai',
      component: AITripRecommendation,
    },

    {
  path: '/tripdetail',
  name: 'TripDetail',
  component: TripDetail,
  // 쿼리나 params에서 id를 받아서 props.placeId에 집어넣는다
  props: route => ({ placeId: route.query.id || route.params.id })
}

  ],
})

export default router