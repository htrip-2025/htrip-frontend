<template>
  <div class="trip-detail-container">
    <!-- 배경 그라데이션 원형들 -->
    <div class="gradient-circle circle1"></div>
    <div class="gradient-circle circle2"></div>
    <div class="gradient-circle circle3"></div>
    <div class="gradient-circle circle4"></div>
    <div class="gradient-circle circle5"></div>
    <div class="gradient-circle circle6"></div>
    <div class="gradient-circle circle7"></div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>여행지 정보를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchTripDetail" class="retry-button">다시 시도</button>
    </div>

    <!-- 메인 콘텐츠 -->
    <div v-if="!isLoading && !error && tripDetail" class="main-content">
      <!-- 여행지 헤더 -->
      <section class="trip-header">
        <div class="header-content">
          <!-- 이미지 섹션 -->
          <div class="image-section">
            <div class="main-image">
              <img 
                :src="tripDetail.firstImageUrl || 'https://placehold.co/600x400?text=No+Image'" 
                :alt="tripDetail.title"
                @error="handleImageError"
              >
              <button 
                class="favorite-button" 
                :class="{ favorited: isFavorited }"
                @click="toggleFavorite"
                :disabled="favoriteLoading"
              >
                <span class="heart-icon">{{ isFavorited ? '❤️' : '🤍' }}</span>
              </button>
            </div>
            <div v-if="tripDetail.secondImageUrl" class="sub-image">
              <img 
                :src="tripDetail.secondImageUrl" 
                :alt="tripDetail.title + ' 추가 이미지'"
                @error="handleImageError"
              >
            </div>
          </div>

          <!-- 정보 섹션 -->
          <div class="info-section">
            <div class="trip-category">
              <span class="category-badge">{{ getCategoryName(tripDetail.category1) }}</span>
            </div>
            
            <h1 class="trip-title">{{ tripDetail.title }}</h1>
            
            <div class="trip-meta">
              <div class="meta-item">
                <span class="meta-icon">📍</span>
                <span>{{ tripDetail.address1 }} {{ tripDetail.address2 || '' }}</span>
              </div>
              
              <div v-if="tripDetail.telephone" class="meta-item">
                <span class="meta-icon">📞</span>
                <span>{{ tripDetail.telephone }}</span>
              </div>
              
              <div class="meta-item">
                <span class="meta-icon">❤️</span>
                <span>{{ favoriteCount }}명이 찜했어요</span>
              </div>
            </div>

            <!-- 상세 설명 -->
            <div v-if="tripDetail.overview" class="trip-description">
              <h3>상세 정보</h3>
              <p>{{ tripDetail.overview }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 지도 섹션 -->
      <section class="map-section" v-if="tripDetail.mapX && tripDetail.mapY">
        <h2 class="section-title">위치</h2>
        <div class="map-container" ref="mapContainer" id="trip-detail-map">
          <div class="map-loading" v-if="mapLoading || mapError">
            <div class="loading-spinner" v-if="mapLoading"></div>
            <p>{{ mapError || '지도를 불러오는 중...' }}</p>
            <button v-if="mapError" @click="initializeMap" class="retry-btn">다시 시도</button>
          </div>
        </div>
      </section>

      <!-- 리뷰 섹션 -->
      <section class="review-section">
        <div class="review-header">
          <h2 class="section-title">리뷰 ({{ reviewStats.totalCount || 0 }})</h2>
          <div class="review-stats" v-if="reviewStats.averageRating">
            <div class="rating-display">
              <span class="rating-score">{{ reviewStats.averageRating.toFixed(1) }}</span>
              <div class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(reviewStats.averageRating) }">⭐</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 리뷰 작성 -->
        <div class="review-write" v-if="isLoggedIn">
          <h3>리뷰 작성하기</h3>
          <div class="rating-input">
            <span>평점: </span>
            <div class="star-rating">
              <span 
                v-for="n in 5" 
                :key="n" 
                class="star-input" 
                :class="{ active: n <= newReview.rating }"
                @click="setRating(n)"
              >⭐</span>
            </div>
          </div>
          <textarea 
            v-model="newReview.content" 
            placeholder="이곳에 대한 경험을 공유해주세요..."
            class="review-textarea"
            rows="4"
            maxlength="1000"
          ></textarea>
          <div class="review-actions">
            <div class="char-count">{{ newReview.content.length }}/1000</div>
            <button 
              @click="submitReview" 
              class="submit-review-btn"
              :disabled="reviewSubmitting || !newReview.content.trim() || newReview.rating === 0"
            >
              {{ reviewSubmitting ? '등록 중...' : '리뷰 등록' }}
            </button>
          </div>
        </div>

        <div v-else class="login-prompt">
          <p>리뷰를 작성하려면 <router-link to="/login">로그인</router-link>이 필요합니다.</p>
        </div>

        <!-- 리뷰 목록 -->
        <div class="review-list">
          <div v-if="reviews.length === 0 && !reviewsLoading" class="no-reviews">
            <p>아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>
          </div>
          
          <div v-if="reviewsLoading" class="loading">
            <div class="loading-spinner"></div>
            <p>리뷰를 불러오는 중...</p>
          </div>

          <div 
            v-for="review in reviews" 
            :key="review.reviewId"
            class="review-item"
          >
            <div class="review-header-item">
              <div class="reviewer-info">
                <div class="reviewer-avatar">{{ review.userName?.charAt(0) || 'U' }}</div>
                <div class="reviewer-details">
                  <div class="reviewer-name">{{ review.userName || '익명' }}</div>
                  <div class="review-date">{{ formatDate(review.createDate) }}</div>
                </div>
              </div>
              <div class="review-rating">
                <div class="stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">⭐</span>
                </div>
              </div>
            </div>
            <div class="review-content">
              <p>{{ review.content }}</p>
            </div>
            <div v-if="review.imageUrl" class="review-image">
              <img :src="review.imageUrl" :alt="'리뷰 이미지'" />
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div class="pagination" v-if="totalReviewPages > 1">
          <button 
            class="pagination-btn prev" 
            @click="changeReviewPage(currentReviewPage - 1)"
            :disabled="currentReviewPage === 1"
          >
            이전
          </button>
          <button 
            v-for="page in visibleReviewPages" 
            :key="page"
            class="pagination-btn" 
            :class="{ active: page === currentReviewPage }"
            @click="changeReviewPage(page)"
          >
            {{ page }}
          </button>
          <button 
            class="pagination-btn next"
            @click="changeReviewPage(currentReviewPage + 1)"
            :disabled="currentReviewPage === totalReviewPages"
          >
            다음
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

