<template>
  <div class="trip-planner-container">
    <!-- 헤더 -->
   

    <!-- 메인 콘텐츠 영역 -->
    <div class="main-content">
      <!-- 왼쪽 여행 계획 패널 -->
      <div class="plan-panel">
        <!-- 여행 날짜 선택 섹션 -->
        <div class="date-selection-section">
          <h3 class="section-title">여행 기간</h3>
          <div class="date-inputs">
            <div class="date-input-group">
              <label>가는 날</label>
              <input type="date" v-model="startDate" @change="calculateDuration">
            </div>
            <div class="date-divider">→</div>
            <div class="date-input-group">
              <label>오는 날</label>
              <input type="date" v-model="endDate" @change="calculateDuration">
            </div>
          </div>
          <div class="trip-duration">
            <span v-if="tripDuration > 0">{{ tripDuration }}박 {{ tripDuration + 1 }}일</span>
          </div>
        </div>

        <!-- 날짜 탭 -->
        <div class="date-tabs">
          <button 
            v-for="(day, index) in generateDays()" 
            :key="index"
            class="date-tab"
            :class="{ active: selectedDay === index }"
            @click="selectDay(index)"
          >
            day{{ index + 1 }}
            <span class="day-date">{{ formatDayDate(index) }}</span>
          </button>
        </div>

        <!-- 선택된 장소 목록 -->
        <div class="selected-places">
          <div 
            v-for="(place, index) in getSelectedPlacesByDay(selectedDay)" 
            :key="place.placeId"
            class="place-item"
            @click="selectPlace(place)"
          >
            <div class="place-number">{{ index + 1 }}</div>
            <div class="place-content">
              <div class="place-name">{{ place.title }}</div>
              <div class="place-category">{{ place.address1 }}</div>
              <div class="place-distance" v-if="index > 0">{{ place.telephone || '' }}</div>
            </div>
            <button @click.stop="removePlaceFromDay(selectedDay, index)" class="remove-place-btn">×</button>
          </div>

          <!-- 장소 추가 버튼 -->
          <div class="add-place-container">
            <button class="add-place-button" @click="openSearchModal">
              <span class="add-place-icon">+</span>
              <span>장소 추가하기</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 오른쪽 지도 패널 -->
      <div class="map-panel">
        <div class="map-container" ref="mapContainer">
          <!-- 지도가 표시될 곳 -->
          <div class="map-overlay-text" v-if="selectedPlaces.flat().length === 0">
            장소를 추가하면 지도에 표시됩니다
          </div>
        </div>
      </div>
    </div>

    <!-- 장소 검색 모달 -->
    <div class="search-modal" v-if="isSearchModalOpen">
      <div class="modal-content">
        <div class="modal-header">
          <h3>장소 추가하기</h3>
          <button class="close-button" @click="closeSearchModal">&times;</button>
        </div>

        <!-- 필터 섹션 -->
        <div class="modal-filters">
          <div class="filter-row">
            <div class="filter-group">
              <label>지역 선택</label>
              <select v-model="selectedAreaCode" @change="onAreaChange" class="filter-select">
                <option value="">전체 지역</option>
                <option v-for="area in areas" :key="area.areaCode" :value="area.areaCode">
                  {{ area.name }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>시/군/구</label>
              <select v-model="selectedSigunguCode" @change="onSigunguChange" class="filter-select" :disabled="!selectedAreaCode">
                <option value="">전체 시/군/구</option>
                <option v-for="sigungu in filteredSigungus" :key="sigungu.sigunguCode" :value="sigungu.sigunguCode">
                  {{ sigungu.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label>카테고리</label>
              <select v-model="selectedCategory" @change="onCategoryChange" class="filter-select">
                <option value="">전체 카테고리</option>
                <option v-for="category in categories" :key="category.code" :value="category.code">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- 검색 입력 -->
        <div class="modal-search">
          <input 
            type="text" 
            v-model="modalSearchQuery" 
            placeholder="여행지, 맛집, 액티비티 검색..." 
            class="modal-search-input"
            @keyup.enter="searchInModal"
          >
          <button class="modal-search-button" @click="searchInModal" :disabled="isSearching">
            {{ isSearching ? '검색중...' : '검색' }}
          </button>
        </div>

        <!-- 검색 결과 -->
        <div class="modal-results">
          <div v-if="isSearching" class="loading">
            <div class="loading-spinner"></div>
            <p>검색 중...</p>
          </div>
          <div v-else-if="searchResults.length === 0 && hasSearched" class="no-results">
            <div class="no-results-icon">🔍</div>
            <p>검색 결과가 없습니다.</p>
            <small>다른 지역이나 키워드로 검색해보세요.</small>
          </div>
          <div v-else-if="!hasSearched" class="search-prompt">
            <div class="search-prompt-icon">📍</div>
            <p>지역을 선택하거나 키워드를 입력해서</p>
            <p>원하는 장소를 검색해보세요!</p>
          </div>
          <div 
            v-else
            v-for="place in searchResults" 
            :key="place.placeId"
            class="modal-result-item"
            @click="addPlaceToDay(place, selectedDay)"
          >
            <div class="modal-result-image">
              <img :src="place.firstImageUrl || 'https://placehold.co/80x80?text=No+Image'" :alt="place.title" @error="handleImageError">
            </div>
            <div class="modal-result-content">
              <div class="modal-result-name">{{ place.title }}</div>
              <div class="modal-result-category">
                <span class="category-badge">{{ getCategoryName(place.category1) }}</span>
                {{ place.address1 }} {{ place.address2 || '' }}
              </div>
              <div class="modal-result-phone" v-if="place.telephone">📞 {{ place.telephone }}</div>
            </div>
            <div class="add-place-icon">+</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 상태 관리
const tripTitle = ref('새로운 여행 계획');
const startDate = ref('');
const endDate = ref('');
const tripDuration = ref(0);
const selectedDay = ref(0);
const modalSearchQuery = ref('');
const isSearchModalOpen = ref(false);
const mapContainer = ref(null);
const isSearching = ref(false);
const hasSearched = ref(false);

// 지역 관련
const selectedAreaCode = ref('');
const selectedSigunguCode = ref('');
const selectedCategory = ref('');
const areas = ref([]);
const sigungus = ref([]);

// 카테고리 정의
const categories = ref([
  { code: 'A01', name: '자연' },
  { code: 'A02', name: '인문(문화/예술/역사)' },
  { code: 'A03', name: '레포츠' },
  { code: 'A04', name: '쇼핑' },
  { code: 'A05', name: '음식' }
]);

// 날짜별 선택된 장소들
const selectedPlaces = ref([]);

// 검색 결과
const searchResults = ref([]);

// 계산된 속성
const filteredSigungus = computed(() => {
  if (!selectedAreaCode.value) return [];
  return sigungus.value.filter(sigungu => sigungu.areaCode === parseInt(selectedAreaCode.value));
});

// API 호출 함수들
async function fetchAreas() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/region`);
    areas.value = response.data;
  } catch (error) {
    console.error('지역 API 호출 실패:', error);
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
        console.warn(`지역 ${area.areaCode} 시군구 API 호출 실패:`, error);
      }
    }
    sigungus.value = allSigungus;
  } catch (error) {
    console.error('시군구 API 호출 실패:', error);
  }
}

async function searchPlacesAPI() {
  try {
    isSearching.value = true;
    hasSearched.value = true;
    
    const params = {
      page: 0,
      size: 20,
    };

    if (selectedAreaCode.value) {
      params.areaCode = selectedAreaCode.value;
    }
    if (selectedSigunguCode.value) {
      params.sigunguCode = selectedSigunguCode.value;
    }
    if (modalSearchQuery.value.trim()) {
      params.keyword = modalSearchQuery.value.trim();
    }

    const response = await axios.get(`${API_BASE_URL}/api/travel/search`, { params });
    
    if (response.data.content) {
      searchResults.value = response.data.content;
    } else if (Array.isArray(response.data)) {
      searchResults.value = response.data;
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error('여행지 API 호출 실패:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
}

// 날짜 계산 함수
function calculateDuration() {
  if (!startDate.value || !endDate.value) {
    tripDuration.value = 0;
    return;
  }
  
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  tripDuration.value = diffDays;
  initSelectedPlaces();
}

// 날짜별 선택된 장소 초기화
function initSelectedPlaces() {
  selectedPlaces.value = Array(tripDuration.value + 1).fill().map(() => []);
}

// 날짜 버튼 생성 함수
function generateDays() {
  return Array(tripDuration.value + 1).fill().map((_, i) => i + 1);
}

// 날짜 포맷 함수
function formatDayDate(dayIndex) {
  if (!startDate.value) return '';
  
  const dayDate = new Date(startDate.value);
  dayDate.setDate(dayDate.getDate() + dayIndex);
  
  return `${dayDate.getMonth() + 1}.${dayDate.getDate()}`;
}

// 날짜 선택 함수
function selectDay(dayIndex) {
  selectedDay.value = dayIndex;
}

// 지역 변경 이벤트
function onAreaChange() {
  selectedSigunguCode.value = '';
  if (hasSearched.value) {
    searchPlacesAPI();
  }
}

function onSigunguChange() {
  if (hasSearched.value) {
    searchPlacesAPI();
  }
}

function onCategoryChange() {
  if (hasSearched.value) {
    searchPlacesAPI();
  }
}

// 모달에서 검색 함수
function searchInModal() {
  if (!modalSearchQuery.value.trim() && !selectedAreaCode.value && !selectedSigunguCode.value && !selectedCategory.value) {
    alert('검색어를 입력하거나 지역/카테고리를 선택해주세요.');
    return;
  }
  searchPlacesAPI();
}

// 장소 추가 모달 열기
function openSearchModal() {
  isSearchModalOpen.value = true;
  hasSearched.value = false;
  searchResults.value = [];
  modalSearchQuery.value = '';
  selectedAreaCode.value = '';
  selectedSigunguCode.value = '';
  selectedCategory.value = '';
}

// 장소 추가 모달 닫기
function closeSearchModal() {
  isSearchModalOpen.value = false;
}

// 장소를 특정 날짜에 추가
function addPlaceToDay(place, dayIndex) {
  const isDuplicate = selectedPlaces.value[dayIndex].some(p => p.placeId === place.placeId);
  
  if (!isDuplicate) {
    selectedPlaces.value[dayIndex].push({ ...place });
    closeSearchModal();
    addMarkerToMap(place);
  } else {
    alert('이미 추가된 장소입니다.');
  }
}

// 장소 제거
function removePlaceFromDay(dayIndex, placeIndex) {
  if (confirm('이 장소를 제거하시겠습니까?')) {
    selectedPlaces.value[dayIndex].splice(placeIndex, 1);
  }
}

// 날짜별 선택된 장소들 가져오기
function getSelectedPlacesByDay(dayIndex) {
  return selectedPlaces.value[dayIndex] || [];
}

// 장소 선택 함수
function selectPlace(place) {
  console.log('Selected place:', place);
}

// 지도에 마커 추가하는 함수
function addMarkerToMap(place) {
  console.log('Added marker for:', place.title);
}

// 이미지 에러 핸들링
function handleImageError(event) {
  event.target.src = 'https://placehold.co/80x80?text=No+Image';
}

// 카테고리 이름 가져오기
function getCategoryName(categoryCode) {
  const category = categories.value.find(c => c.code === categoryCode);
  return category ? category.name : '기타';
}

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  // 오늘 날짜를 기본값으로 설정
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  startDate.value = today.toISOString().split('T')[0];
  endDate.value = tomorrow.toISOString().split('T')[0];
  
  calculateDuration();
  
  // 지역 데이터 로드
  await fetchAreas();
  await fetchSigungus();
  
  console.log('Map initialized', mapContainer.value);
});

// 날짜가 변경될 때마다 기간 재계산
watch([startDate, endDate], () => {
  calculateDuration();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

.trip-planner-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

/* 헤더 스타일 */


.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.logo-icon {
  color: #9581e8;
  background-color: #ffefd5;
  padding: 2px 6px;
  border-radius: 50%;
  margin-right: 2px;
}

.trip-title-container {
  flex: 1;
  margin: 0 2rem;
}

.trip-title-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.save-button, .share-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-button {
  background-color: #9581e8;
  color: white;
}

.save-button:hover {
  background-color: #8470d7;
}

.share-button {
  background-color: #f0f0f0;
  color: #333;
}

.share-button:hover {
  background-color: #e0e0e0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.profile-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #9581e8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

/* 메인 콘텐츠 영역 */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 왼쪽 계획 패널 */
.plan-panel {
  width: 360px;
  height: 100%;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 날짜 선택 섹션 */
.date-selection-section {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.date-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.date-input-group label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.date-input-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.date-divider {
  color: #666;
  margin-top: 1rem;
  font-size: 1.2rem;
}

.trip-duration {
  text-align: center;
  padding: 0.5rem;
  background-color: #f0f4ff;
  border-radius: 4px;
  color: #586bad;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 날짜 탭 */
.date-tabs {
  display: flex;
  overflow-x: auto;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.date-tab {
  flex: 1;
  min-width: 80px;
  padding: 0.7rem 0.5rem;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-tab.active {
  background-color: #f0f4ff;
  color: #586bad;
  font-weight: 600;
}

.day-date {
  font-size: 0.75rem;
  margin-top: 0.2rem;
  color: #999;
}

.date-tab.active .day-date {
  color: #586bad;
}

/* 선택된 장소 목록 */
.selected-places {
  flex: 1;
  padding: 1rem;
}

.place-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.place-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.place-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #9581e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  margin-right: 0.8rem;
  flex-shrink: 0;
}

.place-content {
  flex: 1;
}

.place-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
}

.place-category {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.place-distance {
  font-size: 0.8rem;
  color: #586bad;
}

.remove-place-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff6b6b;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 장소 추가 버튼 */
.add-place-container {
  padding: 1rem 0;
}

.add-place-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-place-button:hover {
  background-color: #f0f0f0;
  border-color: #bbb;
}

.add-place-icon {
  font-size: 1.2rem;
  color: #9581e8;
  font-weight: 600;
}

/* 오른쪽 지도 패널 */
.map-panel {
  flex: 1;
  height: 100%;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
  background-color: #e6e6e6;
  position: relative;
}

.map-overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #888;
  font-size: 1rem;
  text-align: center;
}

/* 검색 모달 */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 700px;
  max-width: 90%;
  max-height: 90vh;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.modal-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #e9ecef;
}

/* 필터 섹션 */
.modal-filters {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #fafafa;
}

.filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
}

.filter-select {
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #9581e8;
  box-shadow: 0 0 0 2px rgba(149, 129, 232, 0.1);
}

.filter-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #999;
}

/* 검색 입력 */
.modal-search {
  display: flex;
  padding: 1.5rem;
  gap: 0.8rem;
  border-bottom: 1px solid #eee;
}

.modal-search-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.modal-search-input:focus {
  outline: none;
  border-color: #9581e8;
  box-shadow: 0 0 0 2px rgba(149, 129, 232, 0.1);
}

.modal-search-button {
  padding: 0.8rem 1.5rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.modal-search-button:hover:not(:disabled) {
  background-color: #8470d7;
}

.modal-search-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 검색 결과 */
.modal-results {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  max-height: 50vh;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #9581e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-results, .search-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #888;
  text-align: center;
}

.no-results-icon, .search-prompt-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-results p, .search-prompt p {
  margin-bottom: 0.5rem;
}

.modal-result-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  position: relative;
}

.modal-result-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-result-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
}

.modal-result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-result-content {
  flex: 1;
}

.modal-result-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.modal-result-category {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-badge {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.modal-result-phone {
  font-size: 0.8rem;
  color: #2ecc71;
}

.add-place-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #9581e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
}

/* 미디어 쿼리 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .plan-panel {
    width: 100%;
    height: 50%;
  }
  
  .map-panel {
    height: 50%;
  }
  
  .date-inputs {
    flex-direction: column;
  }
  
  .filter-row {
    flex-direction: column;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .modal-search {
    flex-direction: column;
  }
}
</style>