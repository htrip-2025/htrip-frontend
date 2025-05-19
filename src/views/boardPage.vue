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
        <a href="/info" class="menu-link">여행정보</a>
        <a href="#" class="menu-link">여행계획</a>
        <a href="#" class="menu-link active">커뮤니티</a>
        <a href="#" class="menu-link search-icon">🔍</a>
      </div>
      <div class="login-section">
        <a href="#" class="login-button">
          <span class="button-text">로그인</span>
        </a>
      </div>
    </header>

    <!-- 게시판 섹션 -->
    <section class="board-section">
      <!-- 커뮤니티 탭 메뉴 -->
      <div class="community-tabs">
        <a href="#" class="community-tab-item active">자유게시판</a>
        <a href="#" class="community-tab-item">여행 팁</a>
        <a href="#" class="community-tab-item">Q&A</a>
        <a href="#" class="community-tab-item">여행지 리뷰</a>
        <a href="#" class="community-tab-item">동행 구하기</a>
      </div>
      
      <!-- 검색 및 글쓰기 영역 -->
      <div class="search-write-container">
        <div class="search-box">
          <input type="text" placeholder="검색어를 입력하세요" class="search-input">
          <button class="search-btn">검색</button>
        </div>
        <button class="write-btn">글쓰기</button>
      </div>
      
      <!-- 정렬 옵션 -->
      <div class="sort-options">
        <span class="sort-option active">최신순</span>
        <span class="sort-option">인기순</span>
        <span class="sort-option">조회순</span>
      </div>
      
      <!-- 게시글 테이블 -->
      <div class="board-table">
        <div class="table-header">
          <div class="cell-number">번호</div>
          <div class="cell-title">제목</div>
          <div class="cell-author">작성자</div>
          <div class="cell-date">작성일</div>
          <div class="cell-views">조회수</div>
          <div class="cell-likes">좋아요</div>
        </div>
        
        <div class="table-row">
          <div class="cell-number">1024</div>
          <div class="cell-title">
            <span class="tag popular">[인기]</span> 
            제주도 여행시 꼭 방문해야 할 맛집 추천합니다!
          </div>
          <div class="cell-author">제주사랑</div>
          <div class="cell-date">2025.05.06</div>
          <div class="cell-views">1,245</div>
          <div class="cell-likes">87</div>
        </div>
        
        <div class="table-row">
          <div class="cell-number">1023</div>
          <div class="cell-title">서울 당일치기 코스 어떻게 생각하세요?</div>
          <div class="cell-author">여행자123</div>
          <div class="cell-date">2025.05.06</div>
          <div class="cell-views">432</div>
          <div class="cell-likes">15</div>
        </div>
        
        <div class="table-row">
          <div class="cell-number">1022</div>
          <div class="cell-title">
            <span class="tag notice">[공지]</span> 
            커뮤니티 이용 규칙 안내
          </div>
          <div class="cell-author">관리자</div>
          <div class="cell-date">2025.05.05</div>
          <div class="cell-views">2,103</div>
          <div class="cell-likes">156</div>
        </div>
        
        <div class="table-row">
          <div class="cell-number">1021</div>
          <div class="cell-title">부산 해운대에서 찍은 사진 공유합니다~</div>
          <div class="cell-author">바다사랑</div>
          <div class="cell-date">2025.05.05</div>
          <div class="cell-views">876</div>
          <div class="cell-likes">42</div>
        </div>
        
        <div class="table-row">
          <div class="cell-number">1020</div>
          <div class="cell-title">
            <span class="tag recommend">[추천]</span> 
            경주 2박 3일 여행 후기 (사진 많음)
          </div>
          <div class="cell-author">역사탐험가</div>
          <div class="cell-date">2025.05.04</div>
          <div class="cell-views">1,023</div>
          <div class="cell-likes">73</div>
        </div>
      </div>
      
      <!-- 페이지네이션 -->
      <div class="pagination">
        <a href="#" class="page-item active">1</a>
        <a href="#" class="page-item">2</a>
        <a href="#" class="page-item">3</a>
        <a href="#" class="page-item">4</a>
        <a href="#" class="page-item">5</a>
      </div>
      
      <!-- 사이드 콘텐츠 영역 -->
      <div class="side-content-container">
        <!-- 인기 게시글 -->
        <div class="popular-posts">
          <h3 class="side-title">인기 게시글</h3>
          <div class="popular-post-item">
            <span class="post-category">[여행 팁]</span> 해외여행 짐 꾸리기 노하우
            <span class="likes-count">❤️ 98</span>
          </div>
          <div class="popular-post-item">
            <span class="post-category">[추천]</span> 강릉 가족여행 추천 후기
            <span class="likes-count">❤️ 85</span>
          </div>
          <div class="popular-post-item">
            <span class="post-category">[팁]</span> 호텔 예약 시 알아두면 좋은 꿀팁
            <span class="likes-count">❤️ 76</span>
          </div>
        </div>
        
        <!-- 최근 여행지 리뷰 -->
        <div class="recent-reviews">
          <h3 class="side-title">최근 여행지 리뷰</h3>
          <div class="review-item">
            <div class="review-location">경복궁</div>
            <div class="review-rating">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <span class="review-text">역사를 느낄 수 있는 좋은 곳</span>
            </div>
          </div>
          <div class="review-item">
            <div class="review-location">해운대</div>
            <div class="review-rating">
              <span class="stars">⭐⭐⭐⭐</span>
              <span class="review-text">바다가 정말 아름다워요</span>
            </div>
          </div>
          <div class="review-item">
            <div class="review-location">성산일출봉</div>
            <div class="review-rating">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <span class="review-text">일출이 정말 장관입니다</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 여기에 필요한 Vue 관련 코드 작성 가능
