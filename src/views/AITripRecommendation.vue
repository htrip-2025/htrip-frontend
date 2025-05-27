<template>
  <div class="container">
    
    <p class="page-subtitle">여행 계획을 위한 키워드를 선택해주세요</p>

    <!-- 조건 선택 폼 (처음 화면) -->
    <div v-if="step === 'form'" class="recommendation-form">
      <!-- 지역 선택 -->
      <div class="form-section">
        <h2 class="section-title">지역</h2>
        <div class="button-grid">
          <button 
            v-for="area in areaOptions" 
            :key="area.code"
            class="option-button"
            :class="{ active: formData.areaCode === area.code }"
            @click="formData.areaCode = area.code"
          >
            {{ area.name }}
          </button>
        </div>
      </div>

      <!-- 기간 선택 -->
      <div class="form-section">
        <h2 class="section-title">기간</h2>
        <div class="button-grid">
          <button 
            v-for="duration in durationOptions" 
            :key="duration.days"
            class="option-button"
            :class="{ active: formData.durationDays === duration.days }"
            @click="formData.durationDays = duration.days"
          >
            {{ duration.name }}
          </button>
        </div>
      </div>

      <!-- 누구와? -->
      <div class="form-section">
        <h2 class="section-title">누구와?</h2>
        <div class="button-grid">
          <button 
            v-for="companion in travelWithOptions" 
            :key="companion.id"
            class="option-button"
            :class="{ active: formData.travelWith === companion.id }"
            @click="formData.travelWith = companion.id"
          >
            {{ companion.name }}
          </button>
        </div>
      </div>

      <!-- 여행 스타일 -->
      <div class="form-section">
        <h2 class="section-title">여행 스타일 (다중 선택 가능)</h2>
        <div class="button-grid">
          <button 
            v-for="style in travelStyleOptions" 
            :key="style.id"
            class="option-button"
            :class="{ active: formData.travelStyles.includes(style.id) }"
            @click="toggleTravelStyle(style.id)"
          >
            {{ style.name }}
          </button>
        </div>
      </div>

      <!-- 선호하는 여행 일정 -->
      <div class="form-section">
        <h2 class="section-title">선호하는 여행 일정</h2>
        <div class="button-grid">
          <button 
            v-for="schedule in scheduleTypeOptions" 
            :key="schedule.id"
            class="option-button"
            :class="{ active: formData.scheduleType === schedule.id }"
            @click="formData.scheduleType = schedule.id"
          >
            {{ schedule.name }}
          </button>
        </div>
      </div>

      <!-- 추천 받기 버튼 -->
      <button 
        class="submit-button" 
        :disabled="!isFormValid"
        @click="getRecommendation"
      >
        여행 경로 추천받기
      </button>
    </div>

    <!-- 로딩 화면 -->
    <div v-if="step === 'loading'" class="loading-container">
      <div class="loading-box">
        <div class="spinner"></div>
        <h2 class="loading-title">AI가 최적의 여행 경로를 찾고 있어요</h2>
        <p class="loading-message">{{ loadingMessages[currentMessageIndex] }}</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <p class="progress-text">{{ progress }}%</p>
      </div>
    </div>

    <!-- 결과 화면 -->
    <div v-if="step === 'result'" class="result-container">
      <div class="result-header">
        <img src="https://i.pinimg.com/736x/22/8a/da/228adaff2bc066e8fc04218bf72e5225.jpg" alt="지역 이미지" class="area-image">
        <div class="result-title-container">
          <h2 class="result-title">{{ getAreaName() }}, {{ getDurationText() }}</h2>
          <h3 class="result-subtitle">추천일정입니다.</h3>
          <p class="result-description">AI가 추천한 맞춤일정으로 여행을 떠나보세요.</p>
        </div>
      </div>

      <!-- 지도 영역 -->
      <div class="map-container" ref="mapContainer">
        <div v-if="!mapLoaded" class="map-loading">
          <div class="map-spinner"></div>
          <p>지도를 불러오는 중...</p>
        </div>
      </div>

      <!-- 일차별 탭 -->
      <div class="day-tabs">
        <button 
          v-for="day in recommendation.days" 
          :key="day.dayDate"
          class="day-tab"
          :class="{ active: selectedDay === day.dayDate }"
          @click="selectedDay = day.dayDate"
        >
          Day {{ day.dayDate }}
        </button>
      </div>

      <!-- 일차별 장소 목록 -->
      <div class="places-list">
        <div 
          v-for="day in recommendation.days" 
          :key="day.dayDate"
          v-show="selectedDay === day.dayDate"
          class="day-places"
        >
          <div 
            v-for="(item, index) in day.items" 
            :key="index"
            class="place-item"
          >
            <div class="place-number">{{ index + 1 }}</div>
            <div class="place-info">
              <h4 class="place-name">{{ getPlaceName(item.placeId) }}</h4>
              <p class="place-category">{{ getPlaceCategory(item.placeId) }}</p>
              <p class="place-memo">{{ item.memo }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 액션 버튼들 -->
      <div class="action-buttons">
        <button class="action-btn retry-btn" @click="getRecommendation">
          다시하기
        </button>
        <button class="action-btn change-btn" @click="step = 'form'">
          다른 조건으로 추천받기
        </button>
        <button class="action-btn edit-btn" @click="editInMyPlan">
          내 여행경로에서 편집
        </button>
      </div>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="error = null; step = 'form'">다시 시도하기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AITripRecommendation',
  data() {
    return {
      step: 'form', // form, loading, result
      formData: {
        areaCode: null,
        durationDays: null,
        travelWith: null,
        travelStyles: [],
        scheduleType: null
      },
      recommendation: null,
      progress: 0,
      currentMessageIndex: 0,
      messageInterval: null,
      progressInterval: null,
      error: null,
      mapLoaded: false,
      selectedDay: 1,
      attractionsCache: {},
      
      // 옵션 데이터
      areaOptions: [
        { code: 1, name: '서울' },
        { code: 31, name: '경기' },
        { code: 32, name: '인천' },
        { code: 33, name: '강원' },
        { code: 34, name: '충청' },
        { code: 35, name: '전라' },
        { code: 36, name: '경상' },
        { code: 39, name: '제주' }
      ],
      durationOptions: [
        { days: 1, name: '당일치기' },
        { days: 2, name: '1박2일' },
        { days: 3, name: '2박3일' },
        { days: 4, name: '3박4일' },
        { days: 5, name: '4박5일' },
        { days: 6, name: '5박6일 이상' }
      ],
      travelWithOptions: [
        { id: 'alone', name: '혼자' },
        { id: 'friends', name: '친구와' },
        { id: 'couple', name: '커플' },
        { id: 'spouse', name: '배우자' },
        { id: 'kids', name: '아이와' },
        { id: 'parents', name: '부모님과' },
        { id: 'group', name: '단체' }
      ],
      travelStyleOptions: [
        { id: '자연/풍경', name: '자연/풍경' },
        { id: '맛집/음식', name: '맛집/음식' },
        { id: '역사/문화', name: '역사/문화' },
        { id: '쇼핑', name: '쇼핑' },
        { id: '휴양/힐링', name: '휴양/힐링' },
        { id: '액티비티', name: '액티비티' },
        { id: '사진촬영', name: '사진촬영' },
        { id: '예술/공연', name: '예술/공연' },
        { id: '캠핑', name: '캠핑' },
        { id: '테마파크', name: '테마파크' }
      ],
      scheduleTypeOptions: [
        { id: '빡빡', name: '빡빡' },
        { id: '널널', name: '널널' }
      ],
      loadingMessages: [
        "여행지 정보를 수집하고 있어요...",
        "당신의 취향을 분석하고 있어요...",
        "최적의 경로를 계산하고 있어요...",
        "맛있는 식당을 찾고 있어요...",
        "특별한 장소를 발견했어요!",
        "여행 일정을 최종 정리하고 있어요..."
      ]
    };
  },
  computed: {
    // 폼 유효성 검사
    isFormValid() {
      return this.formData.areaCode !== null && 
             this.formData.durationDays !== null && 
             this.formData.travelWith !== null && 
             this.formData.travelStyles.length > 0 && 
             this.formData.scheduleType !== null;
    }
  },
  methods: {
    // 여행 스타일 토글
    toggleTravelStyle(styleId) {
      const index = this.formData.travelStyles.indexOf(styleId);
      if (index === -1) {
        this.formData.travelStyles.push(styleId);
      } else {
        this.formData.travelStyles.splice(index, 1);
      }
    },
    
    // 추천 받기
    async getRecommendation() {
      this.step = 'loading';
      this.startLoadingAnimation();
      
      try {
        // API 요청 데이터 준비
        const requestData = {
          areaCode: this.formData.areaCode,
          durationDays: this.formData.durationDays,
          travelWith: this.formData.travelWith,
          travelStyles: this.formData.travelStyles,
          scheduleType: this.formData.scheduleType
        };
        
        // 백엔드 API 호출
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/ai`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          credentials: 'include' // 쿠키 포함
        });
        
        if (!response.ok) {
          throw new Error(`API 호출 실패: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API 응답:', data);
        
        // API 응답 형식에 맞게 데이터 변환
        this.recommendation = {
          id: data.recommendationId,
          days: data.recommendedPlan.days
        };
        
        // 추천된 장소 ID 추출
        const placeIds = [];
        this.recommendation.days.forEach(day => {
          day.items.forEach(item => {
            if (item.placeId && !this.attractionsCache[item.placeId]) {
              placeIds.push(item.placeId);
            }
          });
        });
        
        // 장소 상세 정보 가져오기
        if (placeIds.length > 0) {
          await this.fetchAttractionDetails(placeIds);
        }
        
        // 로딩 완료
        this.progress = 100;
        setTimeout(() => {
          this.stopLoadingAnimation();
          this.step = 'result';
          this.selectedDay = 1;
          
          // 지도 초기화
          this.$nextTick(() => {
            this.initializeMap();
          });
        }, 500);
        
      } catch (err) {
        console.error('추천 받기 실패:', err);
        this.error = '여행 경로 추천을 받는 중 오류가 발생했습니다. 다시 시도해주세요.';
        this.stopLoadingAnimation();
        this.step = 'form';
      }
    },
    
    // 장소 상세 정보 가져오기
    async fetchAttractionDetails(placeIds) {
      try {
        // 병렬로 모든 관광지 정보 요청
        const fetchPromises = placeIds.map(placeId => 
          fetch(`${import.meta.env.VITE_API_URL || ''}/api/travel/${placeId}`, {
            credentials: 'include' // 쿠키 포함
          }).then(response => {
            if (!response.ok) {
              throw new Error(`관광지 정보 조회 실패: ${response.status}`);
            }
            return response.json();
          })
        );
        
        // 모든 요청의 응답 대기
        const responses = await Promise.all(fetchPromises);
        
        // 응답 데이터를 캐시에 저장
        responses.forEach(attraction => {
          if (attraction && attraction.placeId) {
            this.attractionsCache[attraction.placeId] = attraction;
          }
        });
        
        console.log('관광지 정보 로드 완료:', Object.keys(this.attractionsCache).length);
      } catch (err) {
        console.error('관광지 정보 가져오기 실패:', err);
        // 에러가 발생해도 일부 기능은 계속 작동하도록 처리
        
        // 백업 방법: 없는 정보는 임시 데이터 생성
        placeIds.forEach(placeId => {
          if (!this.attractionsCache[placeId]) {
            this.attractionsCache[placeId] = {
              placeId: placeId,
              title: `장소 ${placeId}`,
              category1: "관광명소",
              address1: "주소 정보 없음",
              latitude: 37.5665 + (Math.random() * 0.1 - 0.05), // 서울 중심 근처 랜덤 좌표
              longitude: 126.9780 + (Math.random() * 0.1 - 0.05)
            };
          }
        });
      }
    },
    
    // 로딩 애니메이션 시작
    startLoadingAnimation() {
      this.progress = 0;
      this.currentMessageIndex = 0;
      
      // 메시지 변경 인터벌
      this.messageInterval = setInterval(() => {
        this.currentMessageIndex = (this.currentMessageIndex + 1) % this.loadingMessages.length;
      }, 3000);
      
      // 진행 상태 인터벌
      this.progressInterval = setInterval(() => {
        if (this.progress < 95) {
          this.progress += Math.floor(Math.random() * 5) + 1;
          if (this.progress > 95) {
            this.progress = 95;
          }
        }
      }, 500);
    },
    
    // 로딩 애니메이션 중지
    stopLoadingAnimation() {
      clearInterval(this.messageInterval);
      clearInterval(this.progressInterval);
    },
    
    // 지도 초기화
    initializeMap() {
    if (!this.$refs.mapContainer || !this.recommendation) return;

    // 1) 로드 후 renderMap() 실행
    const loadAndRender = () => {
      // maps 내부 모듈이 완전히 준비되는 시점
      window.kakao.maps.load(() => {
        this.renderMap();
      });
    };

    // 2) SDK 스크립트가 전혀 없다면 삽입  
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
      script.onload = loadAndRender;
      document.head.appendChild(script);

    // 3) SDK는 이미 로드되어 있지만, loadAndRender()가 한 번도 실행되지 않았다면
    } else {
      loadAndRender();
    }
  },
    
    // 지도 렌더링
    renderMap() {
      const currentDay = this.recommendation.days.find(day => day.dayDate === this.selectedDay);
      if (!currentDay) return;
      
      const coordinates = [];
      currentDay.items.forEach(item => {
        const attraction = this.attractionsCache[item.placeId];
        if (attraction && attraction.latitude && attraction.longitude) {
          coordinates.push({
            lat: parseFloat(attraction.latitude),
            lng: parseFloat(attraction.longitude),
            name: attraction.title,
            sequence: item.sequence
          });
        }
      });
      
      if (coordinates.length === 0) return;
      
      // 지도 생성
      const mapContainer = this.$refs.mapContainer;
      const mapOption = {
        center: new window.kakao.maps.LatLng(coordinates[0].lat, coordinates[0].lng),
        level: 7
      };
      
      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      
      // 좌표 순서로 정렬
      coordinates.sort((a, b) => a.sequence - b.sequence);
      
      // 선 그리기
      if (coordinates.length > 1) {
        const linePath = coordinates.map(coord => 
          new window.kakao.maps.LatLng(coord.lat, coord.lng)
        );
        
        const polyline = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: '#9581e8',
          strokeOpacity: 0.7,
          strokeStyle: 'solid'
        });
        
        polyline.setMap(map);
      }
      
      // 마커 추가
      coordinates.forEach((coord, index) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(coord.lat, coord.lng),
          map: map
        });
        
        // 인포윈도우 생성
        const infoContent = `<div style="padding:5px;font-size:12px;text-align:center;width:150px;">${index + 1}. ${coord.name}</div>`;
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoContent
        });
        
        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(map, marker);
        });
        
        // 첫번째 마커는 기본적으로 인포윈도우 표시
        if (index === 0) {
          infoWindow.open(map, marker);
        }
      });
      
      // 지도 범위 재설정
      const bounds = new window.kakao.maps.LatLngBounds();
      coordinates.forEach(coord => {
        bounds.extend(new window.kakao.maps.LatLng(coord.lat, coord.lng));
      });
      map.setBounds(bounds);
      
      this.mapLoaded = true;
    },
    
    // 내 여행 경로에서 편집
