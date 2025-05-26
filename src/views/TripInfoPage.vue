<template>
  <div class="info-container">

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

      <!-- 메인 콘텐츠 -->
      <div v-if="!isLoading && !error">

        <!-- 필터 섹션 -->
        <div class="filter-section">
          <!-- 지역 및 카테고리 필터 -->
          <div class="filter-row">
            <div class="filter-group">
              <label for="area-select">지역</label>
              <select 
                id="area-select" 
                v-model="selectedAreaCode" 
                @change="onAreaChange"
                class="filter-select-small"
              >
                <option value="">전체 지역</option>
                <option v-for="area in areas" :key="area.areaCode" :value="area.areaCode">
                  {{ area.name }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="sigungu-select">시/군/구</label>
              <select 
                id="sigungu-select" 
                v-model="selectedSigunguCode"
                @change="onSigunguChange"
                class="filter-select-small"
                :disabled="!selectedAreaCode"
              >
                <option value="">전체</option>
                <option v-for="sigungu in filteredSigungus" :key="sigungu.sigunguCode" :value="sigungu.sigunguCode">
                  {{ sigungu.name }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label for="main-category-select">여행테마</label>
              <select 
                id="main-category-select"
                v-model="selectedMainCategory" 
                @change="onMainCategoryChange"
                class="filter-select-small"
              >
                <option value="">전체 테마</option>
                <option v-for="category in categories" :key="category.category" :value="category.category">
                  {{ category.categoryName }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="middle-category-select">세부분류</label>
              <select 
                id="middle-category-select"
                v-model="selectedMiddleCategory" 
                @change="onMiddleCategoryChange"
                class="filter-select-small"
                :disabled="!selectedMainCategory"
              >
                <option value="">전체</option>
                <option v-for="category in middleCategories" :key="category.category" :value="category.category">
                  {{ category.categoryName }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="sub-category-select">상세구분</label>
              <select 
                id="sub-category-select"
                v-model="selectedSubCategory" 
                @change="onSubCategoryChange"
                class="filter-select-small"
                :disabled="!selectedMiddleCategory"
              >
                <option value="">전체</option>
                <option v-for="category in subCategories" :key="category.category" :value="category.category">
                  {{ category.categoryName }}
                </option>
              </select>
            </div>

            <!-- 검색 입력 -->
            <div class="filter-group search-group">
              <label for="search-input">검색</label>
              <div class="search-input-group">
                <input 
                  id="search-input"
                  type="text" 
                  v-model="searchKeyword" 
                  @input="onSearchInput"
                  placeholder="여행지명 검색..."
                  class="filter-select-small"
                >
                <button @click="searchPlaces" class="search-button">검색</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 검색 결과 없음 -->
        <div v-if="places.length === 0 && !isLoading" class="no-results">
          <p v-if="hasSearchConditions">
            검색 조건에 맞는 여행지가 없습니다.
          </p>
          <p v-else>
            등록된 여행지가 없습니다.
          </p>
        </div>
        
        <!-- 여행지 리스트 -->
        <div class="place-list" v-else>
          <div 
            v-for="place in paginatedPlaces" 
            :key="place.placeId" 
            class="place-card"
            @click="navigateToDetail(place.placeId)"
          >
            <div class="place-image">
              <img 
                :src="place.firstImageUrl || 'https://placehold.co/300x200?text=No+Image'" 
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
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 상태 관리
const selectedAreaCode = ref('');
const selectedSigunguCode = ref('');
const searchKeyword = ref('');
const isLoading = ref(false);
const error = ref('');

// 카테고리 관련 상태
const categories = ref([]);
const middleCategories = ref([]);
const subCategories = ref([]);
const selectedMainCategory = ref('');
const selectedMiddleCategory = ref('');
const selectedSubCategory = ref('');

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

const paginatedPlaces = computed(() => {
  return places.value;
});

const hasSearchConditions = computed(() => {
  return selectedAreaCode.value || 
         selectedSigunguCode.value || 
         selectedMainCategory.value ||
         selectedMiddleCategory.value ||
         selectedSubCategory.value ||
         searchKeyword.value.trim();
});

// 여행지 상세 페이지로 이동하는 함수
const navigateToDetail = (placeId) => {
  router.push({
    path: '/tripdetail',
    query: { id: placeId }
  });
};

// API 호출 함수들
async function fetchAreas() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/region`);
    areas.value = response.data;
  } catch (error) {
    console.error('지역 API 호출 실패:', error.message);
    // 기본 지역 데이터 설정
    areas.value = [
      { areaCode: 1, name: '서울' },
      { areaCode: 6, name: '부산' },
      { areaCode: 31, name: '경기도' },
      { areaCode: 39, name: '제주도' }
    ];
  }
}

async function fetchSigungus() {
  try {
    const allSigungus = [];
    for (const area of areas.value) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/region/${area.areaCode}/sigungu`);
        allSigungus.push(...response.data);
      } catch (error) {
        console.warn(`지역 ${area.areaCode} 시군구 API 호출 실패:`, error.message);
      }
    }
    sigungus.value = allSigungus;
  } catch (error) {
    console.error('시군구 API 호출 실패:', error.message);
    sigungus.value = [];
  }
}

