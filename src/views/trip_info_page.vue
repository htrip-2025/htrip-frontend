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
        <a href="#" class="menu-link">여행계획</a>
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
      <!-- 지역 선택 필터 -->
      <div class="filter-section">
        <div class="filter-group">
          <label for="province-select">도/시 선택</label>
          <select 
            id="province-select" 
            v-model="selectedProvince" 
            @change="onProvinceChange"
            class="filter-select"
          >
            <option disabled value="">도 선택</option>
            <option v-for="province in provinces" :key="province">{{ province }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="city-select">시/군 선택</label>
          <select 
            id="city-select" 
            v-model="selectedCity"
            class="filter-select"
            :disabled="!selectedProvince"
          >
            <option disabled value="">시/군 선택</option>
            <option v-for="city in filteredCities" :key="city">{{ city }}</option>
          </select>
        </div>
      </div>
      
      <!-- 필터링된 결과가 없을 때 메시지 -->
      <div v-if="filteredPlaces.length === 0 && (selectedProvince || selectedCity)" class="no-results">
        선택한 지역에 등록된 관광지가 없습니다. 다른 지역을 선택해 주세요.
      </div>
      
      <!-- 관광지 리스트 -->
      <div class="place-list" v-else>
        <div 
          v-for="place in filteredPlaces" 
          :key="place.id" 
          class="place-card"
        >
          <div class="place-image">
            <img :src="place.imageUrl" :alt="place.name">
          </div>
          <div class="place-info">
            <h3 class="place-name">{{ place.name }}</h3>
            <div class="place-location">
              <span class="location-icon">📍</span>
              <span>{{ place.province }} {{ place.city }}</span>
            </div>
            <p class="place-description">{{ place.description }}</p>
            <div class="place-meta">
              <span class="place-rating">⭐ {{ place.rating }}/5</span>
              <span class="place-visitors">👁️ {{ place.visitors }}명 방문</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 페이지네이션 -->
      <div class="pagination">
        <button class="pagination-btn prev">이전</button>
        <button class="pagination-btn active">1</button>
        <button class="pagination-btn">2</button>
        <button class="pagination-btn">3</button>
        <button class="pagination-btn next">다음</button>
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
import { ref, computed } from 'vue';

// 상태 관리
const selectedProvince = ref('');
const selectedCity = ref('');

// 도/시 데이터
const provinces = [
  '서울', '경기도', '강원도', '충청북도', '충청남도',
  '전라북도', '전라남도', '경상북도', '경상남도', '제주도',
  '부산', '대구', '인천', '광주', '대전', '울산', '세종'
];

const citiesByProvince = {
  '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
         '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
         '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '부산': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구',
         '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  '대구': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
  '인천': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '광주': ['동구', '서구', '남구', '북구', '광산구'],
  '대전': ['동구', '중구', '서구', '유성구', '대덕구'],
  '울산': ['중구', '남구', '동구', '북구', '울주군'],
  '세종': ['세종시'],

  '경기도': ['수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '안양시', '남양주시',
           '화성시', '평택시', '의정부시', '시흥시', '파주시', '김포시', '광주시', '광명시',
           '군포시', '오산시', '이천시', '안성시', '의왕시', '하남시', '여주시', '양평군',
           '동두천시', '구리시', '과천시', '연천군', '가평군', '포천시'],
  '강원도': ['춘천시', '원주시', '강릉시', '동해시', '속초시', '삼척시', '태백시',
           '홍천군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군', '평창군', '정선군', '영월군'],
  '충청북도': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '단양군'],
  '충청남도': ['천안시', '아산시', '서산시', '당진시', '공주시', '보령시', '논산시', '계룡시',
            '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
  '전라북도': ['전주시', '익산시', '군산시', '정읍시', '남원시', '김제시',
           '완주군', '고창군', '부안군', '임실군', '순창군', '진안군', '장수군', '무주군'],
  '전라남도': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군',
           '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군',
           '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
  '경상북도': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시',
           '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군',
           '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
  '경상남도': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시',
           '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군',
           '함양군', '거창군', '합천군'],
  '제주도': ['제주시', '서귀포시']
};


