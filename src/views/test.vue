<template>
  <div class="travel-container">
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
          <img src="https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg" alt="Traveler in nature">
        </div>
        <div class="secondary-image">
          <img src="https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg" alt="Scenic view">
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
// 함수 및 데이터는 여기에 추가할 수 있습니다
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(120deg, #f0f4ff 0%, #fff9f9 100%);
  overflow: hidden;
}

/* 헤더 스타일 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
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
  padding: 0.8rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
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
  width: 300px;
  height: 350px;
  border-radius: 50% 40% 30% 20%;
  overflow: hidden;
  top: 0;
  right: 50px;
}

.secondary-image {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 40% 50% 20% 30%;
  overflow: hidden;
  bottom: 0;
  right: 0;
}

.main-image img, .secondary-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.travel-icon {
  position: absolute;
  font-size: 1.5rem;
  background-color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.tent {
  top: 20px;
  right: 400px;
}

.hotel {
  top: 60px;
  right: 10px;
}

.location {
  bottom: 180px;
  right: 340px;
}

.helicopter {
  top: 150px;
  right: 230px;
}

.dotted-line {
  position: absolute;
  border: 2px dashed #ccc;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  top: 50px;
  right: 100px;
  border-left: none;
  border-bottom: none;
}

/* 서비스 섹션 */
.services-section {
  margin-bottom: 5rem;
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
}

.destination-cards {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  scrollbar-width: none; /* Firefox */
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
}

.planning-images {
  flex: 1;
  position: relative;
  height: 400px;
}

.main-planning-image {
  position: absolute;
  width: 300px;
  height: 350px;
  border-radius: 40% 50% 20% 30%;
  overflow: hidden;
  top: 0;
  left: 0;
}

.secondary-planning-image {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50% 40% 30% 20%;
  overflow: hidden;
  bottom: 0;
  left: 150px;
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
  .hero-section, 
  .vacation-planning {
    flex-direction: column;
  }
  
  .services-grid {
    flex-wrap: wrap;
  }
  
  .service-card {
    min-width: calc(50% - 1rem);
  }
  
  .hero-images,
  .planning-images {
    margin-top: 3rem;
  }
  
  .main-image,
  .main-planning-image {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .secondary-image,
  .secondary-planning-image {
    right: auto;
    left: calc(50% + 100px);
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
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
}
</style>