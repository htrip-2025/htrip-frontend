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
        <a href="/board" class="menu-link active">커뮤니티</a>
        <a href="#" class="menu-link search-icon">🔍</a>
      </div>
      <div class="login-section">
        <a href="/login" class="login-button">
          <span class="button-text">로그인</span>
        </a>
      </div>
    </header>

    <!-- 게시글 상세 섹션 -->
    <section class="post-detail-section">
      <div class="post-container">
        <!-- 게시글 헤더 -->
        <div class="post-header">
          <div class="post-navigation">
            <router-link to="/board" class="back-btn">← 목록으로</router-link>
          </div>
          <div class="post-actions">
            <button v-if="isAuthor" @click="editPost" class="edit-btn">수정</button>
            <button v-if="isAuthor || isAdmin" @click="deletePost" class="delete-btn">삭제</button>
          </div>
        </div>

        <!-- 게시글 내용 -->
        <article class="post-content">
          <!-- 제목 및 메타 정보 -->
          <div class="post-meta">
            <div class="post-category">
              <span v-if="post.category === 'tips'" class="tag tip">[팁]</span>
              <span v-else-if="post.category === 'qna'" class="tag qna">[Q&A]</span>
              <span v-else-if="post.category === 'companion'" class="tag companion">[동행]</span>
              <span v-else-if="post.category === 'notice'" class="tag notice">[공지]</span>
            </div>
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-info">
              <div class="author-info">
                <div class="author-avatar">{{ post.author.charAt(0) }}</div>
                <div class="author-details">
                  <div class="author-name">{{ post.author }}</div>
                  <div class="post-date">{{ formatFullDate(post.createdAt) }}</div>
                </div>
              </div>
              <div class="post-stats">
                <span class="stat-item">👁️ {{ post.views.toLocaleString() }}</span>
                <span class="stat-item">❤️ {{ post.likes }}</span>
                <span class="stat-item">💬 {{ comments.length }}</span>
              </div>
            </div>
          </div>

          <!-- 태그 -->
          <div v-if="post.tags && post.tags.length > 0" class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">#{{ tag }}</span>
          </div>

          <!-- 본문 내용 -->
          <div class="post-body">
            <div class="post-text">{{ post.content }}</div>
            
            <!-- 첨부 이미지 -->
            <div v-if="post.images && post.images.length > 0" class="post-images">
              <div 
                v-for="(image, index) in post.images" 
                :key="index"
                class="post-image-item"
                @click="openImageModal(index)"
              >
                <img :src="image.url" :alt="`첨부 이미지 ${index + 1}`">
              </div>
            </div>
          </div>

          <!-- 좋아요 버튼 -->
          <div class="post-actions-bottom">
            <button 
              @click="toggleLike" 
              class="like-btn"
              :class="{ liked: isLiked }"
            >
              <span class="like-icon">{{ isLiked ? '❤️' : '🤍' }}</span>
              좋아요 {{ post.likes }}
            </button>
          </div>
        </article>

        <!-- 댓글 섹션 -->
        <section class="comments-section">
          <div class="comments-header">
            <h3>댓글 {{ comments.length }}개</h3>
          </div>

          <!-- 댓글 작성 -->
          <div class="comment-write">
            <div class="comment-author-avatar">{{ currentUser.charAt(0) }}</div>
            <div class="comment-input-container">
              <textarea 
                v-model="newComment"
                placeholder="댓글을 작성해주세요..."
                class="comment-textarea"
                rows="3"
                maxlength="1000"
              ></textarea>
              <div class="comment-actions">
                <div class="comment-char-count">{{ newComment.length }}/1000</div>
                <button 
                  @click="addComment" 
                  class="comment-submit-btn"
                  :disabled="!newComment.trim()"
                >
                  댓글 등록
                </button>
              </div>
            </div>
          </div>

          <!-- 댓글 목록 -->
          <div class="comments-list">
            <div 
              v-for="comment in comments" 
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-avatar">{{ comment.author.charAt(0) }}</div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-date">{{ formatRelativeTime(comment.createdAt) }}</span>
                </div>
                <div class="comment-text">{{ comment.content }}</div>
                <div class="comment-actions">
                  <button 
                    @click="toggleCommentLike(comment.id)" 
                    class="comment-like-btn"
                    :class="{ liked: comment.isLiked }"
                  >
                    {{ comment.isLiked ? '❤️' : '🤍' }} {{ comment.likes }}
                  </button>
                  <button 
                    v-if="comment.author === currentUser || isAdmin"
                    @click="deleteComment(comment.id)" 
                    class="comment-delete-btn"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- 이미지 모달 -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="image-modal-content" @click.stop>
        <button @click="closeImageModal" class="modal-close-btn">×</button>
        <img :src="post.images[currentImageIndex].url" :alt="`이미지 ${currentImageIndex + 1}`">
        <div class="image-navigation">
          <button 
            @click="prevImage" 
            class="nav-btn"
            :disabled="currentImageIndex === 0"
          >‹</button>
          <span class="image-counter">{{ currentImageIndex + 1 }} / {{ post.images.length }}</span>
          <button 
            @click="nextImage" 
            class="nav-btn"
            :disabled="currentImageIndex === post.images.length - 1"
          >›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 사용자 정보 (실제로는 로그인 상태에서 가져와야 함)
