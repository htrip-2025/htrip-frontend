<template>
  <div class="travel-container">
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
        <span class="logo-icon">T</span>ravel
      </div>
      <div class="menu-items">
        <a href="#" class="menu-link active">Home</a>
        <a href="#" class="menu-link">Our Tours</a>
        <a href="#" class="menu-link">Reviews</a>
        <a href="#" class="menu-link contact-btn">Contact Us</a>
      </div>
    </header>

    <!-- 히어로 섹션 -->
    <section class="hero-section">
      <div class="hero-content">
        <p class="hero-subtitle">The vacation you deserve is closer than you think 🤔</p>
        <h1 class="hero-title">
          Life is short <br> 
          and the world 🌎<br>
          is Wide! 🌴
        </h1>

        <!-- 검색 바 -->
        <div class="search-bar">
          <div class="search-item">
            <div class="search-label">
              <span class="icon">📍</span>
              Location
            </div>
            <div class="search-value">Manali, India</div>
          </div>
          <div class="search-divider"></div>
          <div class="search-item">
            <div class="search-label">
              <span class="icon">📅</span>
              Date
            </div>
            <div class="search-value">26 Oct 2022</div>
          </div>
          <div class="search-divider"></div>
          <div class="search-item">
            <div class="search-label">
              <span class="icon">🔄</span>
              Return
            </div>
            <div class="search-value">12 Nov 2022</div>
          </div>
          <button class="search-button">
            <span class="search-icon">🔍</span>
          </button>
        </div>
      </div>

      <div class="hero-images">
        <div class="main-image">
          <img src="https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg" alt="Traveler in nature">
        </div>
        <div class="secondary-image">
          <img src="https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg" alt="Scenic view">
        </div>
        <div class="travel-icon tent">🏕️</div>
        <div class="travel-icon hotel">🏨</div>
        <div class="travel-icon location">📍</div>
        <div class="travel-icon helicopter">🚁</div>
        <div class="dotted-line"></div>
      </div>
    </section>

    <!-- 서비스 섹션 -->
    <section class="services-section">
      <div class="section-heading">
        <h2 class="section-title">WHAT WE SERVE</h2>
        <div class="service-intro">
          <h3>Top Values <br>For You 🔥</h3>
          <p class="intro-text">Try a variety of benefits when using our services.</p>
        </div>
      </div>
      
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">🌎</div>
          <h4>Lot Of Choices</h4>
          <p>Total 460+ destinations that we work with.</p>
        </div>
        
        <div class="service-card">
          <div class="service-icon">🧳</div>
          <h4>Best Tour Guide</h4>
          <p>Our tour guides with 15+ years of experience.</p>
        </div>
        
        <div class="service-card">
          <div class="service-icon">🎫</div>
          <h4>Easy Booking</h4>
          <p>With an easy and fast ticket purchase process.</p>
        </div>
      </div>
    </section>

    <!-- 목적지 섹션 -->
    <section class="destinations-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">TOP DESTINATION</h2>
          <h3 class="destination-title">Discover Top Destination ✈️</h3>
        </div>
        <div class="navigation-arrows">
          <button class="arrow-btn prev">◀</button>
          <button class="arrow-btn next">▶</button>
        </div>
      </div>
      
      <div class="destination-cards">
        <!-- Original 4 destination cards -->
        <div class="destination-card">
          <div class="destination-image">
            <img src="https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg" alt="Kullu Manali">
          </div>
          <div class="destination-info">
            <h4>Kullu Manali, Himachal Pradesh</h4>
            <div class="destination-meta">
              <span class="price">₹ 20,000</span>
              <span class="duration">10 Days Trip</span>
            </div>
          </div>
        </div>
        
        <div class="destination-card">
          <div class="destination-image">
            <img src="https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg" alt="Rann Utsav">
          </div>
          <div class="destination-info">
            <h4>Rann Utsav (Kutch), Gujarat</h4>
            <div class="destination-meta">
              <span class="price">₹ 20,000</span>
              <span class="duration">10 Days Trip</span>
            </div>
          </div>
        </div>
        
        <div class="destination-card">
          <div class="destination-image">
            <img src="https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg" alt="Hawa Mahal">
          </div>
          <div class="destination-info">
            <h4>Hawa Mahal (Jaipur), Rajasthan</h4>
            <div class="destination-meta">
              <span class="price">₹ 20,000</span>
              <span class="duration">10 Days Trip</span>
            </div>
          </div>
        </div>
        
        <div class="destination-card">
          <div class="destination-image">
            <img src="https://i.pinimg.com/736x/7d/43/ff/7d43ff51a9f3ecedda6f12a43abdb5d8.jpg" alt="Kullu Manali">
          </div>
          <div class="destination-info">
            <h4>Kullu Manali, Himachal Pradesh</h4>
            <div class="destination-meta">
              <span class="price">₹ 20,000</span>
              <span class="duration">10 Days Trip</span>
            </div>
          </div>
        </div>
        
        <!-- Additional 4 destination cards -->
        <div class="destination-card">
          <div class="destination-image">
            <img src="https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg" alt="Coastal Railway">
          </div>
          <div class="destination-info">
            <h4>Cinque Terre, Italy</h4>
            <div class="destination-meta">
              <span class="price">₹ 45,000</span>
              <span class="duration">7 Days Trip</span>
            </div>
          </div>
        </div>
        
        <div class="destination-card">
          <div class="destination-image">
            <img src="https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg" alt="Lake Boating">
          </div>
          <div class="destination-info">
            <h4>Lake District, England</h4>
            <div class="destination-meta">
              <span class="price">₹ 38,000</span>
              <span class="duration">5 Days Trip</span>
            </div>
          </div>
        </div>
        
        <div class="destination-card">
          <div class="destination-image">
            <img src="https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg" alt="Mountain Trek">
          </div>
          <div class="destination-info">
            <h4>Swiss Alps, Switzerland</h4>
            <div class="destination-meta">
              <span class="price">₹ 52,000</span>
              <span class="duration">8 Days Trip</span>
            </div>
          </div>
        </div>
        
        <div class="destination-card">
          <div class="destination-image">
            <img src="https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg" alt="Beach Resort">
          </div>
          <div class="destination-info">
            <h4>Bali, Indonesia</h4>
            <div class="destination-meta">
              <span class="price">₹ 40,000</span>
              <span class="duration">6 Days Trip</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 항공사 로고 섹션 -->
    <section class="airlines-section">
      <div class="airline-logo">
        <span>JET AIRWAYS ✈️</span>
      </div>
      <div class="airline-logo">
        <span>AirAsia</span>
      </div>
      <div class="airline-logo">
        <span>✈️ SpiceJet</span>
      </div>
      <div class="airline-logo">
        <span>IndiGo ✈️</span>
      </div>
      <div class="airline-logo">
        <span>✈️ GoAir</span>
      </div>
    </section>

    <!-- 휴가 계획 섹션 -->
    <section class="vacation-planning">
      <div class="planning-images">
        <div class="main-planning-image">
          <img src="https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg" alt="Traveler in nature">
        </div>
        <div class="secondary-planning-image">
          <img src="https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg" alt="Scenic view">
        </div>
      </div>
      
      <div class="planning-content">
        <h2 class="planning-subtitle">TRAVEL POINT</h2>
        <h3 class="planning-title">We Helping You Find Your Dream Vacation 😊</h3>
        <p class="planning-text">
          Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type...
        </p>
        
        <div class="stats-container">
          <div class="stat-item">
            <h3 class="stat-value">100+</h3>
            <p class="stat-label">Holiday Package</p>
          </div>
          <div class="stat-item">
            <h3 class="stat-value">230</h3>
            <p class="stat-label">Luxury Hotel</p>
          </div>
          <div class="stat-item">
            <h3 class="stat-value">12</h3>
            <p class="stat-label">Elite Airline</p>
          </div>
          <div class="stat-item">
            <h3 class="stat-value">114M+</h3>
            <p class="stat-label">Satisfied Traveler</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 리뷰 섹션 -->
    <section class="reviews-section">
      <h2 class="reviews-subtitle">HAPPY TRAVELLERS</h2>
      <h3 class="reviews-title">What Our Travellers Say 😊</h3>
    </section>
  </div>