// 상태 관리
const isLoading = ref(false);
const error = ref('');
const tripDetail = ref(null);
const placeId = ref(route.params.id);

// 찜 관련
const isFavorited = ref(false);
const favoriteCount = ref(0);
const favoriteLoading = ref(false);

// 지도 관련
const mapContainer = ref(null);
const mapLoading = ref(false);
const mapError = ref('');
const kakaoMap = ref(null);
const mapLoaded = ref(false);

// 리뷰 관련
const reviews = ref([]);
const reviewStats = ref({});
const reviewsLoading = ref(false);
const currentReviewPage = ref(1);
const totalReviewPages = ref(1);
const reviewsPerPage = ref(10);
const newReview = ref({
  rating: 0,
  content: ''
});
const reviewSubmitting = ref(false);

// 사용자 로그인 상태
const isLoggedIn = ref(false);

// axios 기본 설정
axios.defaults.withCredentials = true;

// 계산된 속성
const visibleReviewPages = computed(() => {
  const start = Math.max(1, currentReviewPage.value - 2);
  const end = Math.min(totalReviewPages.value, start + 4);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// API 호출 함수들
const fetchTripDetail = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    
    const response = await axios.get(`${API_BASE_URL}/api/travel/${placeId.value}`);
    tripDetail.value = response.data;
    
    // 지도 초기화
    if (tripDetail.value.mapX && tripDetail.value.mapY) {
      await nextTick();
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
    
  } catch (err) {
    console.error('여행지 정보 조회 실패:', err);
    error.value = '여행지 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    isLoading.value = false;
  }
};

const fetchFavoriteInfo = async () => {
  try {
    // 찜 개수 조회
    const countResponse = await axios.get(`${API_BASE_URL}/api/travel/${placeId.value}/favorite/count`);
    favoriteCount.value = countResponse.data.count;
    
    // 로그인한 경우 내가 찜했는지 확인
    if (isLoggedIn.value) {
      // 내 찜 목록에서 확인하는 로직 추가 필요
      // 지금은 단순화해서 false로 설정
      isFavorited.value = false;
    }
  } catch (err) {
    console.error('찜 정보 조회 실패:', err);
  }
};

const fetchReviews = async (page = 1) => {
  try {
    reviewsLoading.value = true;
    
    const response = await axios.get(
      `${API_BASE_URL}/api/reviews/place/${placeId.value}?page=${page - 1}&size=${reviewsPerPage.value}`
    );
    
    reviews.value = response.data.content;
    totalReviewPages.value = response.data.totalPages;
    currentReviewPage.value = page;
    
  } catch (err) {
    console.error('리뷰 조회 실패:', err);
  } finally {
    reviewsLoading.value = false;
  }
};

const fetchReviewStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/reviews/place/${placeId.value}/stats`);
    reviewStats.value = response.data;
  } catch (err) {
    console.error('리뷰 통계 조회 실패:', err);
  }
};

const checkLoginStatus = async () => {
  try {
    await axios.get(`${API_BASE_URL}/api/member`);
    isLoggedIn.value = true;
  } catch (err) {
    isLoggedIn.value = false;
  }
};

// 지도 초기화
const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    if (!KAKAO_MAP_API_KEY) {
      reject(new Error('카카오 지도 API 키가 설정되지 않았습니다.'));
      return;
    }

    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          resolve();
        });
      } else {
        reject(new Error('카카오 지도 객체를 찾을 수 없습니다.'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('카카오 지도 스크립트 로드 실패'));
    };
    
    document.head.appendChild(script);
  });
};

const initializeMap = async () => {
  try {
    mapLoading.value = true;
    mapError.value = '';
    
    await loadKakaoMapScript();
    
    if (!mapContainer.value || !tripDetail.value) {
      throw new Error('지도 컨테이너 또는 여행지 정보가 없습니다.');
    }

    const mapOption = {
      center: new window.kakao.maps.LatLng(
        parseFloat(tripDetail.value.mapY), 
        parseFloat(tripDetail.value.mapX)
      ),
      level: 4
    };

    kakaoMap.value = new window.kakao.maps.Map(mapContainer.value, mapOption);
    
    // 마커 추가
    const markerPosition = new window.kakao.maps.LatLng(
      parseFloat(tripDetail.value.mapY), 
      parseFloat(tripDetail.value.mapX)
    );
    
    const marker = new window.kakao.maps.Marker({
      position: markerPosition
    });
    
    marker.setMap(kakaoMap.value);
    
    // 인포윈도우 추가
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div class="map-info-window">
                  <div class="info-title">${tripDetail.value.title}</div>
                  <div class="info-address">${tripDetail.value.address1}</div>
                </div>`
    });
    
    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.open(kakaoMap.value, marker);
    });
    
    mapLoaded.value = true;
    
  } catch (error) {
    console.error('지도 초기화 실패:', error);
    mapError.value = error.message || '지도를 불러오는 중 오류가 발생했습니다.';
  } finally {
    mapLoading.value = false;
  }
};