const currentUser = ref('현재사용자');
const isAdmin = ref(false);

// 게시글 데이터 (실제로는 API에서 가져와야 함)
const post = ref({
  id: 1024,
  title: '제주도 여행시 꼭 방문해야 할 맛집 추천합니다!',
  author: '제주사랑',
  category: 'tips',
  content: `안녕하세요! 제주도 3박 4일 여행을 다녀온 제주사랑입니다.

이번 여행에서 발견한 정말 맛있었던 맛집들을 여러분께 소개해드리고 싶어요!

🍽️ 첫 번째 맛집: 성산일출봉 근처 '해녀의 집'
- 위치: 성산일출봉에서 도보 5분 거리
- 추천메뉴: 성게미역국, 전복죽
- 가격대: 1만원~2만원
- 특징: 해녀분들이 직접 따온 신선한 해산물 사용

🍜 두 번째 맛집: 제주시 '올레국수'
- 위치: 제주시 중앙로
- 추천메뉴: 고기국수, 김치국수
- 가격대: 6천원~8천원
- 특징: 진짜 제주 스타일 국수, 현지인들도 많이 찾는 곳

🥩 세 번째 맛집: 서귀포 '제주흑돼지 전문점'
- 위치: 서귀포시 중문
- 추천메뉴: 흑돼지 구이, 된장찌개
- 가격대: 2만원~3만원 (2인 기준)
- 특징: 정말 부드럽고 맛있는 제주 흑돼지

모든 맛집이 정말 만족스러웠어요! 제주도 가시는 분들께 강력 추천드립니다 😊`,
  createdAt: '2025-05-06',
  views: 1245,
  likes: 87,
  tags: ['제주도', '맛집', '여행', '음식', '추천'],
  images: [
    { url: 'https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg', alt: '해녀의 집 성게미역국' },
    { url: 'https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg', alt: '올레국수 고기국수' },
    { url: 'https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg', alt: '제주흑돼지 구이' }
  ]
});

// 댓글 데이터
const comments = ref([
  {
    id: 1,
    author: '여행러버',
    content: '와 정말 유용한 정보네요! 다음 주에 제주도 가는데 꼭 가보겠습니다. 감사해요!',
    createdAt: '2025-05-06T14:30:00',
    likes: 5,
    isLiked: false
  },
  {
    id: 2,
    author: '맛집탐험가',
    content: '해녀의 집 정말 맛있죠! 저도 작년에 가봤는데 성게미역국이 정말 진짜 맛있었어요. 추천 감사합니다 ㅎㅎ',
    createdAt: '2025-05-06T15:45:00',
    likes: 3,
    isLiked: true
  },
  {
    id: 3,
    author: '제주도민',
    content: '올레국수는 저희 동네 맛집인데 외지분들께도 소개해주셔서 감사해요! 김치국수도 정말 맛있습니다.',
    createdAt: '2025-05-06T16:20:00',
    likes: 8,
    isLiked: false
  }
]);