</template>

<script setup>
// 화살표 버튼 클릭 시 목적지 카드 스크롤 기능

// DOM이 마운트된 후에 화살표 버튼에 이벤트 리스너 추가
import { onMounted, ref } from 'vue';

// 스크롤 위치 추적을 위한 ref
const scrollPosition = ref(0);
const scrollAmount = 800; // 한 번에 스크롤할 픽셀 수
const destinationCards = ref(null);

onMounted(() => {
  // 화살표 버튼 요소 가져오기
  const prevButton = document.querySelector('.arrow-btn.prev');
  const nextButton = document.querySelector('.arrow-btn.next');
  destinationCards.value = document.querySelector('.destination-cards');
  
  // 이전 버튼 클릭 이벤트
  prevButton.addEventListener('click', scrollLeft);
  
  // 다음 버튼 클릭 이벤트
  nextButton.addEventListener('click', scrollRight);
});

// 왼쪽으로 스크롤하는 함수
const scrollLeft = () => {
  if (!destinationCards.value) return;
  
  // 부드러운 스크롤 애니메이션으로 왼쪽으로 이동
  scrollPosition.value = Math.max(0, scrollPosition.value - scrollAmount);
  destinationCards.value.scrollTo({
    left: scrollPosition.value,
    behavior: 'smooth'
  });
};

