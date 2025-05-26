<template>
 <div class="trip-planner-container">
    <!-- 헤더 영역 -->
    <div class="header-section">
      <div class="plan-title-section">
        <input 
          type="text" 
          v-model="tripTitle" 
          placeholder="여행 계획 제목을 입력하세요"
          class="plan-title-input"
        />
        <div class="plan-options">
          <label class="public-option">
            <input type="checkbox" v-model="isPublic" />
            <span>공개 설정</span>
          </label>
          <button 
            class="save-plan-button" 
            @click="saveTripPlan"
            :disabled="isSaving || !canSave"
            :class="{ saving: isSaving }"
          >
            <span v-if="isSaving" class="loading-spinner-small"></span>
            {{ isSaving ? '저장 중...' : '여행 계획 저장' }}
          </button>
        </div>
      </div>
    </div>

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

        <!-- 선택된 장소 목록 + 고정 버튼 래퍼 -->
        <div class="selected-places-wrapper">
          <!-- (1) 스크롤되는 장소 목록 -->
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
                <div class="place-distance" v-if="place.telephone">{{ place.telephone }}</div>
              </div>
              <button @click.stop="removePlaceFromDay(selectedDay, index)" class="remove-place-btn">×</button>
            </div>
          </div>

          <!-- (2) 항상 보이는 하단 고정 버튼 -->
          <div class="add-place-container">
            <button class="add-place-button" @click="openSearchModal">
              <span>장소 추가하기</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 오른쪽 지도 패널 -->
      <div class="map-panel">
        <div class="map-container" ref="mapContainer" id="kakao-map">
          <!-- 지도 로딩 중 표시 -->
          <div class="map-loading" v-if="mapLoading || mapError">
            <div class="loading-spinner" v-if="mapLoading"></div>
            <p>{{ mapError || '지도를 불러오는 중...' }}</p>
            <button v-if="mapError" @click="retryMapInit" class="retry-btn">다시 시도</button>
          </div>
          <!-- 지도가 표시될 곳 -->
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
              <label>여행 테마</label>
              <select v-model="selectedMainCategory" @change="onMainCategoryChange" class="filter-select">
                <option value="">전체 테마</option>
                <option v-for="category in categories" :key="category.category" :value="category.category">
                  {{ category.categoryName }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>세부 분류</label>
              <select v-model="selectedMiddleCategory" @change="onMiddleCategoryChange" class="filter-select" :disabled="!selectedMainCategory">
                <option value="">전체</option>
                <option v-for="category in middleCategories" :key="category.category" :value="category.category">
                  {{ category.categoryName }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>상세 구분</label>
              <select v-model="selectedSubCategory" @change="onSubCategoryChange" class="filter-select" :disabled="!selectedMiddleCategory">
                <option value="">전체</option>
                <option v-for="category in subCategories" :key="category.category" :value="category.category">
                  {{ category.categoryName }}
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
              <img :src="place.firstImageUrl || 'https://placehold.co/250x150?text=No+Image'" :alt="place.title" @error="handleImageError">
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

    <!-- 저장 성공/실패 알림 모달 -->
    <div v-if="showSaveModal" class="save-modal" @click.self="closeSaveModal">
      <div class="save-modal-content">
        <div class="save-modal-header">
          <h3>{{ saveModalTitle }}</h3>
          <button class="close-button" @click="closeSaveModal">&times;</button>
        </div>
        <div class="save-modal-body">
          <div v-if="saveSuccess" class="success-message">
            <div class="success-icon">✅</div>
            <p>{{ saveModalMessage }}</p>
            <button class="ok-button" @click="goToMyPlans">내 계획 보기</button>
          </div>
          <div v-else class="error-message">
            <div class="error-icon">❌</div>
            <p>{{ saveModalMessage }}</p>
            <button class="ok-button" @click="closeSaveModal">확인</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 카카오 지도 API 키
const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

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
const isPublic = ref(true);

// 저장 관련 상태
const isSaving = ref(false);
const showSaveModal = ref(false);
const saveSuccess = ref(false);
const saveModalTitle = ref('');
const saveModalMessage = ref('');

// 지도 관련 상태
const mapLoading = ref(false);
const mapLoaded = ref(false);
const mapError = ref('');
const kakaoMap = ref(null);
const markers = ref([]);
const kakaoLoaded = ref(false);

// 지역 관련
const selectedAreaCode = ref('');
const selectedSigunguCode = ref('');
const selectedCategory = ref('');
const areas = ref([]);
const sigungus = ref([]);

// 카테고리 관련 상태
const categories = ref([]);
const middleCategories = ref([]);
const subCategories = ref([]);

// 선택된 카테고리 상태
const selectedMainCategory = ref('');
const selectedMiddleCategory = ref('');
const selectedSubCategory = ref('');

// 날짜별 선택된 장소들
const selectedPlaces = ref([]);

// 검색 결과
const searchResults = ref([]);

// 사용자 로그인 상태
const isLoggedIn = ref(false);
const currentUser = ref(null);

// axios 기본 설정
axios.defaults.withCredentials = true;

// 계산된 속성
const filteredSigungus = computed(() => {
  if (!selectedAreaCode.value) return [];
  return sigungus.value.filter(sigungu => sigungu.areaCode === parseInt(selectedAreaCode.value));
});

const canSave = computed(() => {
  return tripTitle.value.trim() && 
         startDate.value && 
         endDate.value && 
         isLoggedIn.value &&
         selectedPlaces.value.some(dayPlaces => dayPlaces.length > 0);
});

// 로그인 상태 확인
const checkLoginStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/member`);
    isLoggedIn.value = true;
    currentUser.value = response.data;
  } catch (err) {
    isLoggedIn.value = false;
    currentUser.value = null;
  }
};

// 여행 계획 저장
const saveTripPlan = async () => {
  if (!canSave.value) {
    alert('여행 계획을 저장하려면 로그인이 필요하고, 제목, 날짜, 그리고 최소 하나의 장소가 필요합니다.');
    return;
  }

  try {
    isSaving.value = true;

    // 1. 여행 계획 생성
    const planRequest = {
      title: tripTitle.value.trim(),
      startDate: startDate.value,
      endDate: endDate.value,
      isPublic: isPublic.value
    };

    console.log('여행 계획 생성 요청:', planRequest);
    const planResponse = await axios.post(`${API_BASE_URL}/api/plan`, planRequest);
    const planId = planResponse.data.planId;
    
    console.log('여행 계획 생성 완료, planId:', planId);

    // 2. 각 날짜별로 day 생성 및 장소 추가
    for (let dayIndex = 0; dayIndex < selectedPlaces.value.length; dayIndex++) {
      const dayPlaces = selectedPlaces.value[dayIndex];
      
      if (dayPlaces.length === 0) continue;

      // 장소들을 순서대로 추가
      for (let sequence = 0; sequence < dayPlaces.length; sequence++) {
        const place = dayPlaces[sequence];
        
        const itemRequest = {
          dayId: null, // 백엔드에서 처리
          placeId: place.placeId,
          sequence: sequence + 1,
          startTime: null,
          endTime: null,
          memo: null
        };

        console.log(`Day ${dayIndex + 1}, 장소 ${sequence + 1} 추가:`, itemRequest);
        
        try {
          // 임시로 dayId를 1로 설정 (백엔드에서 실제 처리)
          await axios.post(`${API_BASE_URL}/api/plan/${planId}/day/${dayIndex + 1}/item`, itemRequest);
        } catch (itemError) {
          console.error(`장소 추가 실패 (Day ${dayIndex + 1}, 장소 ${sequence + 1}):`, itemError);
        }
      }
    }

    // 저장 성공
    saveSuccess.value = true;
    saveModalTitle.value = '저장 완료';
    saveModalMessage.value = '여행 계획이 성공적으로 저장되었습니다!';
    showSaveModal.value = true;

  } catch (error) {
    console.error('여행 계획 저장 실패:', error);
    
    // 저장 실패
    saveSuccess.value = false;
    saveModalTitle.value = '저장 실패';


    
    
    if (error.response?.status === 401) {
      saveModalMessage.value = '로그인이 필요합니다. 다시 로그인해주세요.';
    } else if (error.response?.status === 400) {
      saveModalMessage.value = '입력 정보를 확인해주세요.';
    } else {
      saveModalMessage.value = '저장 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
    
    showSaveModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

// 저장 모달 닫기
const closeSaveModal = () => {
  showSaveModal.value = false;
};

// 내 계획 페이지로 이동
const goToMyPlans = () => {
  router.push('/tripmain');
};

// 카카오 지도 스크립트 로드
const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    console.log('🔍 카카오 지도 API 로드 시작');
    console.log('🔍 API 키 확인:', KAKAO_MAP_API_KEY ? '설정됨' : '없음');
    
    // API 키 확인
    if (!KAKAO_MAP_API_KEY) {
      const error = '카카오 지도 API 키가 설정되지 않았습니다.';
      console.error('❌', error);
      reject(new Error(error));
      return;
    }

    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps && kakaoLoaded.value) {
      console.log('✅ 카카오 지도 이미 로드됨');
      resolve();
      return;
    }

    // 기존 스크립트 제거 (있는 경우)
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      console.log('✅ 카카오 지도 스크립트 로드 성공');
      
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('✅ 카카오 지도 API 초기화 완료');
          kakaoLoaded.value = true;
          resolve();
        });
      } else {
        const error = '카카오 지도 객체를 찾을 수 없습니다.';
        console.error('❌', error);
        reject(new Error(error));
      }
    };
    
    script.onerror = (error) => {
      console.error('❌ 카카오 지도 스크립트 로드 실패:', error);
      reject(new Error('카카오 지도 스크립트 로드 실패'));
    };
    
    document.head.appendChild(script);
    
    // 타임아웃 설정 (10초)
    setTimeout(() => {
      if (!kakaoLoaded.value) {
        reject(new Error('카카오 지도 로드 타임아웃'));
      }
    }, 10000);
  });
};

// 지도 초기화
const initializeMap = async () => {
  try {
    mapLoading.value = true;
    mapError.value = '';
    
    console.log('🗺️ 지도 초기화 시작');
    
    // 카카오 지도 스크립트 로드 대기
    await loadKakaoMapScript();
    
    // DOM 요소 확인
    if (!mapContainer.value) {
      throw new Error('지도 컨테이너를 찾을 수 없습니다.');
    }

    // 카카오 지도 API 확인
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.Map) {
      throw new Error('카카오 지도 API가 준비되지 않았습니다.');
    }

    // 기존 지도 정리
    if (kakaoMap.value) {
      kakaoMap.value = null;
    }
    clearMarkers();

    // 지도 옵션 설정 (서울 시청을 기본 중심으로)
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
      level: 8 // 확대 레벨
    };

    // 지도 생성
    kakaoMap.value = new window.kakao.maps.Map(mapContainer.value, mapOption);
    mapLoaded.value = true;
    
    console.log('✅ 카카오 지도 초기화 완료');
    
    // 현재 선택된 날짜의 장소들을 지도에 표시
    const placesForDay = getSelectedPlacesByDay(selectedDay.value);
    if (placesForDay.length > 0) {
      addMarkersToMap(placesForDay);
    }
    
  } catch (error) {
    console.error('❌ 지도 초기화 실패:', error);
    mapError.value = error.message || '지도를 불러오는 중 오류가 발생했습니다.';
    mapLoaded.value = false;
  } finally {
    mapLoading.value = false;
  }
};

// 지도 재시도 함수
const retryMapInit = () => {
  console.log('🔄 지도 초기화 재시도');
  kakaoLoaded.value = false;
  initializeMap();
};

// 장소들 사이에 경로선 그리기 기능 추가
const drawRouteBetweenMarkers = (places) => {
  if (!kakaoMap.value || !places || places.length < 2) {
    console.log('경로를 그리기 위한 조건이 충족되지 않았습니다.');
    return;
  }

  try {
    // 기존 경로선 제거
    if (window.routePolyline) {
      window.routePolyline.setMap(null);
    }

    // 경로 좌표 배열 생성
    const linePath = places.map(place => {
      return new window.kakao.maps.LatLng(
        parseFloat(place.latitude), 
        parseFloat(place.longitude)
      );
    });

    // 경로선 생성
    window.routePolyline = new window.kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 3,        // 선 두께
      strokeColor: '#5882fa', // 선 색상 (파란색)
      strokeOpacity: 0.8,     // 선 투명도
      strokeStyle: 'solid'    // 선 스타일
    });

    // 지도에 경로선 표시
    window.routePolyline.setMap(kakaoMap.value);
    
    console.log('✅ 경로선 그리기 완료');
  } catch (error) {
    console.error('경로선 그리기 실패:', error);
  }
};

// 지도에서 기존 마커들과 경로선 제거
const clearMarkers = () => {
  if (markers.value && markers.value.length > 0) {
    markers.value.forEach(markerInfo => {
      if (markerInfo.marker) {
        markerInfo.marker.setMap(null);
      }
      if (markerInfo.customOverlay) {
        markerInfo.customOverlay.setMap(null);
      }
      if (markerInfo.infowindow) {
        markerInfo.infowindow.close();
      }
    });
    markers.value = [];
  }
  
  // 경로선 제거
  if (window.routePolyline) {
    window.routePolyline.setMap(null);
    window.routePolyline = null;
  }
};

// 지도에 마커 추가
const addMarkersToMap = (places) => {
  if (!kakaoMap.value || !places || places.length === 0) {
    console.log('지도 또는 장소 정보가 없어 마커를 추가할 수 없습니다.');
    return;
  }

  if (!window.kakao || !window.kakao.maps) {
    console.error('카카오 지도 API가 로드되지 않았습니다.');
    return;
  }

  try {
    // 기존 마커 제거
    clearMarkers();

    const bounds = new window.kakao.maps.LatLngBounds();
    let validPlaces = 0;

    places.forEach((place, index) => {
      // mapY(위도), mapX(경도) 확인
      if (!place.latitude || !place.longitude) {
        console.warn(`장소 "${place.title}"의 좌표 정보가 없습니다.`);
        return;
      }

      try {
        const position = new window.kakao.maps.LatLng(
          parseFloat(place.latitude), 
          parseFloat(place.longitude)
        );

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: kakaoMap.value
        });

        // 마커에 번호 표시 (커스텀 오버레이 사용)
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: position,
          content: `<div class="map-marker-number">${index + 1}</div>`,
          yAnchor: 2.3,
          xAnchor: 0.5
        });
        customOverlay.setMap(kakaoMap.value);

        // 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div class="map-info-window">
                      <div class="info-title">${place.title}</div>
                      <div class="info-address">${place.address1 || ''}</div>
                    </div>`
        });

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', () => {
          // 다른 인포윈도우 닫기
          markers.value.forEach(m => {
            if (m.infowindow) {
              m.infowindow.close();
            }
          });
          
          infowindow.open(kakaoMap.value, marker);
        });

        // 마커 배열에 추가
        markers.value.push({
          marker,
          customOverlay,
          infowindow
        });

        bounds.extend(position);
        validPlaces++;
      } catch (markerError) {
        console.error(`마커 생성 실패 (${place.title}):`, markerError);
      }
    });

    // 마커가 있으면 지도 범위 조정
    if (validPlaces > 0) {
      kakaoMap.value.setBounds(bounds);
      
      // 마커가 1개인 경우 확대 레벨 조정
      if (validPlaces === 1) {
        setTimeout(() => {
          kakaoMap.value.setLevel(4);
        }, 100);
      }
      
      // 경로선 그리기 (마커가 2개 이상일 때)
      if (validPlaces >= 2) {
        drawRouteBetweenMarkers(places);
      }
    }
  } catch (error) {
    console.error('마커 추가 중 오류:', error);
  }
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

