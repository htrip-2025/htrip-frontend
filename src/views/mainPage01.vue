<template>
  <div class="travel-container" :class="{ 'cherry-blossom-active': isCherryBlossomActive, 'summer-leaves-active': isSummerLeavesActive }">
    <!-- Cherry Blossom Overlay -->
    <div class="cherry-blossom-overlay">
      <!-- 개별 꽃잎들 -->
      <div class="petal petal1"></div>
      <div class="petal petal2"></div>
      <div class="petal petal3"></div>
      <div class="petal petal4"></div>
      <div class="petal petal5"></div>
      <div class="petal petal6"></div>
      <div class="petal petal7"></div>
      <div class="petal petal8"></div>
      <div class="petal petal9"></div>
      <div class="petal petal10"></div>
      <div class="petal petal11"></div>
      <div class="petal petal12"></div>
      <div class="petal petal13"></div>
      <div class="petal petal14"></div>
      <div class="petal petal15"></div>
      <div class="petal petal16"></div>
      <div class="petal petal17"></div>
      <div class="petal petal18"></div>
      <div class="petal petal19"></div>
      <div class="petal petal20"></div>
      <div class="petal petal21"></div>
      <div class="petal petal22"></div>
      <div class="petal petal23"></div>
      <div class="petal petal24"></div>
      <div class="petal petal25"></div>
      <div class="petal petal26"></div>
      <div class="petal petal27"></div>
      <div class="petal petal28"></div>
      <div class="petal petal29"></div>
      <div class="petal petal30"></div>
      
      <!-- 전체 꽃 모양 -->
      <div class="flower flower1"></div>
      <div class="flower flower2"></div>
      <div class="flower flower3"></div>
      <div class="flower flower4"></div>
      <div class="flower flower5"></div>
    </div>
    
    <!-- Summer Leaves Overlay -->
    <div class="summer-leaves-overlay">
      <div class="corner-leaves top-left"></div>
      <div class="corner-leaves top-right"></div>
      <div class="corner-leaves bottom-left"></div>
      <div class="corner-leaves bottom-right"></div>
      
      <!-- 날리는 나뭇잎들 -->
      <div class="leaf leaf1"></div>
      <div class="leaf leaf2"></div>
      <div class="leaf leaf3"></div>
      <div class="leaf leaf4"></div>
      <div class="leaf leaf5"></div>
      <div class="leaf leaf6"></div>
      <div class="leaf leaf7"></div>
      <div class="leaf leaf8"></div>
      <div class="leaf leaf9"></div>
      <div class="leaf leaf10"></div>
      <div class="leaf leaf11"></div>
      <div class="leaf leaf12"></div>
      <div class="leaf leaf13"></div>
      <div class="leaf leaf14"></div>
      <div class="leaf leaf15"></div>
      <div class="leaf leaf16"></div>
      <div class="leaf leaf17"></div>
      <div class="leaf leaf18"></div>
      <div class="leaf leaf19"></div>
      <div class="leaf leaf20"></div>
    </div>
    
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
        <a href="/info" class="menu-link">여행정보</a>
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

    <!-- 히어로 섹션 -->
    <section class="hero-section">
      <div class="hero-content">
        <p class="hero-subtitle">The vacation you deserve is closer than you think </p>
        <h1 class="hero-title">
            <br>
          Since I was born <br>
          I traveled to Korea<br>
        </h1>

        <!-- 계획 시작하기 버튼 - 왼쪽 정렬로 변경 -->
        <div class="plan-button-container">
          <router-link to="/info" class="plan-start-button">
            <span class="button-icon">✈️</span>
            <span class="button-text">여행 계획 시작하기</span>
            <span class="button-arrow">→</span>
          </router-link>
        </div>
      </div>

      <div class="hero-images">
        <div class="polaroid-container">
          <div class="polaroid main-image" 
               @mouseover="activateCherryBlossom" 
               @mouseleave="deactivateCherryBlossom">
            <img src="https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg" alt="Traveler in nature">
            <div class="polaroid-bottom"></div>
          </div>
          
          <div class="polaroid secondary-image" 
               @mouseover="activateSummerLeaves" 
               @mouseleave="deactivateSummerLeaves">
            <img src="https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg" alt="Scenic view">
            <div class="polaroid-bottom"></div>
          </div>
          
          <div class="polaroid third-image">
            <img src="https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg" alt="Another view">
            <div class="polaroid-bottom"></div>
          </div>
          
          <div class="polaroid fourth-image">
            <img src="https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg" alt="More scenery">
            <div class="polaroid-bottom"></div>
          </div>
        </div>
      </div>
    </section>





    <!-- 목적지 섹션 -->
    <section class="destinations-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">TOP DESTINATION</h2>
          <h3 class="destination-title">Popular travel destinations ✈️</h3>
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

    

  </div>