editInMyPlan() {
  if (!this.recommendation) return;
  
  try {
    // 추천 데이터를 전달할 형태로 변환
    const tripPlanData = {
      title: `${this.getAreaName()} ${this.getDurationText()} 여행`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().getTime() + (this.formData.durationDays - 1) * 86400000).toISOString().split('T')[0],
      isPublic: true,
      days: this.recommendation.days.map(day => ({
        dayId: `temp_${day.dayDate}`,
        dayDate: day.dayDate,
        items: day.items.map((item, index) => {
          const attraction = this.attractionsCache[item.placeId];
          return {
            placeId: item.placeId,
            title: attraction?.title || `장소 ${item.placeId}`,
            address1: attraction?.address1 || '',
            telephone: attraction?.telephone || '',
            latitude: attraction?.latitude || null,
            longitude: attraction?.longitude || null,
            memo: item.memo || null,
            startTime: null,
            endTime: null,
            sequence: index + 1
          };
        })
      })),
      metadata: {
        source: 'ai-recommendation',
        recommendationId: this.recommendation.id,
        originalFormData: { ...this.formData }
      }
    };

    // 방법 1: sessionStorage 사용 (가장 간단)
    sessionStorage.setItem('aiRecommendedPlan', JSON.stringify(tripPlanData));
    this.$router.push('/plan');

    // 방법 2: 라우터 params로 전달 (백업)
    // this.$router.push({
    //   path: '/plan',
    //   query: { 
    //     source: 'ai-recommendation',
    //     planData: encodeURIComponent(JSON.stringify(tripPlanData))
    //   }
    // });

  } catch (error) {
    console.error('여행 계획으로 이동 실패:', error);
    alert('여행 계획 페이지로 이동하는 중 오류가 발생했습니다.');
  }
},
    
    // 지역 이미지 가져오기
    getAreaImage() {
      // 예시 이미지 URL (실제 구현 시에는 적절한 이미지 URL로 대체)
      const images = {
        1: 'https://images.unsplash.com/photo-1538485399081-7c0be8fa5773',  // 서울
        31: 'https://images.unsplash.com/photo-1602479185248-15f38a637082', // 경기
        32: 'https://images.unsplash.com/photo-1594822627896-21b735903dd4', // 인천
        33: 'https://images.unsplash.com/photo-1580631569230-93a5f2dd5cd3', // 강원
        39: 'https://images.unsplash.com/photo-1547093349-65cdba98369a'     // 제주
      };
      
      return images[this.formData.areaCode] || 'https://i.pinimg.com/736x/22/8a/da/228adaff2bc066e8fc04218bf72e5225.jpg'; // 기본 이미지
    },
    
    // 지역명 가져오기
    getAreaName() {
      const area = this.areaOptions.find(a => a.code === this.formData.areaCode);
      return area ? area.name : '선택한 지역';
    },
    
    // 기간 텍스트 가져오기
    getDurationText() {
      const duration = this.durationOptions.find(d => d.days === this.formData.durationDays);
      return duration ? duration.name : `${this.formData.durationDays}일`;
    },
    
    // 장소 이름 가져오기
    getPlaceName(placeId) {
      if (this.attractionsCache[placeId]) {
        return this.attractionsCache[placeId].title;
      }
      return `장소 ${placeId}`;
    },
    
    // 장소 카테고리 가져오기
    getPlaceCategory(placeId) {
        const ctId = this.attractionsCache[placeId]?.contentTypeId;
        switch (ctId) {
        case 12: return '관광지';
        case 14: return '문화시설';
        case 15: return '행사/공연/축제';
        case 25: return '여행코스';
        case 28: return '레포츠';
        case 32: return '숙박';
        case 38: return '쇼핑';
        case 39: return '음식점';
        default: return '관광명소';
        }
    }
  },
  created() {
    // 폼 데이터 복원 (로컬 스토리지 사용)
    const savedFormData = localStorage.getItem('aiTripFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        Object.assign(this.formData, parsedData);
      } catch (e) {
        console.error('저장된 폼 데이터를 불러오는데 실패했습니다:', e);
      }
    }
  },
  watch: {
    formData: {
      handler(newValue) {
        // 폼 데이터 저장 (로컬 스토리지 사용)
        localStorage.setItem('aiTripFormData', JSON.stringify(newValue));
      },
      deep: true
    },
    selectedDay() {
      if (this.step === 'result') {
        this.mapLoaded = false;
        this.$nextTick(() => {
          this.initializeMap();
        });
      }
    }
  },
  beforeUnmount() {
    // 인터벌 정리
    this.stopLoadingAnimation();
  }
};
</script>
<style scoped>
/* 기본 스타일 */
.container {
  width: 100vw;
  min-height: 100vh;
  padding: 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  
  /* 배경 이미지 설정 */
  background-image: url('https://i.pinimg.com/736x/5e/9f/07/5e9f07d84b763d9fd5becff18cc6e99e.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* 스크롤바 숨기기 (선택사항) */
.container::-webkit-scrollbar {
  width: 8px;
}

.container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 페이지 제목 */
.page-title {
  font-size: 2.5rem;
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   font-family: 'LeeSeoyun';
}

.page-subtitle {
  font-size: 1.2rem;
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 600;
   font-family: 'LeeSeoyun';
}

/* 폼 스타일 */
.recommendation-form {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  color: #444;
  margin-bottom: 1rem;
  font-weight: 600;
   font-family: 'LeeSeoyun';

}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.option-button {
  padding: 1rem;
  background-color: rgba(245, 247, 251, 0.9);
  border: 1px solid #e0e4ec;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  color: #555;
  text-align: center;
  backdrop-filter: blur(5px);
   font-family: 'LeeSeoyun';
}

.option-button:hover {
  background-color: rgba(234, 239, 253, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.option-button.active {
  background-color: #2172ce;
  color: white;
  border-color: #2172ce;
  box-shadow: 0 5px 15px rgba(33, 114, 206, 0.3);
}

.submit-button {
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 3rem auto 1rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #2172ce 0%, #2c88f1 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 20px rgba(33, 114, 206, 0.4);
  position: relative;
  overflow: hidden;
  z-index: 1;
   font-family: 'LeeSeoyun';
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(135deg, #2c88f1 0%, #2172ce 100%);
  transition: width 0.5s ease;
  z-index: -1;
  border-radius: 10px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(33, 114, 206, 0.5);
}

.submit-button:hover::before {
  width: 100%;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

/* 로딩 화면 스타일 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-box {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.spinner {
  width: 70px;
  height: 70px;
  margin: 0 auto 2rem;
  border: 6px solid rgba(243, 243, 243, 0.8);
  border-top: 6px solid #2172ce;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
   font-family: 'LeeSeoyun';
}

.loading-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  min-height: 3.3rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: rgba(240, 240, 240, 0.8);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2172ce 0%, #2c88f1 100%);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
   font-family: 'LeeSeoyun';
}

/* 결과 화면 스타일 */
.result-container {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.result-header {
  display: flex;
  align-items: center;
  padding: 2rem;
  background-color: rgba(248, 249, 250, 0.9);
  backdrop-filter: blur(5px);
}

.area-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 2rem;
  border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
}

.result-title-container {
  flex: 1;
}

.result-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 700;
   font-family: 'LeeSeoyun';
}

.result-subtitle {
  font-size: 1.3rem;
  color: #2172ce;
  margin-bottom: 0.5rem;
  font-weight: 600;
   font-family: 'LeeSeoyun';

}

.result-description {
  font-size: 1rem;
  color: #666;
   font-family: 'LeeSeoyun';
}

.map-container {
  width: 100%;
  height: 400px;
  background-color: rgba(240, 244, 255, 0.9);
  position: relative;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(240, 244, 255, 0.9);
  backdrop-filter: blur(5px);
}

.map-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(243, 243, 243, 0.8);
  border-top: 4px solid #2172ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
   font-family: 'LeeSeoyun';
}

.day-tabs {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid rgba(238, 238, 238, 0.8);
  overflow-x: auto;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
   font-family: 'LeeSeoyun';
}

.day-tab {
  padding: 0.8rem 1.5rem;
  margin-right: 0.5rem;
  background-color: rgba(245, 247, 251, 0.9);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
  white-space: nowrap;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
   font-family: 'LeeSeoyun';
}

.day-tab.active {
  background-color: #2172ce;
  color: white;
  box-shadow: 0 3px 10px rgba(33, 114, 206, 0.3);
}

.day-tab:hover:not(.active) {
  background-color: rgba(234, 239, 253, 0.9);
}

.places-list {
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
   font-family: 'LeeSeoyun';
}

.day-places {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
   font-family: 'LeeSeoyun';
}

.place-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: rgba(248, 249, 250, 0.9);
  border-radius: 10px;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
   font-family: 'LeeSeoyun';
}

.place-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);
}

.place-number {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2172ce;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(33, 114, 206, 0.3);
   font-family: 'LeeSeoyun';
}

.place-info {
  flex: 1;
   font-family: 'LeeSeoyun';
}

.place-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
   font-family: 'LeeSeoyun';
}