// 장소 상세 정보 가져오기
async function fetchPlaceDetails(placeId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/travel/${placeId}`);
    return response.data;
  } catch (error) {
    console.error('장소 상세 정보 가져오기 실패:', error);
    throw error;
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
  
  // 선택된 날짜의 장소들을 지도에 표시
  const placesForDay = getSelectedPlacesByDay(dayIndex);
  addMarkersToMap(placesForDay);
}

// 이벤트 핸들러들
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

function onMainCategoryChange() {
  selectedMiddleCategory.value = '';
  selectedSubCategory.value = '';
  fetchMiddleCategories(selectedMainCategory.value);
  
  if (hasSearched.value) {
    searchPlacesAPI();
  }
}

function onMiddleCategoryChange() {
  selectedSubCategory.value = '';
  fetchSubCategories(selectedMiddleCategory.value);
  
  if (hasSearched.value) {
    searchPlacesAPI();
  }
}

function onSubCategoryChange() {
  if (hasSearched.value) {
    searchPlacesAPI();
  }
}

// 모달에서 검색 함수
function searchInModal() {
  if (!modalSearchQuery.value.trim() && !selectedAreaCode.value && !selectedSigunguCode.value && !selectedMainCategory.value) {
    alert('검색어를 입력하거나 지역/테마를 선택해주세요.');
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
  selectedMainCategory.value = '';
  selectedMiddleCategory.value = '';
  selectedSubCategory.value = '';
  
  // 카테고리 중분류, 소분류 초기화
  middleCategories.value = [];
  subCategories.value = [];
}

// 장소 추가 모달 닫기
function closeSearchModal() {
  isSearchModalOpen.value = false;
}

// 장소를 특정 날짜에 추가
function addPlaceToDay(place, dayIndex) {
  const isDuplicate = selectedPlaces.value[dayIndex].some(p => p.placeId === place.placeId);
  
  if (!isDuplicate) {
    // 좌표 정보 확인
    if (!place.latitude || !place.longitude) {
      // 좌표 정보가 없는 경우, API를 통해 좌표 정보를 가져오기
      fetchPlaceDetails(place.placeId)
        .then(detailedPlace => {
          selectedPlaces.value[dayIndex].push(detailedPlace);
          closeSearchModal();
          
          // 현재 선택된 날짜의 장소들을 지도에 업데이트
          if (selectedDay.value === dayIndex) {
            const placesForDay = getSelectedPlacesByDay(dayIndex);
            addMarkersToMap(placesForDay);
          }
        })
        .catch(error => {
          console.error('장소 상세 정보 가져오기 실패:', error);
          // 실패해도 일단 추가 (좌표 없이)
          selectedPlaces.value[dayIndex].push(place);
          closeSearchModal();
        });
    } else {
      // 좌표 정보가 이미 있는 경우
      selectedPlaces.value[dayIndex].push(place);
      closeSearchModal();
      
      // 현재 선택된 날짜의 장소들을 지도에 업데이트
      if (selectedDay.value === dayIndex) {
        const placesForDay = getSelectedPlacesByDay(dayIndex);
        addMarkersToMap(placesForDay);
      }
    }
  } else {
    alert('이미 추가된 장소입니다.');
  }
}

// 장소 제거
function removePlaceFromDay(dayIndex, placeIndex) {
  if (confirm('이 장소를 제거하시겠습니까?')) {
    selectedPlaces.value[dayIndex].splice(placeIndex, 1);
    
    // 현재 선택된 날짜의 장소들을 지도에 업데이트
    if (selectedDay.value === dayIndex) {
      const placesForDay = getSelectedPlacesByDay(dayIndex);
      addMarkersToMap(placesForDay);
    }
  }
}

// 날짜별 선택된 장소들 가져오기
function getSelectedPlacesByDay(dayIndex) {
  return selectedPlaces.value[dayIndex] || [];
}

// 장소 선택 함수
function selectPlace(place) {
  if (!kakaoMap.value || !place.latitude || !place.longitude) return;
  
  try {
    // 지도 중심을 선택된 장소로 이동
    const position = new window.kakao.maps.LatLng(
      parseFloat(place.latitude), 
      parseFloat(place.longitude)
    );
    kakaoMap.value.setCenter(position);
    kakaoMap.value.setLevel(4);
  } catch (error) {
    console.error('장소 선택 중 오류:', error);
  }
}

// 이미지 에러 핸들링
function handleImageError(event) {
  event.target.src = 'https://placehold.co/250x150?text=No+Image';
}

// 카테고리 이름 가져오기
function getCategoryName(categoryCode) {
  if (!categoryCode) return '기타';
  
  // 메인 카테고리 확인
  const mainCategory = categories.value.find(c => c.category === categoryCode);
  if (mainCategory) return mainCategory.categoryName;
  
  // 중분류 카테고리 확인
  const middleCategory = middleCategories.value.find(c => c.category === categoryCode);
  if (middleCategory) return middleCategory.categoryName;
  
  // 소분류 카테고리 확인
  const subCategory = subCategories.value.find(c => c.category === categoryCode);
  if (subCategory) return subCategory.categoryName;
  
  // 기본 카테고리 맵에서 확인 (fallback)
  const categoryMap = {
    'A01': '자연',
    'A02': '인문(문화/예술/역사)',
    'A03': '레포츠',
    'A04': '쇼핑',
    'A05': '음식'
  };
  
  if (categoryCode && categoryCode.length >= 3) {
    const mainCode = categoryCode.substring(0, 3);
    return categoryMap[mainCode] || '기타';
  }
  
  return '기타';
}

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  clearMarkers();
  if (kakaoMap.value) {
    kakaoMap.value = null;
  }
  kakaoLoaded.value = false;
});

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  // 로그인 상태 확인
  await checkLoginStatus();
  
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
  
  // 카테고리 데이터 로드
  await fetchMainCategories();
  
  // 지도 초기화는 DOM이 준비된 후 실행
  await nextTick();
  setTimeout(() => {
    initializeMap();
  }, 100);
});

// 날짜가 변경될 때마다 기간 재계산
watch([startDate, endDate], () => {
  calculateDuration();
});

// 선택된 날짜가 변경될 때 지도 업데이트
watch(selectedDay, (newDay) => {
  if (mapLoaded.value) {
    const placesForDay = getSelectedPlacesByDay(newDay);
    addMarkersToMap(placesForDay);
  }
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

/* 메인 콘텐츠 영역 */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 왼쪽 계획 패널 */
.plan-panel {
  width: 360px;
  height: 100vh; /* 고정 높이 설정 */
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 전체 패널 오버플로우 숨김 */
}

/* 날짜 선택 섹션 - 고정 높이 */
.date-selection-section {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  flex-shrink: 0; /* 축소되지 않도록 */
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

/* 날짜 탭 - 고정 높이 */
.date-tabs {
  display: flex;
  overflow-x: auto;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  flex-shrink: 0; /* 축소되지 않도록 */
  background-color: #fff; /* 배경색 고정 */
  position: sticky; /* 스크롤 시에도 고정 */
  top: 0;
  z-index: 10;
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

/* 날짜 탭 스크롤바 스타일링 */
.date-tabs::-webkit-scrollbar {
  height: 4px;
}

.date-tabs::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.date-tabs::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.date-tabs::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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

/* 선택된 장소 목록 - 스크롤 가능하게 */
.selected-places {
  flex: 1;
  padding: 1rem;
  overflow-y: auto; /* 세로 스크롤 가능 */
  min-height: 0; /* flex item이 축소될 수 있도록 */
}

/* 스크롤바 스타일링 */
.selected-places::-webkit-scrollbar {
  width: 6px;
}

.selected-places::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.selected-places::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.selected-places::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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

/* 장소 추가 버튼 컨테이너 - 하단 고정 */
.add-place-container {
  padding: 1rem 0;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
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

#kakao-map {
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

.retry-btn:hover {
  background-color: #8470d7;
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
  width: 900px;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.loading {
  grid-column: 1 / -1;
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
  grid-column: 1 / -1;
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
  flex-direction: column;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  position: relative;
  border: 1px solid #eee;
  background-color: white;
  height: fit-content;
}

.modal-result-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #9581e8;
}

.modal-result-image {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
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
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.modal-result-category {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-badge {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.modal-result-phone {
  font-size: 0.8rem;
  color: #2ecc71;
}

.add-place-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #9581e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 미디어 쿼리 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .plan-panel {
    width: 100%;
    height: 60vh;
  }
  
  .map-panel {
    height: 40vh;
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

  .modal-results {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .filter-row {
    flex-wrap: wrap;
  }
  
  .filter-group {
    min-width: 200px;
  }
}

.map-marker-number {
  width: 24px;
  height: 24px;
  background-color: #9581e8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

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

/* 헤더 섹션 스타일 */
.header-section {
  background-color: white;
  border-bottom: 1px solid #eee;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.plan-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.plan-title-input {
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #333;
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.plan-title-input:focus {
  outline: none;
  background-color: #f8f9fa;
  box-shadow: 0 0 0 2px rgba(149, 129, 232, 0.1);
}

.plan-title-input::placeholder {
  color: #999;
  font-weight: 400;
}

.plan-options {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.public-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
}

.public-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #9581e8;
}

.save-plan-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #9581e8, #8470d7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(149, 129, 232, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.save-plan-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #8470d7, #7359d1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(149, 129, 232, 0.4);
}

.save-plan-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.save-plan-button.saving {
  background: #9581e8;
  cursor: wait;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 저장 모달 스타일 */
.save-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.save-modal-content {
  width: 400px;
  max-width: 90%;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transform: scale(0.9);
  animation: modalAppear 0.3s ease forwards;
}

@keyframes modalAppear {
  to {
    transform: scale(1);
  }
}

.save-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.save-modal-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.save-modal-body {
  padding: 2rem;
}

.success-message, .error-message {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-icon, .error-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.success-message p, .error-message p {
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.ok-button {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #9581e8, #8470d7);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.ok-button:hover {
  background: linear-gradient(135deg, #8470d7, #7359d1);
  transform: translateY(-2px);
}

/* 반응형 디자인 추가 */
@media (max-width: 768px) {
  .header-section {
    padding: 1rem;
  }
  
  .plan-title-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .plan-title-input {
    font-size: 1.2rem;
    text-align: center;
  }
  
  .plan-options {
    justify-content: space-between;
  }
  
  
  .save-modal-content {
    width: 320px;
  }
  
  .save-modal-body {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .plan-title-input {
    font-size: 1.1rem;
  }
  
  .save-plan-button {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }

}
</style>

