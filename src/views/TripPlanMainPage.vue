<template>
  <div class="ai-recommendation-container">
    <!-- AI 추천 및 계획 만들기 섹션 -->
    <section class="hero-banner-section">
      <div class="hero-banner">
        <div class="banner-content">
          <h2 class="banner-title">나만의 완벽한 여행을 계획해보세요</h2>
          <p class="banner-subtitle">AI가 추천하는 맞춤형 여행 코스와 직접 계획하는 여행 중 선택하세요</p>
          <div class="banner-buttons">
            <button class="banner-btn ai-btn" @click="goToAIRecommendation">
              <span class="btn-icon">🤖</span>
              AI 추천
            </button>
            <button class="banner-btn plan-btn" @click="goToPlanMaker">
              <span class="btn-icon">📝</span>
              계획 만들기
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 인기 여행경로 섹션 -->
    <section class="popular-routes-section">
      <div class="section-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">인기 여행경로</h2>
            <h3 class="route-title">많은 사람들이 선택한 여행코스 ✈️</h3>
          </div>
          <div class="navigation-arrows">
            <button class="arrow-btn prev" @click="scrollRoutes('left')">◀</button>
            <button class="arrow-btn next" @click="scrollRoutes('right')">▶</button>
          </div>
        </div>
        
        <div class="route-cards" ref="routeCardsContainer">
          <div 
            v-for="route in travelRoutes" 
            :key="route.id"
            class="route-card"
            @click="selectRoute(route)"
          >
            <!-- 지도 영역 (이미지 대신) -->
            <div class="route-map">
              <div class="map-placeholder">
                <span class="map-icon">🗺️</span>
                <p class="map-text">{{ route.title }} 경로</p>
              </div>
            </div>
            <div class="route-info">
              <h4>{{ route.title }}</h4>
              <div class="route-meta">
                <span class="route-duration">{{ route.duration }}</span>
                <span class="route-places">{{ route.places }}</span>
              </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const routeCardsContainer = ref(null);
const scrollAmount = 300;

// 여행 경로 데이터
const travelRoutes = ref([
  {
    id: 1,
    title: '서울 2박 3일 클래식 코스',
    duration: '2박 3일',
    places: '경복궁 · 명동 · 홍대',
  },
  {
    id: 2,
    title: '부산 바다여행 3박 4일',
    duration: '3박 4일',
    places: '해운대 · 광안리 · 감천문화마을',
  },
  {
    id: 3,
    title: '제주도 힐링여행 4박 5일',
    duration: '4박 5일',
    places: '성산일출봉 · 한라산 · 우도',
  },
  {
    id: 4,
    title: '경주 역사여행 2박 3일',
    duration: '2박 3일',
    places: '불국사 · 석굴암 · 첨성대',
  },
  {
    id: 5,
    title: '강릉 바다여행 1박 2일',
    duration: '1박 2일',
    places: '정동진 · 경포대 · 안목해변',
  },
  {
    id: 6,
    title: '전주 한옥마을 1박 2일',
    duration: '1박 2일',
    places: '한옥마을 · 비빔밥 · 오목대'
  },
  {
    id: 7,
    title: '여수 밤바다 2박 3일',
    duration: '2박 3일',
    places: '여수밤바다 · 오동도 · 향일암',
  },
  {
    id: 8,
    title: '가평 자연여행 1박 2일',
    duration: '1박 2일',
    places: '남이섬 · 쁘띠프랑스 · 아침고요수목원',
  }
]);

// 메서드
const scrollRoutes = (direction) => {
  if (!routeCardsContainer.value) return;
  
  const container = routeCardsContainer.value;
  const scrollLeft = container.scrollLeft;
  
  if (direction === 'left') {
    container.scrollTo({
      left: Math.max(0, scrollLeft - scrollAmount),
      behavior: 'smooth'
    });
  } else {
    container.scrollTo({
      left: Math.min(
        container.scrollWidth - container.clientWidth,
        scrollLeft + scrollAmount
      ),
      behavior: 'smooth'
    });
  }
};

const goToAIRecommendation = () => {
  console.log('AI 추천 페이지로 이동');
  // router.push('/ai-recommendation');
};

const goToPlanMaker = () => {
  console.log('계획 만들기 페이지로 이동');
  router.push('/plan');
};

const selectRoute = (route) => {
  console.log('선택된 여행 경로:', route);
  // router.push(`/route/${route.id}`);
};

onMounted(() => {
  console.log('AI 추천 페이지 로드 완료');
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

.ai-recommendation-container {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 0;
}

/* AI 추천 및 계획 만들기 섹션 */
.hero-banner-section {
  width: 100%;
  padding: 2rem 6rem;
  margin-bottom: 3rem;
}

.hero-banner {
  width: 100%;
  height: 350px;
  background-image: url(''); /* 이미지 경로는 나중에 추가 */
  background-size: cover;
  background-position: center;
  background-color: #f8f9fa;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(149, 129, 232, 0.8), rgba(162, 179, 248, 0.6));
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.banner-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
}

.banner-buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.banner-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 2.5rem;
  border: 2px solid white;
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.banner-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 1.4rem;
}

/* 인기 여행경로 섹션 */
.popular-routes-section {
  width: 100%;
  padding: 0 6rem;
  margin-bottom: 4rem;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.route-title {
  font-size: 1.8rem;
  color: #333;
  font-weight: 700;
}

.navigation-arrows {
  display: flex;
  gap: 0.5rem;
}

.arrow-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #ddd;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s;
  color: #666;
}

.arrow-btn:hover {
  background-color: #9581e8;
  color: white;
  border-color: #9581e8;
  transform: scale(1.1);
}

.arrow-btn:active {
  transform: scale(0.95);
}

.route-cards {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  scrollbar-width: none;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

.route-cards::-webkit-scrollbar {
  display: none;
}

.route-card {
  min-width: 300px;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  scroll-snap-align: start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.route-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* 지도 영역 (이미지 영역 대신) */
.route-map {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ddd;
  transition: all 0.3s ease;
}

.route-card:hover .map-placeholder {
  background-color: #f0f4ff;
  border-color: #9581e8;
}

.map-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #9581e8;
  transition: transform 0.3s ease;
}

.route-card:hover .map-icon {
  transform: scale(1.1);
}

.map-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  text-align: center;
}

.route-info {
  padding: 1.5rem;
}

.route-info h4 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

.route-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.route-duration {
  color: #9581e8;
  font-weight: 600;
}

.route-places {
  color: #666;
}

.route-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  color: #ffc107;
  font-size: 1rem;
}

.star {
  color: #ddd;
}

.star.filled {
  color: #ffc107;
}

.rating-text {
  font-size: 0.8rem;
  color: #666;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .hero-banner-section,
  .popular-routes-section {
    padding: 0 4rem;
  }
  
  .banner-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 992px) {
  .hero-banner-section,
  .popular-routes-section {
    padding: 0 2rem;
  }
  
  .banner-title {
    font-size: 2rem;
  }
  
  .banner-subtitle {
    font-size: 1.1rem;
  }
  
  .banner-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .banner-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .hero-banner-section,
  .popular-routes-section {
    padding: 0 1rem;
  }
  
  .hero-banner {
    height: 280px;
  }
  
  .banner-title {
    font-size: 1.7rem;
  }
  
  .banner-subtitle {
    font-size: 1rem;
  }
  
  .route-cards {
    gap: 1rem;
  }
  
  .route-card {
    min-width: 250px;
  }
  
  .map-icon {
    font-size: 2rem;
  }
  
  .map-text {
    font-size: 0.8rem;
  }
}
</style>