// 이벤트 핸들러들
const toggleFavorite = async () => {
  if (!isLoggedIn.value) {
    alert('로그인이 필요합니다.');
    return;
  }
  
  try {
    favoriteLoading.value = true;
    
    if (isFavorited.value) {
      await axios.delete(`${API_BASE_URL}/api/travel/${placeId.value}/favorite`);
      isFavorited.value = false;
      favoriteCount.value = Math.max(0, favoriteCount.value - 1);
    } else {
      await axios.post(`${API_BASE_URL}/api/travel/${placeId.value}/favorite`, {
        placeId: parseInt(placeId.value)
      });
      isFavorited.value = true;
      favoriteCount.value += 1;
    }
  } catch (err) {
    console.error('찜 토글 실패:', err);
    alert('오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    favoriteLoading.value = false;
  }
};

const setRating = (rating) => {
  newReview.value.rating = rating;
};

const submitReview = async () => {
  if (!isLoggedIn.value) {
    alert('로그인이 필요합니다.');
    return;
  }
  
  if (!newReview.value.content.trim() || newReview.value.rating === 0) {
    alert('평점과 리뷰 내용을 모두 입력해주세요.');
    return;
  }
  
  try {
    reviewSubmitting.value = true;
    
    await axios.post(`${API_BASE_URL}/api/reviews`, {
      placeId: parseInt(placeId.value),
      rating: newReview.value.rating,
      content: newReview.value.content.trim()
    });
    
    // 리뷰 목록 및 통계 다시 로드
    await fetchReviews(1);
    await fetchReviewStats();
    
    // 폼 초기화
    newReview.value = { rating: 0, content: '' };
    
    alert('리뷰가 등록되었습니다.');
    
  } catch (err) {
    console.error('리뷰 등록 실패:', err);
    alert('리뷰 등록 중 오류가 발생했습니다.');
  } finally {
    reviewSubmitting.value = false;
  }
};

const changeReviewPage = (page) => {
  if (page >= 1 && page <= totalReviewPages.value) {
    fetchReviews(page);
  }
};

// 헬퍼 함수들
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/600x400?text=No+Image';
};

