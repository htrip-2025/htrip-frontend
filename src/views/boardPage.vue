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
        <a href="/login" class="login-button">
          <span class="button-text">로그인</span>
        </a>
      </div>
    </header>

    <!-- 게시판 섹션 -->
    <section class="board-section">
      <!-- 커뮤니티 탭 메뉴 -->
      <div class="community-tabs">
        <a 
          href="#" 
          class="community-tab-item"
          :class="{ active: activeTab === 'free' }"
          @click.prevent="changeTab('free')"
        >자유게시판</a>
        <a 
          href="#" 
          class="community-tab-item"
          :class="{ active: activeTab === 'tips' }"
          @click.prevent="changeTab('tips')"
        >여행 팁</a>
        <a 
          href="#" 
          class="community-tab-item"
          :class="{ active: activeTab === 'qna' }"
          @click.prevent="changeTab('qna')"
        >질문/답변</a>
        <a 
          href="#" 
          class="community-tab-item"
          :class="{ active: activeTab === 'companion' }"
          @click.prevent="changeTab('companion')"
        >동행 구하기</a>
        <a 
          href="#" 
          class="community-tab-item"
          :class="{ active: activeTab === 'notice' }"
          @click.prevent="changeTab('notice')"
        >공지사항</a>
      </div>
      
      <!-- 검색 및 글쓰기 영역 -->
      <div class="search-write-container">
        <div class="search-box">
          <select v-model="searchType" class="search-type-select">
            <option value="title_content">제목+내용</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="author">작성자</option>
          </select>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="검색어를 입력하세요" 
            class="search-input"
            @keyup.enter="searchPosts"
          >
          <button class="search-btn" @click="searchPosts">검색</button>
        </div>
        <router-link to="/board/write" class="write-btn">글쓰기</router-link>
      </div>
      
      <!-- 정렬 옵션 -->
      <div class="sort-options">
        <span 
          class="sort-option"
          :class="{ active: activeSort === 'latest' }"
          @click="changeSort('latest')"
        >최신순</span>
        <span 
          class="sort-option"
          :class="{ active: activeSort === 'popular' }"
          @click="changeSort('popular')"
        >인기순</span>
        <span 
          class="sort-option"
          :class="{ active: activeSort === 'views' }"
          @click="changeSort('views')"
        >조회순</span>
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
        
        <!-- 공지사항 (항상 최상단) -->
        <router-link 
          v-for="notice in noticePost" 
          :key="notice.id"
          :to="`/board/${notice.id}`"
          class="table-row notice-row"
        >
          <div class="cell-number">공지</div>
          <div class="cell-title">
            <span class="tag notice">[공지]</span> 
            {{ notice.title }}
          </div>
          <div class="cell-author">{{ notice.author }}</div>
          <div class="cell-date">{{ formatDate(notice.createdAt) }}</div>
          <div class="cell-views">{{ notice.views.toLocaleString() }}</div>
          <div class="cell-likes">{{ notice.likes }}</div>
        </router-link>
        
        <!-- 일반 게시글 -->
        <router-link 
          v-for="post in displayedPosts" 
          :key="post.id"
          :to="`/board/${post.id}`"
          class="table-row"
        >
          <div class="cell-number">{{ post.id }}</div>
          <div class="cell-title">
            <span v-if="post.category === 'tips'" class="tag tip">[팁]</span>
            <span v-else-if="post.category === 'qna'" class="tag qna">[Q&A]</span>
            <span v-else-if="post.category === 'companion'" class="tag companion">[동행]</span>
            <span v-if="post.hasImage" class="attachment-icon">📷</span>
            <span v-if="post.commentCount > 0" class="comment-count">[{{ post.commentCount }}]</span>
            {{ post.title }}
          </div>
          <div class="cell-author">{{ post.author }}</div>
          <div class="cell-date">{{ formatDate(post.createdAt) }}</div>
          <div class="cell-views">{{ post.views.toLocaleString() }}</div>
          <div class="cell-likes">{{ post.likes }}</div>
        </router-link>
      </div>
      
      <!-- 페이지네이션 -->
      <div class="pagination">
        <button 
          class="page-item"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >이전</button>
        <button 
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >{{ page }}</button>
        <button 
          class="page-item"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >다음</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 상태 관리
