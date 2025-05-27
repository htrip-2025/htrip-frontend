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
            v-for="(day,idx) in sortedDays"
            :key="day.dayId"
            class="date-tab"
            :class="{ active: selectedDay === idx }"
            @click="selectDay(idx)"
          >
            day{{ day.dayDate }}
            <span class="day-date">{{ formatDayDate(idx) }}</span>
          </button>
        </div>

        <!-- 선택된 장소 목록 + 고정 버튼 래퍼 -->
        <div class="selected-places-wrapper">
          <!-- (1) 스크롤되는 장소 목록 -->
          <div class="selected-places">
            <div 
              v-for="(place,i) in sortedItems(sortedDays[selectedDay])" 
              :key="place.placeId + '_' + i"
              class="place-item"
              @click="selectPlace(place)"
            >
              <div class="place-number">{{ i + 1 }}</div>
              <div class="place-content">
                <div class="place-name">{{ place.title }}</div>
                <div class="place-category">{{ place.address1 }}</div>
                <div class="place-distance" v-if="place.telephone">{{ place.telephone }}</div>
              </div>
              <button
                @click.stop="removePlaceFromDay(selectedDay, i)"
                class="remove-place-btn"
              >×</button>
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
import { ref, computed, onMounted, watch, nextTick, onUnmounted, toRefs } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import axios from 'axios';
import Sortable from 'sortablejs';

const router = useRouter();
const route = useRoute();

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
const planData = ref({ days: [] });
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

const planId = ref(null);
const isEditMode = ref(false);
const userPermissions = ref({
  canEdit: false,
  canDelete: false,
  userRole: null
});

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
         planData.value.days.some(day => day.items && day.items.length > 0);
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

// saveTripPlan 함수 수정 (수정 모드 지원)
const saveTripPlan = async () => {
  if (!canSave.value) {
    alert('여행 계획을 저장하려면 로그인이 필요하고, 제목, 날짜, 그리고 최소 하나의 장소가 필요합니다.');
    return;
  }

  // 수정 권한 확인
  if (isEditMode.value && !userPermissions.value.canEdit) {
    alert('이 계획을 수정할 권한이 없습니다.');
    return;
  }

  try {
    isSaving.value = true;

    // 전체 계획 데이터 준비
    const fullPlanRequest = {
      title: tripTitle.value.trim(),
      startDate: startDate.value,
      endDate: endDate.value,
      isPublic: isPublic.value,
      days: planData.value.days.map(day => ({
        dayId: day.dayId.toString().startsWith('temp_') ? null : day.dayId,
        dayDate: day.dayDate,
        items: (day.items || []).map(item => ({
          itemId: item.itemId || null,
          placeId: item.placeId,
          sequence: item.sequence,
          startTime: item.startTime || null,
          endTime: item.endTime || null,
          memo: item.memo || null
        }))
      }))
    };
    
    let response;
    
    if (isEditMode.value) {
      // 전체 계획 한 번에 업데이트
      response = await axios.put(`${API_BASE_URL}/api/plan/${planId.value}/full`, fullPlanRequest);
    } else {
      // 새 계획 생성
      response = await axios.post(`${API_BASE_URL}/api/plan`, {
        title: tripTitle.value.trim(),
        startDate: startDate.value,
        endDate: endDate.value,
        isPublic: isPublic.value
      });
      
      // 생성된 계획 ID 저장
      planId.value = response.data.planId;
      
      // 각 일자별 아이템 추가
      for (const day of planData.value.days) {
        const dayResponse = response.data.days.find(d => d.dayDate === day.dayDate);
        if (!dayResponse) continue;
        
        // 각 아이템 추가
        for (let i = 0; i < (day.items || []).length; i++) {
          const place = day.items[i];
          const itemRequest = {
            placeId: place.placeId,
            sequence: i + 1,
            startTime: place.startTime || null,
            endTime: place.endTime || null,
            memo: place.memo || null
          };
          
          try {
            const newItemResponse = await axios.post(
              `${API_BASE_URL}/api/plan/${planId.value}/day/${dayResponse.dayId}/item`,
              itemRequest
            );
            // 새로 생성된 아이템의 ID 저장
            place.itemId = newItemResponse.data.itemId;
          } catch (itemError) {
            console.error(`아이템 추가 실패 (${place.title}):`, itemError);
          }
        }
      }
    }

    // 저장 성공 UI
    saveSuccess.value = true;
    saveModalTitle.value = isEditMode.value ? '수정 완료' : '저장 완료';
    saveModalMessage.value = isEditMode.value
      ? '여행 계획이 성공적으로 수정되었습니다!'
      : '여행 계획이 성공적으로 저장되었습니다!';
    showSaveModal.value = true;

    // 수정 모드로 전환
    if (!isEditMode.value) {
      isEditMode.value = true;
      userPermissions.value.canEdit = true;
      userPermissions.value.canDelete = true;
    }

  } catch (error) {
    console.error('저장 실패:', error);
    saveSuccess.value = false;
    saveModalTitle.value = '저장 실패';
    saveModalMessage.value = '여행 계획 저장 중 오류가 발생했습니다. 다시 시도해주세요.';
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
  router.push('/mypage');
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
    const placesForDay = getPlacesForDay(selectedDay.value);
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
    initializePlanData();
    return;
  }
  
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  tripDuration.value = diffDays;
  initializePlanData();
}

