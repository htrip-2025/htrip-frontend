<template>
  <div class="trip-website">
    <!-- 상단 메뉴바 -->
    <nav class="menu-bar">
      <div class="site-title">
        <h1>Trip</h1>
      </div>
      <div class="menu-items">
        <a href="#" class="menu-link">Travel Info</a>
        <a href="#" class="menu-link">AI Recommendation</a>
        <a href="#" class="menu-link">Travel Plan</a>
        <a href="#" class="menu-link">Community</a>
      </div>
      <div class="login-section">
        <a href="#" class="login-button">
          <div class="profile-icon"></div>
        </a>
      </div>
    </nav>

    <!-- 메인 배너 영역 -->
    <div class="main-banner">
      <div class="banner-content">
        <h2 class="banner-title">AI Companion Travel</h2>
        <button class="start-button">Get Started</button>
      </div>
    </div>

    <!-- 여행지 추천 섹션 -->
    <section class="recommendation-section">
      <h3 class="section-title">Recommended Destinations</h3>
      
      <!-- 지그재그 이미지 갤러리 -->
      <div class="irregular-grid">
        <!-- 스위스 알프스 마을 -->
        <div class="grid-item grid-item-large">
          <div class="image-container">
            <img src="https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg" alt="Swiss Alps Village with Snow Mountains" class="gallery-image">
            <div class="image-overlay">
              <div class="image-caption">
                <h4>Swiss Alps</h4>
                <p>Picturesque village nestled in the majestic mountains</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 호수에서 보트 타는 사람들 -->
        <div class="grid-item grid-item-medium">
          <div class="image-container">
            <img src="https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg" alt="People Boating in a Park Lake" class="gallery-image">
            <div class="image-overlay">
              <div class="image-caption">
                <h4>Summer Retreat</h4>
                <p>Peaceful afternoon at the park lake</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 연안 열차와 바다 -->
        <div class="grid-item grid-item-medium">
          <div class="image-container">
            <img src="https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg" alt="Green Train Heading to the Sea" class="gallery-image">
            <div class="image-overlay">
              <div class="image-caption">
                <h4>Coastal Journey</h4>
                <p>Scenic railway along the breathtaking coastline</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 연안 열차와 바다 (다른 각도) -->
        <div class="grid-item grid-item-small">
          <div class="image-container">
            <img src="https://i.pinimg.com/736x/7d/43/ff/7d43ff51a9f3ecedda6f12a43abdb5d8.jpg" alt="Coastal Train Between Houses" class="gallery-image">
            <div class="image-overlay">
              <div class="image-caption">
                <h4>Hidden Passage</h4>
                <p>Train tracks winding between seaside homes</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 벚꽃길과 버스 -->
        <div class="grid-item grid-item-large">
          <div class="image-container">
            <img src="https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg" alt="Cherry Blossom Tunnel with Blue Bus" class="gallery-image">
            <div class="image-overlay">
              <div class="image-caption">
                <h4>Spring Blossoms</h4>
                <p>Cherry blossom avenue with passing blue bus</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 서울 한강 풍경 -->
        <div class="grid-item grid-item-wide">
          <div class="image-container">
            <img src="https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg" alt="Han River and Seoul Cityscape" class="gallery-image">
            <div class="image-overlay">
              <div class="image-caption">
                <h4>Seoul Sunset</h4>
                <p>Evening by the Han River with Seoul's iconic skyline</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <p>© 2025 Trip | Your AI-Powered Travel Companion</p>
      <div class="footer-links">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 이미지 파일은 public 폴더에 저장하거나 assets 폴더를 사용할 수 있습니다
// 실제 배포 시에는 이미지 경로를 적절히 조정해야 합니다
</script>

<style scoped>
/* 기본 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 전체 페이지 스타일 */
.trip-website {
  font-family: 'Caveat', 'Brush Script MT', cursive;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

/* 상단 메뉴바 스타일 */
.menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.site-title h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3a86ff;
  margin: 0;
}

.menu-items {
  display: flex;
  gap: 2rem;
}

