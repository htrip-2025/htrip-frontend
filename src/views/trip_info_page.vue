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
        <a href="#" class="login-button">
          <span class="button-text">로그인</span>
        </a>
      </div>
    </header>

    <!-- 한국 지역 아이콘 섹션 -->
    <section class="region-icons">
      <div class="region-title">
        <h2>한국의 지역</h2>
        <p>대한민국의 아름다운 지역을 둘러보세요</p>
      </div>
      
      <div class="region-scroll">
        <div class="region-item">
          <div class="region-icon">
            <span class="region-text">서울</span>
          </div>
         
        </div>
        
        <div class="region-item">
          <div class="region-icon">
            <span class="region-text">부산</span>
          </div>
         
        </div>
        
        <div class="region-item">
          <div class="region-icon">
            <span class="region-text">제주</span>
          </div>
         
        </div>
        
        <div class="region-item">
          <div class="region-icon">
            <span class="region-text">강원</span>
          </div>
        
        </div>
        
        <div class="region-item">
          <div class="region-icon">
            <span class="region-text">경주</span>
          </div>
        
        </div>
        
        <div class="region-item">
          <div class="region-icon">
            <span class="region-text">전주</span>
          </div>
        
        </div>
        
        <div class="region-item">
          <div class="region-icon">
            <span class="region-text">인천</span>
          </div>
        
        </div>
        
        <div class="region-item">
          <div class="region-icon">
            <span class="region-text">경기</span>
          </div>
         
        </div>
      </div>
    </section>

    <!-- 인기 여행지 섹션 -->
    <section class="popular-destinations">
      <div class="section-header">
        <h2 class="section-title">인기 여행지</h2>
        <p class="section-subtitle">한국에서 가장 인기있는 여행지를 둘러보세요</p>
      </div>
      
      <div class="destinations-grid">
        <div class="destination-card">
          <img src="https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg" alt="남산타워">
          <div class="destination-info">
            <h3>남산타워</h3>
            <p>서울</p>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://i.pinimg.com/736x/7d/43/ff/7d43ff51a9f3ecedda6f12a43abdb5d8.jpg" alt="해운대 해변">
          <div class="destination-info">
            <h3>해운대 해변</h3>
            <p>부산</p>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg" alt="성산일출봉">
          <div class="destination-info">
            <h3>성산일출봉</h3>
            <p>제주도</p>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg" alt="불국사">
          <div class="destination-info">
            <h3>불국사</h3>
            <p>경주</p>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg" alt="설악산">
          <div class="destination-info">
            <h3>설악산</h3>
            <p>강원도</p>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg" alt="한옥마을">
          <div class="destination-info">
            <h3>한옥마을</h3>
            <p>전주</p>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg" alt="경복궁">
          <div class="destination-info">
            <h3>경복궁</h3>
            <p>서울</p>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg" alt="송도 센트럴파크">
          <div class="destination-info">
            <h3>송도 센트럴파크</h3>
            <p>인천</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 여행 팁 섹션 -->
    <section class="travel-tips">
      <div class="section-header">
        <h2 class="section-title">여행 팁</h2>
        <p class="section-subtitle">더 즐겁고 편안한 여행을 위한 팁</p>
      </div>
      
      <div class="tips-container">
        <div class="tip-card">
          <div class="tip-icon">🚆</div>
          <h3>교통 이용하기</h3>
          <p>대중교통으로 한국 여행하기</p>
          <a href="#" class="read-more">더 알아보기 →</a>
        </div>
        
        <div class="tip-card">
          <div class="tip-icon">🏨</div>
          <h3>숙소 예약</h3>
          <p>한국의 다양한 숙박 옵션</p>
          <a href="#" class="read-more">더 알아보기 →</a>
        </div>
        
        <div class="tip-card">
          <div class="tip-icon">🍜</div>
          <h3>현지 음식</h3>
          <p>꼭 먹어봐야 할 한국 음식</p>
          <a href="#" class="read-more">더 알아보기 →</a>
        </div>
        
        <div class="tip-card">
          <div class="tip-icon">🗓️</div>
          <h3>최적의 여행 시기</h3>
          <p>계절별 추천 여행지</p>
          <a href="#" class="read-more">더 알아보기 →</a>
        </div>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <span class="logo-icon">T</span>rip
          <p>당신의 완벽한 여행 파트너</p>
        </div>
        
        <div class="footer-links">
          <h3>바로가기</h3>
          <a href="#">홈</a>
          <a href="#">여행정보</a>
          <a href="#">여행계획</a>
          <a href="#">커뮤니티</a>
        </div>
        
        <div class="footer-newsletter">
          <h3>뉴스레터 구독</h3>
          <p>최신 여행 정보를 받아보세요</p>
          <div class="newsletter-form">
            <input type="email" placeholder="이메일 주소">
            <button>구독</button>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 Trip. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 기본 스크립트
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

/* 헤더 스타일 수정 */
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

.login-button:active {
  transform: translateY(-1px);
}

/* 지역 아이콘 섹션 */
.region-icons {
  position: relative;
  z-index: 1;
  margin-bottom: 4rem;
}

.region-title {
  text-align: center;
  margin-bottom: 2rem;
}

.region-title h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.region-title p {
  color: #666;
  font-size: 1.1rem;
}

.region-scroll {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 0;
  flex-wrap: wrap;
}

.region-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
}

.region-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.region-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
}

.region-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(149, 129, 232, 0.3);
  background-color: #e8e4f5;
}

.region-item p {
  font-size: 0.85rem;
  font-weight: 500;
  color: #444;
}

/* 인기 여행지 섹션 */
.popular-destinations {
  position: relative;
  z-index: 1;
  margin-bottom: 5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.destination-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
  height: 220px;
}

.destination-card:hover {
  transform: translateY(-5px);
}

.destination-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.destination-card:hover img {
  transform: scale(1.05);
}

.destination-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.destination-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.2rem;
}

.destination-info p {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 여행 팁 섹션 */
.travel-tips {
  position: relative;
  z-index: 1;
  margin-bottom: 5rem;
}

.tips-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.tip-card {
  flex: 1;
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
}

.tip-card:hover {
  transform: translateY(-10px);
}

.tip-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.tip-card h3 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1rem;
}

.tip-card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.read-more {
  color: #9581e8;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.read-more:hover {
  color: #7761c8;
}

/* 푸터 스타일 */
.footer {
  background-color: #f8f9fa;
  padding: 4rem 0 2rem;
  position: relative;
  z-index: 1;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.footer-logo {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.footer-logo p {
  font-size: 1rem;
  color: #666;
  font-weight: normal;
}

.footer-links {
  display: flex;
  flex-direction: column;
}

.footer-links h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #9581e8;
}

.footer-newsletter h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
}

.footer-newsletter p {
  color: #666;
  margin-bottom: 1rem;
}

.newsletter-form {
  display: flex;
}

.newsletter-form input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  outline: none;
}

.newsletter-form button {
  background-color: #9581e8;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.newsletter-form button:hover {
  background-color: #7761c8;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  color: #888;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .travel-container {
    padding: 2rem;
  }
  
  .tips-container {
    flex-wrap: wrap;
  }
  
  .tip-card {
    flex: 0 0 calc(50% - 1rem);
  }
  
  .footer-content {
    flex-wrap: wrap;
    gap: 2rem;
  }

  .destinations-grid {
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
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .region-scroll {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 1rem;
  }
  
  .destinations-grid {
    grid-template-columns: 1fr;
  }
  
  .tip-card {
    flex: 0 0 100%;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }
}
</style>