// planData 초기화 함수
function initializePlanData() {
  const days = [];
  for (let i = 1; i <= tripDuration.value + 1; i++) {
    days.push({
      dayId: `temp_${i}`,
      dayDate: i,
      items: []
    });
  }
  planData.value.days = days;
  selectedPlaces.value = days.map(() => []);
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
  const placesForDay = getPlacesForDay(dayIndex);
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
  console.log('▶ addPlaceToDay 호출됨:', place, 'dayIndex=', dayIndex);

  // 1) sortedDays 기준으로 해당 날짜 객체 찾기
  const day = sortedDays.value[dayIndex];
  if (!day) return alert('잘못된 날짜입니다.');

  // 2) planData 안의 진짜 원본 day 객체 찾기
  const origDay = planData.value.days.find(d => d.dayDate === day.dayDate);
  if (!origDay) return;

  // 3) 중복 검사
  if (origDay.items.some(it => it.placeId === place.placeId)) {
    return alert('이미 추가된 장소입니다.');
  }

  // 4) 새 아이템 생성 (좌표 매핑까지 필요하면 여기서 detail.fetch)
  const newItem = {
    placeId: place.placeId,
    title: place.title,
    address1: place.address1,
    telephone: place.telephone,
    latitude: place.latitude,
    longitude: place.longitude,
    memo: null,
    startTime: null,
    endTime: null,
    sequence: origDay.items.length + 1
  };

  // 5) planData 에만 push
  origDay.items.push(newItem);

  // 6) 모달 닫고, 마커 / 리스트 갱신
  closeSearchModal();
  addMarkersToMap(getPlacesForDay(dayIndex));
}

const props = defineProps({
  plan: {
    type: Object,
    required: false,
    default: () => ({ days: [] })
  }
});

const { plan } = toRefs(props);

// dayDate 순 정렬
const sortedDays = computed(() => {
  const days = planData.value.days;
  if (!Array.isArray(days)) return [];
  return days
    .slice()
    .sort((a, b) => a.dayDate - b.dayDate);
});

function sortedItems(day) {
  if (!day?.items) return [];
  return day.items
    .slice()
    .sort((a, b) => a.sequence - b.sequence);
}

