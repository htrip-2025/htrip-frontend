<template>
  <div class="info-container">
    <!-- 배경 그라데이션 원형들 -->
    <div class="gradient-circle circle1"></div>
    <div class="gradient-circle circle2"></div>
    <div class="gradient-circle circle3"></div>
    <div class="gradient-circle circle4"></div>
    <div class="gradient-circle circle5"></div>
    <div class="gradient-circle circle6"></div>
    <div class="gradient-circle circle7"></div>
    
    <!-- 헤더 -->
    <header class="header">
      <div class="logo">
        <span class="logo-icon">T</span>rip
      </div>
      <div class="menu-items">
        <a href="#" class="menu-link">AI 추천</a>
        <a href="/info" class="menu-link active">여행정보</a>
        <a href="/plan" class="menu-link">여행계획</a>
        <a href="#" class="menu-link">커뮤니티</a>
        <a href="#" class="menu-link search-icon">🔍</a>
      </div>
     <div class="login-section">
      <a href="/login" class="login-button">
        <span class="button-text">로그인</span>
      </a>
    </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <section class="main-content">
      <!-- 로딩 표시 -->
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>여행지 정보를 불러오는 중...</p>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchData" class="retry-button">다시 시도</button>
      </div>

      <!-- 메인 콘텐츠 (로딩이 아닐 때만 표시) -->
      <div v-if="!isLoading && !error">
        <!-- 지역 선택 필터 -->
        <div class="filter-section">
          <div class="filter-group">
            <label for="area-select">지역 선택</label>
            <select 
              id="area-select" 
              v-model="selectedAreaCode" 
              @change="onAreaChange"
              class="filter-select"
            >
              <option value="">전체 지역</option>
              <option v-for="area in areas" :key="area.areaCode" :value="area.areaCode">
                {{ area.name }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="sigungu-select">시/군/구 선택</label>
            <select 
              id="sigungu-select" 
              v-model="selectedSigunguCode"
              @change="onSigunguChange"
              class="filter-select"
              :disabled="!selectedAreaCode"
            >
              <option value="">전체 시/군/구</option>
              <option v-for="sigungu in filteredSigungus" :key="sigungu.sigunguCode" :value="sigungu.sigunguCode">
                {{ sigungu.name }}
              </option>
            </select>
          </div>

          <!-- 검색 입력 -->
          <div class="filter-group">
            <label for="search-input">검색</label>
            <div class="search-input-group">
              <input 
                id="search-input"
                type="text" 
                v-model="searchKeyword" 
                @input="onSearchInput"
                placeholder="여행지명 검색..."
                class="filter-select"
              >
              <button @click="searchPlaces" class="search-button">검색</button>
            </div>
          </div>
        </div>
        
        <!-- 필터링된 결과가 없을 때 메시지 -->
        <div v-if="places.length === 0 && !isLoading" class="no-results">
          <p v-if="selectedAreaCode || selectedSigunguCode || searchKeyword">
            검색 조건에 맞는 여행지가 없습니다.
          </p>
          <p v-else>
            등록된 여행지가 없습니다.
          </p>
        </div>
        
        <!-- 여행지 리스트 -->
        <div class="place-list" v-else>
          <div 
            v-for="place in places" 
            :key="place.placeId" 
            class="place-card"
          >
            <div class="place-image">
              <img 
                :src="place.firstImageUrl || '/api/placeholder/300/200'" 
                :alt="place.title"
                @error="handleImageError"
              >
            </div>
            <div class="place-info">
              <h3 class="place-name">{{ place.title }}</h3>
              <div class="place-location">
                <span class="location-icon">📍</span>
                <span>{{ getAreaName(place.areaCode) }} {{ getSigunguName(place.areaCode, place.sigunguCode) }}</span>
              </div>
              <div class="place-address">
                <p>{{ place.address1 }} {{ place.address2 || '' }}</p>
              </div>
              <div class="place-meta">
                <span v-if="place.telephone" class="place-phone">📞 {{ place.telephone }}</span>
                <span class="place-category">{{ getCategoryName(place.category1, place.category2, place.category3) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 페이지네이션 -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="pagination-btn prev" 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            이전
          </button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="pagination-btn" 
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button 
            class="pagination-btn next"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            다음
          </button>
        </div>
      </div>
    </section>
    
    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <span class="logo-icon">T</span>rip
        </div>
        <p class="copyright">© 2025 Trip. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

// API 기본 URL - 환경변수로 설정 (수정됨)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 상태 관리
const selectedAreaCode = ref('');
const selectedSigunguCode = ref('');
const searchKeyword = ref('');
const isLoading = ref(false);
const error = ref('');

// 데이터
const areas = ref([]);
const sigungus = ref([]);
const places = ref([]);

// 페이지네이션
const currentPage = ref(1);
const pageSize = ref(12);
const totalElements = ref(0);

// 계산된 속성
const totalPages = computed(() => Math.ceil(totalElements.value / pageSize.value));

const visiblePages = computed(() => {
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const filteredSigungus = computed(() => {
  if (!selectedAreaCode.value) return [];
  return sigungus.value.filter(sigungu => sigungu.areaCode === parseInt(selectedAreaCode.value));
});

// 하드코딩된 지역 데이터 (임시 - API가 준비되면 제거)
const AREA_DATA = [
  { areaCode: 1, name: '서울' },
  { areaCode: 2, name: '인천' },
  { areaCode: 3, name: '대전' },
  { areaCode: 4, name: '대구' },
  { areaCode: 5, name: '광주' },
  { areaCode: 6, name: '부산' },
  { areaCode: 7, name: '울산' },
  { areaCode: 8, name: '세종특별자치시' },
  { areaCode: 31, name: '경기도' },
  { areaCode: 32, name: '강원도' },
  { areaCode: 33, name: '충청북도' },
  { areaCode: 34, name: '충청남도' },
  { areaCode: 35, name: '경상북도' },
  { areaCode: 36, name: '경상남도' },
  { areaCode: 37, name: '전라북도' },
  { areaCode: 38, name: '전라남도' },
  { areaCode: 39, name: '제주도' }
];

const SIGUNGU_DATA = [
  // 서울
  { areaCode: 1, sigunguCode: 1, name: '강남구' },
  { areaCode: 1, sigunguCode: 2, name: '강동구' },
  { areaCode: 1, sigunguCode: 3, name: '강북구' },
  { areaCode: 1, sigunguCode: 4, name: '강서구' },
  { areaCode: 1, sigunguCode: 5, name: '관악구' },
  { areaCode: 1, sigunguCode: 6, name: '광진구' },
  { areaCode: 1, sigunguCode: 7, name: '구로구' },
  { areaCode: 1, sigunguCode: 8, name: '금천구' },
  { areaCode: 1, sigunguCode: 9, name: '노원구' },
  { areaCode: 1, sigunguCode: 10, name: '도봉구' },
  { areaCode: 1, sigunguCode: 11, name: '동대문구' },
  { areaCode: 1, sigunguCode: 12, name: '동작구' },
  { areaCode: 1, sigunguCode: 13, name: '마포구' },
  { areaCode: 1, sigunguCode: 14, name: '서대문구' },
  { areaCode: 1, sigunguCode: 15, name: '서초구' },
  { areaCode: 1, sigunguCode: 16, name: '성동구' },
  { areaCode: 1, sigunguCode: 17, name: '성북구' },
  { areaCode: 1, sigunguCode: 18, name: '송파구' },
  { areaCode: 1, sigunguCode: 19, name: '양천구' },
  { areaCode: 1, sigunguCode: 20, name: '영등포구' },
  { areaCode: 1, sigunguCode: 21, name: '용산구' },
  { areaCode: 1, sigunguCode: 22, name: '은평구' },
  { areaCode: 1, sigunguCode: 23, name: '종로구' },
  { areaCode: 1, sigunguCode: 24, name: '중구' },
  { areaCode: 1, sigunguCode: 25, name: '중랑구' },
  
  // 경기도 (일부만)
  { areaCode: 31, sigunguCode: 1, name: '가평군' },
  { areaCode: 31, sigunguCode: 2, name: '고양시' },
  { areaCode: 31, sigunguCode: 3, name: '과천시' },
  { areaCode: 31, sigunguCode: 4, name: '광명시' },
  { areaCode: 31, sigunguCode: 5, name: '광주시' },
  { areaCode: 31, sigunguCode: 6, name: '구리시' },
  { areaCode: 31, sigunguCode: 7, name: '군포시' },
  { areaCode: 31, sigunguCode: 8, name: '김포시' },
  { areaCode: 31, sigunguCode: 9, name: '남양주시' },
  { areaCode: 31, sigunguCode: 10, name: '동두천시' },
  { areaCode: 31, sigunguCode: 11, name: '부천시' },
  { areaCode: 31, sigunguCode: 12, name: '성남시' },
  { areaCode: 31, sigunguCode: 13, name: '수원시' },
  { areaCode: 31, sigunguCode: 14, name: '시흥시' },
  { areaCode: 31, sigunguCode: 15, name: '안산시' },
  { areaCode: 31, sigunguCode: 16, name: '안성시' },
  { areaCode: 31, sigunguCode: 17, name: '안양시' },
  { areaCode: 31, sigunguCode: 18, name: '양주시' },
  { areaCode: 31, sigunguCode: 19, name: '여주시' },
  { areaCode: 31, sigunguCode: 20, name: '오산시' },
  { areaCode: 31, sigunguCode: 21, name: '용인시' },
  { areaCode: 31, sigunguCode: 22, name: '의왕시' },
  { areaCode: 31, sigunguCode: 23, name: '의정부시' },
  { areaCode: 31, sigunguCode: 24, name: '이천시' },
  { areaCode: 31, sigunguCode: 25, name: '파주시' },
  { areaCode: 31, sigunguCode: 26, name: '평택시' },
  { areaCode: 31, sigunguCode: 27, name: '포천시' },
  { areaCode: 31, sigunguCode: 28, name: '하남시' },
  { areaCode: 31, sigunguCode: 29, name: '화성시' },
  
  // 부산
  { areaCode: 6, sigunguCode: 1, name: '해운대구' },
  { areaCode: 6, sigunguCode: 2, name: '중구' },
  { areaCode: 6, sigunguCode: 3, name: '동구' },
  { areaCode: 6, sigunguCode: 4, name: '영도구' },
  { areaCode: 6, sigunguCode: 5, name: '부산진구' },
  { areaCode: 6, sigunguCode: 6, name: '동래구' },
  { areaCode: 6, sigunguCode: 7, name: '남구' },
  { areaCode: 6, sigunguCode: 8, name: '북구' },
  { areaCode: 6, sigunguCode: 9, name: '강서구' },
  { areaCode: 6, sigunguCode: 10, name: '금정구' },
  { areaCode: 6, sigunguCode: 11, name: '기장군' },
  { areaCode: 6, sigunguCode: 12, name: '연제구' },
  { areaCode: 6, sigunguCode: 13, name: '수영구' },
  { areaCode: 6, sigunguCode: 14, name: '사상구' },
  { areaCode: 6, sigunguCode: 15, name: '사하구' },
  { areaCode: 6, sigunguCode: 16, name: '서구' },
  
  // 제주도
  { areaCode: 39, sigunguCode: 1, name: '서귀포시' },
  { areaCode: 39, sigunguCode: 2, name: '제주시' }
];

// 임시 여행지 데이터
const SAMPLE_PLACES = [
  {
    placeId: 1,
    title: '경복궁',
    address1: '서울특별시 종로구',
    address2: '사직로 161',
    areaCode: 1,
    sigunguCode: 23,
    telephone: '02-3700-3900',
    firstImageUrl: 'https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg',
    category1: 'A02',
    category2: '',
    category3: ''
  },
  {
    placeId: 2,
    title: '해운대해수욕장',
    address1: '부산광역시 해운대구',
    address2: '해운대해변로 264',
    areaCode: 6,
    sigunguCode: 1,
    telephone: '051-749-4000',
    firstImageUrl: 'https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg',
    category1: 'A01',
    category2: '',
    category3: ''
  },
  {
    placeId: 3,
    title: '성산일출봉',
    address1: '제주특별자치도 서귀포시',
    address2: '성산읍 일출로 284-12',
    areaCode: 39,
    sigunguCode: 1,
    telephone: '064-783-0959',
    firstImageUrl: 'https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg',
    category1: 'A01',
    category2: '',
    category3: ''
  },
  {
    placeId: 4,
    title: '명동',
    address1: '서울특별시 중구',
    address2: '명동길',
    areaCode: 1,
    sigunguCode: 24,
    telephone: '02-3396-5656',
    firstImageUrl: 'https://i.pinimg.com/736x/7d/43/ff/7d43ff51a9f3ecedda6f12a43abdb5d8.jpg',
    category1: 'A04',
    category2: '',
    category3: ''
  },
  {
    placeId: 5,
    title: '부산타워',
    address1: '부산광역시 중구',
    address2: '용두산길 37-55',
    areaCode: 6,
    sigunguCode: 2,
    telephone: '051-245-1744',
    firstImageUrl: 'https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg',
    category1: 'A02',
    category2: '',
    category3: ''
  },
  {
    placeId: 6,
    title: '한라산',
    address1: '제주특별자치도 제주시',
    address2: '1100로 2070-61',
    areaCode: 39,
    sigunguCode: 2,
    telephone: '064-713-9950',
    firstImageUrl: 'https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg',
    category1: 'A01',
    category2: '',
    category3: ''
  },
  {
    placeId: 7,
    title: 'N서울타워',
    address1: '서울특별시 용산구',
    address2: '남산공원길 105',
    areaCode: 1,
    sigunguCode: 21,
    telephone: '02-3455-9277',
    firstImageUrl: 'https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg',
    category1: 'A02',
    category2: '',
    category3: ''
  },
  {
    placeId: 8,
    title: '광안리해수욕장',
    address1: '부산광역시 수영구',
    address2: '광안해변로 219',
    areaCode: 6,
    sigunguCode: 13,
    telephone: '051-610-4123',
    firstImageUrl: 'https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg',
    category1: 'A01',
    category2: '',
    category3: ''
  }
];

// API 호출 함수들
async function fetchAreas() {
  try {
    // 실제 API 호출 시도
    const response = await axios.get(`${API_BASE_URL}/api/areas`);
    areas.value = response.data;
    console.log('지역 API 호출 성공');
  } catch (error) {
    console.warn('지역 API 호출 실패, 임시 데이터 사용:', error.message);
    // 에러 발생 시 하드코딩된 데이터 사용
    areas.value = AREA_DATA;
  }
}

async function fetchSigungus() {
  try {
    // 실제 API 호출 시도
    const response = await axios.get(`${API_BASE_URL}/api/sigungus`);
    sigungus.value = response.data;
    console.log('시군구 API 호출 성공');
  } catch (error) {
    console.warn('시군구 API 호출 실패, 임시 데이터 사용:', error.message);
    // 에러 발생 시 하드코딩된 데이터 사용
    sigungus.value = SIGUNGU_DATA;
  }
}

async function fetchPlaces() {
  try {
    isLoading.value = true;
    error.value = '';
    
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
    };

    // 필터 조건 추가
    if (selectedAreaCode.value) {
      params.areaCode = selectedAreaCode.value;
    }
    if (selectedSigunguCode.value) {
      params.sigunguCode = selectedSigunguCode.value;
    }
    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim();
    }

    console.log('여행지 API 호출 시도:', `${API_BASE_URL}/api/travel/search`, params);

    // 실제 API 호출 시도
    const response = await axios.get(`${API_BASE_URL}/api/travel/search`, { params });
    
    console.log('여행지 API 응답:', response.data);
    
    // 페이지네이션 응답 구조에 따라 조정
    if (response.data.content) {
      // Spring Page 응답인 경우
      places.value = response.data.content;
      totalElements.value = response.data.totalElements;
    } else if (Array.isArray(response.data)) {
      // 단순 배열 응답인 경우
      places.value = response.data;
      totalElements.value = response.data.length;
    } else {
      places.value = [];
      totalElements.value = 0;
    }
    
    console.log('여행지 API 호출 성공, 결과 수:', places.value.length);
  } catch (error) {
    console.warn('여행지 API 호출 실패, 임시 데이터 사용:', error.message);
    
    // 에러 발생 시 임시 데이터 사용
    let filteredPlaces = [...SAMPLE_PLACES];
    
    // 필터링 적용
    if (selectedAreaCode.value) {
      filteredPlaces = filteredPlaces.filter(place => place.areaCode === parseInt(selectedAreaCode.value));
    }
    if (selectedSigunguCode.value) {
      filteredPlaces = filteredPlaces.filter(place => place.sigunguCode === parseInt(selectedSigunguCode.value));
    }
    if (searchKeyword.value.trim()) {
      const keyword = searchKeyword.value.trim().toLowerCase();
      filteredPlaces = filteredPlaces.filter(place => 
        place.title.toLowerCase().includes(keyword) ||
        place.address1.toLowerCase().includes(keyword) ||
        place.address2?.toLowerCase().includes(keyword)
      );
    }
    
    // 페이지네이션 적용
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    
    places.value = filteredPlaces.slice(startIndex, endIndex);
    totalElements.value = filteredPlaces.length;
  } finally {
    isLoading.value = false;
  }
}

// 초기 데이터 로드
async function fetchData() {
  try {
    error.value = '';
    isLoading.value = true;
    
    console.log('초기 데이터 로드 시작');
    console.log('API_BASE_URL:', API_BASE_URL);
    
    await Promise.all([
      fetchAreas(),
      fetchSigungus()
    ]);
    
    await fetchPlaces();
    
    console.log('초기 데이터 로드 완료');
  } catch (err) {
    console.error('초기 데이터 로드 실패:', err);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    isLoading.value = false;
  }
}

// 이벤트 핸들러
function onAreaChange() {
  selectedSigunguCode.value = '';
  currentPage.value = 1;
  fetchPlaces();
}

function onSigunguChange() {
  currentPage.value = 1;
  fetchPlaces();
}

function onSearchInput() {
  // 디바운스 효과를 위해 타이머 사용
  clearTimeout(window.searchTimer);
  window.searchTimer = setTimeout(() => {
    if (searchKeyword.value.length === 0 || searchKeyword.value.length >= 2) {
      searchPlaces();
    }
  }, 500);
}

function searchPlaces() {
  currentPage.value = 1;
  fetchPlaces();
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchPlaces();
  }
}

function handleImageError(event) {
  event.target.src = '/api/placeholder/300/200';
}

// 헬퍼 함수들
function getAreaName(areaCode) {
  const area = areas.value.find(a => a.areaCode === areaCode);
  return area ? area.name : '';
}

function getSigunguName(areaCode, sigunguCode) {
  const sigungu = sigungus.value.find(s => s.areaCode === areaCode && s.sigunguCode === sigunguCode);
  return sigungu ? sigungu.name : '';
}

function getCategoryName(category1, category2, category3) {
  // 카테고리 코드를 실제 이름으로 변환하는 로직
  const categoryMap = {
    'A01': '자연',
    'A02': '인문(문화/예술/역사)',
    'A03': '레포츠',
    'A04': '쇼핑',
    'A05': '음식',
    // 필요에 따라 더 추가
  };
  
  return categoryMap[category1] || '기타';
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  console.log('컴포넌트 마운트됨');
  fetchData();
});

// 페이지 변경 감지
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped>
/* 기존 스타일 유지하면서 추가 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.info-container {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 6rem;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

/* 로딩 스타일 */
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

/* 에러 메시지 스타일 */
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

.retry-button:hover {
  background-color: #8470d7;
}

/* 검색 입력 그룹 */
.search-input-group {
  display: flex;
  gap: 0.5rem;
}

.search-button {
  padding: 0.6rem 1rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
}

.search-button:hover {
  background-color: #8470d7;
}

/* 기존 스타일들... (그라데이션, 헤더, 필터 등) */
.gradient-circle {
  position: absolute;
  border-radius: 65% 35% 60% 40% / 60% 40% 60% 40%;
  z-index: 0;
  transform: skew(-5deg, -10deg);
  transition: background 0.5s ease, opacity 0.5s ease;
}

.circle1 {
  top: -10%;
  left: -5%;
  width: 45vw;
  height: 35vw;
  background: radial-gradient(ellipse, rgba(213, 224, 251, 0.9) 0%, rgba(213, 224, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-15deg);
}

.circle2 {
  bottom: -15%;
  right: -10%;
  width: 50vw;
  height: 38vw;
  background: radial-gradient(ellipse, rgba(213, 237, 251, 0.9) 0%, rgba(213, 237, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(10deg);
}

.circle3 {
  top: 20%;
  right: 10%;
  width: 35vw;
  height: 25vw;
  background: radial-gradient(ellipse, rgba(213, 222, 251, 0.85) 0%, rgba(213, 222, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-8deg);
}

.circle4 {
  bottom: 30%;
  left: 5%;
  width: 28vw;
  height: 22vw;
  background: radial-gradient(ellipse, rgba(213, 232, 251, 0.9) 0%, rgba(213, 232, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(12deg);
}

.circle5 {
  top: 45%;
  left: 30%;
  width: 40vw;
  height: 28vw;
  background: radial-gradient(ellipse, rgba(213, 224, 251, 0.85) 0%, rgba(213, 224, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-5deg);
}

.circle6 {
  bottom: 50%;
  right: 30%;
  width: 45vw;
  height: 32vw;
  background: radial-gradient(ellipse, rgba(213, 237, 251, 0.8) 0%, rgba(213, 237, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(15deg);
}

.circle7 {
  bottom: 10%;
  left: 40%;
  width: 42vw;
  height: 30vw;
  background: radial-gradient(ellipse, rgba(213, 232, 251, 0.85) 0%, rgba(213, 232, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-12deg);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
  padding: 1rem 0;
  border-bottom: 0.8px solid rgba(0, 0, 0, 0.2);
}

.logo {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
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
}

.menu-link:hover, .menu-link.active {
  color: #9581e8;
  background: none;
}

.menu-link.active {
  font-weight: 600;
}

.search-icon {
  font-size: 1.2rem;
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

.main-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.filter-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 140px;
}

.filter-group label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.filter-select {
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.filter-select:focus {
  border-color: #9581e8;
  outline: none;
  box-shadow: 0 0 0 2px rgba(149, 129, 232, 0.2);
}

.filter-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.place-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.place-card {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.place-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.place-image {
  height: 200px;
  overflow: hidden;
}

.place-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.place-card:hover .place-image img {
  transform: scale(1.1);
}

.place-info {
  padding: 1rem;
}

.place-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
}

.place-location {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.location-icon {
  color: #9581e8;
}

.place-address {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 0.8rem;
}

.place-meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #666;
}

.place-phone {
  color: #2ecc71;
}

.place-category {
  color: #9581e8;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
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

.footer {
  background-color: #f8f9fa;
  padding: 2rem 0;
  margin-top: 3rem;
  border-top: 1px solid #eee;
  position: relative;
  z-index: 1;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.copyright {
  color: #999;
  font-size: 0.9rem;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .info-container {
    padding: 2rem 4rem;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-group {
    width: 100%;
    max-width: 300px;
  }
  
  .place-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .info-container {
    padding: 2rem 2rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .menu-items {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .place-list {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>