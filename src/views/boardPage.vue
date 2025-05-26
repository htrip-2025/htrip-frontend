<template>
  <div class="travel-container">

    <!-- 게시판 섹션 -->
    <section class="board-section">
      <!-- 커뮤니티 탭 메뉴 -->
      <div class="community-tabs">
        <a 
          href="#" 
          class="community-tab-item"
          :class="{ active: activeTab === 'all' }"
          @click.prevent="changeTab('all')"
        >전체글 보기</a>
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
          :class="{ active: activeSort === 'LATEST' }"
          @click="changeSort('LATEST')"
        >최신순</span>
        <span 
          class="sort-option"
          :class="{ active: activeSort === 'LIKES' }"
          @click="changeSort('LIKES')"
        >인기순</span>
        <span 
          class="sort-option"
          :class="{ active: activeSort === 'VIEWS' }"
          @click="changeSort('VIEWS')"
        >조회순</span>
      </div>
      
      <!-- 로딩 인디케이터 -->
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>데이터를 불러오는 중입니다...</p>
      </div>

      <!-- 오류 메시지 -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchBoards" class="retry-btn">다시 시도</button>
      </div>
      
      <!-- 게시글 테이블 -->
      <div v-else class="board-table">
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
          v-if="latestNotice"
          :to="`/board/${latestNotice.boardNo}`"
          class="table-row notice-row"
        >
          <div class="cell-number">공지</div>
          <div class="cell-title">
            <span class="tag notice">[공지]</span> 
            {{ latestNotice.title }}
          </div>
          <div class="cell-author">{{ latestNotice.author }}</div>
          <div class="cell-date">{{ formatDate(latestNotice.writeDate) }}</div>
          <div class="cell-views">{{ latestNotice.views }}</div>
          <div class="cell-likes">{{ latestNotice.likes }}</div>
        </router-link>
        
        <!-- 일반 게시글 -->
        <router-link 
          v-for="post in posts" 
          :key="post.boardNo"
          :to="`/board/${post.boardNo}`"
          class="table-row"
        >
          <div class="cell-number">{{ post.boardNo }}</div>
          <div class="cell-title">
            <span v-if="post.categoryNo === 2" class="tag free">[자유]</span>
            <span v-else-if="post.categoryNo === 3" class="tag tip">[팁]</span>
            <span v-else-if="post.categoryNo === 4" class="tag qna">[Q&A]</span>
            <span v-else-if="post.categoryNo === 5" class="tag companion">[동행]</span>
            <span v-if="post.hasImage" class="attachment-icon">📷</span>
            {{ post.title }}
            <span v-if="post.commentCount > 0" class="comment-count">[{{ post.commentCount }}]</span>
          </div>
          <div class="cell-author">{{ post.author }}</div>
          <div class="cell-date">{{ formatDate(post.writeDate) }}</div>
          <div class="cell-views">{{ post.views }}</div>
          <div class="cell-likes">{{ post.likes }}</div>
        </router-link>

        <!-- 데이터가 없을 때 -->
        <div v-if="posts.length === 0" class="no-data">
          <p>게시글이 없습니다.</p>
        </div>
      </div>
      
      <!-- 페이지네이션 -->
      <div v-if="!loading && !error && totalPages > 0" class="pagination">
        <button 
          class="page-item"
          :disabled="currentPage === 0"
          @click="changePage(currentPage - 1)"
        >이전</button>
        <button 
          v-for="page in paginationRange"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >{{ page + 1 }}</button>
        <button 
          class="page-item"
          :disabled="currentPage === totalPages - 1"
          @click="changePage(currentPage + 1)"
        >다음</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 상태 관리
const activeTab = ref('all'); // 기본값은 '전체글 보기'
const activeSort = ref('LATEST');
const searchQuery = ref('');
const searchType = ref('title_content');
const currentPage = ref(0); // 백엔드는 0부터 시작하는 페이징
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);

// 데이터 상태
const posts = ref([]);
const latestNotice = ref(null);
const loading = ref(false);
const error = ref(null);

// 카테고리 번호 매핑
const categoryMapping = {
  'all': 0,    // 전체글 보기
  'free': 2,   // 자유게시판
  'tips': 3,   // 여행 팁
  'qna': 4,    // 질문/답변
  'companion': 5, // 동행 구하기
  'notice': 1  // 공지사항
};