// 장소 제거 함수 수정
function removePlaceFromDay(dayIndex, placeIndex) {
  console.log('▶ removePlaceFromDay 호출:', dayIndex, placeIndex);
  
  const day = sortedDays.value[dayIndex];
  if (!day) {
    console.error('해당 날짜를 찾을 수 없습니다:', dayIndex);
    return;
  }
  
  // 원본 planData에서 해당 day 찾기
  const origDay = planData.value.days.find(d => d.dayDate === day.dayDate);
  if (!origDay || !origDay.items) {
    console.error('원본 day 데이터를 찾을 수 없습니다');
    return;
  }
  
  // 정렬된 순서로 삭제할 아이템 찾기
  const sortedItemsArray = sortedItems(origDay);
  if (placeIndex >= sortedItemsArray.length) {
    console.error('잘못된 장소 인덱스:', placeIndex);
    return;
  }
  
  const itemToRemove = sortedItemsArray[placeIndex];
  
  // 원본 배열에서 해당 아이템 제거 (동일한 객체 참조로 찾기)
  const originalIndex = origDay.items.indexOf(itemToRemove);
  
  if (originalIndex !== -1) {
    origDay.items.splice(originalIndex, 1);
    
    // sequence 재부여
    origDay.items.forEach((item, i) => { 
      item.sequence = i + 1; 
    });
    
    console.log('✅ 장소 삭제 완료. 남은 장소 수:', origDay.items.length);
    
    // 마커 갱신
    addMarkersToMap(getPlacesForDay(dayIndex));
  } else {
    console.error('삭제할 아이템을 원본 배열에서 찾을 수 없습니다');
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

function getPlacesForDay(dayIndex) {
  const day = sortedDays.value[dayIndex];
  return day ? sortedItems(day) : [];
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
  const aiRecommendedPlan = sessionStorage.getItem('aiRecommendedPlan');
  // URL에서 planId 파라미터 확인
  if (aiRecommendedPlan) {
    try {
      const recommendedData = JSON.parse(aiRecommendedPlan);
      console.log('AI 추천 계획 데이터 수신:', recommendedData);
      
      // 데이터 사용 후 즉시 삭제 (한 번만 사용)
      sessionStorage.removeItem('aiRecommendedPlan');
      
      await loadRecommendedPlan(recommendedData);
    } catch (error) {
      console.error('AI 추천 계획 데이터 파싱 실패:', error);
      sessionStorage.removeItem('aiRecommendedPlan');
      // 기본 새 계획으로 fallback
      initializeNewPlan();
    }
  } else if (route.query.id) {
    planId.value = route.query.id;
    isEditMode.value = true;
    await loadExistingPlan(planId.value);
  } else {
    // 새 계획 초기화
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    userPermissions.value.canEdit = true;
    startDate.value = today.toISOString().split('T')[0];
    endDate.value = tomorrow.toISOString().split('T')[0];
    
    calculateDuration();
  }
  
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
  
  // 다음 코드를 추가해 sortable 기능 초기화
  initSortable();
});

// Sortable.js 초기화 함수 추가
const initSortable = () => {
  // 각 날짜에 대해 sortable 적용 (selectedDay가 변경될 때마다 재적용)
  watch(selectedDay, () => {
    nextTick(() => {
      const container = document.querySelector('.selected-places');
      if (!container) return;
      
      // 기존 sortable 인스턴스 제거
      if (window.currentSortable) {
        window.currentSortable.destroy();
      }
      
      // 새 sortable 인스턴스 생성 (편집 권한이 있을 때만)
      if (userPermissions.value.canEdit) {
        window.currentSortable = Sortable.create(container, {
          animation: 150,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          handle: '.place-item',
          onEnd: async evt => {
            // 1) 화면상 순서 반영 (planData 기준)
            const dayObj = sortedDays.value[selectedDay.value];
            const origDay = planData.value.days.find(d => d.dayDate === dayObj.dayDate);
            if (!origDay) return;

            // oldIndex → newIndex 로 item 이동
            const moved = origDay.items.splice(evt.oldIndex, 1)[0];
            origDay.items.splice(evt.newIndex, 0, moved);

            // 2) sequence 재부여
            origDay.items.forEach((it, i) => {
              it.sequence = i + 1;
            });

            // 3) 리스트·마커 다시 그리기
            addMarkersToMap(getPlacesForDay(selectedDay.value));
          }
        });
      }
    });
  }, {immediate: true});
};

const loadRecommendedPlan = async (recommendedData) => {
  try {
    console.log('추천 계획 로드 시작:', recommendedData);
    
    // 권한 설정 (새 계획이므로 편집 가능)
    userPermissions.value = {
      canEdit: true,
      canDelete: true,
      userRole: 'LEADER'
    };
    
    // 기본 정보 설정
    tripTitle.value = recommendedData.title;
    startDate.value = recommendedData.startDate;
    endDate.value = recommendedData.endDate;
    isPublic.value = recommendedData.isPublic;
    
    // 기간 계산
    calculateDuration();
    
    // 추천된 계획 데이터를 planData에 로드하되, 상세 정보도 함께 가져오기
    const daysWithDetails = await Promise.all(
      recommendedData.days.map(async day => {
        console.log(`Day ${day.dayDate} 처리 중, 아이템 수:`, day.items?.length || 0);
        
        // 각 아이템에 대해 상세 정보 가져오기
        const itemsWithDetail = await Promise.all(
          (day.items || []).map(async (item, index) => {
            try {
              console.log(`아이템 ${index + 1} 처리 중 - placeId:`, item.placeId);
              
              // 이미 상세 정보가 있는 경우 (AI에서 제공된 경우)
              if (item.title && item.address1 && item.latitude && item.longitude) {
                console.log(`아이템 ${index + 1} - 이미 상세 정보 있음:`, item.title);
                return {
                  ...item,
                  sequence: index + 1 // sequence 보정
                };
              }
              
              // 상세 정보가 없는 경우 API에서 가져오기
              console.log(`아이템 ${index + 1} - API에서 상세 정보 가져오는 중...`);
              const detail = await fetchPlaceDetails(item.placeId);
              console.log(`아이템 ${index + 1} - API 응답:`, detail.title);
              
              return {
                ...item, // 기존 정보 유지
                title: detail.title,
                address1: detail.address1,
                address2: detail.address2 || '',
                telephone: detail.telephone || '',
                longitude: detail.longitude,
                latitude: detail.latitude,
                sequence: index + 1 // sequence 보정
              };
            } catch (error) {
              console.error(`placeId ${item.placeId} 상세 정보 로드 실패:`, error);
              // 실패한 경우 기본 정보라도 표시
              return { 
                ...item,
                title: item.title || `장소 ${item.placeId}`,
                address1: item.address1 || '주소 정보 없음',
                telephone: item.telephone || '',
                longitude: item.longitude || null,
                latitude: item.latitude || null,
                sequence: index + 1
              };
            }
          })
        );
        
        console.log(`Day ${day.dayDate} 완료 - 처리된 아이템 수:`, itemsWithDetail.length);
        return {
          ...day,
          items: itemsWithDetail
        };
      })
    );
    
    // planData에 할당
    planData.value.days = daysWithDetails;
    
    // selectedPlaces는 호환성을 위해 유지
    selectedPlaces.value = planData.value.days.map(day => [...(day.items || [])]);
    
    console.log('✅ 추천 계획 로드 완료. 전체 planData:', planData.value);
    console.log('첫 번째 날 아이템들:', planData.value.days[0]?.items);
    
    // 첫 번째 날짜의 장소들을 지도에 표시
    if (planData.value.days.length > 0) {
      const firstDayPlaces = getPlacesForDay(0);
      console.log('첫 번째 날 장소들:', firstDayPlaces);
      if (mapLoaded.value) {
        addMarkersToMap(firstDayPlaces);
      }
    }
    
  } catch (error) {
    console.error('추천 계획 로드 실패:', error);
    alert('추천 여행 계획을 불러오는 중 오류가 발생했습니다.');
    
    // 실패 시 기본 새 계획으로 초기화
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    startDate.value = today.toISOString().split('T')[0];
    endDate.value = tomorrow.toISOString().split('T')[0];
    calculateDuration();
  }
};

// 기존 계획 불러오기 함수 수정
const loadExistingPlan = async (id) => {
  try {
    const { data: plan } = await axios.get(`${API_BASE_URL}/api/plan/${id}/with-permission`);
    
    // 권한 정보 설정
    userPermissions.value = {
      canEdit: plan.canEdit === true,
      canDelete: plan.canDelete === true,
      userRole: plan.userRole
    };
    
    // 계획 기본 정보 설정
    tripTitle.value = plan.title || '여행 계획';
    startDate.value = plan.startDate?.split('T')[0] || '';
    endDate.value = plan.endDate?.split('T')[0] || '';
    isPublic.value = plan.isPublic === true;
    
    calculateDuration();
    
    // 장소 정보 설정 - API 응답 구조 그대로 사용하되 상세 정보만 추가
    const daysWithDetails = await Promise.all(
      (plan.days || []).map(async day => {
        // 각 아이템에 대해 상세 정보 가져오기
        const itemsWithDetail = await Promise.all(
          (day.items || []).map(async item => {
            try {
              const detail = await fetchPlaceDetails(item.placeId);
              return {
                ...item, // 기존 itemId, sequence 등 유지
                title: detail.title,
                address1: detail.address1,
                telephone: detail.telephone,
                longitude: detail.longitude,
                latitude: detail.latitude
                // memo, startTime, endTime은 이미 item에 있음
              };
            } catch (e) {
              console.error(`placeId ${item.placeId} 로드 실패`, e);
              return { 
                ...item,
                title: `알 수 없는 장소 (${item.placeId})`,
                address1: '',
                telephone: '',
                longitude: null,
                latitude: null
              };
            }
          })
        );
        
        return {
          ...day, // 기존 dayId, dayDate 유지
          items: itemsWithDetail
        };
      })
    );
    
    // planData에 직접 할당 (기존 구조 유지)
    planData.value.days = daysWithDetails;
    
    // selectedPlaces는 호환성을 위해 유지하지만 실제로는 planData를 사용
    selectedPlaces.value = planData.value.days.map(day => [...(day.items || [])]);
    
    console.log('✅ 기존 계획 로드 완료:', planData.value);
    
  } catch (error) {
    console.error('계획 정보 로드 실패:', error);
    
    if (error.response?.status === 404) {
      alert('존재하지 않는 여행 계획입니다.');
      router.push('/tripmain');
    } else if (error.response?.status === 403) {
      alert('이 계획을 볼 수 있는 권한이 없습니다.');
      router.push('/tripmain');
    } else {
      alert('여행 계획을 불러오는 중 오류가 발생했습니다.');
    }
  }
};

// 날짜가 변경될 때마다 기간 재계산
watch([startDate, endDate], () => {
  calculateDuration();
});

// 선택된 날짜가 변경될 때 지도 업데이트
watch(selectedDay, (newDay) => {
  if (mapLoaded.value) {
    const placesForDay = getPlacesForDay(newDay);
    addMarkersToMap(placesForDay);
  }
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
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

/* 날짜 선택 섹션 - 고정 높이 */
.date-selection-section {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  flex-shrink: 0; /* 축소되지 않도록 */
  font-family: 'LeeSeoyun';
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  font-family: 'LeeSeoyun';
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-family: 'LeeSeoyun';
}

.date-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-family: 'LeeSeoyun';
}

.date-input-group label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
  font-family: 'LeeSeoyun';
}

.date-input-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: 'LeeSeoyun';
}