</template>

<script setup>
// 화살표 버튼 클릭 시 목적지 카드 스크롤 기능
import { onMounted, ref } from 'vue';

// 체리 블라썸 효과 활성화 상태 추적
const isCherryBlossomActive = ref(false);
// 여름 나뭇잎 효과 활성화 상태 추적
const isSummerLeavesActive = ref(false);

// 체리 블라썸 효과 활성화 및 비활성화 함수
const activateCherryBlossom = () => {
  isCherryBlossomActive.value = true;
};

const deactivateCherryBlossom = () => {
  isCherryBlossomActive.value = false;
};

// 여름 나뭇잎 효과 활성화 및 비활성화 함수
const activateSummerLeaves = () => {
  isSummerLeavesActive.value = true;
};

const deactivateSummerLeaves = () => {
  isSummerLeavesActive.value = false;
};

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

/* 체리 블라썸 스타일 */
.cherry-blossom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
  overflow: hidden;
}

.cherry-blossom-active .cherry-blossom-overlay {
  opacity: 1;
}

/* 벚꽃 꽃잎 */
.petal {
  position: absolute;
  opacity: 0.8;
  animation-name: fallAndSway;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

/* 다양한 꽃잎 모양 */
.petal1, .petal6, .petal11, .petal16, .petal21, .petal26 {
  background-image: radial-gradient(ellipse at center, #ffb7c5 0%, #ffc7d1 50%, #ffd8df 100%);
  border-radius: 150% 0 150% 0;
  transform: rotate(45deg);
}

.petal2, .petal7, .petal12, .petal17, .petal22, .petal27 {
  background-image: radial-gradient(ellipse at center, #ffcad8 0%, #ffd6e1 50%, #ffe8ee 100%);
  border-radius: 100% 0 100% 30%;
  transform: rotate(30deg);
}

.petal3, .petal8, .petal13, .petal18, .petal23, .petal28 {
  background-image: radial-gradient(ellipse at center, #ffa7b8 0%, #ffbdd0 50%, #ffd5df 100%);
  border-radius: 120% 20% 120% 20%;
  transform: rotate(60deg);
}

.petal4, .petal9, .petal14, .petal19, .petal24, .petal29 {
  background-image: radial-gradient(ellipse at center, #ffc1d5 0%, #ffd3e2 50%, #ffe5ee 100%);
  border-radius: 130% 10% 130% 40%;
  transform: rotate(15deg);
}

.petal5, .petal10, .petal15, .petal20, .petal25, .petal30 {
  background-image: radial-gradient(ellipse at center, #ff9ebc 0%, #ffb5ca 50%, #ffcbd9 100%);
  border-radius: 110% 40% 110% 10%;
  transform: rotate(75deg);
}

/* 다양한 크기의 꽃잎 */
.petal1, .petal16, .petal21 { width: 20px; height: 20px; }
.petal6, .petal11, .petal26 { width: 15px; height: 15px; }
.petal2, .petal17, .petal27 { width: 25px; height: 25px; }
.petal7, .petal12, .petal22 { width: 22px; height: 22px; }
.petal3, .petal18 { width: 35px; height: 35px; } /* 더 큰 꽃잎 */
.petal8, .petal13, .petal23, .petal28 { width: 30px; height: 30px; } /* 더 큰 꽃잎 */
.petal4, .petal19, .petal29 { width: 18px; height: 18px; }
.petal9, .petal14, .petal24 { width: 28px; height: 28px; } /* 더 큰 꽃잎 */
.petal5, .petal20, .petal30 { width: 40px; height: 40px; } /* 더 큰 꽃잎 */
.petal10, .petal15, .petal25 { width: 32px; height: 32px; } /* 더 큰 꽃잎 */

/* 꽃잎의 초기 위치 설정 */
.petal1 { top: -50px; left: 10%; animation-duration: 10s; animation-delay: 0.5s; }
.petal2 { top: -50px; left: 20%; animation-duration: 14s; animation-delay: 2s; }
.petal3 { top: -50px; left: 30%; animation-duration: 12s; animation-delay: 0s; }
.petal4 { top: -50px; left: 40%; animation-duration: 15s; animation-delay: 3s; }
.petal5 { top: -50px; left: 50%; animation-duration: 13s; animation-delay: 1.5s; }
.petal6 { top: -50px; left: 60%; animation-duration: 11s; animation-delay: 4s; }
.petal7 { top: -50px; left: 70%; animation-duration: 16s; animation-delay: 0.8s; }
.petal8 { top: -50px; left: 80%; animation-duration: 10s; animation-delay: 2.5s; }
.petal9 { top: -50px; left: 90%; animation-duration: 13s; animation-delay: 1s; }
.petal10 { top: -50px; left: 15%; animation-duration: 12s; animation-delay: 3.5s; }
.petal11 { top: -50px; left: 25%; animation-duration: 14s; animation-delay: 0.3s; }
.petal12 { top: -50px; left: 35%; animation-duration: 11s; animation-delay: 2.8s; }
.petal13 { top: -50px; left: 45%; animation-duration: 15s; animation-delay: 1.2s; }
.petal14 { top: -50px; left: 55%; animation-duration: 13s; animation-delay: 3.8s; }
.petal15 { top: -50px; left: 65%; animation-duration: 12s; animation-delay: 0.6s; }
.petal16 { top: -50px; left: 75%; animation-duration: 15s; animation-delay: 2.2s; }
.petal17 { top: -50px; left: 85%; animation-duration: 14s; animation-delay: 1.7s; }
.petal18 { top: -50px; left: 5%; animation-duration: 13s; animation-delay: 3.2s; }
.petal19 { top: -50px; left: 95%; animation-duration: 15s; animation-delay: 1.3s; }
.petal20 { top: -50px; left: 55%; animation-duration: 12s; animation-delay: 2.7s; }
.petal21 { top: -50px; left: 17%; animation-duration: 15s; animation-delay: 0.7s; }
.petal22 { top: -50px; left: 52%; animation-duration: 12s; animation-delay: 2.6s; }
.petal23 { top: -50px; left: 82%; animation-duration: 13s; animation-delay: 3.8s; }
.petal24 { top: -50px; left: 28%; animation-duration: 11s; animation-delay: 1.4s; }
.petal25 { top: -50px; left: 62%; animation-duration: 14s; animation-delay: 0.6s; }
.petal26 { top: -50px; left: 73%; animation-duration: 12s; animation-delay: 3.1s; }
.petal27 { top: -50px; left: 33%; animation-duration: 13s; animation-delay: 2.3s; }
.petal28 { top: -50px; left: 87%; animation-duration: 15s; animation-delay: 0.9s; }
.petal29 { top: -50px; left: 42%; animation-duration: 10s; animation-delay: 2.7s; }
.petal30 { top: -50px; left: 67%; animation-duration: 16s; animation-delay: 1.6s; }

/* 꽃잎이 떨어지고 좌우로 흔들리는 애니메이션 */
@keyframes fallAndSway {
  0% {
    top: -50px;
    transform-origin: center;
  }
  25% {
    transform-origin: center;
    transform: translateX(15px) rotate(20deg);
  }
  50% {
    transform-origin: center;
    transform: translateX(0) rotate(-10deg);
  }
  75% {
    transform-origin: center;
    transform: translateX(-15px) rotate(15deg);
  }
  100% {
    top: 120%;
    transform-origin: center;
    transform: translateX(0) rotate(-5deg);
  }
}


/* 여름 나뭇잎 오버레이 */
/* summer-leaves-overlay 스타일 수정 */
.summer-leaves-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  /* 기존 배경 이미지 제거하고 새 색상 그라데이션 배경 적용 */
  background: radial-gradient(circle at center, rgba(209, 253, 180, 0.6) 0%, rgba(205, 239, 189, 0.4) 50%, rgba(255, 255, 255, 0) 70%);
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
  overflow: hidden;
}

/* 코너 효과 수정 - 새 색상으로 변경 */
.corner-leaves {
  /* 기존 속성 유지 */
  position: absolute;
  width: 30px; /* 크기 키움 */
  height: 300px; /* 크기 키움 */
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 1s ease, transform 1s ease;
  z-index: 101;
}

.top-left {
  top: 0;
  left: 0;
  /* SVG 색상 수정 - #caf1bb 색상 사용 */
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNMCwwIEwxMDAsMTAwIEwwLDEwMCBaIiBmaWxsPSJyZ2JhKDIwMiwgMjQxLCAxODcsIDAuNikiLz48cGF0aCBkPSJNMTAsMTAgQzUwLDMwIDcwLDUwIDkwLDkwIEMzMCw3MCAyMCw0MCAxMCwxMCBaIiBmaWxsPSJyZ2JhKDIwMiwgMjQxLCAxODcsIDAuOSkiLz48L3N2Zz4=');
  transform: scale(1.2) translate(-30px, -30px);
}

.top-right {
  top: 0;
  right: 0;
  /* SVG 색상 수정 - #d1fdb4 색상 사용 */
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNMjAwLDAgTDEwMCwxMDAgTDIwMCwxMDAgWiIgZmlsbD0icmdiYSgyMDksIDI1MywgMTgwLCAwLjYpIi8+PHBhdGggZD0iTTE5MCwxMCBDMTUwLDMwIDEzMCw1MCAxMTAsOTAgQzE3MCw3MCAxODAsNDAgMTkwLDEwIFoiIGZpbGw9InJnYmEoMjA5LCAyNTMsIDE4MCwgMC45KSIvPjwvc3ZnPg==');
  transform: scale(1.2) translate(30px, -30px);
}

.bottom-left {
  bottom: 0;
  left: 0;
  /* SVG 색상 수정 - #cdefbd 색상 사용 */
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNMCwyMDAgTDEwMCwxMDAgTDAsMTAwIFoiIGZpbGw9InJnYmEoMjA1LCAyMzksIDE4OSwgMC42KSIvPjxwYXRoIGQ9Ik0xMCwxOTAgQzUwLDE3MCA3MCwxNTAgOTAsMTEwIEMzMCwxMzAgMjAsMTYwIDEwLDE5MCBaIiBmaWxsPSJyZ2JhKDIwNSwgMjM5LCAxODksIDAuOSkiLz48L3N2Zz4=');
  transform: scale(1.2) translate(-30px, 30px);
}

.bottom-right {
  bottom: 0;
  right: 0;
  /* SVG 색상 수정 - 색상 혼합 사용 */
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNMjAwLDIwMCBMMTAwLDEwMCBMMjAwLDEwMCBaIiBmaWxsPSJyZ2JhKDIwMiwgMjQxLCAxODcsIDAuNikiLz48cGF0aCBkPSJNMTkwLDE5MCBDMTU1LDE3MCAxMzUsMTUwIDExNSwxMTAgQzE3NSwxMzAgMTg1LDE2MCAxOTAsMTkwIFoiIGZpbGw9InJnYmEoMjA5LCAyNTMsIDE4MCwgMC45KSIvPjwvc3ZnPg==');
  transform: scale(1.2) translate(30px, 30px);
}

/* 날리는 나뭇잎들 수정 - 크기 다양화 및 색상 변경 */
.leaf {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0;
  animation-name: floatLeaf;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  z-index: 102;
}

/* 다양한 나뭇잎 크기와 모양 - 더 크게 수정 */
.leaf1, .leaf6, .leaf11, .leaf16 {
  width: 40px; /* 크기 증가 */
  height: 40px; /* 크기 증가 */
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHBhdGggZD0iTTI1LDEgQzQwLDEwIDQwLDQwIDI1LDUwIEMxMCw0MCAxMCwxMCAyNSwxIHoiIGZpbGw9IiNjYWYxYmIiLz48cGF0aCBkPSJNMjUsOSBMMjUsNDIiIHN0cm9rZT0iI2IxZTFhNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+');
}

.leaf2, .leaf7, .leaf12, .leaf17 {
  width: 60px; /* 크기 증가 */
  height: 60px; /* 크기 증가 */
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHBhdGggZD0iTTI1LDEgQzQ1LDE1IDQ1LDM1IDI1LDUwIEM1LDM1IDUsMTUgMjUsMyB6IiBmaWxsPSIjZDFmZGI0Ii8+PHBhdGggZD0iTTEwLDI1IEMyNSwxMCA0NSwzMCAyNSw0NSIgc3Ryb2tlPSIjYjdlMTlkIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=');
}

.leaf3, .leaf8, .leaf13, .leaf18 {
  width: 70px; /* 크기 증가 */
  height: 35px; /* 크기 증가 */
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCAyNSI+PHBhdGggZD0iTTEsNSBDMTAsMCAyNSw1IDUwLDEwIEMyNSwyNSAxLDIwIDEsNSB6IiBmaWxsPSIjY2RlZmJkIi8+PHBhdGggZD0iTTUsNSBMNDAsMTUiIHN0cm9rZT0iI2FkZGZhMCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9zdmc+');
}

.leaf4, .leaf9, .leaf14, .leaf19 {
  width: 50px; /* 크기 증가 */
  height: 65px; /* 크기 증가 */
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNSA0NSI+PHBhdGggZD0iTTE3LDEgQzMwLDEwIDM1LDMwIDE3LDQ1IEM1LDMwIDUsMTAgMTcsMSB6IiBmaWxsPSIjY2FmMWJiIi8+PHBhdGggZD0iTTE3LDEgTDE3LDQ1IE01LDIwIEMxNSwxNSAyMCwxNSAzMCwyMCIgc3Ryb2tlPSIjYjNlYTliIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=');
}

.leaf5, .leaf10, .leaf15, .leaf20 {
  width: 80px; /* 크기 증가 */
  height: 60px; /* 크기 증가 */
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSAzNSI+PHBhdGggZD0iTTEsNSBDMTUsMCAzMCw1IDQ1LDEwIEMzMCwzNSAxLDMwIDEsNSB6IiBmaWxsPSIjZDFmZGI0Ii8+PHBhdGggZD0iTTUsOCBMMzUsMTgiIHN0cm9rZT0iI2IzZWE5YiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9zdmc+');
}

/* 새로운 큰 나뭇잎 추가 */
.summer-leaves-overlay::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  background-image: radial-gradient(circle at center, rgba(209, 253, 180, 0.7) 0%, rgba(205, 239, 189, 0.3) 70%, transparent 100%);
  animation: pulseGlow 6s infinite ease-in-out;
  border-radius: 50%;
  z-index: -1;
}

.summer-leaves-overlay::after {
  content: '';
  position: absolute;
  top: 40%;
  left: 60%;
  width: 200px;
  height: 200px;
  background-image: radial-gradient(circle at center, rgba(202, 241, 187, 0.6) 0%, rgba(209, 253, 180, 0.2) 70%, transparent 100%);
  animation: pulseGlow 8s infinite ease-in-out;
  border-radius: 50%;
  z-index: -1;
}

@keyframes pulseGlow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* 애니메이션 속도 조정 */
@keyframes floatLeaf {
  0% {
    top: -50px;
    transform: translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    transform: translateX(20px) rotate(15deg);
    opacity: 0.8;
  }
  /* 나머지 애니메이션 키프레임 유지 */
  100% {
    top: 120%;
    transform: translateX(0) rotate(0deg);
    opacity: 0;
  }
}

.summer-leaves-active .summer-leaves-overlay {
  opacity: 1;
}


/* 날리는 나뭇잎들 */
.leaf {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0;
  animation-name: floatLeaf;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  z-index: 102;
}

.summer-leaves-active .leaf {
  opacity: 0.8;
}

/* 다양한 나뭇잎 크기와 모양 */
.leaf1, .leaf6, .leaf11, .leaf16 {
  width: 30px;
  height: 30px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHBhdGggZD0iTTI1LDEgQzQwLDEwIDQwLDQwIDI1LDUwIEMxMCw0MCAxMCwxMCAyNSwxIHoiIGZpbGw9InJnYmEoMTAwLDE4MCw4MCwwLjkpIi8+PHBhdGggZD0iTTI1LDEgTDI1LDUwIiBzdHJva2U9InJnYmEoODAsMTUwLDcwLDAuNikiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==');
}

.leaf2, .leaf7, .leaf12, .leaf17 {
  width: 40px;
  height: 40px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHBhdGggZD0iTTI1LDEgQzQ1LDE1IDQ1LDM1IDI1LDUwIEM1LDM1IDUsMTUgMjUsMyB6IiBmaWxsPSJyZ2JhKDEyMCwyMDAsOTAsMC44KSIvPjxwYXRoIGQ9Ik0xMCwyNSBDMjUsMTAgNDUsMzAgMjUsNDUiIHN0cm9rZT0icmdiYSg5MCwxNjAsODAsMC43KSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9zdmc+');
}

.leaf3, .leaf8, .leaf13, .leaf18 {
  width: 50px;
  height: 25px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCAyNSI+PHBhdGggZD0iTTEsNSBDMTAsMCAyNSw1IDUwLDEwIEMyNSwyNSAxLDIwIDEsNSB6IiBmaWxsPSJyZ2JhKDE0MCwyMTAsMTEwLDAuOSkiLz48cGF0aCBkPSJNNSw1IEw0MCwxNSIgc3Ryb2tlPSJyZ2JhKDEyMCwxODAsMTAwLDAuNikiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==');
}

.leaf4, .leaf9, .leaf14, .leaf19 {
  width: 35px;
  height: 45px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNSA0NSI+PHBhdGggZD0iTTE3LDEgQzMwLDEwIDM1LDMwIDE3LDQ1IEM1LDMwIDUsMTAgMTcsMSB6IiBmaWxsPSJyZ2JhKDgwLDE3MCw2MCwwLjkpIi8+PHBhdGggZD0iTTE3LDEgTDE3LDQ1IE01LDIwIEMxNSwxNSAyMCwxNSAzMCwyMCIgc3Ryb2tlPSJyZ2JhKDYwLDE1MCw1MCwwLjYpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=');
}

.leaf5, .leaf10, .leaf15, .leaf20 {
  width: 45px;
  height: 35px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NSAzNSI+PHBhdGggZD0iTTEsNSBDMTUsMCAzMCw1IDQ1LDEwIEMzMCwzNSAxLDMwIDEsNSB6IiBmaWxsPSJyZ2JhKDEzMCwxOTAsMTAwLDAuOSkiLz48cGF0aCBkPSJNNSw4IEwzNSwxOCIgc3Ryb2tlPSJyZ2JhKDEwMCwxNjAsODAsMC42KSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9zdmc+');
}

/* 나뭇잎 초기 위치 설정 */
.leaf1 { top: -50px; left: 10%; animation-duration: 20s; animation-delay: 0.5s; }
.leaf2 { top: -50px; left: 20%; animation-duration: 18s; animation-delay: 2s; }
.leaf3 { top: -50px; left: 30%; animation-duration: 22s; animation-delay: 0s; }
.leaf4 { top: -50px; left: 40%; animation-duration: 19s; animation-delay: 3s; }
.leaf5 { top: -50px; left: 50%; animation-duration: 21s; animation-delay: 1.5s; }
.leaf6 { top: -50px; left: 60%; animation-duration: 17s; animation-delay: 4s; }
.leaf7 { top: -50px; left: 70%; animation-duration: 23s; animation-delay: 0.8s; }
.leaf8 { top: -50px; left: 80%; animation-duration: 16s; animation-delay: 2.5s; }
.leaf9 { top: -50px; left: 90%; animation-duration: 24s; animation-delay: 1s; }
.leaf10 { top: -50px; left: 15%; animation-duration: 18s; animation-delay: 3.5s; }
.leaf11 { top: -50px; left: 25%; animation-duration: 20s; animation-delay: 0.3s; }
.leaf12 { top: -50px; left: 35%; animation-duration: 19s; animation-delay: 2.8s; }
.leaf13 { top: -50px; left: 45%; animation-duration: 21s; animation-delay: 1.2s; }
.leaf14 { top: -50px; left: 55%; animation-duration: 17s; animation-delay: 3.8s; }
.leaf15 { top: -50px; left: 65%; animation-duration: 23s; animation-delay: 0.6s; }
.leaf16 { top: -50px; left: 75%; animation-duration: 16s; animation-delay: 2.2s; }
.leaf17 { top: -50px; left: 85%; animation-duration: 22s; animation-delay: 1.7s; }
.leaf18 { top: -50px; left: 5%; animation-duration: 19s; animation-delay: 3.2s; }
.leaf19 { top: -50px; left: 95%; animation-duration: 18s; animation-delay: 1.3s; }
.leaf20 { top: -50px; left: 55%; animation-duration: 20s; animation-delay: 2.7s; }

/* 나뭇잎이 떨어지고 좌우로 흔들리는 애니메이션 */
@keyframes floatLeaf {
  0% {
    top: -50px;
    transform: translateX(0) rotate(0deg);
  }
  10% {
    transform: translateX(20px) rotate(15deg);
  }
  20% {
    transform: translateX(-15px) rotate(-10deg);
  }
  30% {
    transform: translateX(15px) rotate(5deg);
  }
  40% {
    transform: translateX(-20px) rotate(-15deg);
  }
  50% {
    transform: translateX(10px) rotate(10deg);
  }
  60% {
    transform: translateX(-15px) rotate(-5deg);
  }
  70% {
    transform: translateX(20px) rotate(15deg);
  }
  80% {
    transform: translateX(-10px) rotate(-10deg);
  }
  90% {
    transform: translateX(15px) rotate(5deg);
  }
  100% {
    top: 120%;
    transform: translateX(0) rotate(0deg);
  }
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
  transition: background-color 0.5s ease;
}

/* 그라데이션 원형(타원형) 스타일 */
.gradient-circle {
  position: absolute;
  border-radius: 65% 35% 60% 40% / 60% 40% 60% 40%;
  z-index: 0;
  transform: skew(-5deg, -10deg);
  transition: background 0.5s ease, opacity 0.5s ease;
}

/* Cherry blossom active일 때 그라데이션 원 색상 변경 */
.cherry-blossom-active .gradient-circle {
  opacity: 0.9;
}

/* Summer leaves active일 때 그라데이션 원 색상 변경 */
.summer-leaves-active .gradient-circle {
  opacity: 0.9;
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

.cherry-blossom-active .circle1 {
  background: radial-gradient(ellipse, rgba(245, 198, 239, 0.9) 0%, rgba(245, 198, 239, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
}

.summer-leaves-active .circle1 {
  background: radial-gradient(ellipse, rgba(198, 245, 200, 0.9) 0%, rgba(198, 245, 200, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
}

.circle2 {
  bottom: -15%;
  right: -10%;
  width: 50vw;
  height: 38vw;
  background: radial-gradient(ellipse, rgba(213, 237, 251, 0.9) 0%, rgba(213, 237, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(10deg);
}

.cherry-blossom-active .circle2 {
  background: radial-gradient(ellipse, rgba(252, 227, 248, 0.9) 0%, rgba(252, 227, 248, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
}

.summer-leaves-active .circle2 {
  background: radial-gradient(ellipse, rgba(185, 245, 190, 0.9) 0%, rgba(185, 245, 190, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
}

.circle3 {
  top: 20%;
  right: 10%;
  width: 35vw;
  height: 25vw;
  background: radial-gradient(ellipse, rgba(213, 222, 251, 0.85) 0%, rgba(213, 222, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-8deg);
}

.cherry-blossom-active .circle3 {
  background: radial-gradient(ellipse, rgba(235, 195, 248, 0.85) 0%, rgba(235, 195, 248, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
}

.summer-leaves-active .circle3 {
  background: radial-gradient(ellipse, rgba(160, 230, 170, 0.85) 0%, rgba(160, 230, 170, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
}

.circle4 {
  bottom: 30%;
  left: 5%;
  width: 28vw;
  height: 22vw;
  background: radial-gradient(ellipse, rgba(213, 232, 251, 0.9) 0%, rgba(213, 232, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(12deg);
}

.cherry-blossom-active .circle4 {
  background: radial-gradient(ellipse, rgba(245, 198, 239, 0.9) 0%, rgba(245, 198, 239, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
}

.summer-leaves-active .circle4 {
  background: radial-gradient(ellipse, rgba(175, 235, 180, 0.9) 0%, rgba(175, 235, 180, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
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

.cherry-blossom-active .circle5 {
  background: radial-gradient(ellipse, rgba(252, 227, 248, 0.85) 0%, rgba(252, 227, 248, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
}

.summer-leaves-active .circle5 {
  background: radial-gradient(ellipse, rgba(190, 245, 195, 0.85) 0%, rgba(190, 245, 195, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
}

.circle6 {
  bottom: 50%;
  right: 30%;
  width: 45vw;
  height: 32vw;
  background: radial-gradient(ellipse, rgba(213, 237, 251, 0.8) 0%, rgba(213, 237, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(15deg);
}

.cherry-blossom-active .circle6 {
  background: radial-gradient(ellipse, rgba(235, 195, 248, 0.8) 0%, rgba(235, 195, 248, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
}

.summer-leaves-active .circle6 {
  background: radial-gradient(ellipse, rgba(170, 225, 175, 0.8) 0%, rgba(170, 225, 175, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
}

.circle7 {
  bottom: 10%;
  left: 40%;
  width: 42vw;
  height: 30vw;
  background: radial-gradient(ellipse, rgba(213, 232, 251, 0.85) 0%, rgba(213, 232, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-12deg);
}

.cherry-blossom-active .circle7 {
  background: radial-gradient(ellipse, rgba(245, 198, 239, 0.85) 0%, rgba(245, 198, 239, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
}

.summer-leaves-active .circle7 {
  background: radial-gradient(ellipse, rgba(175, 240, 180, 0.85) 0%, rgba(175, 240, 180, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
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

/* 로그인 버튼 스타일 업데이트 */
.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #9581e8 0%, #a2b3f8 100%); /* 요청한 색상으로 변경 */
  color: white;
  padding: 0.6rem 1.5rem; /* 약간 작게 */
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(149, 129, 232, 0.25); /* 그림자 연하게 */
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

/* 미디어 쿼리에 추가 */
@media (max-width: 768px) {
  .login-button {
    padding: 0.5rem 1.2rem;
    font-size: 0.85rem;
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .menu-items {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .login-section {
    margin-top: 0.5rem;
  }
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

/* 계획 시작하기 버튼 스타일 - 더 작고 연한 색상으로 수정 */
.plan-button-container {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬로 변경 */
}

.plan-start-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #9581e8 0%, #a2b3f8 100%); /* 연한 색상으로 변경 */
  color: white;
  padding: 0.8rem 1.8rem; /* 패딩 줄임 */
  border-radius: 30px; /* 약간 줄임 */
  font-size: 1rem; /* 폰트 크기 줄임 */
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(162, 179, 248, 0.25); /* 그림자 연하게 */
  transition: all 0.3s ease;
  width: auto; /* 자동 너비로 변경 */
  max-width: 300px; /* 최대 너비 줄임 */
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
  z-index: 1;
}

.plan-start-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: linear-gradient(135deg, #a2b3f8 0%, #9581e8 100%); /* 연한 색상으로 변경 */
  transition: width 0.5s ease;
  z-index: -1;
  border-radius: 30px;
}

.plan-start-button:hover {
  transform: translateY(-3px); /* 호버 효과 줄임 */
  box-shadow: 0 10px 25px rgba(162, 179, 248, 0.35);
}

.plan-start-button:hover::before {
  width: 100%;
}

.plan-start-button:active {
  transform: translateY(-1px);
}

.button-icon {
  font-size: 1.1rem; /* 아이콘 크기 줄임 */
  margin-right: 8px;
}

.button-text {
  flex: 1;
  text-align: left; /* 왼쪽 정렬로 변경 */
}

.button-arrow {
  font-size: 1.2rem; /* 화살표 크기 줄임 */
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.plan-start-button:hover .button-arrow {
  transform: translateX(5px);
}

/* 미디어 쿼리 */
@media (max-width: 768px) {
  .plan-start-button {
    padding: 1rem 1.8rem;
    font-size: 1.1rem;
    max-width: 320px;
  }
}

/* 히어로 이미지 폴라로이드 스타일 */
.hero-images {
  flex: 1;
  position: relative;
  height: 450px;
  /*background-color: #f5efd0;*/ /* 옅은 베이지색 배경 */
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  margin-top: 2rem;
}

.polaroid-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.polaroid {
  position: absolute;
  background-color: white;
  padding: 10px 10px 30px 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  width: 200px;
  height: auto;
  transition: transform 0.3s ease;
}

.polaroid img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.polaroid-bottom {
  width: 100%;
  height: 30px;
  background-color: white;
  position: absolute;
  bottom: 0;
  left: 0;
}

.polaroid:hover {
  transform: scale(1.05) rotate(0deg) !important;
  z-index: 10;
}

/* 메인 이미지 강조 - 호버 시 약간 더 큰 스케일 및 z-index */
.main-image {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.main-image:hover {
  transform: scale(1.08) rotate(0deg) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  z-index: 1001; /* Cherry blossom overlay보다 높게 */
}

/* 각 폴라로이드 위치 및 회전 */
.main-image {
  top: 40px;
  left: 50px;
  transform: rotate(-5deg);
  z-index: 4;
}

.secondary-image {
  top: 80px;
  left: 180px;
  transform: rotate(3deg);
  z-index: 3;
}

.third-image {
  top: 150px;
  left: 100px;
  transform: rotate(-8deg);
  z-index: 2;
}

.fourth-image {
  top: 170px;
  right: 70px;
  transform: rotate(6deg);
  z-index: 1;
}

/* 반응형 조정 */
@media (max-width: 768px) {
  .hero-images {
    height: 500px;
  }
  
  .polaroid {
    width: 150px;
  }
  
  .polaroid img {
    height: 130px;
  }
  
  .main-image {
    top: 50px;
    left: 30px;
  }
  
  .secondary-image {
    top: 100px;
    left: 120px;
  }
  
  .third-image {
    top: 200px;
    left: 60px;
  }
  
  .fourth-image {
    top: 220px;
    right: 40px;
  }
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
  border: 2px solid #ddd;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s;
}

.arrow-btn:hover {
  background-color: #9581e8;
  color: white;
  border-color: #9581e8;
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  color: #9581e8;
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
  border-radius: 15px;
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
  border-radius: 15px;
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
  border-radius: 15px;
  box-shadow: none;
  background-color: transparent;
  border: none;
}

.secondary-planning-image img {
  display: block;
  width: 100%;      
  bottom: 0;
  left: 150px;
  border-radius: 15px;
  -webkit-mask-image: radial-gradient(ellipse 90% 90% at center, black 60%, transparent 95%);
  mask-image: radial-gradient(ellipse 90% 90% at center, black 60%, transparent 95%);
  filter: brightness(1.02) contrast(0.95);
}

.planning-content {
  flex: 1;
}

.planning-subtitle {
  font-size: 0.9rem;
  color: #9581e8;
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
  color: #9581e8;
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
  color: #9581e8;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.reviews-title {
  font-size: 1.8rem;
  color: #333;
}

/* 체리 블라썸 활성화 시 컨텐츠 상대적 위치 유지 */
.cherry-blossom-active .header,
.cherry-blossom-active .hero-section,
.cherry-blossom-active .destinations-section,
.cherry-blossom-active .airlines-section,
.cherry-blossom-active .vacation-planning,
.cherry-blossom-active .reviews-section,
.summer-leaves-active .header,
.summer-leaves-active .hero-section,
.summer-leaves-active .destinations-section,
.summer-leaves-active .airlines-section,
.summer-leaves-active .vacation-planning,
.summer-leaves-active .reviews-section {
  position: relative;
  z-index: 1001;
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