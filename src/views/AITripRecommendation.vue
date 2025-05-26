<template>
  <div class="container">
    <!-- 배경 그라데이션 원형들 -->
    <div class="gradient-circle circle1"></div>
    <div class="gradient-circle circle2"></div>
    <div class="gradient-circle circle3"></div>
    <div class="gradient-circle circle4"></div>
    <div class="gradient-circle circle5"></div>
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
        <img :src="getAreaImage()" alt="지역 이미지" class="area-image">
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
          fetch(`${import.meta.env.VITE_API_URL || ''}/api/attraction/${placeId}`, {
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
      
      if (window.kakao && window.kakao.maps) {
        this.renderMap();
      } else {
        // 카카오맵 API 로드
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
        script.onload = () => {
          window.kakao.maps.load(() => {
            this.renderMap();
          });
        };
        document.head.appendChild(script);
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
        // 추천 여행 계획을 새 여행 계획으로 저장하는 API 호출
        const requestData = {
          title: `${this.getAreaName()} ${this.getDurationText()} 여행`,
          startDate: new Date().toISOString().split('T')[0], // 오늘 날짜를 기본값으로
          endDate: new Date(new Date().getTime() + (this.formData.durationDays - 1) * 86400000).toISOString().split('T')[0],
          isPublic: true
        };
        
        // API 호출
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          credentials: 'include' // 쿠키 포함
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('여행 계획 생성 실패');
          }
          return response.json();
        })
        .then(planData => {
          console.log('생성된 여행 계획:', planData);
          
          // 추천된 여행 일정 아이템들을 새 계획에 추가
          const addItemPromises = [];
          
          this.recommendation.days.forEach(day => {
            const dayId = planData.days.find(d => d.dayDate === day.dayDate)?.dayId;
            if (!dayId) return;
            
            day.items.forEach(item => {
              const itemRequest = {
                dayId: dayId,
                placeId: item.placeId,
                sequence: item.sequence,
                startTime: null, // 실제로는 적절한 시간 설정 필요
                endTime: null,
                memo: item.memo
              };
              
              // 아이템 추가 API 호출
              const promise = fetch(`${import.meta.env.VITE_API_URL || ''}/api/plan/${planData.planId}/day/${dayId}/item`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemRequest),
                credentials: 'include'
              });
              
              addItemPromises.push(promise);
            });
          });
          
          // 모든 아이템 추가가 완료되면 편집 페이지로 이동
          Promise.all(addItemPromises)
            .then(() => {
              // 여행 계획 편집 페이지로 이동
              this.$router.push(`/plan?id=${planData.planId}`);
            })
            .catch(error => {
              console.error('일정 아이템 추가 실패:', error);
              // 오류가 있어도 편집 페이지로 이동
              this.$router.push(`/plan?id=${planData.planId}`);
            });
        })
        .catch(error => {
          console.error('여행 계획 저장 실패:', error);
          alert('여행 계획을 저장하는 중 오류가 발생했습니다.');
        });
        
      } catch (error) {
        console.error('내 여행 경로로 편집 실패:', error);
        alert('여행 계획을 저장하는 중 오류가 발생했습니다.');
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
      
      return images[this.formData.areaCode] || 'https://images.unsplash.com/photo-1517154421773-0529f29ea451'; // 기본 이미지
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
      if (this.attractionsCache[placeId]) {
        return this.attractionsCache[placeId].category1 || '관광명소';
      }
      return '관광명소';
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  min-height: 100vh;
  background-color: #ffffff;
}

/* 배경 그라데이션 원형 */
.gradient-circle {
  position: absolute;
  border-radius: 65% 35% 60% 40% / 60% 40% 60% 40%;
  z-index: -1;
  opacity: 0.7;
}