const getCategoryName = (categoryCode) => {
  const categoryMap = {
    'A01': '자연',
    'A02': '인문(문화/예술/역사)',
    'A03': '레포츠',
    'A04': '쇼핑',
    'A05': '음식'
  };
  
  return categoryMap[categoryCode] || '기타';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 컴포넌트 마운트
onMounted(async () => {
  await checkLoginStatus();
  await fetchTripDetail();
  await fetchFavoriteInfo();
  await fetchReviews();
  await fetchReviewStats();
});

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  if (kakaoMap.value) {
    kakaoMap.value = null;
  }
});
</script>

<style scoped>
/* 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

.trip-detail-container {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 6rem;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

/* 로딩 및 에러 스타일 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #9581e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 3rem;
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 10px;
  margin-bottom: 2rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

/* 그라데이션 원형들 */
.gradient-circle {
  position: absolute;
  border-radius: 65% 35% 60% 40% / 60% 40% 60% 40%;
  z-index: 0;
  transform: skew(-5deg, -10deg);
}

.circle1 { top: -10%; left: -5%; width: 45vw; height: 35vw; background: radial-gradient(ellipse, rgba(213, 224, 251, 0.9) 0%, rgba(213, 224, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-15deg); }
.circle2 { bottom: -15%; right: -10%; width: 50vw; height: 38vw; background: radial-gradient(ellipse, rgba(213, 237, 251, 0.9) 0%, rgba(213, 237, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(10deg); }
.circle3 { top: 20%; right: 10%; width: 35vw; height: 25vw; background: radial-gradient(ellipse, rgba(213, 222, 251, 0.85) 0%, rgba(213, 222, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-8deg); }
.circle4 { bottom: 30%; left: 5%; width: 28vw; height: 22vw; background: radial-gradient(ellipse, rgba(213, 232, 251, 0.9) 0%, rgba(213, 232, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(12deg); }
.circle5 { top: 45%; left: 30%; width: 40vw; height: 28vw; background: radial-gradient(ellipse, rgba(213, 224, 251, 0.85) 0%, rgba(213, 224, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-5deg); }
.circle6 { bottom: 50%; right: 30%; width: 45vw; height: 32vw; background: radial-gradient(ellipse, rgba(213, 237, 251, 0.8) 0%, rgba(213, 237, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(15deg); }
.circle7 { bottom: 10%; left: 40%; width: 42vw; height: 30vw; background: radial-gradient(ellipse, rgba(213, 232, 251, 0.85) 0%, rgba(213, 232, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-12deg); }

.main-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

/* 여행지 헤더 */
.trip-header {
  margin-bottom: 3rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.image-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.favorite-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.favorite-button:hover {
  transform: scale(1.1);
  background-color: white;
}

.favorite-button.favorited {
  background-color: rgba(255, 182, 193, 0.9);
}

.sub-image {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sub-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.info-section {
  padding: 1rem 0;
}

.trip-category {
  margin-bottom: 1rem;
}

.category-badge {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.trip-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.trip-meta {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #555;
}

.meta-icon {
  font-size: 1.1rem;
}

.trip-description {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #9581e8;
}

.trip-description h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
}

.trip-description p {
  line-height: 1.7;
  color: #555;
}

/* 지도 섹션 */
.map-section {
  margin-bottom: 3rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#trip-detail-map {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

/* 리뷰 섹션 */
.review-section {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.review-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-score {
  font-size: 1.5rem;
  font-weight: 700;
  color: #9581e8;
}

.stars {
  display: flex;
  gap: 0.1rem;
}

.star {
  font-size: 1rem;
  color: #ddd;
}

.star.filled {
  color: #ffc107;
}

/* 리뷰 작성 */
.review-write {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.review-write h3 {
  margin-bottom: 1rem;
  color: #333;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.star-rating {
  display: flex;
  gap: 0.2rem;
}

.star-input {
  font-size: 1.5rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star-input:hover,
.star-input.active {
  color: #ffc107;
}

.review-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.review-textarea:focus {
  outline: none;
  border-color: #9581e8;
  box-shadow: 0 0 0 2px rgba(149, 129, 232, 0.1);
}

.review-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 0.85rem;
  color: #666;
}

.submit-review-btn {
  padding: 0.8rem 1.5rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s;
}

.submit-review-btn:hover:not(:disabled) {
  background-color: #8470d7;
  transform: translateY(-2px);
}

.submit-review-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.login-prompt {
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.login-prompt a {
  color: #9581e8;
  text-decoration: none;
  font-weight: 600;
}

/* 리뷰 목록 */
.review-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-reviews {
  text-align: center;
  padding: 3rem;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.review-item {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.review-header-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #9581e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.reviewer-name {
  font-weight: 600;
  color: #333;
}

.review-date {
  font-size: 0.85rem;
  color: #666;
}

.review-content p {
  line-height: 1.6;
  color: #555;
  margin-bottom: 1rem;
}

.review-image {
  margin-top: 1rem;
}

.review-image img {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: #666;
}

.prev, .next {
  width: auto;
  padding: 0 1rem;
  border-radius: 20px;
}

.pagination-btn.active {
  background-color: #9581e8;
  color: white;
  border-color: #9581e8;
}

.pagination-btn:hover:not(.active):not(:disabled) {
  background-color: #f5f5f5;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .trip-detail-container {
    padding: 2rem 4rem;
  }
  
  .header-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .trip-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .trip-detail-container {
    padding: 2rem 2rem;
  }
  
  .trip-title {
    font-size: 1.5rem;
  }
  
  .main-image img {
    height: 250px;
  }
  
  .sub-image img {
    height: 150px;
  }
  
  .map-container {
    height: 300px;
  }
  
  .review-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .review-header-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>

<!-- 지도 인포윈도우 스타일 -->
<style>
.map-info-window {
  padding: 8px 12px;
  max-width: 200px;
}

.info-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  font-size: 14px;
}

.info-address {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
}
</style>