const activeTab = ref('free');
const activeSort = ref('latest');
const searchQuery = ref('');
const searchType = ref('title_content');
const currentPage = ref(1);
const postsPerPage = 10;

// 더미 게시글 데이터
const allPosts = ref([
  // 공지사항
  {
    id: 1001,
    title: '커뮤니티 이용 규칙 안내',
    author: '관리자',
    category: 'notice',
    content: '커뮤니티 이용 시 지켜야 할 규칙들을 안내드립니다.',
    createdAt: '2025-05-05',
    views: 2103,
    likes: 156,
    commentCount: 8,
    hasImage: false,
    isNotice: true
  },
  // 일반 게시글
  {
    id: 1024,
    title: '제주도 여행시 꼭 방문해야 할 맛집 추천합니다!',
    author: '제주사랑',
    category: 'tips',
    content: '제주도 3박 4일 여행하면서 발견한 숨은 맛집들을 소개합니다.',
    createdAt: '2025-05-06',
    views: 1245,
    likes: 87,
    commentCount: 23,
    hasImage: true
  },
  {
    id: 1023,
    title: '서울 당일치기 코스 어떻게 생각하세요?',
    author: '여행자123',
    category: 'qna',
    content: '서울 당일치기로 경복궁-북촌한옥마을-인사동 코스 계획했는데 어떤가요?',
    createdAt: '2025-05-06',
    views: 432,
    likes: 15,
    commentCount: 12,
    hasImage: false
  },
  {
    id: 1022,
    title: '부산 해운대에서 찍은 사진 공유합니다~',
    author: '바다사랑',
    category: 'free',
    content: '어제 부산 해운대에서 찍은 예쁜 사진들 공유해요!',
    createdAt: '2025-05-05',
    views: 876,
    likes: 42,
    commentCount: 18,
    hasImage: true
  },
  {
    id: 1021,
    title: '경주 2박 3일 여행 후기 (사진 많음)',
    author: '역사탐험가',
    category: 'tips',
    content: '경주 여행 코스와 팁을 자세히 정리했습니다.',
    createdAt: '2025-05-04',
    views: 1023,
    likes: 73,
    commentCount: 31,
    hasImage: true
  },
  {
    id: 1020,
    title: '6월 강릉 여행 같이 가실 분 구해요!',
    author: '동행러버',
    category: 'companion',
    content: '6월 둘째 주 강릉 1박 2일 여행 동행 구합니다.',
    createdAt: '2025-05-04',
    views: 654,
    likes: 28,
    commentCount: 9,
    hasImage: false
  },
  {
    id: 1019,
    title: '유럽 배낭여행 준비물 체크리스트',
    author: '배낭여행러',
    category: 'tips',
    content: '유럽 배낭여행 3주간 다녀온 후기와 준비물 리스트입니다.',
    createdAt: '2025-05-03',
    views: 1456,
    likes: 94,
    commentCount: 27,
    hasImage: true
  },
  {
    id: 1018,
    title: '여행 중 와이파이 사용 방법 질문드려요',
    author: '초보여행자',
    category: 'qna',
    content: '해외여행시 인터넷 사용하는 가장 경제적인 방법이 뭔가요?',
    createdAt: '2025-05-03',
    views: 723,
    likes: 35,
    commentCount: 19,
    hasImage: false
  },
  {
    id: 1017,
    title: '일본 도쿄 벚꽃 시즌 여행기',
    author: '벚꽃사랑',
    category: 'free',
    content: '4월 초 도쿄 벚꽃 여행 다녀온 후기입니다.',
    createdAt: '2025-05-02',
    views: 987,
    likes: 67,
    commentCount: 14,
    hasImage: true
  },
  {
    id: 1016,
    title: '대만 타이베이 먹방 여행 같이 하실 분!',
    author: '먹방러버',
    category: 'companion',
    content: '7월 대만 타이베이 먹방 투어 동행 구합니다.',
    createdAt: '2025-05-02',
    views: 543,
    likes: 22,
    commentCount: 6,
    hasImage: false
  },
  {
    id: 1015,
    title: '국내 캠핑장 추천 부탁드려요',
    author: '캠핑초보',
    category: 'qna',
    content: '첫 캠핑 계획 중인데 초보자에게 좋은 캠핑장 추천해주세요.',
    createdAt: '2025-05-01',
    views: 634,
    likes: 41,
    commentCount: 22,
    hasImage: false
  }
]);