.circle1 {
  top: -10%;
  left: -5%;
  width: 45vw;
  height: 35vw;
  background: radial-gradient(ellipse, rgba(213, 224, 251, 0.9) 0%, rgba(213, 224, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
}

.circle2 {
  bottom: -15%;
  right: -10%;
  width: 50vw;
  height: 38vw;
  background: radial-gradient(ellipse, rgba(213, 237, 251, 0.9) 0%, rgba(213, 237, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
}

.circle3 {
  top: 20%;
  right: 10%;
  width: 35vw;
  height: 25vw;
  background: radial-gradient(ellipse, rgba(213, 222, 251, 0.85) 0%, rgba(213, 222, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
}

.circle4 {
  bottom: 30%;
  left: 5%;
  width: 28vw;
  height: 22vw;
  background: radial-gradient(ellipse, rgba(213, 232, 251, 0.9) 0%, rgba(213, 232, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
}

.circle5 {
  top: 45%;
  left: 30%;
  width: 40vw;
  height: 28vw;
  background: radial-gradient(ellipse, rgba(213, 224, 251, 0.85) 0%, rgba(213, 224, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
}

/* 페이지 제목 */
.page-title {
  font-size: 2.5rem;
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.page-subtitle {
  font-size: 1.2rem;
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

/* 폼 스타일 */
.recommendation-form {
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  color: #444;
  margin-bottom: 1rem;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.option-button {
  padding: 1rem;
  background-color: #f5f7fb;
  border: 1px solid #e0e4ec;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  color: #555;
  text-align: center;
}

.option-button:hover {
  background-color: #eaeffd;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.option-button.active {
  background-color: #9581e8;
  color: white;
  border-color: #9581e8;
  box-shadow: 0 5px 15px rgba(149, 129, 232, 0.3);
}

.submit-button {
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 3rem auto 1rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #9581e8 0%, #a2b3f8 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 20px rgba(149, 129, 232, 0.4);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(149, 129, 232, 0.5);
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
}

.loading-box {
  background-color: white;
  border-radius: 15px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.spinner {
  width: 70px;
  height: 70px;
  margin: 0 auto 2rem;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #9581e8;
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
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #9581e8 0%, #a2b3f8 100%);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 1rem;
  color: #666;
}

/* 결과 화면 스타일 */
.result-container {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.result-header {
  display: flex;
  align-items: center;
  padding: 2rem;
  background-color: #f8f9fa;
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
}

.result-subtitle {
  font-size: 1.3rem;
  color: #9581e8;
  margin-bottom: 0.5rem;
}

.result-description {
  font-size: 1rem;
  color: #666;
}

.map-container {
  width: 100%;
  height: 400px;
  background-color: #f0f4ff;
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
  background-color: rgba(240, 244, 255, 0.8);
}

.map-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #9581e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.day-tabs {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
}

.day-tab {
  padding: 0.8rem 1.5rem;
  margin-right: 0.5rem;
  background-color: #f5f7fb;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
  white-space: nowrap;
}

.day-tab.active {
  background-color: #9581e8;
  color: white;
}

.places-list {
  padding: 2rem;
}

.day-places {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.place-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s;
}

.place-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.place-number {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #9581e8;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
}

.place-info {
  flex: 1;
}

.place-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.place-category {
  font-size: 0.9rem;
  color: #9581e8;
  margin-bottom: 0.5rem;
}

.place-memo {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid #eee;
}

.action-btn {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
}

.retry-btn {
  background-color: #f0f0f0;
  color: #666;
  border: none;
}

.retry-btn:hover {
  background-color: #e0e0e0;
}

.change-btn {
  background-color: #f5f7fb;
  color: #9581e8;
  border: 1px solid #9581e8;
}

.change-btn:hover {
  background-color: #eaeffd;
}

.edit-btn {
  background-color: #9581e8;
  color: white;
  border: none;
}

.edit-btn:hover {
  background-color: #8571d8;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(149, 129, 232, 0.3);
}

/* 에러 메시지 */
.error-message {
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 1rem;
  border-radius: 10px;
  margin: 2rem 0;
  text-align: center;
}

.error-message button {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  cursor: pointer;
}

/* 반응형 디자인 */
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
}
</style>