.date-divider {
  color: #666;
  margin-top: 1rem;
  font-size: 1.2rem;
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

/* 날짜 탭 스크롤바 스타일링 */
.date-tabs::-webkit-scrollbar {
  height: 4px;
  font-family: 'LeeSeoyun';
}

.date-tabs::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
  font-family: 'LeeSeoyun';
}

.date-tabs::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
  font-family: 'LeeSeoyun';
}

.date-tabs::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
.date-tab.active {
  background-color: #f0f4ff;
  color: #2172ce;
  font-weight: 600;
}

.day-date {
  font-size: 0.75rem;
  margin-top: 0.2rem;
  color: #999;
  font-family: 'LeeSeoyun';
}

.date-tab.active .day-date {
  color: #2172ce;
}

/* 선택된 장소 목록 - 스크롤 가능하게 */
.selected-places {
  flex: 1;
  padding: 1rem;
  overflow-y: auto; /* 세로 스크롤 가능 */
  min-height: 0; /* flex item이 축소될 수 있도록 */
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.place-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.place-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #2172ce;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  margin-right: 0.8rem;
  flex-shrink: 0;
  font-family: 'LeeSeoyun';
}

.place-content {
    font-family: 'LeeSeoyun';
  flex: 1;
}

.place-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
  font-family: 'LeeSeoyun';
}

