<template>
  <div class="travel-container">
    <!-- 헤더 -->
 
    <!-- 히어로 섹션 -->
    <section class="hero-section">
      <div class="hero-content">
        <br>
        <p class="hero-subtitle">The vacation you deserve is closer than you think </p>
        <h1 class="hero-title">
            <br>
            <br>
          Since I was born <br>
          I traveled to Korea<br>
        </h1>

        <!-- 계획 시작하기 버튼 - 왼쪽 정렬로 변경 -->
<div class="plan-button-container">
  <router-link to="/plan" class="plan-start-button">
    <span class="button-text">여행 계획 시작하기</span>
  </router-link>
</div>
</div>

      <div class="hero-images">
  <div class="polaroid-container">
    <div class="polaroid main-image">
      <img src="https://i.pinimg.com/736x/25/d2/54/25d254a20512c16e7670653a01ac5e14.jpg" alt="Traveler in nature">
      <div class="polaroid-bottom"></div>
    </div>
    
    <div class="polaroid secondary-image">
      <img src="https://i.pinimg.com/736x/40/7e/4c/407e4c902c66973ecc2f5a48612e7581.jpg" alt="Scenic view">
      <div class="polaroid-bottom"></div>
    </div>
    
    <div class="polaroid third-image">
      <img src="https://i.pinimg.com/736x/86/a3/fe/86a3fe5cb80c7b1f3496f951fcb607a4.jpg" alt="Another view">
      <div class="polaroid-bottom"></div>
    </div>
    
    <div class="polaroid fourth-image">
      <img src="https://i.pinimg.com/736x/27/d1/dc/27d1dc5282bd7df8b8fdeac347482ea3.jpg" alt="More scenery">
      <div class="polaroid-bottom"></div>
    </div>
  </div>
</div>
    </section>





    <!-- 목적지 섹션 -->
    <section class="destinations-section">
      <div class="section-header">
       
        <div class="navigation-arrows">
          <!-- <button class="arrow-btn prev">◀</button>
          <button class="arrow-btn next">▶</button> -->
        </div>
      </div>
     
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

  
  // 요소가 존재할 때만 이벤트 리스너 추가
  if (prevButton) {
    prevButton.addEventListener('click', scrollLeft);
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', scrollRight);
  }
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
  margin: 0 auto;
  padding: 2rem 6rem;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
  min-height: 100vh;



  min-height: 100vh;
  background-image: url('https://i.pinimg.com/736x/5e/9f/07/5e9f07d84b763d9fd5becff18cc6e99e.jpg');
  background-repeat: repeat;
  background-size: cover;
  background-attachment: fixed;

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
  background: linear-gradient(135deg, #2172ce 0%, #2c88f1 100%); /* 연한 색상으로 변경 */
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
  background: linear-gradient(135deg, #2c88f1 0%, #2172ce 100%); /* 연한 색상으로 변경 */
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

/* 배경에 커브 선 추가 */
/* .hero-images::before {
  content: '';
  position: absolute;
  top: 30%;
  left: 5%;
  width: 90%;
  height: 50%;
  border: 2px solid #e6d7a3;
  border-left: none;
  border-right: none;
  border-bottom: none;
  border-radius: 50% 50% 0 0;
  z-index: 0;
} */

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