.place-category {
  font-size: 0.9rem;
  color: #2172ce;
  margin-bottom: 0.5rem;
  font-weight: 500;
   font-family: 'LeeSeoyun';
}

.place-memo {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
   font-family: 'LeeSeoyun';
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid rgba(238, 238, 238, 0.8);
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
   font-family: 'LeeSeoyun';
    font-family: 'LeeSeoyun';
}

.action-btn {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
   font-family: 'LeeSeoyun';
    font-family: 'LeeSeoyun';
}

.retry-btn {
  background-color: rgba(240, 240, 240, 0.9);
  color: #666;
  border: 1px solid rgba(224, 224, 224, 0.8);
   font-family: 'LeeSeoyun';
}

.retry-btn:hover {
  background-color: rgba(224, 224, 224, 0.9);
  transform: translateY(-2px);
}

.change-btn {
  background-color: rgba(245, 247, 251, 0.9);
  color: #2172ce;
  border: 1px solid rgba(33, 114, 206, 0.8);
}

.change-btn:hover {
  background-color: rgba(234, 239, 253, 0.9);
  transform: translateY(-2px);
}

.edit-btn {
  background-color: #2172ce;
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 3px 10px rgba(33, 114, 206, 0.3);
}

.edit-btn::before {
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

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(33, 114, 206, 0.4);
}

.edit-btn:hover::before {
  width: 100%;
}

/* 에러 메시지 */
.error-message {
  background-color: rgba(255, 245, 245, 0.95);
  color: #e53e3e;
  padding: 1rem;
  border-radius: 10px;
  margin: 2rem auto;
  text-align: center;
  max-width: 600px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(229, 62, 62, 0.3);
   font-family: 'LeeSeoyun';
}

.error-message button {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s;
   font-family: 'LeeSeoyun';
}

.error-message button:hover {
  background-color: #d32f2f;
  transform: translateY(-1px);
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .container {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .button-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .result-header {
    flex-direction: column;
    text-align: center;
  }
  
  .area-image {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .day-tabs {
    justify-content: flex-start;
  }
  
  .place-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0.5rem;
  }
  
  .recommendation-form,
  .loading-box,
  .result-container {
    margin: 0;
    border-radius: 10px;
  }
  
  .button-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.8rem;
  }
  
  .option-button {
    padding: 0.8rem 0.5rem;
    font-size: 0.9rem;
  }
}
</style>