.place-category {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.5rem;
  font-family: 'LeeSeoyun';
}

.place-distance {
  font-size: 0.8rem;
  color: #2172ce;
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

/* 장소 추가 버튼 컨테이너 - 하단 고정 */
.add-place-container {
  padding: 1rem 0;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
  font-family: 'LeeSeoyun';
}

.add-place-button {
  width: 95%;
  margin: 0 auto;
  padding: 0.8rem;
  background: linear-gradient(135deg, #2172ce 0%, #2c88f1 100%);
  color: white;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-family: 'LeeSeoyun';
}

.add-place-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(135deg, #2c88f1 0%, #2172ce 100%);
  transition: width 0.5s ease;
  z-index: -1;
  border-radius: 6px;
}

.add-place-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 114, 206, 0.3);
}

.add-place-button:hover::before {
  width: 100%;
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
  font-family: 'LeeSeoyun';
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: #2172ce;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-family: 'LeeSeoyun';
}

.retry-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(135deg, #2c88f1 0%, #2172ce 100%);
  transition: width 0.5s ease;
  z-index: -1;
  border-radius: 4px;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 114, 206, 0.3);
}

.retry-btn:hover::before {
  width: 100%;
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
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
  font-family: 'LeeSeoyun';
}

.modal-header h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.close-button:hover {
  background-color: #e9ecef;
}