// 카테고리 관련 API 호출
async function fetchMainCategories() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/filters/categories/main`);
    categories.value = response.data;
  } catch (error) {
    console.error('대분류 카테고리 API 호출 실패:', error.message);
    // 기본 카테고리 데이터 설정
    categories.value = [
      { category: 'A01', categoryName: '자연' },
      { category: 'A02', categoryName: '인문(문화/예술/역사)' },
      { category: 'A03', categoryName: '레포츠' },
      { category: 'A04', categoryName: '쇼핑' },
      { category: 'A05', categoryName: '음식' }
    ];
  }
}

async function fetchMiddleCategories(mainCategory) {
  if (!mainCategory) {
    middleCategories.value = [];
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/filters/categories/middle`, {
      params: { mainCategory }
    });
    middleCategories.value = response.data;
  } catch (error) {
    console.error('중분류 카테고리 API 호출 실패:', error.message);
    middleCategories.value = [];
  }
}

async function fetchSubCategories(middleCategory) {
  if (!middleCategory) {
    subCategories.value = [];
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/filters/categories/sub`, {
      params: { middleCategory }
    });
    subCategories.value = response.data;
  } catch (error) {
    console.error('소분류 카테고리 API 호출 실패:', error.message);
    subCategories.value = [];
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

    if (selectedAreaCode.value) {
      params.areaCode = selectedAreaCode.value;
    }
    if (selectedSigunguCode.value) {
      params.sigunguCode = selectedSigunguCode.value;
    }
    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim();
    }

    // 가장 구체적인 카테고리 코드 사용
    let categoryCode = null;
    if (selectedSubCategory.value) {
      categoryCode = selectedSubCategory.value;
    } else if (selectedMiddleCategory.value) {
      categoryCode = selectedMiddleCategory.value;
    } else if (selectedMainCategory.value) {
      categoryCode = selectedMainCategory.value;
    }
    
    if (categoryCode) {
      params.categoryCode = categoryCode;
    }

    const response = await axios.get(`${API_BASE_URL}/api/travel/search`, { params });
    
    if (response.data.content) {
      places.value = response.data.content;
      totalElements.value = response.data.totalElements;
    } else if (Array.isArray(response.data)) {
      places.value = response.data;
      totalElements.value = response.data.length;
    } else {
      places.value = [];
      totalElements.value = 0;
    }
  } catch (error) {
    console.error('여행지 API 호출 실패:', error.message);
    places.value = [];
    totalElements.value = 0;
    error.value = '여행지 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    isLoading.value = false;
  }
}

// 초기 데이터 로드
async function fetchData() {
  try {
    error.value = '';
    isLoading.value = true;
    
    await fetchAreas();
    await fetchSigungus();
    await fetchMainCategories();
    await fetchPlaces();
  } catch (err) {
    console.error('초기 데이터 로드 실패:', err);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    isLoading.value = false;
  }
}

// 이벤트 핸들러들
function onAreaChange() {
  selectedSigunguCode.value = '';
  currentPage.value = 1;
  fetchPlaces();
}

function onSigunguChange() {
  currentPage.value = 1;
  fetchPlaces();
}

function onMainCategoryChange() {
  selectedMiddleCategory.value = '';
  selectedSubCategory.value = '';
  fetchMiddleCategories(selectedMainCategory.value);
  currentPage.value = 1;
  fetchPlaces();
}

function onMiddleCategoryChange() {
  selectedSubCategory.value = '';
  fetchSubCategories(selectedMiddleCategory.value);
  currentPage.value = 1;
  fetchPlaces();
}

function onSubCategoryChange() {
  currentPage.value = 1;
  fetchPlaces();
}

function onSearchInput() {
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
  event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
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
  // 카테고리 코드에 따른 이름 반환
  if (!category1) return '기타';
  
  // 메인 카테고리 확인
  const mainCategory = categories.value.find(c => c.category === category1);
  if (mainCategory) return mainCategory.categoryName;
  
  // 중분류 카테고리 확인
  const middleCategory = middleCategories.value.find(c => c.category === category2);
  if (middleCategory) return middleCategory.categoryName;
  
  // 소분류 카테고리 확인
  const subCategory = subCategories.value.find(c => c.category === category3);
  if (subCategory) return subCategory.categoryName;
  
  // 기본 카테고리 맵에서 확인 (fallback)
  const categoryMap = {
    'A01': '자연',
    'A02': '인문(문화/예술/역사)',
    'A03': '레포츠',
    'A04': '쇼핑',
    'A05': '음식'
  };
  
  return categoryMap[category1] || '기타';
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchData();
});

// 페이지 변경 감지
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>


<style scoped>
/* 기본 스타일 */
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

  min-height: 100vh;
  background-image: url('https://i.pinimg.com/736x/91/72/b7/9172b7886a49d6649cb05dea79f55f53.jpg');
  background-repeat: repeat;
  background-size: auto;
  background-attachment: fixed;


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
  border-top: 4px solid #48ac50;
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
  background-color: #48ac50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.retry-button:hover {
  background-color: #71ca78;
}

.main-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
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
  border-color: #48ac50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(149, 129, 232, 0.2);
}

.filter-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.search-input-group {
  display: flex;
  gap: 0.5rem;
}

.search-button {
  padding: 0.6rem 1rem;
  background-color: #48ac50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
}

.search-button:hover {
  background-color: #71ca78;
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
  /* border-radius: 15px; */
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.place-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.place-image {
  height: 150px;
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
  color: black;
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
  color: black;
}

.place-category {
  color: black;
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
  background-color: #48ac50;
  color: white;
  border-color: #48ac50;
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

.logo-icon {
  color: #48ac50;
  background-color: #ffefd5;
  padding: 2px 8px;
  border-radius: 50%;
  margin-right: 2px;
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
  
  
  .place-list {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* 필터 섹션 - 새로운 스타일 */
.filter-section {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.filter-row {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
  justify-content: space-between;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 120px;
  flex: 1;
}

.filter-group.search-group {
  min-width: 200px;
  flex: 1.5;
}

.filter-group label {
  font-size: 0.85rem;
  color: #555;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select-small {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.filter-select-small:focus {
  border-color: #48ac50;
  outline: none;
  box-shadow: 0 0 0 3px rgba(149, 129, 232, 0.15);
  transform: translateY(-1px);
}

.filter-select-small:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  color: #999;
  border-color: #e9ecef;
}

.search-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.search-input-group input {
  flex: 1;
  background-image: none !important;
  padding-right: 0.8rem !important;
}

.search-button {
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #48ac50, #71ca78);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(149, 129, 232, 0.3);
}

.search-button:hover {
  background: linear-gradient(135deg, #71ca78, #48ac50);
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(149, 129, 232, 0.4);
}

/* 반응형 추가 스타일 */
@media (max-width: 1200px) {
  .filter-row {
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  
  .filter-group {
    min-width: 100px;
  }
  
  .filter-group.search-group {
    min-width: 180px;
  }
}

@media (max-width: 1024px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
    min-width: auto;
  }
  
  .search-input-group {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .filter-section {
    padding: 1rem;
  }
  
  .filter-select-small {
    font-size: 0.85rem;
    padding: 0.5rem 0.7rem;
  }
  
  .search-button {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .filter-row {
    gap: 0.5rem;
  }
  
  .filter-select-small {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>