<template>
  <div class="mypage-container">
  
    <!-- 마이페이지 콘텐츠 -->
    <div class="mypage-content">
      <div class="mypage-layout">
        <!-- 왼쪽 사이드바 -->
        <div class="sidebar">
          <!-- 프로필 정보 -->
          <div class="profile-section">
            <div class="profile-image">
              <img src="" alt="프로필 이미지" ref="profileImage" class="avatar-img"/>
              <button class="edit-profile-btn" title="프로필 편집">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <h2 class="profile-name">{{ userProfile.name }}</h2>
            <p class="profile-email">{{ userProfile.email }}</p>
            
            <!-- 통계 정보 -->
            <div class="profile-stats">
              <div class="stat-row">
                <span class="stat-label">총 여행 계획</span>
                <span class="stat-value">{{ stats.totalTrips }}</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-row">
                <span class="stat-label">찜한 여행지</span>
                <span class="stat-value">{{ stats.totalWishlists }}</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-row">
                <span class="stat-label">작성한 리뷰</span>
                <span class="stat-value">{{ stats.totalReviews }}</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-row">
                <span class="stat-label">작성한 게시글</span>
                <span class="stat-value">{{ stats.totalPosts }}</span>
              </div>
            </div>
          </div>
          
          <!-- 네비게이션 메뉴 -->
          <div class="navigation-menu">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="nav-btn"
              :class="{ active: activeTab === tab.id }"
            >
              <span class="nav-icon">{{ tab.icon }}</span>
              <span class="nav-text">{{ tab.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- 오른쪽 콘텐츠 영역 -->
        <div class="content-area">
          <!-- 홈 탭 -->
          <div v-if="activeTab === 'home'" class="home-content">
            <!-- 요약 섹션들 -->
            <div class="summary-sections">
              <!-- 상단 수평 레이아웃 (최근 여행 계획 + 최근 찜한 여행지) -->
              <div class="horizontal-summary-row">
                <!-- 최근 여행 계획 -->
                <div class="summary-card">
                  <div class="summary-header">
                    <h3>최근 여행 계획</h3>
                    <button @click="activeTab = 'plans'" class="more-btn">더보기</button>
                  </div>
                  <div class="summary-list">
                    <div v-for="plan in recentPlans.slice(0, 3)" :key="plan.id" class="summary-item home-summary-item">
                      <div class="item-title clickable" @click="viewItem('plan', plan.id)">{{ plan.title }}</div>
                      <div class="item-subtitle">{{ plan.date }} · {{ plan.participants }}명</div>
                    </div>
                  </div>
                </div>
                
                <!-- 최근 찜한 여행지 -->
                <div class="summary-card">
                  <div class="summary-header">
                    <h3>최근 찜한 여행지</h3>
                    <button @click="activeTab = 'wishlists'" class="more-btn">더보기</button>
                  </div>
                  <div class="summary-grid">
                    <div v-for="item in recentWishlists.slice(0, 4)" :key="item.id" class="wishlist-preview clickable" @click="viewItem('wishlist', item.placeId)">
                      <img :src="item.image" :alt="item.title" />
                      <div class="wishlist-title">{{ item.title }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 하단 수직 레이아웃 (리뷰, 게시글, 댓글) -->
              <div class="vertical-summary-section">
                <!-- 최근 리뷰 -->
                <div class="summary-card">
                  <div class="summary-header">
                    <h3>최근 리뷰</h3>
                    <button @click="activeTab = 'reviews'" class="more-btn">더보기</button>
                  </div>
                  <div class="summary-list">
                    <div v-for="review in allReviews.slice(0, 3)" :key="review.id" class="summary-item">
                      <div class="item-title clickable" @click="viewItem('review', review.placeId)">{{ review.placeName }}</div>
                      <div class="item-subtitle">{{ review.date }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- 최근 게시글 -->
                <div class="summary-card">
                  <div class="summary-header">
                    <h3>최근 게시글</h3>
                    <button @click="activeTab = 'posts'" class="more-btn">더보기</button>
                  </div>
                  <div class="summary-list">
                    <div v-for="post in recentPosts.slice(0, 3)" :key="post.id" class="summary-item">
                      <div class="item-title clickable" @click="viewItem('post', post.id)">{{ post.title }}</div>
                      <div class="item-subtitle">{{ post.date }} · 조회 {{ post.views }}회</div>
                    </div>
                  </div>
                </div>
                
                <!-- 최근 댓글 -->
                <div class="summary-card">
                  <div class="summary-header">
                    <h3>최근 댓글</h3>
                    <button @click="activeTab = 'comments'" class="more-btn">더보기</button>
                  </div>
                  <div class="summary-list">
                    <div v-for="comment in allComments.slice(0, 3)" :key="comment.id" class="summary-item">
                      <div class="item-title clickable" @click="viewItem('comment', comment.boardNo)">{{ comment.postTitle }}</div>
                      <div class="item-subtitle">{{ comment.date }} · 좋아요 {{ comment.likes }}개</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 나의 찜 탭 -->
          <div v-if="activeTab === 'wishlists'" class="wishlists-content">
            <div class="content-header">
              <h2 class="content-title">나의 찜 ({{ filteredWishlists.length }})</h2>
              
              <div class="content-actions">
                <div class="search-box">
                  <input 
                    type="text" 
                    v-model="searchTerms.wishlists" 
                    placeholder="여행지명 검색..." 
                    class="search-input"
                  />
                </div>
                <button 
                  @click="deleteSelected('wishlists')" 
                  class="delete-btn" 
                  :disabled="selectedItems.wishlists.length === 0"
                >
                  선택 삭제
                </button>
              </div>
              
              <div class="select-all-container">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected('wishlists')" 
                    @change="toggleSelectAll('wishlists')" 
                  />
                  <span class="checkmark"></span>
                  전체 선택
                </label>
              </div>
            </div>
            
            <div class="wishlists-grid">
              <div v-for="item in paginatedWishlists" :key="item.id" class="wishlist-card">
                <div class="item-checkbox">
                  <label class="checkbox-container">
                    <input 
                      type="checkbox" 
                      :checked="isSelected('wishlists', item.id)" 
                      @change="toggleSelect('wishlists', item.id)" 
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>
                <div class="wishlist-image">
                  <img :src="item.image" :alt="item.title" />
                  <button class="remove-wishlist-btn" @click="removeWishlist(item.id)">❤️</button>
                </div>
                <div class="wishlist-info">
                  <h4 class="clickable" @click="viewItem('wishlist', item.placeId)">{{ item.title }}</h4>
                  <p>{{ item.location }}</p>
                </div>
              </div>
            </div>
            
            <div class="pagination-container" v-if="totalPages.wishlists > 1">
              <div class="pagination">
                <button 
                  class="page-btn" 
                  :disabled="currentPage.wishlists === 1" 
                  @click="changePage('wishlists', currentPage.wishlists - 1)"
                >
                  이전
                </button>
                <button 
                  v-for="page in getPageNumbers('wishlists')" 
                  :key="page" 
                  class="page-btn" 
                  :class="{ active: currentPage.wishlists === page }" 
                  @click="changePage('wishlists', page)"
                >
                  {{ page }}
                </button>
                <button 
                  class="page-btn" 
                  :disabled="currentPage.wishlists === totalPages.wishlists" 
                  @click="changePage('wishlists', currentPage.wishlists + 1)"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
          
          <!-- 나의 여행 계획 탭 -->
          <div v-if="activeTab === 'plans'" class="plans-content">
            <div class="content-header">
              <h2 class="content-title">나의 여행 계획 ({{ filteredPlans.length }})</h2>
              
              <div class="content-actions">
                <div class="search-box">
                  <input 
                    type="text" 
                    v-model="searchTerms.plans" 
                    placeholder="여행 제목 검색..." 
                    class="search-input"
                  />
                  <select v-model="filterStatus" class="filter-select">
                    <option value="all">모든 상태</option>
                    <option value="completed">완료</option>
                    <option value="planning">계획 중</option>
                    <option value="cancelled">취소됨</option>
                  </select>
                </div>
                <button 
                  @click="deleteSelected('plans')" 
                  class="delete-btn" 
                  :disabled="selectedItems.plans.length === 0"
                >
                  선택 삭제
                </button>
              </div>
              
              <div class="select-all-container">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected('plans')" 
                    @change="toggleSelectAll('plans')" 
                  />
                  <span class="checkmark"></span>
                  전체 선택
                </label>
              </div>
            </div>
            
            <div class="plans-list">
              <div v-for="plan in paginatedPlans" :key="plan.id" class="plan-card">
                <div class="item-checkbox">
                  <label class="checkbox-container">
                    <input 
                      type="checkbox" 
                      :checked="isSelected('plans', plan.id)" 
                      @change="toggleSelect('plans', plan.id)" 
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>
                <div class="plan-info">
                  <h4 class="clickable" @click="viewItem('plan', plan.id)">{{ plan.title }}</h4>
                  <p>{{ plan.date }} · {{ plan.participants }}명</p>
                  <span class="plan-status" :class="plan.status">{{ getStatusText(plan.status) }}</span>
                </div>
              </div>
            </div>
            
            <div class="pagination-container" v-if="totalPages.plans > 1">
              <div class="pagination">
                <button 
                  class="page-btn" 
                  :disabled="currentPage.plans === 1" 
                  @click="changePage('plans', currentPage.plans - 1)"
                >
                  이전
                </button>
                <button 
                  v-for="page in getPageNumbers('plans')" 
                  :key="page" 
                  class="page-btn" 
                  :class="{ active: currentPage.plans === page }" 
                  @click="changePage('plans', page)"
                >
                  {{ page }}
                </button>
                <button 
                  class="page-btn" 
                  :disabled="currentPage.plans === totalPages.plans" 
                  @click="changePage('plans', currentPage.plans + 1)"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
          
          <!-- 나의 리뷰 탭 -->
          <div v-if="activeTab === 'reviews'" class="reviews-content">
            <div class="content-header">
              <h2 class="content-title">나의 리뷰 ({{ filteredReviews.length }})</h2>
              
              <div class="content-actions">
                <div class="search-box">
                  <input 
                    type="text" 
                    v-model="searchTerms.reviews" 
                    placeholder="장소명 검색..." 
                    class="search-input"
                  />
                </div>
                <button 
                  @click="deleteSelected('reviews')" 
                  class="delete-btn" 
                  :disabled="selectedItems.reviews.length === 0"
                >
                  선택 삭제
                </button>
              </div>
              
              <div class="select-all-container">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected('reviews')" 
                    @change="toggleSelectAll('reviews')" 
                  />
                  <span class="checkmark"></span>
                  전체 선택
                </label>
              </div>
            </div>
            
            <div class="reviews-list">
              <div v-for="review in paginatedReviews" :key="review.id" class="review-card">
                <div class="item-checkbox">
                  <label class="checkbox-container">
                    <input 
                      type="checkbox" 
                      :checked="isSelected('reviews', review.id)" 
                      @change="toggleSelect('reviews', review.id)" 
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>
                <div class="review-image">
                  <img :src="review.image" :alt="review.placeName" />
                </div>
                <div class="review-info">
                  <h4 class="clickable" @click="viewItem('review', review.id)">{{ review.placeName }}</h4>
                  <p class="review-text">{{ review.content }}</p>
                  <div class="review-date">{{ review.date }}</div>
                </div>
              </div>
            </div>
            
            <div class="pagination-container" v-if="totalPages.reviews > 1">
              <div class="pagination">
                <button 
                  class="page-btn" 
                  :disabled="currentPage.reviews === 1" 
                  @click="changePage('reviews', currentPage.reviews - 1)"
                >
                  이전
                </button>
                <button 
                  v-for="page in getPageNumbers('reviews')" 
                  :key="page" 
                  class="page-btn" 
                  :class="{ active: currentPage.reviews === page }" 
                  @click="changePage('reviews', page)"
                >
                  {{ page }}
                </button>
                <button 
                  class="page-btn" 
                  :disabled="currentPage.reviews === totalPages.reviews" 
                  @click="changePage('reviews', currentPage.reviews + 1)"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
          
          <!-- 나의 게시글 탭 -->
          <div v-if="activeTab === 'posts'" class="posts-content">
            <div class="content-header">
              <h2 class="content-title">나의 게시글 ({{ filteredPosts.length }})</h2>
              
              <div class="content-actions">
                <div class="search-box">
                  <input 
                    type="text" 
                    v-model="searchTerms.posts" 
                    placeholder="제목 검색..." 
                    class="search-input"
                  />
                  <select v-model="categoryFilter" class="filter-select">
                    <option value="all">모든 카테고리</option>
                    <option value="여행팁">여행팁</option>
                    <option value="맛집">맛집</option>
                    <option value="추천">추천</option>
                    <option value="후기">후기</option>
                  </select>
                </div>
                <button 
                  @click="deleteSelected('posts')" 
                  class="delete-btn" 
                  :disabled="selectedItems.posts.length === 0"
                >
                  선택 삭제
                </button>
              </div>
              
              <div class="select-all-container">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected('posts')" 
                    @change="toggleSelectAll('posts')" 
                  />
                  <span class="checkmark"></span>
                  전체 선택
                </label>
              </div>
            </div>
            
            <div class="posts-list">
              <div v-for="post in paginatedPosts" :key="post.id" class="post-card">
                <div class="item-checkbox">
                  <label class="checkbox-container">
                    <input 
                      type="checkbox" 
                      :checked="isSelected('posts', post.id)" 
                      @change="toggleSelect('posts', post.id)" 
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>
                <div class="post-info">
                  <span class="post-category">{{ post.category }}</span>
                  <h4 class="clickable" @click="viewItem('post', post.id)">{{ post.title }}</h4>
                  <div class="post-meta">
                    <span>{{ post.date }}</span>
                    <span>조회 {{ post.views }}회</span>
                    <span>댓글 {{ post.comments }}개</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="pagination-container" v-if="totalPages.posts > 1">
              <div class="pagination">
                <button 
                  class="page-btn" 
                  :disabled="currentPage.posts === 1" 
                  @click="changePage('posts', currentPage.posts - 1)"
                >
                  이전
                </button>
                <button 
                  v-for="page in getPageNumbers('posts')" 
                  :key="page" 
                  class="page-btn" 
                  :class="{ active: currentPage.posts === page }" 
                  @click="changePage('posts', page)"
                >
                  {{ page }}
                </button>
                <button 
                  class="page-btn" 
                  :disabled="currentPage.posts === totalPages.posts" 
                  @click="changePage('posts', currentPage.posts + 1)"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
          
          <!-- 나의 댓글 탭 -->
          <div v-if="activeTab === 'comments'" class="comments-content">
            <div class="content-header">
              <h2 class="content-title">나의 댓글 ({{ filteredComments.length }})</h2>
              
              <div class="content-actions">
                <div class="search-box">
                  <input 
                    type="text" 
                    v-model="searchTerms.comments" 
                    placeholder="내용 검색..." 
                    class="search-input"
                  />
                </div>
                <button 
                  @click="deleteSelected('comments')" 
                  class="delete-btn" 
                  :disabled="selectedItems.comments.length === 0"
                >
                  선택 삭제
                </button>
              </div>
              
              <div class="select-all-container">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected('comments')" 
                    @change="toggleSelectAll('comments')" 
                  />
                  <span class="checkmark"></span>
                  전체 선택
                </label>
              </div>
            </div>
            
            <div class="comments-list">
              <div v-for="comment in paginatedComments" :key="comment.id" class="comment-card">
                <div class="item-checkbox">
                  <label class="checkbox-container">
                    <input 
                      type="checkbox" 
                      :checked="isSelected('comments', comment.id)" 
                      @change="toggleSelect('comments', comment.id)" 
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>
                <div class="comment-info">
                  <h4 class="clickable" @click="viewItem('comment', comment.boardNo)">{{ comment.postTitle }}</h4>
                  <p class="comment-text">{{ comment.content }}</p>
                  <div class="comment-meta">
                    <span>{{ comment.date }}</span>
                    <span>좋아요 {{ comment.likes }}개</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="pagination-container" v-if="totalPages.comments > 1">
              <div class="pagination">
                <button 
                  class="page-btn" 
                  :disabled="currentPage.comments === 1" 
                  @click="changePage('comments', currentPage.comments - 1)"
                >
                  이전
                </button>
                <button 
                  v-for="page in getPageNumbers('comments')" 
                  :key="page" 
                  class="page-btn" 
                  :class="{ active: currentPage.comments === page }" 
                  @click="changePage('comments', page)"
                >
                  {{ page }}
                </button>
                <button 
                  class="page-btn" 
                  :disabled="currentPage.comments === totalPages.comments" 
                  @click="changePage('comments', currentPage.comments + 1)"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const api = axios.create({
 baseURL: 'http://localhost:8080',
 withCredentials: true
});

// 탭 정의
const tabs = ref([
 { id: 'home', name: '홈', icon: '🏠' },
 { id: 'wishlists', name: '나의 찜', icon: '❤️' },
 { id: 'plans', name: '나의 여행 계획', icon: '✈️' },
 { id: 'reviews', name: '나의 리뷰', icon: '⭐' },
 { id: 'posts', name: '나의 게시글', icon: '📝' },
 { id: 'comments', name: '나의 댓글', icon: '💬' }
]);

// 활성 탭
const activeTab = ref('home');

// 사용자 프로필
const userProfile = ref({
 name: '',
 email: ''
});

// 통계 데이터
const stats = ref({
 totalTrips: 0,
 totalWishlists: 0,
 totalReviews: 0,
 totalPosts: 0
});

// 최근 여행 계획
const recentPlans = ref([]);

// 모든 여행 계획
const allPlans = ref([]);

// 최근 찜한 여행지
const recentWishlists = ref([]);

// 모든 찜한 여행지
const allWishlists = ref([]);

// 최근 게시글
const recentPosts = ref([]);

// 모든 게시글
const allPosts = ref([]);

// 모든 리뷰
const allReviews = ref([]);

// 모든 댓글
const allComments = ref([]);

// 이미지 배열
const images = [
 'https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg',
 'https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg',
 'https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg',
 'https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg'
];

const profileImage = ref(null);

// 페이지네이션 설정
const itemsPerPage = 10;

// 필터 및 검색 상태
const searchTerms = ref({
 wishlists: '',
 plans: '',
 reviews: '',
 posts: '',
 comments: ''
});

const filterStatus = ref('all');
const categoryFilter = ref('all');

// 현재 페이지 상태
const currentPage = ref({
 wishlists: 1,
 plans: 1,
 reviews: 1,
 posts: 1,
 comments: 1
});

// 총 페이지 수
const totalPages = ref({
 wishlists: 1,
 plans: 1,
 reviews: 1,
 posts: 1,
 comments: 1
});

// 선택된 항목 상태
const selectedItems = ref({
 wishlists: [],
 plans: [],
 reviews: [],
 posts: [],
 comments: []
});

// API 호출 함수들
const fetchProfileAndStats = async () => {
 try {
   const profileRes = await api.get('/api/member');
   const statsRes = await api.get('/api/member/stats');
   
   userProfile.value = profileRes.data;
   stats.value = {
     totalTrips: statsRes.data.planCount || 0,
     totalWishlists: statsRes.data.favoriteCount || 0,
     totalReviews: statsRes.data.reviewCount || 0,
     totalPosts: statsRes.data.boardCount || 0
   };
 } catch (error) {
   console.error('프로필 정보 조회 실패:', error);
 }
};

const fetchDashboard = async () => {
 try {
   const res = await api.get('/api/member/dashboard');
   const data = res.data;
   
   // 최근 여행 계획 데이터 매핑
   if (data.recentPlans && data.recentPlans.content) {
     recentPlans.value = data.recentPlans.content.map(plan => ({
       id: plan.planId,
       title: plan.title,
       date: `${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}`,
       participants: plan.members ? plan.members.length : 1
     }));
   }
   
   // 최근 찜한 여행지 데이터 매핑
   if (data.recentFavorites && data.recentFavorites.content) {
     recentWishlists.value = data.recentFavorites.content.map(favorite => ({
       id: favorite.favoriteNo,
       placeId: favorite.placeId, 
       title: favorite.attraction.title,
       image: favorite.attraction.firstImageUrl || 'https://placehold.co/300x200?text=No+Image'
     }));
   }
   
   // 최근 리뷰 데이터 매핑
   if (data.recentReviews && data.recentReviews.content) {
     allReviews.value = data.recentReviews.content.map(review => ({
       id: review.reviewId,
       placeId: review.placeId,
       placeName: review.placeName,
       content: review.content,
       date: formatDate(review.createDate),
       image: review.imageUrl || 'https://placehold.co/300x200?text=No+Image'
     }));
   }
   
   // 최근 게시글 데이터 매핑 (해당 API가 있는 경우)
   if (data.recentPosts && data.recentPosts.content) {
     recentPosts.value = data.recentPosts.content.map(post => ({
       id: post.boardNo,
       title: post.title,
       date: formatDate(post.writeDate),
       views: post.views,
       category: post.category
     }));
   }
   
   // 최근 댓글 데이터 매핑 (해당 API가 있는 경우)
   if (data.recentComments && data.recentComments.content) {
     allComments.value = data.recentComments.content.map(comment => ({
       id: comment.commentId,
       boardNo: comment.boardNo,
       postTitle: comment.postTitle,
       content: comment.content,
       date: formatDate(comment.writeDate),
       likes: comment.likes || 0
     }));
   }
 } catch (error) {
   console.error('대시보드 데이터 조회 실패:', error);
 }
};

// 찜 목록 조회
const fetchWishlists = async () => {
 try {
   const res = await api.get(`/api/member/favorite?page=${currentPage.value.wishlists - 1}&size=${itemsPerPage}`);
   const data = res.data;
   
   allWishlists.value = data.content.map(favorite => ({
     id: favorite.favoriteNo,
     placeId : favorite.placeId,
     title: favorite.attraction.title,
     location: favorite.attraction.address1 || '주소 정보 없음',
     image: favorite.attraction.firstImageUrl || 'https://placehold.co/300x200?text=No+Image'
   }));
   
   totalPages.value.wishlists = data.totalPages;
 } catch (error) {
   console.error('찜 목록 조회 실패:', error);
 }
};

// 여행 계획 조회
const fetchPlans = async () => {
 try {
   // 필터가 있는 경우 쿼리 파라미터 추가
   let url = `/api/plan/my?page=${currentPage.value.plans - 1}&size=${itemsPerPage}`;
   if (filterStatus.value !== 'all') {
     url += `&status=${filterStatus.value}`;
   }
   if (searchTerms.value.plans) {
     url += `&keyword=${encodeURIComponent(searchTerms.value.plans)}`;
   }
   
   const res = await api.get(url);
   const data = res.data;
   
   allPlans.value = data.content.map(plan => ({
     id: plan.planId,
     title: plan.title,
     date: `${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}`,
     participants: plan.members ? plan.members.length : 1,
     status: determineStatus(plan.startDate, plan.endDate)
   }));
   
   totalPages.value.plans = data.totalPages;
 } catch (error) {
   console.error('여행 계획 조회 실패:', error);
 }
};

// 계획 상태 결정 함수
const determineStatus = (startDate, endDate) => {
 const now = new Date();
 const start = new Date(startDate);
 const end = new Date(endDate);
 
 if (end < now) return 'completed';
 if (start > now) return 'planning';
 return 'ongoing';
};

// 리뷰 조회
const fetchReviews = async () => {
 try {
   let url = `/api/review/my?page=${currentPage.value.reviews - 1}&size=${itemsPerPage}`;
   if (searchTerms.value.reviews) {
     url += `&keyword=${encodeURIComponent(searchTerms.value.reviews)}`;
   }
   
   const res = await api.get(url);
   const data = res.data;
   
   allReviews.value = data.content.map(review => ({
     id: review.reviewId,
     placeName: review.placeName,
     content: review.content,
     date: formatDate(review.createDate),
     image: review.imageUrl || 'https://placehold.co/300x200?text=No+Image'
   }));
   
   totalPages.value.reviews = data.totalPages;
 } catch (error) {
   console.error('리뷰 조회 실패:', error);
 }
};

// 게시글 조회
const fetchPosts = async () => {
 try {
   let url = `/api/board/my?page=${currentPage.value.posts - 1}&size=${itemsPerPage}`;
   if (categoryFilter.value !== 'all') {
     url += `&category=${categoryFilter.value}`;
   }
   if (searchTerms.value.posts) {
     url += `&keyword=${encodeURIComponent(searchTerms.value.posts)}`;
   }
   
   const res = await api.get(url);
   const data = res.data;
   
   allPosts.value = data.content.map(post => ({
     id: post.boardNo,
     title: post.title,
     category: post.category,
     date: formatDate(post.writeDate),
     views: post.views,
     comments: post.commentCount || 0
   }));
   
   totalPages.value.posts = data.totalPages;
 } catch (error) {
   console.error('게시글 조회 실패:', error);
 }
};

// 댓글 조회
const fetchComments = async () => {
 try {
   let url = `/api/comment/my?page=${currentPage.value.comments - 1}&size=${itemsPerPage}`;
   if (searchTerms.value.comments) {
     url += `&keyword=${encodeURIComponent(searchTerms.value.comments)}`;
   }
   
   const res = await api.get(url);
   const data = res.data;
   
   allComments.value = data.content.map(comment => ({
     id: comment.commentId,
     postTitle: comment.postTitle,
     content: comment.content,
     date: formatDate(comment.writeDate),
     likes: comment.likes || 0
   }));
   
   totalPages.value.comments = data.totalPages;
 } catch (error) {
   console.error('댓글 조회 실패:', error);
 }
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
 if (!dateString) return '';
 const date = new Date(dateString);
 return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 상태 텍스트 변환
const getStatusText = (status) => {
 const statusMap = {
   'completed': '완료',
   'planning': '계획 중',
   'ongoing': '진행 중',
   'cancelled': '취소됨'
 };
 return statusMap[status] || status;
};

// 항목 보기
const viewItem = (type, id) => {
 console.log(`Viewing ${type} with ID ${id}`);
 switch (type) {
   case 'plan':
     router.push(`/plan/${id}`);
     break;
   case 'wishlist':
    // 찜한 여행지 상세로 (query 방식)
    router.push({ path: '/tripdetail', query: { id } });
    break;
   case 'review':
    // 리뷰가 달린 장소 상세도 tripdetail 로
    router.push({ path: '/tripdetail', query: { id } });
    break;
   case 'post':
     router.push(`/board/${id}`);
     break;
   case 'comment':
     router.push(`/board/${id}`);
     break;
   default:
     break;
 }
};

// 찜 항목 삭제
const removeWishlist = async (id) => {
 if (confirm('찜 목록에서 제거하시겠습니까?')) {
   try {
     await api.delete(`/api/member/favorite/${id}`);
     // 화면에서 제거
     allWishlists.value = allWishlists.value.filter(item => item.id !== id);
     // 통계 업데이트
     if (stats.value.totalWishlists > 0) {
       stats.value.totalWishlists--;
     }
     // 필터링된 목록도 업데이트
     if (activeTab.value === 'wishlists') {
       fetchWishlists();
     }
   } catch (error) {
     console.error('찜 삭제 실패:', error);
   }
 }
};

// 필터링된 컬렉션 계산
const filteredWishlists = computed(() => {
 if (!searchTerms.value.wishlists) return allWishlists.value;
 return allWishlists.value.filter(item => 
   item.title.toLowerCase().includes(searchTerms.value.wishlists.toLowerCase()) ||
   item.location.toLowerCase().includes(searchTerms.value.wishlists.toLowerCase())
 );
});

const filteredPlans = computed(() => {
 let result = allPlans.value;
 
 // 검색어 필터링
 if (searchTerms.value.plans) {
   result = result.filter(plan => 
     plan.title.toLowerCase().includes(searchTerms.value.plans.toLowerCase())
   );
 }
 
 // 상태 필터링
 if (filterStatus.value !== 'all') {
   result = result.filter(plan => plan.status === filterStatus.value);
 }
 
 return result;
});

const filteredReviews = computed(() => {
 if (!searchTerms.value.reviews) return allReviews.value;
 return allReviews.value.filter(review => 
   review.placeName.toLowerCase().includes(searchTerms.value.reviews.toLowerCase()) ||
   review.content.toLowerCase().includes(searchTerms.value.reviews.toLowerCase())
 );
});

const filteredPosts = computed(() => {
 let result = allPosts.value;
 
 // 검색어 필터링
 if (searchTerms.value.posts) {
   result = result.filter(post => 
     post.title.toLowerCase().includes(searchTerms.value.posts.toLowerCase())
   );
 }
 
 // 카테고리 필터링
 if (categoryFilter.value !== 'all') {
   result = result.filter(post => post.category === categoryFilter.value);
 }
 
 return result;
});

const filteredComments = computed(() => {
 if (!searchTerms.value.comments) return allComments.value;
 return allComments.value.filter(comment => 
   comment.postTitle.toLowerCase().includes(searchTerms.value.comments.toLowerCase()) ||
   comment.content.toLowerCase().includes(searchTerms.value.comments.toLowerCase())
 );
});

// 페이지네이션된 컬렉션 계산
const paginatedWishlists = computed(() => {
 return filteredWishlists.value;
});

const paginatedPlans = computed(() => {
 return filteredPlans.value;
});

const paginatedReviews = computed(() => {
 return filteredReviews.value;
});

const paginatedPosts = computed(() => {
 return filteredPosts.value;
});

const paginatedComments = computed(() => {
 return filteredComments.value;
});

// 페이지 번호 배열 생성 (최대 5개만 표시)
const getPageNumbers = (type) => {
 const total = totalPages.value[type];
 const current = currentPage.value[type];
 
 if (total <= 5) {
   return Array.from({ length: total }, (_, i) => i + 1);
 }
 
 if (current <= 3) {
   return [1, 2, 3, 4, 5];
 }
 
 if (current >= total - 2) {
   return [total - 4, total - 3, total - 2, total - 1, total];
 }
 
 return [current - 2, current - 1, current, current + 1, current + 2];
};

// 페이지 변경 메서드
const changePage = (type, page) => {
 currentPage.value[type] = page;
 
 // 각 타입에 맞는 API 호출
 switch (type) {
   case 'wishlists':
     fetchWishlists();
     break;
   case 'plans':
     fetchPlans();
     break;
   case 'reviews':
     fetchReviews();
     break;
   case 'posts':
     fetchPosts();
     break;
   case 'comments':
     fetchComments();
     break;
 }
};

// 선택 상태 확인
const isSelected = (type, id) => {
 return selectedItems.value[type].includes(id);
};

// 모두 선택되었는지 확인
const isAllSelected = (type) => {
 const items = getPaginatedItems(type);
 return items.length > 0 && items.every(item => selectedItems.value[type].includes(item.id));
};

// 현재 페이지의 항목들 가져오기 (타입에 따라)
const getPaginatedItems = (type) => {
 switch (type) {
   case 'wishlists': return paginatedWishlists.value;
   case 'plans': return paginatedPlans.value;
   case 'reviews': return paginatedReviews.value;
   case 'posts': return paginatedPosts.value;
   case 'comments': return paginatedComments.value;
   default: return [];
 }
};

// 항목 선택/해제
const toggleSelect = (type, id) => {
 const index = selectedItems.value[type].indexOf(id);
 if (index === -1) {
   selectedItems.value[type].push(id);
 } else {
   selectedItems.value[type].splice(index, 1);
 }
};

// 모든 항목 선택/해제
const toggleSelectAll = (type) => {
 const items = getPaginatedItems(type);
 
 if (isAllSelected(type)) {
   // 모두 선택되어 있으면 해제
   selectedItems.value[type] = selectedItems.value[type].filter(id => 
     !items.some(item => item.id === id)
   );
 } else {
   // 선택되지 않은 항목들 추가
   const currentIds = selectedItems.value[type];
   const newIds = items.filter(item => !currentIds.includes(item.id)).map(item => item.id);
   selectedItems.value[type] = [...currentIds, ...newIds];
 }
};

// 선택된 항목 삭제
const deleteSelected = async (type) => {
 if (selectedItems.value[type].length === 0) return;
 
 if (!confirm(`선택한 ${selectedItems.value[type].length}개의 항목을 삭제하시겠습니까?`)) {
   return;
 }
 
 // 각 타입별 삭제 API 호출
 try {
   const deletePromises = selectedItems.value[type].map(id => {
     switch (type) {
       case 'wishlists':
         return api.delete(`/api/member/favorite/${id}`);
       case 'plans':
         return api.delete(`/api/plan/${id}`);
       case 'reviews':
         return api.delete(`/api/reviews/${id}`);
       case 'posts':
         return api.delete(`/api/board/${id}`);
       case 'comments':
         return api.delete(`/api/comment/${id}`);
     }
   });
   
   await Promise.all(deletePromises);
   
   // 삭제 후 데이터 다시 조회
   switch (type) {
     case 'wishlists':
       fetchWishlists();
       if (stats.value.totalWishlists >= selectedItems.value[type].length) {
         stats.value.totalWishlists -= selectedItems.value[type].length;
       }
       break;
     case 'plans':
       fetchPlans();
       if (stats.value.totalTrips >= selectedItems.value[type].length) {
         stats.value.totalTrips -= selectedItems.value[type].length;
       }
       break;
     case 'reviews':
       fetchReviews();
       if (stats.value.totalReviews >= selectedItems.value[type].length) {
         stats.value.totalReviews -= selectedItems.value[type].length;
       }
       break;
     case 'posts':
       fetchPosts();
       if (stats.value.totalPosts >= selectedItems.value[type].length) {
         stats.value.totalPosts -= selectedItems.value[type].length;
       }
       break;
     case 'comments':
       fetchComments();
       break;
   }
   
   // 선택 목록 초기화
   selectedItems.value[type] = [];
 } catch (error) {
   console.error(`${type} 삭제 실패:`, error);
 }
};

// 검색어 변경 시 페이지 초기화
watch(searchTerms, (newTerms, oldTerms) => {
 for (const type in newTerms) {
   if (newTerms[type] !== oldTerms[type]) {
     currentPage.value[type] = 1;
     
     // 각 타입별 데이터 다시 조회
     switch (type) {
       case 'wishlists':
         fetchWishlists();
         break;
       case 'plans':
         fetchPlans();
         break;
       case 'reviews':
         fetchReviews();
         break;
       case 'posts':
         fetchPosts();
         break;
       case 'comments':
         fetchComments();
         break;
     }
   }
 }
}, { deep: true });

// 필터 변경 시 페이지 초기화
watch(filterStatus, () => {
 currentPage.value.plans = 1;
 fetchPlans();
});

watch(categoryFilter, () => {
 currentPage.value.posts = 1;
 fetchPosts();
});

// 탭 변경 시 선택 항목 초기화 및 데이터 로드
watch(activeTab, (newTab) => {
 // 선택 항목 초기화
 for (const type in selectedItems.value) {
   selectedItems.value[type] = [];
 }
 
 // 홈 탭은 대시보드 데이터 조회
 if (newTab === 'home') {
   fetchDashboard();
   return;
 }
 
 // 각 탭에 맞는 데이터 조회
 switch (newTab) {
   case 'wishlists':
     fetchWishlists();
     break;
   case 'plans':
     fetchPlans();
     break;
   case 'reviews':
     fetchReviews();
     break;
   case 'posts':
     fetchPosts();
     break;
   case 'comments':
     fetchComments();
     break;
 }
});

onMounted(() => {
 // 프로필 이미지 랜덤 선택
 if (profileImage.value) {
   profileImage.value.src = images[Math.floor(Math.random() * images.length)];
 }
 
 // 초기 데이터 로드
 fetchProfileAndStats();
 fetchDashboard();
});
</script>

<style scoped>
/* 기본 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

/* 마이페이지 컨테이너 */
.mypage-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(120deg, #e0f7fa, #e8eaf6, #ede7f6);
  position: relative;
  overflow: hidden;
  padding: 1.5rem 6rem;
}

/* 마이페이지 콘텐츠 스타일 */
.mypage-content {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
}

.mypage-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.mypage-layout {
  display: flex;
  gap: 1.5rem;
}

/* 왼쪽 사이드바 */
.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 프로필 섹션 */
.profile-section {
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f0f0f0;
  /* overflow: visible; (기본) */
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;   /* 이미지 자체만 동그랗게 자름 */
  display: block;
}
/* edit-profile-btn 는 그대로 유지 (z-index:10) */

.edit-profile-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #333;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
  z-index: 10;
}

.edit-profile-btn:hover {
  background-color: #222;
  transform: scale(1.1);
}

/* 프로필 통계 */
.profile-stats {
  width: 100%;
  margin-top: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #9581e8;
}

.stat-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 0;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.3rem;
}

.profile-email {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.8rem;
}

/* 네비게이션 메뉴 */
.navigation-menu {
  background-color: white;
  border-radius: 15px;
  padding: 0.5rem 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.nav-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  color: #666;
}

.nav-btn:hover {
  background-color: #f8f9fa;
  color: #333;
}

.nav-btn.active {
  background-color: #9581e8;
  color: white;
}

.nav-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

/* 오른쪽 콘텐츠 영역 */
.content-area {
  flex: 1;
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

/* 컨텐츠 헤더 */
.content-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.content-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.content-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  max-width: 500px;
}

.search-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 0.9rem;
  min-width: 120px;
}

.delete-btn {
  padding: 0.6rem 1.2rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-all-container {
  margin-bottom: 1rem;
}

/* 체크박스 스타일 */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 3px;
  transition: all 0.3s;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #9581e8;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 아이템 체크박스 공통 스타일 */
.item-checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
}

/* 홈 콘텐츠 스타일 */
.home-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 요약 섹션 */
.summary-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 수평 레이아웃 (최근 여행 계획 + 최근 찜한 여행지) */
.horizontal-summary-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* 수직 레이아웃 (리뷰, 게시글, 댓글) */
.vertical-summary-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.summary-header h3 {
  font-size: 1.2rem;
  color: #333;
}

.more-btn {
  background-color: #9581e8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
}

.more-btn:hover {
  background-color: #8571d8;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-item {
  background-color: white;
  padding: 0.8rem;
  border-radius: 8px;
  border-left: 4px solid #9581e8;
}

/* 홈 섹션의 아이템 높이 조정 */
.home-summary-item {
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
}

.clickable {
  cursor: pointer;
  transition: color 0.3s;
}

.clickable:hover {
  color: #9581e8;
  text-decoration: underline;
}

.item-subtitle {
  font-size: 0.9rem;
  color: #666;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.wishlist-preview {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.wishlist-preview:hover {
  transform: translateY(-3px);
}

.wishlist-preview img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.wishlist-title {
  padding: 0.5rem;
  font-size: 0.8rem;
  color: #333;
  text-align: center;
}

/* 찜 목록 스타일 */
.wishlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.wishlist-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  position: relative;
}

.wishlist-card:hover {
  transform: translateY(-3px);
}

.wishlist-image {
  position: relative;
  height: 160px;
}

.wishlist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  font-size: 1rem;
}