/* 필터 섹션 */
.modal-filters {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background-color: #fafafa;
  font-family: 'LeeSeoyun';
}

.filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0;
  font-family: 'LeeSeoyun';
}

.filter-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: 'LeeSeoyun';
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  font-family: 'LeeSeoyun';
}

.filter-select {
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;
  font-family: 'LeeSeoyun';
}

.filter-select:focus {
  outline: none;
  border-color: #2172ce;
  box-shadow: 0 0 0 2px rgba(33, 114, 206, 0.1);
}

.filter-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #999;
  border-color: #e9ecef;
}

/* 검색 입력 */
.modal-search {
  display: flex;
  padding: 1.5rem;
  gap: 0.8rem;
  border-bottom: 1px solid #eee;
  font-family: 'LeeSeoyun';
}

.modal-search-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  font-family: 'LeeSeoyun';
}

.modal-search-input:focus {
  outline: none;
  border-color: #2172ce;
  box-shadow: 0 0 0 2px rgba(33, 114, 206, 0.1);
}

.modal-search-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #2172ce 0%, #2c88f1 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-family: 'LeeSeoyun';
}

.modal-search-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(135deg, #2c88f1 0%, #2172ce 100%);
  transition: width 0.5s ease;
  z-index: -1;
  border-radius: 6px;
}

.modal-search-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 114, 206, 0.3);
}

.modal-search-button:hover::before {
  width: 100%;
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
  font-family: 'LeeSeoyun';
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
  border-top: 3px solid #2172ce;
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
  border-color: #2172ce;
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
  font-family: 'LeeSeoyun';
}

.modal-result-name {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  font-family: 'LeeSeoyun';
}

.modal-result-category {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-family: 'LeeSeoyun';
}

.category-badge {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  font-family: 'LeeSeoyun';
}

.modal-result-phone {
  font-size: 0.8rem;
  color: #2ecc71;
  font-family: 'LeeSeoyun';
}

.add-place-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #2172ce;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'LeeSeoyun';
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
  background-color: #2172ce;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'LeeSeoyun';
}

.map-info-window {
  padding: 8px 12px;
  max-width: 200px;
  font-family: 'LeeSeoyun';
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

/* 헤더 섹션 스타일 */
.header-section {
  background-color: white;
  border-bottom: 1px solid #eee;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-family: 'LeeSeoyun';
}

.plan-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1550px;
  margin: 0 auto;
  gap: 20px; 
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.plan-title-input:focus {
  outline: none;
  background-color: #f8f9fa;
  box-shadow: 0 0 0 2px rgba(33, 114, 206, 0.1);
}

.plan-title-input::placeholder {
  color: #999;
  font-weight: 400;
}

.plan-options {
  display: flex;
  align-items: center;
  gap: 1.5rem;
font-family: 'LeeSeoyun';
}

.public-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
  font-family: 'LeeSeoyun';
}

.public-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #2172ce;
  
}

.save-plan-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #2172ce 0%, #2c88f1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(33, 114, 206, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-family: 'LeeSeoyun';
}

.save-plan-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(135deg, #2c88f1 0%, #2172ce 100%);
  transition: width 0.5s ease;
  z-index: -1;
  border-radius: 8px;

}

.save-plan-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(33, 114, 206, 0.4);
}

.save-plan-button:hover::before {
  width: 100%;
}

.save-plan-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.save-plan-button.saving {
  background: #2172ce;
  cursor: wait;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.save-modal-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  font-family: 'LeeSeoyun';
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
  font-family: 'LeeSeoyun';
}

.success-icon, .error-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-family: 'LeeSeoyun';
}

.success-message p, .error-message p {
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-family: 'LeeSeoyun';
}

.ok-button {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #2172ce 0%, #2c88f1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-family: 'LeeSeoyun';
}

.ok-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(135deg, #2c88f1 0%, #2172ce 100%);
  transition: width 0.5s ease;
  z-index: -1;
  border-radius: 8px;
  font-family: 'LeeSeoyun';
}

.ok-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 114, 206, 0.3);
}

.ok-button:hover::before {
  width: 100%;
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
    font-family: 'LeeSeoyun';
  }
}
</style>