import { ref } from 'vue';

// 활성 탭 상태 관리 (필요 시 추가)
const activeTab = ref('자유게시판');
const activeSort = ref('최신순');
</script>

<style scoped>
/* 기본 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
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

/* 그라데이션 원형(타원형) 스타일 - mainPage01.vue에서 가져옴 */
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

/* 헤더 스타일 - mainPage01.vue에서 가져옴 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

/* 게시판 섹션 스타일 */
.board-section {
  position: relative;
  z-index: 1;
  margin-top: 1rem;
}

/* 커뮤니티 탭 메뉴 */
.community-tabs {
  display: flex;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.community-tab-item {
  flex: 1;
  padding: 1rem 0;
  text-align: center;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: all 0.3s;
}

.community-tab-item:hover {
  background-color: #e0e0e0;
}

.community-tab-item.active {
  background-color: #9581e8;
  color: white;
}

/* 검색 및 글쓰기 영역 */
.search-write-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  width: 50%;
}

.search-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  outline: none;
  font-size: 0.9rem;
}

.search-btn {
  padding: 0.8rem 1.5rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-weight: 500;
}

.write-btn {
  padding: 0.8rem 1.5rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.write-btn:hover {
  background-color: #8571d8;
  transform: translateY(-2px);
}

/* 정렬 옵션 */
.sort-options {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.sort-option {
  color: #666;
  cursor: pointer;
  padding-bottom: 0.5rem;
  position: relative;
}

.sort-option::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #9581e8;
  transition: width 0.3s;
}

.sort-option:hover::after {
  width: 100%;
}

.sort-option.active {
  color: #9581e8;
  font-weight: 600;
}

.sort-option.active::after {
  width: 100%;
}

/* 게시글 테이블 */
.board-table {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.table-header, .table-row {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.table-header {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #555;
}

.table-row:hover {
  background-color: #f9f9f9;
}

.cell-number {
  flex: 0.5;
  text-align: center;
}

.cell-title {
  flex: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-author, .cell-date {
  flex: 1;
  text-align: center;
}

.cell-views, .cell-likes {
  flex: 0.7;
  text-align: center;
}

/* 태그 스타일 */
.tag {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 0.5rem;
}

.tag.popular {
  background-color: #ffede0;
  color: #ff8c00;
}

.tag.notice {
  background-color: #e0f0ff;
  color: #0080ff;
}

.tag.recommend {
  background-color: #e0ffea;
  color: #00a04d;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
}

.page-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-decoration: none;
  color: #555;
  transition: all 0.3s;
}

.page-item:hover {
  background-color: #f0f0f0;
}

.page-item.active {
  background-color: #9581e8;
  color: white;
}

/* 사이드 콘텐츠 영역 */
.side-content-container {
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
}

.popular-posts, .recent-reviews {
  flex: 1;
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.side-title {
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
  color: #333;
}

/* 인기 게시글 아이템 */
.popular-post-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.post-category {
  color: #9581e8;
  font-weight: 600;
  margin-right: 0.5rem;
}

.likes-count {
  color: #ff6b6b;
  font-weight: 500;
}

/* 리뷰 아이템 */
.review-item {
  padding: 0.8rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.review-location {
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.stars {
  color: #ffcc00;
  margin-right: 0.5rem;
}

.review-text {
  color: #666;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .travel-container {
    padding: 2rem 2rem;
  }
  
  .side-content-container {
    flex-direction: column;
  }
}

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
  
  .community-tabs {
    flex-wrap: wrap;
  }
  
  .community-tab-item {
    flex: none;
    width: 50%;
  }
  
  .search-write-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-box {
    width: 100%;
  }
  
  .table-header, .table-row {
    font-size: 0.9rem;
  }
  
  .cell-author, .cell-date, .cell-views, .cell-likes {
    display: none;
  }
  
  .cell-number {
    flex: 0.3;
  }
  
  .cell-title {
    flex: 1;
  }
}
</style>