// 필터링된 게시글
const filteredPosts = computed(() => {
  let posts = allPosts.value.filter(post => !post.isNotice);
  
  // 탭별 필터링
  if (activeTab.value !== 'free') {
    posts = posts.filter(post => post.category === activeTab.value);
  }
  
  // 검색 필터링
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    posts = posts.filter(post => {
      switch (searchType.value) {
        case 'title':
          return post.title.toLowerCase().includes(query);
        case 'content':
          return post.content.toLowerCase().includes(query);
        case 'author':
          return post.author.toLowerCase().includes(query);
        case 'title_content':
        default:
          return post.title.toLowerCase().includes(query) || 
                 post.content.toLowerCase().includes(query);
      }
    });
  }
  
  // 정렬
  return posts.sort((a, b) => {
    switch (activeSort.value) {
      case 'popular':
        return b.likes - a.likes;
      case 'views':
        return b.views - a.views;
      case 'latest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
});

// 공지사항
const noticePost = computed(() => {
  return allPosts.value.filter(post => post.isNotice);
});

// 현재 페이지에 표시할 게시글
const displayedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return filteredPosts.value.slice(start, end);
});

// 총 페이지 수
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage);
});

// 메서드
const changeTab = (tab) => {
  activeTab.value = tab;
  currentPage.value = 1;
};

const changeSort = (sort) => {
  activeSort.value = sort;
  currentPage.value = 1;
};

const searchPosts = () => {
  currentPage.value = 1;
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}.${date.getDate()}`;
};
</script>

<style scoped>
/* 기존 스타일 유지 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

.travel-container {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 6rem;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

/* 그라데이션 원형 스타일 */
.gradient-circle {
  position: absolute;
  border-radius: 65% 35% 60% 40% / 60% 40% 60% 40%;
  z-index: 0;
  transform: skew(-5deg, -10deg);
}

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

/* 헤더 스타일 */
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
  cursor: pointer;
}

.community-tab-item:hover {
  background-color: #e0e0e0;
}

.community-tab-item.active {
  background-color: #9581e8;
  color: white;
}

/* 검색 및 글쓰기 영역 수정 */
.search-write-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  width: 60%;
  gap: 0.5rem;
}

.search-type-select {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  font-size: 0.9rem;
  min-width: 120px;
}

.search-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  font-size: 0.9rem;
}

.search-btn {
  padding: 0.8rem 1.5rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 5px;
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
  text-decoration: none;
  display: inline-block;
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
  text-decoration: none;
}

.table-header {
  background-color: #f8f8f8;
  font-weight: 600;
  color: #555;
}

.table-row {
  color: #333;
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: #f9f9f9;
  color: #000;
}

.notice-row {
  background-color: #fff8e1;
}

.notice-row:hover {
  background-color: #fff3c4;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  font-weight: 500;
}

.cell-author, .cell-date {
  flex: 1;
  text-align: center;
  color: #555;
  font-weight: 500;
}

.cell-views, .cell-likes {
  flex: 0.7;
  text-align: center;
  color: #666;
  font-weight: 500;
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

.tag.notice {
  background-color: #e0f0ff;
  color: #0080ff;
}

.tag.tip {
  background-color: #e0ffea;
  color: #00a04d;
}

.tag.qna {
  background-color: #ffede0;
  color: #ff8c00;
}

.tag.companion {
  background-color: #f0e0ff;
  color: #8c00ff;
}

.attachment-icon {
  font-size: 0.9rem;
  margin-right: 0.3rem;
}

.comment-count {
  color: #9581e8;
  font-weight: 600;
  margin-left: 0.3rem;
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
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: white;
  color: #555;
  transition: all 0.3s;
  cursor: pointer;
  text-decoration: none;
}

.page-item:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.page-item.active {
  background-color: #9581e8;
  color: white;
  border-color: #9581e8;
}

.page-item:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.5;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .travel-container {
    padding: 2rem 2rem;
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
    flex-direction: column;
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