// 상태 관리
const newComment = ref('');
const isLiked = ref(false);
const showImageModal = ref(false);
const currentImageIndex = ref(0);

// 계산된 속성
const isAuthor = computed(() => post.value.author === currentUser.value);

// 메서드
const toggleLike = () => {
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    post.value.likes++;
  } else {
    post.value.likes--;
  }
};

const addComment = () => {
  if (!newComment.value.trim()) return;
  
  const comment = {
    id: Date.now(),
    author: currentUser.value,
    content: newComment.value.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
    isLiked: false
  };
  
  comments.value.push(comment);
  newComment.value = '';
};

const toggleCommentLike = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId);
  if (comment) {
    comment.isLiked = !comment.isLiked;
    if (comment.isLiked) {
      comment.likes++;
    } else {
      comment.likes--;
    }
  }
};

const deleteComment = (commentId) => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    const index = comments.value.findIndex(c => c.id === commentId);
    if (index > -1) {
      comments.value.splice(index, 1);
    }
  }
};

const editPost = () => {
  // 실제로는 수정 페이지로 이동
  router.push(`/board/edit/${post.value.id}`);
};

const deletePost = () => {
  if (confirm('게시글을 삭제하시겠습니까?')) {
    // 실제로는 API 호출 후 목록으로 이동
    alert('게시글이 삭제되었습니다.');
    router.push('/board');
  }
};

