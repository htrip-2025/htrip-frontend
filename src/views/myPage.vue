<template>
  <div class="mypage-container">
    <!-- 배경 그라데이션 원형들 -->
    <div class="gradient-circle circle1"></div>
    <div class="gradient-circle circle2"></div>
    <div class="gradient-circle circle3"></div>
    <div class="gradient-circle circle4"></div>

    <!-- 마이페이지 콘텐츠 -->
    <div class="mypage-content">
      <h1 class="mypage-title">마이페이지</h1>
      
      <div class="mypage-layout">
        <!-- 왼쪽 박스: 프로필 정보 -->
        <div class="profile-section">
          <div class="profile-image">
            <img src="" alt="프로필 이미지" ref="profileImage" />
          </div>
          <h2 class="profile-name">홍길동</h2>
          <p class="profile-email">hong@example.com</p>
          
          <div class="profile-buttons">
            <button class="profile-btn">프로필 편집</button>
            <button class="profile-btn">설정</button>
          </div>
        </div>
        
        <!-- 오른쪽 박스: 여행 계획 목록 -->
        <div class="plans-section">
          <h2 class="section-title">나의 여행 계획</h2>
          
          <div class="plan-item">
            <div class="plan-details">
              <h3>서울 여행</h3>
              <p>2025.05.10 - 05.15 · 4명</p>
            </div>
            <button class="view-btn">보기</button>
          </div>
          
          <div class="plan-item">
            <div class="plan-details">
              <h3>제주도 여행</h3>
              <p>2025.08.15 - 08.20 · 2명</p>
            </div>
            <button class="view-btn">보기</button>
          </div>
          
          <div class="plan-item">
            <div class="plan-details">
              <h3>부산 여행 (계획 중)</h3>
              <p>2025.09.20 - 09.25 · 미정</p>
            </div>
            <button class="edit-btn">편집</button>
          </div>
        </div>
      </div>
      
      <!-- 찜한 여행지 섹션 -->
      <div class="wishlist-section">
        <h2 class="section-title">내가 찜한 여행지</h2>
        
        <div class="wishlist-items">
          <div class="wishlist-item" v-for="(item, index) in wishlists" :key="index">
            <div class="wishlist-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="wishlist-overlay">
              <h3>{{ item.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 찜한 여행지 데이터 (랜덤 이미지 사용)
const wishlists = ref([
  {
    title: '경복궁',
    image: 'https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg'
  },
  {
    title: '해운대 해수욕장',
    image: 'https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg'
  },
  {
    title: '명동',
    image: 'https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg'
  },
  {
    title: '성산일출봉',
    image: 'https://i.pinimg.com/736x/7d/43/ff/7d43ff51a9f3ecedda6f12a43abdb5d8.jpg'
  }
]);

// 이미지 배열
const images = [
  'https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg',
  'https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg',
  'https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg',
  'https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg'
];

const profileImage = ref(null);

onMounted(() => {
  // 프로필 이미지 랜덤 선택
  if (profileImage.value) {
    profileImage.value.src = images[Math.floor(Math.random() * images.length)];
  }
  
  // 찜한 여행지 이미지를 랜덤으로 섞기
  wishlists.value.sort(() => Math.random() - 0.5);
});
</script>

<style scoped>
/* 기본 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

/* 마이페이지 컨테이너 (loginPage.vue와 동일한 배경) */
.mypage-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(120deg, #e0f7fa, #e8eaf6, #ede7f6);
  position: relative;
  overflow: hidden;
  padding: 2rem 6rem;
}

/* 그라데이션 원형 효과 (loginPage.vue에서 가져옴) */
.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.8;
  z-index: 0;
}

.circle1 {
  width: 550px;
  height: 550px;
  top: -10%;
  left: -10%;
  background: radial-gradient(circle at center, #b6aceb 0%, transparent 70%);
}

.circle2 {
  width: 500px;
  height: 500px;
  top: 70%;
  left: 30%;
  background: radial-gradient(circle at center, #7c8de3 0%, transparent 70%);
}

.circle3 {
  width: 650px;
  height: 650px;
  top: 20%;
  right: -10%;
  background: radial-gradient(circle at center, #6bd5c5 0%, transparent 70%);
}

.circle4 {
  width: 480px;
  height: 480px;
  bottom: -10%;
  right: 10%;
  background: radial-gradient(circle at center, #bfa9e9 0%, transparent 70%);
}

/* 마이페이지 콘텐츠 스타일 */
.mypage-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
}

.mypage-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.mypage-layout {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* 프로필 섹션 스타일 */
.profile-section {
  flex: 1;
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background-color: #f0f0f0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.profile-email {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
}

.profile-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.profile-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #f6f6f6;
  color: #333;
  border: 1px solid #eee;
  cursor: pointer;
  transition: all 0.3s;
}

.profile-btn:hover {
  background-color: #efefef;
  transform: translateY(-2px);
}

/* 여행 계획 섹션 스타일 */
.plans-section {
  flex: 2;
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
}

.plan-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  transition: all 0.3s;
}

.plan-item:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.plan-details h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.plan-details p {
  font-size: 0.9rem;
  color: #666;
}

.view-btn, .edit-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn {
  background-color: #9581e8;
}

.edit-btn {
  background-color: #7c8de3;
}

.view-btn:hover, .edit-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* 찜한 여행지 섹션 */
.wishlist-section {
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.wishlist-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.wishlist-item {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  height: 200px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.wishlist-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.wishlist-image {
  width: 100%;
  height: 100%;
}

.wishlist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wishlist-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.wishlist-overlay h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .mypage-container {
    padding: 2rem;
  }
  
  .wishlist-items {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .mypage-layout {
    flex-direction: column;
  }
  
  .wishlist-items {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .menu-items {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .login-section {
    margin-top: 0.5rem;
  }
  
  .mypage-title {
    font-size: 2rem;
  }
  
  .wishlist-items {
    grid-template-columns: 1fr;
  }
}
</style>