// 계산된 속성
const paginationRange = computed(() => {
  const totalPageCount = totalPages.value;
  const current = currentPage.value;
  const delta = 2; // 현재 페이지 앞뒤로 보여줄 페이지 수
  
  let start = Math.max(0, current - delta);
  let end = Math.min(totalPageCount - 1, current + delta);
  
  // 표시할 페이지 수가 5개 미만인 경우 더 많은 페이지 표시
  if (end - start < 4) {
    if (start === 0) {
      end = Math.min(4, totalPageCount - 1);
    } else if (end === totalPageCount - 1) {
      start = Math.max(0, totalPageCount - 5);
    }
  }
  
  // 범위 내의 페이지 번호 배열 생성
  const range = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  
  return range;
});

// 게시글 목록 조회
const fetchBoards = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    let url;
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      sort: activeSort.value
    };
    
    // 전체글 보기
    if (activeTab.value === 'all') {
      url = `${API_BASE_URL}/api/board`;
    }
    // 공지사항 탭
    else if (activeTab.value === 'notice') {
      url = `${API_BASE_URL}/api/board/category/${categoryMapping.notice}`;
    }
    // 카테고리별 조회
    else {
      const categoryNo = categoryMapping[activeTab.value];
      url = `${API_BASE_URL}/api/board/category/${categoryNo}`;
    }

    const { data } = await axios.get(url, {
      params: { page: currentPage.value, size: pageSize.value, sort: activeSort.value }
    });

    // 게시글
    const wrapper = data.boards ?? data;
    posts.value        = wrapper.content || [];
    totalPages.value   = wrapper.totalPages || 0;
    totalElements.value= wrapper.totalElements || 0;

    if (activeTab.value === 'notice') {
      latestNotice.value = null;
    } else {
      latestNotice.value = data.latestNotice || null;
    }

  } catch (err) {
    console.error('게시글 목록 조회 실패:', err);
    error.value = '게시글 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.';
    posts.value = [];
  } finally {
    loading.value = false;
  }
};

// 게시글 검색
const searchPosts = async () => {
  if (!searchQuery.value.trim()) {
    fetchBoards();
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/board/search`, {
      params: {
        type: searchType.value,
        keyword: searchQuery.value,
        page: 0, // 검색 시 첫 페이지로 이동
        size: pageSize.value,
        sort: 'writeDate',
        direction: 'desc'
      }
    });
    
    posts.value = response.data.content;
    totalPages.value = response.data.totalPages;
    totalElements.value = response.data.totalElements;
    currentPage.value = 0; // 페이지 초기화
    
    // 검색 시에는 공지사항 표시 안함
    latestNotice.value = null;
    
  } catch (err) {
    console.error('게시글 검색 실패:', err);
    error.value = '게시글 검색에 실패했습니다. 잠시 후 다시 시도해주세요.';
    posts.value = [];
  } finally {
    loading.value = false;
  }
};

// 탭 변경
const changeTab = (tab) => {
  activeTab.value = tab;
  currentPage.value = 0; // 페이지 초기화
  searchQuery.value = ''; // 검색어 초기화
  fetchBoards();
  
  // URL 쿼리 파라미터 업데이트
  router.push({ query: { category: tab }});
};

// 정렬 변경
const changeSort = (sort) => {
  activeSort.value = sort;
  fetchBoards();
};

// 페이지 변경
const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchBoards();
  }
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // 오늘 날짜인 경우 시간만 표시
  if (date.toDateString() === now.toDateString()) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  // 올해인 경우 월, 일만 표시
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}.${date.getDate()}`;
  }
  
  // 그 외에는 연, 월, 일 표시
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

// 쿼리 파라미터 감시
watch(() => route.query, (newQuery) => {
  // URL에 카테고리가 있으면 탭 변경
  if (newQuery.category && Object.keys(categoryMapping).includes(newQuery.category)) {
    activeTab.value = newQuery.category;
  }
  
  // URL에 검색어가 있으면 검색 실행
  if (newQuery.keyword) {
    searchQuery.value = newQuery.keyword;
    searchType.value = newQuery.type || 'title_content';
    searchPosts();
  } else {
    fetchBoards();
  }
}, { immediate: true });

// 컴포넌트 마운트 시 게시글 목록 조회
onMounted(() => {
  // URL 쿼리 파라미터가 없으면 기본 조회
  if (!route.query.category && !route.query.keyword) {
    fetchBoards();
  }
});
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

   min-height: 100vh;
  background-image: url('https://i.pinimg.com/736x/91/72/b7/9172b7886a49d6649cb05dea79f55f53.jpg');
  background-repeat: repeat;
  background-size: auto;
  background-attachment: fixed;

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

.tag.free {
  background-color: #e0f2ff;
  color: #1982c4;
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