.wishlist-info {
  padding: 0.8rem;
}

.wishlist-info h4 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.wishlist-info p {
  font-size: 0.85rem;
  color: #666;
}

/* 여행 계획 스타일 */
.plans-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.plan-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.2rem 1.2rem 1.2rem 3rem;
  position: relative;
}

.plan-info h4 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.plan-info p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.plan-status {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.plan-status.completed {
  background-color: #d4edda;
  color: #155724;
}

.plan-status.planning {
  background-color: #d1ecf1;
  color: #0c5460;
}

/* 리뷰 스타일 */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.2rem 1.2rem 1.2rem 3rem;
  display: flex;
  gap: 1rem;
  position: relative;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.review-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-info {
  flex: 1;
}

.review-info h4 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.review-text {
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.review-date {
  font-size: 0.8rem;
  color: #999;
}

/* 게시글/댓글 스타일 */
.posts-list, .comments-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.post-card, .comment-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 1.2rem 1.2rem 1.2rem 3rem;
  position: relative;
}

.post-category {
  display: inline-block;
  background-color: #9581e8;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
}

.post-info h4, .comment-info h4 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.post-meta, .comment-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666;
}

.comment-text {
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

/* 페이지네이션 */
.pagination-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  color: #666;
}

.page-btn:hover:not(:disabled) {
  background-color: #e9ecef;
}

.page-btn.active {
  background-color: #9581e8;
  color: white;
  border-color: #9581e8;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .mypage-container {
    padding: 1.5rem;
  }
  
  .horizontal-summary-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .mypage-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    flex-direction: row;
    gap: 0.8rem;
  }
  
  .profile-section {
    flex: 1;
  }
  
  .navigation-menu {
    flex: 2;
    display: flex;
    overflow-x: auto;
    padding: 0.5rem;
  }
  
  .nav-btn {
    white-space: nowrap;
    min-width: 120px;
    justify-content: center;
  }
  
  .wishlists-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .sidebar {
    flex-direction: column;
  }
  
  .mypage-title {
    font-size: 2rem;
  }
  
  .horizontal-summary-row {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .wishlists-grid {
    grid-template-columns: 1fr;
  }
  
  .content-actions {
    flex-direction: column;
    gap: 0.8rem;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
    max-width: none;
  }
  
  .review-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .review-image {
    width: 100%;
    height: 160px;
  }
  
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>