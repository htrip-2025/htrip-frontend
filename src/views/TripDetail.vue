<template>
  <div class="trip-detail-container">
   
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
                <span class="font">{{ tripDetail.address1 }} {{ tripDetail.address2 || '' }}</span>
              </div>
              
              <div v-if="tripDetail.telephone" class="meta-item">
                <span class="meta-icon">📞</span>
                <span>{{ tripDetail.telephone }}</span>
              </div>
              
              <div class="meta-item">
                <span class="meta-icon">❤️</span>
                <span class=" font">{{ favoriteCount }}명이 찜했어요</span>
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
      <section class="map-section" v-if="hasValidCoordinates">
        <h2 class="section-title">위치</h2>
        <div class="map-container" ref="mapContainer" id="trip-detail-map">
          <div class="map-loading" v-if="mapLoading">
            <div class="loading-spinner"></div>
            <p>지도를 불러오는 중...</p>
          </div>
          <div class="map-error" v-else-if="mapError">
            <p>{{ mapError }}</p>
            <button @click="initializeMap" class="retry-btn">다시 시도</button>
          </div>
          <div v-else-if="!mapLoaded" class="map-placeholder">
            <p>지도를 준비하는 중...</p>
          </div>
        </div>
      </section>

      <!-- 위치 정보가 없는 경우 -->
      <section v-else class="map-section">
        <h2 class="section-title">위치</h2>
        <div class="no-location-info">
          <p>📍 이 여행지의 위치 정보가 없습니다</p>
          <small>{{ tripDetail.address1 }} {{ tripDetail.address2 || '' }}</small>
        </div>
      </section>

      <!-- 리뷰 섹션 -->
      <section class="review-section">
        <div class="review-header">
          <h2 class="section-title">리뷰 ({{ reviewStats.totalCount || 0 }})</h2>
          <div class="review-stats" v-if="reviewStats.averageRating">
            <div class="rating-display">
              <span class="rating-score">{{ reviewStats.averageRating.toFixed(1) }}</span>
            </div>
          </div>
        </div>

        <!-- 리뷰 작성 -->
        <div class="review-write" v-if="isLoggedIn && !editingReview">
          <h3>리뷰 작성하기</h3>

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

        <!-- 리뷰 수정 폼 -->
        <div class="review-write" v-if="editingReview">
          <h3>리뷰 수정하기</h3>
          <textarea 
            v-model="editReview.content" 
            placeholder="이곳에 대한 경험을 공유해주세요..."
            class="review-textarea"
            rows="4"
            maxlength="1000"
          ></textarea>
          <div class="review-actions">
            <div class="char-count">{{ editReview.content.length }}/1000</div>
            <div class="review-edit-buttons">
              <button @click="cancelEdit" class="cancel-edit-btn">취소</button>
              <button 
                @click="updateReview" 
                class="submit-review-btn"
                :disabled="reviewSubmitting || !editReview.content.trim() || editReview.rating === 0"
              >
                {{ reviewSubmitting ? '수정 중...' : '수정 완료' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="!isLoggedIn" class="login-prompt">
          <p>리뷰를 작성하려면 <router-link to="/login">로그인</router-link>이 필요합니다.</p>
        </div>

        <!-- 리뷰 목록 -->
        <div class="review-list">
          <div v-if="reviews.length === 0 && !reviewsLoading" class="no-reviews">
            <p class="font">아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>
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
              <div class="review-rating-and-actions">
                <!-- 내가 작성한 리뷰인 경우 수정/삭제 버튼 표시 -->
                <div v-if="isMyReview(review)" class="review-actions-btns">
                  <button @click="startEditReview(review)" class="edit-review-btn">수정</button>
                  <button @click="deleteReview(review.reviewId)" class="delete-review-btn">삭제</button>
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

const router = useRoute();

const props = defineProps({
  placeId: {
    type: [String, Number],
    required: true
  }
});

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

// 상태 관리
const isLoading = ref(false);
const error = ref('');
const tripDetail = ref(null);

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
const kakaoLoaded = ref(false);

// 리뷰 관련
const reviews = ref([]);
const reviewStats = ref({});
const reviewsLoading = ref(false);
const currentReviewPage = ref(1);
const totalReviewPages = ref(1);
const reviewsPerPage = ref(10);
const newReview = ref({
  content: ''
});
const reviewSubmitting = ref(false);
// const hoverRating = ref(0);

// 리뷰 수정 관련
const editingReview = ref(null);
const editReview = ref({
  reviewId: null,
  content: ''
});

// 사용자 로그인 상태
const isLoggedIn = ref(false);
const currentUser = ref(null);

// axios 기본 설정
axios.defaults.withCredentials = true;

// 계산된 속성
const hasValidCoordinates = computed(() => {
  return tripDetail.value && 
         tripDetail.value.longitude && 
         tripDetail.value.latitude && 
         !isNaN(parseFloat(tripDetail.value.longitude)) && 
         !isNaN(parseFloat(tripDetail.value.latitude));
});

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
    
    console.log('여행지 정보 요청:', props.placeId);
    
    const response = await axios.get(`${API_BASE_URL}/api/travel/${props.placeId}`);
    tripDetail.value = response.data;
    
    console.log('여행지 정보 응답:', tripDetail.value);
    console.log('좌표 정보:', {
      longitude: tripDetail.value.longitude,
      latitude: tripDetail.value.latitude
    });
    
    // 지도 초기화
    if (hasValidCoordinates.value) {
      await nextTick();
      setTimeout(() => {
        initializeMap();
      }, 500);
    } else {
      console.warn('유효한 좌표 정보가 없습니다:', {
        longitude: tripDetail.value.longitude,
        latitude: tripDetail.value.latitude
      });
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
    const countResponse = await axios.get(`${API_BASE_URL}/api/travel/${props.placeId}/favorite/count`);
    favoriteCount.value = countResponse.data.count;
    
    // 로그인한 경우 내가 찜했는지 확인
    if (isLoggedIn.value) {
      try {
        const favoritesResponse = await axios.get(`${API_BASE_URL}/api/member/favorite`, {
          params: { page: 0, size: 100 }
        });
        
        if (favoritesResponse.data && favoritesResponse.data.content) {
          const found = favoritesResponse.data.content.some(
            favorite => favorite.attraction && favorite.attraction.placeId === parseInt(props.placeId)
          );
          isFavorited.value = found;
        }
      } catch (error) {
        console.warn('찜 상태 확인 실패:', error);
      }
    }
  } catch (err) {
    console.error('찜 정보 조회 실패:', err);
  }
};

const fetchReviews = async (page = 1) => {
  try {
    reviewsLoading.value = true;
    
    const response = await axios.get(
      `${API_BASE_URL}/api/review/place/${props.placeId}`,
      { 
        params: {
          page: page - 1,
          size: reviewsPerPage.value
        }
      }
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
    const response = await axios.get(`${API_BASE_URL}/api/review/place/${props.placeId}/stats`);
    reviewStats.value = response.data;
  } catch (err) {
    console.error('리뷰 통계 조회 실패:', err);
  }
};

const checkLoginStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/member`);
    isLoggedIn.value = true;
    currentUser.value = response.data;
    
    // 로그인한 경우 내가 찜했는지 확인
    try {
      const favoritesResponse = await axios.get(`${API_BASE_URL}/api/member/favorite`, {
        params: { page: 0, size: 100 }
      });
      
      if (favoritesResponse.data && favoritesResponse.data.content) {
        const found = favoritesResponse.data.content.some(
          favorite => favorite.attraction && favorite.attraction.placeId === parseInt(props.placeId)
        );
        isFavorited.value = found;
      }
    } catch (error) {
      console.warn('찜 상태 확인 실패:', error);
    }
  } catch (err) {
    isLoggedIn.value = false;
  }
};

// 지도 초기화 함수들
const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    console.log('카카오 지도 스크립트 로드 시작');
    
    if (!KAKAO_MAP_API_KEY) {
      const error = '카카오 지도 API 키가 설정되지 않았습니다.';
      console.error(error);
      reject(new Error(error));
      return;
    }

    if (window.kakao && window.kakao.maps && kakaoLoaded.value) {
      console.log('카카오 지도 이미 로드됨');
      resolve();
      return;
    }

    // 기존 스크립트 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript && window.kakao && window.kakao.maps) {
      console.log('기존 카카오 지도 스크립트 발견');
      window.kakao.maps.load(() => {
        kakaoLoaded.value = true;
        resolve();
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      console.log('카카오 지도 스크립트 로드 완료');
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('카카오 지도 API 초기화 완료');
          kakaoLoaded.value = true;
          resolve();
        });
      } else {
        const error = '카카오 지도 객체를 찾을 수 없습니다.';
        console.error(error);
        reject(new Error(error));
      }
    };
    
    script.onerror = (error) => {
      console.error('카카오 지도 스크립트 로드 실패:', error);
      reject(new Error('카카오 지도 스크립트 로드 실패'));
    };
    
    document.head.appendChild(script);
  });
};

const initializeMap = async () => {
  try {
    mapLoading.value = true;
    mapError.value = '';
    
    console.log('지도 초기화 시작');
    console.log('좌표 정보:', {
      longitude: tripDetail.value.longitude,
      latitude: tripDetail.value.latitude
    });
    
    // 좌표 유효성 검사
    if (!hasValidCoordinates.value) {
      throw new Error('유효한 좌표 정보가 없습니다.');
    }
    
    // 카카오 지도 스크립트 로드
    await loadKakaoMapScript();
    
    // DOM 요소 확인
    if (!mapContainer.value) {
      throw new Error('지도 컨테이너를 찾을 수 없습니다.');
    }

    console.log('지도 컨테이너 확인:', mapContainer.value);

    // 카카오 지도 API 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.Map) {
      throw new Error('카카오 지도 API가 준비되지 않았습니다.');
    }

    // 기존 지도 정리
    if (kakaoMap.value) {
      kakaoMap.value = null;
    }

    const longitude = parseFloat(tripDetail.value.longitude);
    const latitude = parseFloat(tripDetail.value.latitude);
    
    console.log('지도 중심 좌표:', { latitude, longitude });

    // 지도 옵션 설정
    const mapOption = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 4
    };

    // 지도 생성
    kakaoMap.value = new window.kakao.maps.Map(mapContainer.value, mapOption);
    console.log('카카오 지도 생성 완료');
    
    // 마커 생성
    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition
    });
    
    marker.setMap(kakaoMap.value);
    console.log('마커 생성 완료');
    
    // 인포윈도우 생성
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div class="map-info-window">
                  <div class="info-title">${tripDetail.value.title}</div>
                  <div class="info-address">${tripDetail.value.address1}</div>
                </div>`
    });
    
    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.open(kakaoMap.value, marker);
    });
    
    mapLoaded.value = true;
    console.log('지도 초기화 완료');
    
  } catch (error) {
    console.error('지도 초기화 실패:', error);
    mapError.value = error.message || '지도를 불러오는 중 오류가 발생했습니다.';
    mapLoaded.value = false;
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
      await axios.delete(`${API_BASE_URL}/api/travel/${props.placeId}/favorite`);
      isFavorited.value = false;
      favoriteCount.value = Math.max(0, favoriteCount.value - 1);
    } else {
      await axios.post(`${API_BASE_URL}/api/travel/${props.placeId}/favorite`, {
        placeId: parseInt(props.placeId)
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

const submitReview = async () => {
  if (!isLoggedIn.value) {
    alert('로그인이 필요합니다.');
    return;
  }
  
  if (!newReview.value.content.trim() || newReview.value.rating === 0) {
    alert('리뷰 내용을 모두 입력해주세요.');
    return;
  }
  
  try {
    reviewSubmitting.value = true;
    
    const reviewRequest = {
      placeId: parseInt(props.placeId),
      rating: newReview.value.rating,
      content: newReview.value.content.trim()
    };
    
    const response = await axios.post(`${API_BASE_URL}/api/review`, reviewRequest);
    
    // 새로 작성한 리뷰를 즉시 리뷰 목록에 추가
    const newReviewData = {
      reviewId: response.data.reviewId || Date.now(),
      userId: currentUser.value.userId,
      userName: currentUser.value.name || currentUser.value.nickname,
      rating: newReview.value.rating,
      content: newReview.value.content.trim(),
      createDate: new Date().toISOString(),
      imageUrl: null
    };
    
    reviews.value.unshift(newReviewData);
    
    // 리뷰 통계 업데이트
    await fetchReviewStats();
    
    // 리뷰 카운트 직접 증가
    if (reviewStats.value.totalCount !== undefined) {
      reviewStats.value.totalCount += 1;
    } else {
      reviewStats.value.totalCount = 1;
    }
    
    newReview.value = { rating: 0, content: '' };
    
    alert('리뷰가 등록되었습니다.');
    
  } catch (err) {
    console.error('리뷰 등록 실패:', err);
    alert('리뷰 등록 중 오류가 발생했습니다.');
  } finally {
    reviewSubmitting.value = false;
  }
};

const deleteReview = async (reviewId) => {
  if (!confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
    return;
  }
  
  try {
    await axios.delete(`${API_BASE_URL}/api/review/${reviewId}`);
    
    await fetchReviews(currentReviewPage.value);
    await fetchReviewStats();
    
    // 리뷰 카운트 직접 감소
    if (reviewStats.value.totalCount !== undefined && reviewStats.value.totalCount > 0) {
      reviewStats.value.totalCount -= 1;
    }
    
    alert('리뷰가 삭제되었습니다.');
    
  } catch (err) {
    console.error('리뷰 삭제 실패:', err);
    alert('리뷰 삭제 중 오류가 발생했습니다.');
  }
};

const isMyReview = (review) => {
  return isLoggedIn.value && currentUser.value && review.userId === currentUser.value.userId;
};

const startEditReview = (review) => {
  editingReview.value = review;
  editReview.value = {
    reviewId: review.reviewId,
    content: review.content
  };
};

const cancelEdit = () => {
  editingReview.value = null;
  editReview.value = {
    reviewId: null,
    content: ''
  };
};

const updateReview = async () => {
  if (!editReview.value.content.trim() || editReview.value.rating === 0) {
    alert('리뷰 내용을 모두 입력해주세요.');
    return;
  }
  
  try {
    reviewSubmitting.value = true;
    
    const updateRequest = {
      rating: editReview.value.rating,
      content: editReview.value.content.trim()
    };
    
    await axios.put(`${API_BASE_URL}/api/review/${editReview.value.reviewId}`, updateRequest);
    
    await fetchReviews(currentReviewPage.value);
    await fetchReviewStats();
    
    cancelEdit();
    
    alert('리뷰가 수정되었습니다.');
    
  } catch (err) {
    console.error('리뷰 수정 실패:', err);
    alert('리뷰 수정 중 오류가 발생했습니다.');
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
  console.log('TripDetail 컴포넌트 마운트 시작');
  console.log('placeId:', props.placeId);
  
  await checkLoginStatus();
  await fetchTripDetail();
  await fetchFavoriteInfo();
  await fetchReviews();
  await fetchReviewStats();
});

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  console.log('TripDetail 컴포넌트 언마운트');
  if (kakaoMap.value) {
    kakaoMap.value = null;
  }
  kakaoLoaded.value = false;
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

 background-image: url('https://i.pinimg.com/736x/5e/9f/07/5e9f07d84b763d9fd5becff18cc6e99e.jpg');
 background-repeat: repeat;
 background-size: cover;
 background-attachment: fixed;

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
 border-top: 4px solid #2172ce;
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
  font-family: 'LeeSeoyun';
}

.retry-button {
 margin-top: 1rem;
 padding: 0.8rem 1.5rem;
 background: linear-gradient(135deg, #2172ce 0%, #2c88f1 100%);
 color: white;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 font-size: 1rem;
 transition: all 0.3s ease;
 box-shadow: 0 3px 8px rgba(33, 114, 206, 0.3);
 position: relative;
 overflow: hidden;
 z-index: 1;
  font-family: 'LeeSeoyun';
}

.retry-button::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 width: 0%;
 height: 100%;
 background: linear-gradient(135deg, #2c88f1 0%, #2172ce 100%);
 transition: width 0.5s ease;
 z-index: -1;
 border-radius: 5px;
}

.retry-button:hover {
 background: linear-gradient(135deg, #2c88f1, #2172ce);
 transform: translateY(-3px);
 box-shadow: 0 10px 25px rgba(33, 114, 206, 0.35);
}

.retry-button:hover::before {
 width: 100%;
}

.font{
     font-family: 'LeeSeoyun';
}
.main-content {
 position: relative;
 z-index: 1;
 max-width: 1200px;
 margin: 0 auto;
  font-family: 'LeeSeoyun';
}

/* 여행지 헤더 */
.trip-header {
 margin-bottom: 3rem;
 background-color: rgba(255, 255, 255, 0.9);
 border-radius: 15px;
 padding: 2rem;
 box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  font-family: 'LeeSeoyun';
}

.header-content {
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 2rem;
 align-items: start;
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.trip-category {
 margin-bottom: 1rem;
  font-family: 'LeeSeoyun';
}

.category-badge {
 background-color: #e3f2fd;
 color: #1976d2;
 padding: 0.4rem 0.8rem;
 border-radius: 15px;
 font-size: 0.85rem;
 font-weight: 500;
  font-family: 'LeeSeoyun';
}

.trip-title {
 font-size: 2.2rem;
 font-weight: 700;
 color: #333;
 margin-bottom: 1.5rem;
 line-height: 1.3;
  font-family: 'LeeSeoyun';
}

.trip-meta {
 display: flex;
 flex-direction: column;
 gap: 0.8rem;
 margin-bottom: 2rem;
  font-family: 'LeeSeoyun';
}

.meta-item {
 display: flex;
 align-items: center;
 gap: 0.5rem;
 font-size: 1rem;
 color: #555;
  font-family: 'LeeSeoyun';
}

.meta-icon {
 font-size: 1.1rem;
  font-family: 'LeeSeoyun';
}

.trip-description {
 background-color: #f8f9fa;
 padding: 1.5rem;
 border-radius: 10px;
 border-left: 4px solid #2172ce;
  font-family: 'LeeSeoyun';
}

.trip-description h2 {
 font-size: 1.2rem;
 color: #333;
 margin-bottom: 1rem;
  font-family: 'LeeSeoyun';
}

.trip-description p {
 line-height: 1.7;
 color: #555;
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.map-container {
 width: 100%;
 height: 400px;
 border-radius: 10px;
 overflow: hidden;
 position: relative;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 background-color: #f5f5f5;
}

#trip-detail-map {
 width: 100%;
}

.map-loading, .map-error, .map-placeholder {
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

.no-location-info {
 text-align: center;
 padding: 3rem;
 background-color: #f8f9fa;
 border-radius: 10px;
 color: #666;
}

.no-location-info p {
 font-size: 1.1rem;
 margin-bottom: 0.5rem;
}

.no-location-info small {
 color: #999;
}

/* 리뷰 섹션 */
.review-section {
 background-color: rgba(255, 255, 255, 0.9);
 border-radius: 15px;
 padding: 2rem;
 box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  font-family: 'LeeSeoyun';
}

.review-header {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 2rem;
  font-family: 'LeeSeoyun';
}

.review-stats {
 display: flex;
 align-items: center;
 gap: 1rem;
  font-family: 'LeeSeoyun';
}

.rating-display {
 display: flex;
 align-items: center;
 gap: 0.5rem;
  font-family: 'LeeSeoyun';
}

.rating-score {
 font-size: 1.5rem;
 font-weight: 700;
 color: #2172ce;
  font-family: 'LeeSeoyun';
}

/* 리뷰 작성 */
.review-write {
 background-color: #f8f9fa;
 padding: 1.5rem;
 border-radius: 10px;
 margin-bottom: 2rem;
  font-family: 'LeeSeoyun';
}

.review-write h2 {
 margin-bottom: 1rem;
 color: #333;
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.review-textarea:focus {
 outline: none;
 border-color: #2172ce;
 box-shadow: 0 0 0 2px rgba(33, 114, 206, 0.1);
 
}

.review-actions {
 display: flex;
 justify-content: space-between;
 align-items: center;
  font-family: 'LeeSeoyun';
}

.char-count {
 font-size: 0.85rem;
 color: #666;
  font-family: 'LeeSeoyun';
}

.submit-review-btn {
 padding: 0.8rem 1.5rem;
 background: linear-gradient(135deg, #2172ce 0%, #2c88f1 100%);
 color: white;
 border: none;
 border-radius: 8px;
 cursor: pointer;
 font-size: 0.95rem;
 font-weight: 500;
 transition: all 0.3s ease;
 box-shadow: 0 3px 8px rgba(33, 114, 206, 0.3);
 position: relative;
 overflow: hidden;
 z-index: 1;
  font-family: 'LeeSeoyun';
}

.submit-review-btn::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 width: 0%;
 height: 100%;
 /* background: linear-gradient(135deg, #2c88f1 0%, #2172ce 100%); */
 transition: width 0.5s ease;
 z-index: -1;
 border-radius: 8px;
}

.submit-review-btn:hover:not(:disabled) {
 background: linear-gradient(135deg, #2c88f1, #2172ce);
 transform: translateY(-3px);
 box-shadow: 0 10px 25px rgba(33, 114, 206, 0.35);
}

.submit-review-btn:hover::before {
 width: 100%;
}

.submit-review-btn:disabled {
 background: #ccc;
 cursor: not-allowed;
 transform: none;
 box-shadow: none;
}

.review-edit-buttons {
 display: flex;
 gap: 0.8rem;
  font-family: 'LeeSeoyun';
}

.cancel-edit-btn {
 padding: 0.8rem 1.5rem;
 background-color: #6c757d;
 color: white;
 border: none;
 border-radius: 8px;
 cursor: pointer;
 font-size: 0.95rem;
 font-weight: 500;
 transition: all 0.3s;
  font-family: 'LeeSeoyun';
}

.cancel-edit-btn:hover {
 background-color: #5a6268;
 transform: translateY(-2px);
 
}

.login-prompt {
 text-align: center;
 padding: 2rem;
 background-color: #f8f9fa;
 border-radius: 10px;
 margin-bottom: 2rem;
  font-family: 'LeeSeoyun';
}

.login-prompt a {
 color: #2172ce;
 text-decoration: none;
 font-weight: 600;
  font-family: 'LeeSeoyun';
}

/* 리뷰 목록 */
.review-list {
 display: flex;
 flex-direction: column;
 gap: 1.5rem;
  font-family: 'LeeSeoyun';
}

.no-reviews {
 text-align: center;
 padding: 3rem;
 color: #666;
 background-color: #f8f9fa;
 border-radius: 10px;
  font-family: 'LeeSeoyun';
}


.review-item {
 background-color: white;
 border: 1px solid #eee;
 border-radius: 10px;
 padding: 1.5rem;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: 'LeeSeoyun';
}

.review-header-item {
 display: flex;
 justify-content: space-between;
 align-items: flex-start;
 margin-bottom: 1rem;
  font-family: 'LeeSeoyun';
}

.reviewer-info {
 display: flex;
 align-items: center;
 gap: 0.8rem;
  font-family: 'LeeSeoyun';
}

.reviewer-avatar {
 width: 40px;
 height: 40px;
 border-radius: 50%;
 background-color: #2172ce;
 color: white;
 display: flex;
 align-items: center;
 justify-content: center;
 font-weight: 600;
 font-size: 1.1rem;
  font-family: 'LeeSeoyun';
}

.reviewer-name {
 font-weight: 600;
 color: #333;
  font-family: 'LeeSeoyun';
}

.review-date {
 font-size: 0.85rem;
 color: #666;
  font-family: 'LeeSeoyun';
}

.review-actions-btns {
 display: flex;
 gap: 0.5rem;
  font-family: 'LeeSeoyun';
}

.edit-review-btn, .delete-review-btn {
 padding: 0.4rem 0.8rem;
 border: none;
 border-radius: 4px;
 cursor: pointer;
 font-size: 0.8rem;
 font-weight: 500;
 transition: all 0.3s;
  font-family: 'LeeSeoyun';
}

.edit-review-btn {
 background-color: #f8f9fa;
 color: #495057;
 border: 1px solid #dee2e6;
  font-family: 'LeeSeoyun';
}

.edit-review-btn:hover {
 background-color: #e9ecef;
 transform: translateY(-1px);
}

.delete-review-btn {
 background-color: #fff5f5;
 color: #dc3545;
 border: 1px solid #f5c6cb;
  font-family: 'LeeSeoyun';
}

.delete-review-btn:hover {
 background-color: #f8d7da;
 transform: translateY(-1px);
  font-family: 'LeeSeoyun';
}

.review-content p {
 line-height: 1.6;
 color: #555;
 margin-bottom: 1rem;
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.prev, .next {
 width: auto;
 padding: 0 1rem;
 border-radius: 20px;
}

.pagination-btn.active {
 background-color: #2172ce;
 color: white;
 border-color: #2172ce;
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
 
 .review-rating-and-actions {
   align-items: flex-start;
 }
 
 .pagination {
   flex-wrap: wrap;
   justify-content: center;
 }
 
 .review-actions {
   flex-direction: column;
   gap: 1rem;
   align-items: flex-start;
 }
 
 .review-edit-buttons {
   width: 100%;
   justify-content: flex-end;
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
  font-family: 'LeeSeoyun';
}

.info-address {
 font-size: 12px;
 color: #666;
 line-height: 1.3;
  font-family: 'LeeSeoyun';
}
</style>