// 샘플 관광지 데이터
const places = [
  {
    id: 1,
    name: '경복궁',
    province: '서울',
    city: '종로구',
    description: '조선 왕조의 법궁으로, 조선 건국 후 첫 번째로 지어진 궁궐입니다.',
    imageUrl: 'https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg',
    rating: 4.7,
    visitors: 12500
  },
  {
    id: 2,
    name: '남산타워',
    province: '서울',
    city: '용산구',
    description: '남산 정상에 위치한 높이 236.7m의 송신탑으로, 서울의 랜드마크입니다.',
    imageUrl: 'https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg',
    rating: 4.5,
    visitors: 10800
  },
  {
    id: 3,
    name: '에버랜드',
    province: '경기도',
    city: '용인시',
    description: '한국 최대의 테마파크로, 5개의 테마존으로 구성되어 있습니다.',
    imageUrl: 'https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg',
    rating: 4.6,
    visitors: 15300
  },
  {
    id: 4,
    name: '해운대 해수욕장',
    province: '경상남도',
    city: '부산시',
    description: '부산의 대표적인 해수욕장으로, 아름다운 해변과 다양한 축제가 열립니다.',
    imageUrl: 'https://i.pinimg.com/736x/7d/43/ff/7d43ff51a9f3ecedda6f12a43abdb5d8.jpg',
    rating: 4.8,
    visitors: 18200
  },
  {
    id: 5,
    name: '설악산',
    province: '강원도',
    city: '속초시',
    description: '한국에서 세 번째로 높은 산으로, 아름다운 자연 경관을 자랑합니다.',
    imageUrl: 'https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg',
    rating: 4.9,
    visitors: 8700
  },
  {
    id: 6,
    name: '한라산',
    province: '제주도',
    city: '제주시',
    description: '한국에서 가장 높은 산으로, 제주도의 중앙에 위치한 휴화산입니다.',
    imageUrl: 'https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg',
    rating: 4.9,
    visitors: 12100
  }
];

// 계산된 속성
const filteredCities = computed(() => {
  return selectedProvince.value ? citiesByProvince[selectedProvince.value] || [] : [];
});

const filteredPlaces = computed(() => {
  return places.filter(place => {
    // 도가 선택되지 않았으면 모든 장소 표시
    if (!selectedProvince.value) return true;
    
    // 도가 선택되었고 시/군은 선택되지 않았을 경우
    if (selectedProvince.value && !selectedCity.value) {
      return place.province === selectedProvince.value;
    }
    
    // 도와 시/군 모두 선택된 경우
    return place.province === selectedProvince.value && 
           place.city === selectedCity.value;
  });
});

// 메서드
function onProvinceChange() {
  // 도가 변경되면 시/군 선택 초기화
  selectedCity.value = '';
}
</script>

<style scoped>
/* 기본 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/* 전체 컨테이너 */
.info-container {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 6rem;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

/* 그라데이션 원형(타원형) 스타일 */
.gradient-circle {
  position: absolute;
  border-radius: 65% 35% 60% 40% / 60% 40% 60% 40%;
  z-index: 0;
  transform: skew(-5deg, -10deg);
  transition: background 0.5s ease, opacity 0.5s ease;
}

/* 개별 그라데이션 타원형 위치 및 스타일 */
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

/* 추가된 타원형들 */
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

/* 헤더 스타일 */
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

/* 로그인 버튼 스타일 */
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

/* 메인 콘텐츠 영역 */
.main-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.page-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
  text-align: center;
}

/* 필터 섹션 */
.filter-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  max-width: 460px;
  margin-left: auto;
  margin-right: auto;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 160px;
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

/* 결과 없음 메시지 */
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

/* 관광지 리스트 */
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
  margin-bottom: 1rem;
}

.location-icon {
  color: #9581e8;
}

.place-description {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 0.8rem;
  height: 3.6rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.place-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.place-rating {
  color: #ff9800;
}

/* 페이지네이션 */
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

.pagination-btn:hover:not(.active) {
  background-color: #f5f5f5;
}

/* 푸터 */
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
    max-width: 240px;
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
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
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