const openImageModal = (index) => {
  currentImageIndex.value = index;
  showImageModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeImageModal = () => {
  showImageModal.value = false;
  document.body.style.overflow = 'auto';
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const nextImage = () => {
  if (currentImageIndex.value < post.value.images.length - 1) {
    currentImageIndex.value++;
  }
};

const formatFullDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  
  return formatFullDate(dateString);
};

onMounted(() => {
  // 실제로는 라우트 파라미터로 게시글 ID를 받아서 API 호출
  const postId = route.params.id;
  console.log('게시글 ID:', postId);
  
  // 조회수 증가 (실제로는 API 호출)
  post.value.views++;
});
</script>

<style scoped>
/* 기본 스타일은 게시판과 동일하게 유지 */
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

/* 그라데이션 원형 스타일 (동일) */
.gradient-circle {
  position: absolute;
  border-radius: 65% 35% 60% 40% / 60% 40% 60% 40%;
  z-index: 0;
  transform: skew(-5deg, -10deg);
}

.circle1 { top: -10%; left: -5%; width: 45vw; height: 35vw; background: radial-gradient(ellipse, rgba(213, 224, 251, 0.9) 0%, rgba(213, 224, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-15deg); }
.circle2 { bottom: -15%; right: -10%; width: 50vw; height: 38vw; background: radial-gradient(ellipse, rgba(213, 237, 251, 0.9) 0%, rgba(213, 237, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(10deg); }
.circle3 { top: 20%; right: 10%; width: 35vw; height: 25vw; background: radial-gradient(ellipse, rgba(213, 222, 251, 0.85) 0%, rgba(213, 222, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-8deg); }
.circle4 { bottom: 30%; left: 5%; width: 28vw; height: 22vw; background: radial-gradient(ellipse, rgba(213, 232, 251, 0.9) 0%, rgba(213, 232, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(12deg); }
.circle5 { top: 45%; left: 30%; width: 40vw; height: 28vw; background: radial-gradient(ellipse, rgba(213, 224, 251, 0.85) 0%, rgba(213, 224, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-5deg); }
.circle6 { bottom: 50%; right: 30%; width: 45vw; height: 32vw; background: radial-gradient(ellipse, rgba(213, 237, 251, 0.8) 0%, rgba(213, 237, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(15deg); }
.circle7 { bottom: 10%; left: 40%; width: 42vw; height: 30vw; background: radial-gradient(ellipse, rgba(213, 232, 251, 0.85) 0%, rgba(213, 232, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-12deg); }

/* 헤더 스타일 (동일) */
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

/* 게시글 상세 섹션 */
.post-detail-section {
  position: relative;
  z-index: 1;
  margin-top: 1rem;
}

.post-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

/* 게시글 헤더 */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
}

.back-btn {
  color: #9581e8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.back-btn:hover {
  color: #8571d8;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.edit-btn {
  background-color: #f0f0f0;
  color: #666;
}

.edit-btn:hover {
  background-color: #e0e0e0;
}

.delete-btn {
  background-color: #ffe0e0;
  color: #d63384;
}

.delete-btn:hover {
  background-color: #ffcccc;
}

/* 게시글 내용 */
.post-content {
  padding: 2rem;
}

.post-meta {
  margin-bottom: 2rem;
}

.post-category {
  margin-bottom: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.tag.notice { background-color: #e0f0ff; color: #0080ff; }
.tag.tip { background-color: #e0ffea; color: #00a04d; }
.tag.qna { background-color: #ffede0; color: #ff8c00; }
.tag.companion { background-color: #f0e0ff; color: #8c00ff; }

.post-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #9581e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.author-name {
  font-weight: 600;
  color: #333;
}

.post-date {
  font-size: 0.9rem;
  color: #666;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  font-size: 0.9rem;
  color: #666;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.post-tag {
  background-color: #f0f4ff;
  color: #9581e8;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.post-body {
  margin: 2rem 0;
}

.post-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap;
  margin-bottom: 2rem;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.post-image-item {
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
}

.post-image-item:hover {
  transform: scale(1.02);
}

.post-image-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.post-actions-bottom {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  border-top: 1px solid #f0f0f0;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  border: 2px solid #ddd;
  border-radius: 25px;
  background-color: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.like-btn:hover {
  border-color: #9581e8;
  color: #9581e8;
  transform: translateY(-2px);
}

.like-btn.liked {
  border-color: #ff6b6b;
  color: #ff6b6b;
  background-color: #fff5f5;
}

.like-icon {
  font-size: 1.2rem;
}

/* 댓글 섹션 */
.comments-section {
  padding: 2rem;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

.comments-header h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.comment-write {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment-author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #9581e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.comment-input-container {
  flex: 1;
}

.comment-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.comment-textarea:focus {
  outline: none;
  border-color: #9581e8;
  box-shadow: 0 0 0 2px rgba(149, 129, 232, 0.1);
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-char-count {
  font-size: 0.8rem;
  color: #666;
}

.comment-submit-btn {
  padding: 0.6rem 1.2rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.comment-submit-btn:hover:not(:disabled) {
  background-color: #8571d8;
  transform: translateY(-1px);
}

.comment-submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #9581e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: #333;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
}

.comment-text {
  color: #333;
  line-height: 1.6;
  margin-bottom: 0.8rem;
  white-space: pre-wrap;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.comment-like-btn, .comment-delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  color: #666;
  transition: color 0.3s;
}

.comment-like-btn:hover {
  color: #ff6b6b;
}

.comment-like-btn.liked {
  color: #ff6b6b;
}

.comment-delete-btn:hover {
  color: #d63384;
}

/* 이미지 모달 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10001;
}

.image-modal-content img {
  max-width: 100%;
  max-height: calc(100% - 60px);
  object-fit: contain;
  border-radius: 10px;
}

.image-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  color: white;
}

.nav-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.nav-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.3);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.image-counter {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .travel-container {
    padding: 2rem 2rem;
  }
  
  .post-content {
    padding: 1.5rem;
  }
  
  .comments-section {
    padding: 1.5rem;
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
  
  .post-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .post-info {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .post-stats {
    width: 100%;
    justify-content: space-around;
  }
  
  .post-images {
    grid-template-columns: 1fr;
  }
  
  .comment-write, .comment-item {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
}
</style>