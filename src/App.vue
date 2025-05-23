<template>
  <div id="app">
    <!-- 로그인 페이지가 아닐 때만 헤더 표시 -->
    <header v-if="!shouldHideHeader" class="header">
      <div class="logo" @click="goToHome">
        <span class="logo-icon">T</span>rip
      </div>
      <div class="menu-items">
        <router-link to="#" class="menu-link">AI 추천</router-link>
        <router-link to="/info" class="menu-link">여행정보</router-link>
        <router-link to="/plan" class="menu-link">여행계획</router-link>
        <router-link to="/board" class="menu-link">커뮤니티</router-link>
        <a href="#" class="menu-link search-icon">🔍</a>
      </div>
      
      <!-- 로그인 상태에 따른 버튼 표시 -->
      <div class="auth-section">
        <div v-if="isLoggedIn" class="user-info">
          <span class="username">{{ userName }}님</span>
          <router-link to="/mypage" class="mypage-btn">마이페이지</router-link>
          <button @click="logout" class="logout-btn">로그아웃</button>
        </div>
        <div v-else class="login-section">
          <router-link to="/login" class="login-button">
            <span class="button-text">로그인</span>
          </router-link>
        </div>
      </div>
    </header>
    
    <!-- 페이지 콘텐츠 -->
    <main :class="{ 'with-header': !isLoginPage, 'login-page': isLoginPage }">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// 상태 관리
const isLoggedIn = ref(false);
const userName = ref('');

// 로그인 페이지인지 확인
const shouldHideHeader = computed(() => {
  return route.name === 'login';
});

// 사용자 정보 확인
const checkUserInfo = () => {
  const token = localStorage.getItem('jwt_token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userInfo = JSON.parse(user);
      isLoggedIn.value = true;
      userName.value = userInfo.name || userInfo.nickname || '사용자';
      
      // axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      logout();
    }
  } else {
    isLoggedIn.value = false;
    userName.value = '';
  }
};

// 로그아웃 함수
const logout = () => {
  // 로컬 스토리지에서 토큰과 사용자 정보 제거
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user');
  
  // axios 기본 헤더에서 Authorization 제거
  delete axios.defaults.headers.common['Authorization'];
  
  // 상태 업데이트
  isLoggedIn.value = false;
  userName.value = '';
  
  // 홈페이지로 이동
  router.push('/');
};

// 홈으로 이동
const goToHome = () => {
  router.push('/');
};

// 컴포넌트 마운트 시 사용자 정보 확인
onMounted(() => {
  checkUserInfo();
});

// 라우트 변경 시 사용자 정보 다시 확인 (로그인 후 리다이렉트 등)
watch(route, () => {
  checkUserInfo();
});

// 로컬 스토리지 변경 감지 (다른 탭에서 로그인/로그아웃 시)
window.addEventListener('storage', (e) => {
  if (e.key === 'jwt_token' || e.key === 'user') {
    checkUserInfo();
  }
});
</script>

<style scoped>
/* 전체 화면 스타일 재설정 */
html, body {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  width: 100vw !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
  min-height: 100vh;
}

/* 헤더 스타일 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 6rem;
  background-color: #ffffff;
  border-bottom: 0.8px solid rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #9581e8;
}

.logo-icon {
  color: #9581e8;
  background-color: #ffefd5;
  padding: 2px 8px;
  border-radius: 50%;
  margin-right: 2px;
}

.menu-items {
  display: flex;
  gap: 2rem;
}

.menu-link {
  text-decoration: none;
  color: #666;
  font-size: 1.1rem;
  transition: color 0.3s;
  position: relative;
}

.menu-link:hover {
  color: #9581e8;
}

.menu-link.router-link-active {
  color: #9581e8;
  font-weight: 600;
}

.search-icon {
  font-size: 1.2rem;
}

/* 인증 섹션 */
.auth-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}

.mypage-btn {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  color: #666;
  text-decoration: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.mypage-btn:hover {
  background-color: #e9ecef;
  color: #333;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.login-section {
  display: flex;
  align-items: center;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #9581e8 0%, #a2b3f8 100%);
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(149, 129, 232, 0.25);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
  z-index: 1;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(135deg, #a2b3f8 0%, #9581e8 100%);
  transition: width 0.5s ease;
  z-index: -1;
  border-radius: 30px;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(149, 129, 232, 0.35);
}

.login-button:hover::before {
  width: 100%;
}

/* 메인 콘텐츠 영역 */
main {
  width: 100%;
  min-height: 100vh;
}

main.with-header {
  min-height: calc(100vh - 80px);
}

main.login-page {
  min-height: 100vh;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .header {
    padding: 1rem 4rem;
  }
}

@media (max-width: 992px) {
  .header {
    padding: 1rem 2rem;
  }
  
  .menu-items {
    gap: 1.5rem;
  }
  
  .menu-link {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .menu-items {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .auth-section {
    margin-top: 0.5rem;
  }
  
  .user-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .login-button {
    padding: 0.5rem 1.2rem;
    font-size: 0.85rem;
  }
}

@media (min-width: 1024px) {
  body {
    display: block !important;
    width: 100% !important;
    place-items: initial !important;
  }

  #app {
    display: block !important;
    grid-template-columns: none !important;
    width: 100vw !important;
    max-width: 100vw !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>