.menu-link {
  text-decoration: none;
  color: #555;
  font-size: 1.4rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.menu-link:hover {
  background-color: #f0f7ff;
  color: #3a86ff;
}

.login-section {
  display: flex;
  align-items: center;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: 2px solid #ddd;
  background-image: url('path/to/profile-icon.png');
  background-size: cover;
  background-position: center;
}

/* 메인 배너 영역 스타일 */
.main-banner {
  height: 400px;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('path/to/banner-image.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
}

.banner-content {
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 2rem;
  position: relative;
}

.banner-title {
  font-size: 3.5rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.start-button {
  position: absolute;
  right: 2rem;
  background-color: #3a86ff;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  font-family: 'Caveat', cursive;
  transition: background-color 0.3s ease;
}

.start-button:hover {
  background-color: #2a75ff;
}

/* 여행지 추천 섹션 스타일 */
.recommendation-section {
  padding: 2rem 5%;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
  text-align: left;
}

/* 불규칙한 그리드 레이아웃 */
.irregular-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: 20px;
  margin-bottom: 3rem;
}

.grid-item {
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}

/* 스위스 알프스 마을 큰 이미지 */
.irregular-grid .grid-item:nth-child(1) {
  grid-column: 1 / span 7;
  grid-row: 1 / span 3;
}

/* 호수에서 보트 타는 사람들 */
.irregular-grid .grid-item:nth-child(2) {
  grid-column: 8 / span 5;
  grid-row: 1 / span 2;
}

/* 연안 열차와 바다 */
.irregular-grid .grid-item:nth-child(3) {
  grid-column: 1 / span 4;
  grid-row: 4 / span 2;
}

/* 연안 열차와 바다 (다른 각도) */
.irregular-grid .grid-item:nth-child(4) {
  grid-column: 5 / span 4;
  grid-row: 4 / span 2;
}

/* 벚꽃길과 버스 */
.irregular-grid .grid-item:nth-child(5) {
  grid-column: 9 / span 4;
  grid-row: 3 / span 3;
}

/* 서울 한강 풍경 */
.irregular-grid .grid-item:nth-child(6) {
  grid-column: 1 / span 12;
  grid-row: 6 / span 2;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.grid-item:hover .gallery-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 2rem 1.5rem 1.5rem;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.grid-item:hover .image-overlay {
  opacity: 1;
}

.image-caption h4 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.image-caption p {
  font-size: 1.3rem;
  font-weight: 300;
}

/* 푸터 스타일 */
.site-footer {
  background-color: #f0f7ff;
  padding: 2rem 5%;
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

.footer-links {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.footer-links a {
  text-decoration: none;
  color: #3a86ff;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #2a75ff;
  text-decoration: underline;
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .irregular-grid {
    grid-template-columns: repeat(8, 1fr);
  }
  
  .irregular-grid .grid-item:nth-child(1) {
    grid-column: 1 / span 5;
  }
  
  .irregular-grid .grid-item:nth-child(2) {
    grid-column: 6 / span 3;
  }
  
  .irregular-grid .grid-item:nth-child(3) {
    grid-column: 1 / span 4;
  }
  
  .irregular-grid .grid-item:nth-child(4) {
    grid-column: 5 / span 4;
  }
  
  .irregular-grid .grid-item:nth-child(5) {
    grid-column: 1 / span 8;
    grid-row: 6 / span 2;
  }
  
  .irregular-grid .grid-item:nth-child(6) {
    grid-column: 1 / span 8;
    grid-row: 8 / span 2;
  }
  
  .banner-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .menu-bar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .menu-items {
    width: 100%;
    justify-content: space-between;
    gap: 0.5rem;
  }
  
  .menu-link {
    font-size: 1.2rem;
    padding: 0.3rem 0.6rem;
  }
  
  .irregular-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
  }
  
  .irregular-grid .grid-item:nth-child(1),
  .irregular-grid .grid-item:nth-child(2),
  .irregular-grid .grid-item:nth-child(3),
  .irregular-grid .grid-item:nth-child(4),
  .irregular-grid .grid-item:nth-child(5),
  .irregular-grid .grid-item:nth-child(6) {
    grid-column: 1 / span 4;
    grid-row: auto;
  }
  
  .banner-title {
    font-size: 2.5rem;
  }
  
  .start-button {
    position: static;
    margin-top: 1rem;
  }
}
</style>