// 오른쪽으로 스크롤하는 함수
const scrollRight = () => {
  if (!destinationCards.value) return;
  
  // 부드러운 스크롤 애니메이션으로 오른쪽으로 이동
  scrollPosition.value = Math.min(
    destinationCards.value.scrollWidth - destinationCards.value.clientWidth,
    scrollPosition.value + scrollAmount
  );
  destinationCards.value.scrollTo({
    left: scrollPosition.value,
    behavior: 'smooth'
  });
};
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
.travel-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
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
}

/* 개별 그라데이션 타원형 위치 및 스타일 */
.circle1 {
  top: -10%;
  left: -5%;
  width: 45vw;
  height: 35vw;
  background: radial-gradient(ellipse, rgba(204, 228, 255, 0.9) 0%, rgba(204, 228, 255, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-15deg);
}

.circle2 {
  bottom: -15%;
  right: -10%;
  width: 50vw;
  height: 38vw;
  background: radial-gradient(ellipse, rgba(255, 219, 240, 0.9) 0%, rgba(255, 219, 240, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(10deg);
}

.circle3 {
  top: 20%;
  right: 10%;
  width: 35vw;
  height: 25vw;
  background: radial-gradient(ellipse, rgba(225, 204, 255, 0.85) 0%, rgba(225, 204, 255, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-8deg);
}

.circle4 {
  bottom: 30%;
  left: 5%;
  width: 28vw;
  height: 22vw;
  background: radial-gradient(ellipse, rgba(204, 240, 255, 0.9) 0%, rgba(204, 240, 255, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(12deg);
}

/* 추가된 타원형들 */
.circle5 {
  top: 45%;
  left: 30%;
  width: 40vw;
  height: 28vw;
  background: radial-gradient(ellipse, rgba(210, 200, 255, 0.85) 0%, rgba(210, 200, 255, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-5deg);
}

.circle6 {
  bottom: 50%;
  right: 30%;
  width: 45vw;
  height: 32vw;
  background: radial-gradient(ellipse, rgba(195, 195, 245, 0.8) 0%, rgba(195, 195, 245, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(15deg);
}

.circle7 {
  bottom: 10%;
  left: 40%;
  width: 42vw;
  height: 30vw;
  background: radial-gradient(ellipse, rgba(180, 210, 240, 0.85) 0%, rgba(180, 210, 240, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
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
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.logo-icon {
  color: #ff8c00;
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
  font-size: 1rem;
  transition: color 0.3s;
}

.menu-link.active {
  color: #ff8c00;
  font-weight: 600;
}

.contact-btn {
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

/* 히어로 섹션 */
.hero-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5rem;
  position: relative;
  z-index: 1;
  gap: 1rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.hero-content {
  flex: 1;
  padding-right: 2rem;
}

.hero-subtitle {
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 2rem;
  color: #333;
}

/* 검색 바 */
.search-bar {
  display: flex;
  background-color: white;
  border-radius: 50px;
  padding: 0.6rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  margin-top: 2.5rem;
  position: relative;
  z-index: 4;
}

.search-item {
  padding: 0 1rem;
}

.search-label {
  font-size: 0.8rem;
  color: #999;
  display: flex;
  align-items: center;
  gap: 5px;
}

.search-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.search-divider {
  width: 1px;
  background-color: #eee;
}

.search-button {
  width: 50px;
  height: 50px;
  background-color: #ff8c00;
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 히어로 이미지 */
.hero-images {
  flex: 1;
  position: relative;
  height: 400px;
}

.main-image {
  position: absolute;
  width: 320px;
  height: 380px;
  overflow: hidden;
  top: -30px;
  right: 10px;
  z-index: 2;
  mask-image: none;
  -webkit-mask-image: none;
  border-radius: 0;
  box-shadow: none;
  border: none;
  background: transparent;
}

.secondary-image {
  position: absolute;
  width: 200px;
  height: 240px;
  overflow: hidden;
  bottom: -30px;
  right: -60px;
  z-index: 1;
  mask-image: none;
  -webkit-mask-image: none;
  border-radius: 0;
  box-shadow: none;
  border: none;
  background: transparent;
}

.main-image img, .secondary-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: normal;
  opacity: 1;
  border-radius: 0;
  /* 더 강한 원형 그라데이션 효과 적용 */
  -webkit-mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
  mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
  filter: brightness(1.03) contrast(0.93);
}

/* 점선 경로 완전히 제거 */
.dotted-line {
  display: none;
}

/* 아이콘도 제거 */
.travel-icon {
  display: none;
}

/* 서비스 섹션 */
.services-section {
  margin-bottom: 5rem;
  position: relative;
  z-index: 1;
}

.section-heading {
  display: flex;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 0.9rem;
  color: #ff8c00;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.service-intro {
  flex: 1;
}

.service-intro h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
}

.intro-text {
  color: #666;
  max-width: 300px;
}

.services-grid {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
}

.service-card {
  background-color: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  flex: 1;
}

.service-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.service-card h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.service-card p {
  color: #666;
  font-size: 0.9rem;
}

/* 목적지 섹션 */
.destinations-section {
  margin-bottom: 5rem;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.destination-title {
  font-size: 1.8rem;
  color: #333;
}

.navigation-arrows {
  display: flex;
  gap: 0.5rem;
}

.arrow-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all 0.3s;
}

.arrow-btn:hover {
  background-color: #ff8c00;
  color: white;
  border-color: #ff8c00;
  transform: scale(1.1);
}

.arrow-btn:active {
  transform: scale(0.95);
}

.destination-cards {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  scrollbar-width: none; /* Firefox */
  scroll-behavior: smooth; /* 부드러운 스크롤 효과 */
  -webkit-overflow-scrolling: touch; /* iOS에서 부드러운 스크롤 */
  scroll-snap-type: x mandatory; /* 스크롤 스냅 */
}

.destination-cards::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.destination-card {
  min-width: 250px;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  scroll-snap-align: start; /* 스크롤 스냅 지점 */
  transition: transform 0.3s ease;
}

.destination-image {
  height: 180px;
  overflow: hidden;
}

.destination-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.destination-card:hover .destination-image img {
  transform: scale(1.05);
}

.destination-info {
  padding: 1rem;
}

.destination-info h4 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.destination-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.price {
  color: #ff8c00;
  font-weight: 600;
}

.duration {
  color: #666;
}

/* 항공사 로고 섹션 */
.airlines-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  margin-bottom: 5rem;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  position: relative;
  z-index: 1;
}

.airline-logo {
  color: #999;
  font-size: 1rem;
  font-weight: 500;
}

/* 휴가 계획 섹션 */
.vacation-planning {
  display: flex;
  gap: 4rem;
  margin-bottom: 5rem;
  position: relative;
  z-index: 1;
}

.planning-images {
  flex: 1;
  position: relative;
  height: 400px;
}

.main-planning-image {
  position: relative;    /* 절대 위치가 아니라 문서 흐름 안에서 */
  width: 100%;           /* 부모 너비에 맞춤 */
  max-width: 300px;      /* 최대 넓이 지정 (기존 300px) */
  height: auto;          /* 높이는 auto로 */
  overflow: visible;  
  z-index: 2;            /* 숨김 제거 */
  border-radius: 0;
  box-shadow: none;
  background-color: transparent;
  border: none;
}

/* 이미지 비율 유지하며 축소 */
.main-planning-image img {
  display: block;
  width: 100%;           /* 컨테이너 너비에 맞춤 */
  height: auto;          /* 비율 유지 */
  object-fit: contain;   /* 잘리지 않고 전체 보이기 */
  border-radius: 0;
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at center, black 60%, transparent 95%);
  mask-image: radial-gradient(ellipse 90% 90% at center, black 60%, transparent 95%);
  filter: brightness(1.02) contrast(0.95);
}

.secondary-planning-image {
  position: absolute;
  width: 200px;
  height: 200px;
  bottom: 0;
  left: 170px;
  overflow: visible;
  z-index: 1;
  border-radius: 0;
  box-shadow: none;
  background-color: transparent;
  border: none;
}

.secondary-planning-image img {
  display: block;
  width: 100%;      
  bottom: 0;
  left: 150px;
  border-radius: 0;
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at center, black 60%, transparent 95%);
  mask-image: radial-gradient(ellipse 90% 90% at center, black 60%, transparent 95%);
  filter: brightness(1.02) contrast(0.95);
}

.planning-content {
  flex: 1;
}

.planning-subtitle {
  font-size: 0.9rem;
  color: #ff8c00;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.planning-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
}

.planning-text {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: left;
}

.stat-value {
  font-size: 1.8rem;
  color: #ff8c00;
  margin-bottom: 0.3rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* 리뷰 섹션 */
.reviews-section {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.reviews-subtitle {
  font-size: 0.9rem;
  color: #ff8c00;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.reviews-title {
  font-size: 1.8rem;
  color: #333;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    padding: 0 1rem;
  }
  
  .hero-content {
    margin-bottom: 2rem;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .services-grid {
    flex-wrap: wrap;
  }
  
  .service-card {
    min-width: calc(50% - 1rem);
  }
  
  .hero-images {
    height: 500px;
    margin-top: 0;
  }
  
  .main-image {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
  }
  
  .secondary-image {
    right: auto;
    left: calc(50% + 80px);
    bottom: 50px;
  }

  .vacation-planning {
    flex-direction: column;
  }
  
  .planning-images {
    margin-top: 0;
    order: 2;
  }
  
  .main-planning-image {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .secondary-planning-image {
    right: auto;
    left: calc(50% + 80px);
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* 그라데이션 타원형 크기 조정 */
  .circle1, .circle2, .circle3, .circle4, .circle5, .circle6, .circle7 {
    width: 80vw !important;
    height: 60vw !important;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .menu-items {
    width: 100%;
    justify-content: space-between;
  }
  
  .section-heading {
    flex-direction: column;
    gap: 1rem;
  }
  
  .services-grid {
    flex-direction: column;
  }
  
  .service-card {
    width: 100%;
  }
  
  .airlines-section {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
  
  .airline-logo {
    margin: 0 1rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }

  .main-planning-image, .secondary-planning-image {
    position: relative;
    width: 90%;
    left: 5% !important;
    transform: none !important;
    margin-bottom: 1rem;
  }
  
  /* 그라데이션 타원형 크기 조정 */
  .circle1, .circle2, .circle3, .circle4, .circle5, .circle6, .circle7 {
    width: 110vw !important;
    height: 80vw !important;
  }
}
</style>