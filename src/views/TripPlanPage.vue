<template>
  <div class="trip-planner-container">
    <!-- 헤더 -->
    <header class="planner-header">
      <div class="logo">
        <span class="logo-icon">T</span>rip
      </div>
      <div class="trip-title-container">
        <input 
          type="text" 
          v-model="tripTitle" 
          placeholder="여행 제목을 입력하세요" 
          class="trip-title-input"
        >
      </div>
      <div class="header-actions">
        <button class="save-button">저장</button>
        <button class="share-button">공유</button>
        <div class="user-profile">
          <span>내 예약</span>
          <div class="profile-icon">
            <span class="profile-initial">T</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 여행 날짜 선택 섹션 -->
    <div class="date-selection-section">
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

    <!-- 메인 콘텐츠 영역 -->
    <div class="main-content">
      <!-- 왼쪽 여행 계획 패널 -->
      <div class="plan-panel">
        <!-- 검색 기능 -->
        <div class="search-container">
          <div class="search-input-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="여행지, 맛집, 액티비티 검색..." 
              class="search-input"
              @keyup.enter="searchPlaces"
            >
            <button class="search-button" @click="searchPlaces">검색</button>
          </div>
          <div class="search-filters">
            <button class="filter-button" :class="{ active: activeFilter === 'attraction' }" @click="setFilter('attraction')">여행지</button>
            <button class="filter-button" :class="{ active: activeFilter === 'restaurant' }" @click="setFilter('restaurant')">맛집</button>
            <button class="filter-button" :class="{ active: activeFilter === 'activity' }" @click="setFilter('activity')">액티비티</button>
            <button class="filter-button" :class="{ active: activeFilter === 'hotel' }" @click="setFilter('hotel')">숙소</button>
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
            :key="place.id"
            class="place-item"
            @click="selectPlace(place)"
          >
            <div class="place-number">{{ index + 1 }}</div>
            <div class="place-content">
              <div class="place-name">{{ place.name }}</div>
              <div class="place-category">{{ place.category }} · {{ place.subcategory }}</div>
              <div class="place-distance" v-if="index > 0">{{ place.distance }}</div>
            </div>
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
          <div class="map-overlay-text" v-if="selectedPlaces.length === 0">
            장소를 추가하면 지도에 표시됩니다
          </div>
        </div>
      </div>
    </div>

    <!-- 장소 검색 모달 -->
    <div class="search-modal" v-if="isSearchModalOpen">
      <div class="modal-content">
        <div class="modal-header">
          <h3>장소 검색</h3>
          <button class="close-button" @click="closeSearchModal">&times;</button>
        </div>
        <div class="modal-search">
          <input 
            type="text" 
            v-model="modalSearchQuery" 
            placeholder="여행지, 맛집, 액티비티 검색..." 
            class="modal-search-input"
            @keyup.enter="searchInModal"
          >
          <button class="modal-search-button" @click="searchInModal">검색</button>
        </div>
        <div class="modal-filters">
          <button class="filter-button" :class="{ active: modalActiveFilter === 'attraction' }" @click="setModalFilter('attraction')">여행지</button>
          <button class="filter-button" :class="{ active: modalActiveFilter === 'restaurant' }" @click="setModalFilter('restaurant')">맛집</button>
          <button class="filter-button" :class="{ active: modalActiveFilter === 'activity' }" @click="setModalFilter('activity')">액티비티</button>
          <button class="filter-button" :class="{ active: modalActiveFilter === 'hotel' }" @click="setModalFilter('hotel')">숙소</button>
        </div>
        <div class="modal-results">
          <div 
            v-for="place in searchResults" 
            :key="place.id"
            class="modal-result-item"
            @click="addPlaceToDay(place, selectedDay)"
          >
            <div class="modal-result-image">
              <img :src="place.imageUrl" :alt="place.name">
            </div>
            <div class="modal-result-content">
              <div class="modal-result-name">{{ place.name }}</div>
              <div class="modal-result-category">{{ place.category }} · {{ place.subcategory }}</div>
              <div class="modal-result-rating">
                <div class="stars">
                  <span v-for="i in 5" :key="i" :class="i <= place.rating ? 'star filled' : 'star'">★</span>
                </div>
                <span class="review-count">{{ place.reviewCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// 상태 관리
const tripTitle = ref('새로운 여행 계획');
const startDate = ref('');
const endDate = ref('');
const tripDuration = ref(0);
const selectedDay = ref(0);
const searchQuery = ref('');
const modalSearchQuery = ref('');
const activeFilter = ref('attraction');
const modalActiveFilter = ref('attraction');
const isSearchModalOpen = ref(false);
const mapContainer = ref(null);

// 날짜별 선택된 장소들
const selectedPlaces = ref([]);

// 검색 결과
const searchResults = ref([]);

// 가상의 장소 데이터베이스 (실제로는 API에서 가져와야 함)
const placesDatabase = [
  {
    id: 1,
    name: '텐진 지하상가',
    category: '쇼핑',
    subcategory: '텐진',
    rating: 4.5,
    reviewCount: 718,
    latitude: 33.5902,
    longitude: 130.3981,
    imageUrl: 'https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg',
    distance: '427m'
  },
  {
    id: 2,
    name: '돈키호테 텐진 본점',
    category: '쇼핑',
    subcategory: '텐진',
    rating: 4.3,
    reviewCount: 520,
    latitude: 33.5913,
    longitude: 130.3992,
    imageUrl: 'https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg',
    distance: '191m'
  },
  {
    id: 3,
    name: '규카츠 모토무라 후쿠오카 텐진 니시도리점',
    category: '음식점',
    subcategory: '텐진',
    rating: 4.7,
    reviewCount: 312,
    latitude: 33.5920,
    longitude: 130.3965,
    imageUrl: 'https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg',
    distance: '132m'
  },
  {
    id: 4,
    name: '텐진 다이모 거리',
    category: '관광명소',
    subcategory: '텐진',
    rating: 4.2,
    reviewCount: 280,
    latitude: 33.5932,
    longitude: 130.3975,
    imageUrl: 'https://i.pinimg.com/736x/7d/43/ff/7d43ff51a9f3ecedda6f12a43abdb5d8.jpg',
    distance: '1.9km'
  },
  {
    id: 5,
    name: '오호리 공원',
    category: '관광명소',
    subcategory: '시사이드 모모치',
    rating: 4.8,
    reviewCount: 650,
    latitude: 33.5854,
    longitude: 130.3784,
    imageUrl: 'https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg',
    distance: '437m'
  },
  {
    id: 6,
    name: '스타벅스 후쿠오카 오호리 공원점',
    category: '카페/디저트',
    subcategory: '시사이드 모모치',
    rating: 4.1,
    reviewCount: 210,
    latitude: 33.5845,
    longitude: 130.3792,
    imageUrl: 'https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg',
    distance: '2.6km'
  },
  {
    id: 7,
    name: '크로스 라이프 하카타 텐진',
    category: '숙소',
    subcategory: '텐진',
    rating: 4.6,
    reviewCount: 420,
    latitude: 33.5899,
    longitude: 130.4001,
    imageUrl: 'https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg',
    distance: ''
  }
];

// 날짜 계산 함수
function calculateDuration() {
  if (!startDate.value || !endDate.value) {
    tripDuration.value = 0;
    return;
  }
  
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  
  // 두 날짜의 차이를 일수로 계산
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  tripDuration.value = diffDays;
  
  // 날짜가 바뀌면 선택된 장소 배열 초기화
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
  
  // MM.DD 형식으로 반환
  return `${dayDate.getMonth() + 1}.${dayDate.getDate()}`;
}

// 날짜 선택 함수
function selectDay(dayIndex) {
  selectedDay.value = dayIndex;
}

// 검색 함수
function searchPlaces() {
  if (!searchQuery.value.trim()) return;
  
  // 실제로는 API 호출을 해야 함
  // 여기서는 가상의 데이터베이스에서 검색
  searchResults.value = placesDatabase.filter(place => {
    const matchesQuery = place.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesFilter = activeFilter.value === 'all' || mapCategoryToFilter(place.category) === activeFilter.value;
    return matchesQuery && matchesFilter;
  });
  
  // 검색 결과가 있으면 모달 열기
  if (searchResults.value.length > 0) {
    openSearchModal();
  }
}

// 카테고리를 필터로 매핑하는 함수
function mapCategoryToFilter(category) {
  const mapping = {
    '관광명소': 'attraction',
    '음식점': 'restaurant',
    '카페/디저트': 'restaurant',
    '쇼핑': 'activity',
    '숙소': 'hotel'
  };
  return mapping[category] || 'attraction';
}

// 필터 설정 함수
function setFilter(filter) {
  activeFilter.value = filter;
}

function setModalFilter(filter) {
  modalActiveFilter.value = filter;
  // 모달에서 필터를 변경하면 검색 결과 업데이트
  searchInModal();
}

// 모달에서 검색 함수
function searchInModal() {
  if (!modalSearchQuery.value.trim()) {
    // 검색어가 없으면 모든 장소 표시
    searchResults.value = placesDatabase.filter(place => {
      return modalActiveFilter.value === 'all' || mapCategoryToFilter(place.category) === modalActiveFilter.value;
    });
  } else {
    // 검색어로 필터링
    searchResults.value = placesDatabase.filter(place => {
      const matchesQuery = place.name.toLowerCase().includes(modalSearchQuery.value.toLowerCase());
      const matchesFilter = modalActiveFilter.value === 'all' || mapCategoryToFilter(place.category) === modalActiveFilter.value;
      return matchesQuery && matchesFilter;
    });
  }
}

// 장소 추가 모달 열기
function openSearchModal() {
  isSearchModalOpen.value = true;
  modalSearchQuery.value = searchQuery.value;
  modalActiveFilter.value = activeFilter.value;
  searchInModal();
}

// 장소 추가 모달 닫기
function closeSearchModal() {
  isSearchModalOpen.value = false;
}

// 장소를 특정 날짜에 추가
function addPlaceToDay(place, dayIndex) {
  // 이미 추가된 장소인지 확인
  const isDuplicate = selectedPlaces.value[dayIndex].some(p => p.id === place.id);
  
  if (!isDuplicate) {
    // 선택된 날짜의 장소 배열에 장소 추가
    selectedPlaces.value[dayIndex].push({ ...place });
    
    // 모달 닫기
    closeSearchModal();
    
    // 지도에 마커 추가
    addMarkerToMap(place);
  }
}

// 날짜별 선택된 장소들 가져오기
function getSelectedPlacesByDay(dayIndex) {
  return selectedPlaces.value[dayIndex] || [];
}

// 장소 선택 함수
function selectPlace(place) {
  // 지도에서 해당 장소 포커싱 (여기서는 콘솔 로그만)
  console.log('Selected place:', place);
  // 실제로는 지도 API를 사용하여 해당 마커로 이동
}

// 지도에 마커 추가하는 함수 (가상)
function addMarkerToMap(place) {
  // 실제로는 지도 API를 사용하여 마커 추가
  console.log('Added marker for:', place.name, 'at', place.latitude, place.longitude);
}

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  // 오늘 날짜를 기본값으로 설정
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // YYYY-MM-DD 형식으로 변환
  startDate.value = today.toISOString().split('T')[0];
  endDate.value = tomorrow.toISOString().split('T')[0];
  
  // 기간 계산
  calculateDuration();
  
  // 검색 결과 초기화
  searchResults.value = [...placesDatabase];
  
  // 실제로는 여기서 지도 API 초기화
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
.planner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.5rem;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

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

/* 날짜 선택 섹션 */
.date-selection-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.date-input-group label {
  font-size: 0.8rem;
  color: #666;
}

.date-input-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.date-divider {
  color: #666;
  margin: 0 0.5rem;
  font-size: 1.2rem;
  margin-top: 1rem;
}

.trip-duration {
  margin-left: 2rem;
  padding: 0.5rem 1rem;
  background-color: #f0f4ff;
  border-radius: 4px;
  color: #586bad;
  font-size: 0.9rem;
  font-weight: 500;
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

/* 검색 영역 */
.search-container {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.search-input-container {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-button {
  padding: 0.7rem 1rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.search-filters {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
}

.filter-button {
  padding: 0.5rem 0.8rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-button.active {
  background-color: #9581e8;
  color: white;
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
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
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
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
}

.modal-search {
  display: flex;
  padding: 1rem 1.5rem;
  gap: 0.5rem;
  border-bottom: 1px solid #eee;
}

.modal-search-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.modal-search-button {
  padding: 0.7rem 1rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.modal-filters {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-results {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  max-height: 60vh;
}

.modal-result-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-result-item:hover {
  background-color: #f5f5f5;
}

.modal-result-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
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
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
}

.modal-result-category {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.modal-result-rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stars {
  color: #ffc107;
  font-size: 0.9rem;
}

.star {
  color: #ddd;
}

.star.filled {
  color: #ffc107;
}

.review-count {
  font-size: 0.8rem;
  color: #888;
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
}
</style>