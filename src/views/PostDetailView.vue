<template>
  <div class="travel-container">
  
    <!-- 로딩 인디케이터 -->
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>게시글을 불러오는 중입니다...</p>
    </div>

    <!-- 에러 메시지 -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchPostDetail" class="retry-btn">다시 시도</button>
      <router-link to="/board" class="back-to-list-btn">목록으로</router-link>
    </div>

    <!-- 게시글 상세 섹션 -->
    <section v-else class="post-detail-section">
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
              <span v-if="post.categoryNo === 1" class="tag notice">[공지]</span>
              <span v-else-if="post.categoryNo === 3" class="tag tip">[팁]</span>
              <span v-else-if="post.categoryNo === 4" class="tag qna">[Q&A]</span>
              <span v-else-if="post.categoryNo === 5" class="tag companion">[동행]</span>
            </div>
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-info">
              <div class="author-info">
                <div class="author-avatar" v-if="post.profileImgUrl">
                  <img :src="post.profileImgUrl" alt="작성자 아바타">
                </div>
                <div class="author-avatar" v-else>
                  {{ post.author ? post.author.charAt(0) : '?' }}
                </div>
                <div class="author-details">
                  <div class="author-name">{{ post.author }}</div>
                  <div class="post-date">{{ formatFullDate(post.writeDate) }}</div>
                </div>
              </div>
              <div class="post-stats">
                <span class="stat-item">👁️ {{ post.views }}</span>
                <span class="stat-item">❤️ {{ post.likes }}</span>
                <span class="stat-item">💬 {{ post.commentCount }}</span>
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
                <img 
                  :src="getImageUrl(image)" 
                  :alt="`첨부 이미지 ${index + 1}`"
                >
              </div>
            </div>
          </div>

          <!-- 좋아요 버튼 -->
          <div class="post-actions-bottom">
            <button 
              @click="toggleLike" 
              class="like-btn"
              :class="{ liked: isLiked }"
              :disabled="likeLoading"
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
            <div class="comment-author-avatar">
              {{ currentUser ? currentUser.charAt(0) : '?' }}
            </div>
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
                  :disabled="!newComment.trim() || commentSubmitting"
                >
                  댓글 등록
                </button>
              </div>
            </div>
          </div>

          <!-- 댓글 로딩 -->
          <div v-if="commentsLoading" class="comments-loading">
            <div class="spinner-small"></div>
            <p>댓글을 불러오는 중입니다...</p>
          </div>

          <!-- 댓글 에러 -->
          <div v-else-if="commentsError" class="comments-error">
            <p>{{ commentsError }}</p>
            <button @click="fetchComments" class="retry-btn-small">다시 시도</button>
          </div>

          <!-- 댓글 목록 -->
          <div v-else class="comments-list">
            <div 
              v-for="comment in comments" 
              :key="comment.commentId"
              class="comment-item"
            >
              <div class="comment-avatar">
                <img v-if="comment.profileImgUrl" :src="comment.profileImgUrl" alt="댓글 작성자">
                <template v-else>{{ comment.author.charAt(0) }}</template>
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-date">{{ formatRelativeTime(comment.writeDate) }}</span>
                </div>
                <div class="comment-text">{{ comment.content }}</div>
                <div class="comment-actions">
                  <button 
                    @click="toggleCommentLike(comment.commentId)" 
                    class="comment-like-btn"
                    :class="{ liked: comment.isLiked }"
                    :disabled="commentLikeLoading[comment.commentId]"
                  >
                    {{ comment.isLiked ? '❤️' : '🤍' }} {{ comment.likes }}
                  </button>
                  <button 
                    v-if="isCommentAuthor(comment) || isAdmin"
                    @click="deleteComment(comment.commentId)" 
                    class="comment-delete-btn"
                    :disabled="commentDeleteLoading[comment.commentId]"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>

            <!-- 댓글이 없을 때 -->
            <div v-if="comments.length === 0" class="no-comments">
              <p>첫 댓글을 작성해보세요!</p>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- 이미지 모달 -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="image-modal-content" @click.stop>
        <button @click="closeImageModal" class="modal-close-btn">×</button>
        <img 
          v-if="post.images && post.images.length > 0 && currentImageIndex >= 0" 
          :src="getImageUrl(post.images[currentImageIndex])" 
          :alt="`이미지 ${currentImageIndex + 1}`"
        >
        <div class="image-navigation">
          <button 
            @click="prevImage" 
            class="nav-btn"
            :disabled="currentImageIndex === 0"
          >‹</button>
          <span class="image-counter">{{ currentImageIndex + 1 }} / {{ post.images ? post.images.length : 0 }}</span>
          <button 
            @click="nextImage" 
            class="nav-btn"
            :disabled="!post.images || currentImageIndex === post.images.length - 1"
          >›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 게시글 ID
const postId = computed(() => route.params.id);

// 사용자 정보
const currentUser = ref('');
const isAdmin = ref(false);
const userId = ref(null);

// 게시글 데이터
const post = ref({
  boardNo: 0,
  title: '',
  content: '',
  author: '',
  profileImgUrl: '',
  categoryNo: 0,
  category: '',
  writeDate: null,
  updateDate: null,
  views: 0,
  likes: 0,
  commentCount: 0,
  hasImage: false,
  images: [],
  tags: []
});

// 댓글 데이터
const comments = ref([]);
const newComment = ref('');

// 좋아요 상태
const isLiked = ref(false);

// 이미지 모달 상태
const showImageModal = ref(false);
const currentImageIndex = ref(0);

// 로딩 및 에러 상태
const loading = ref(true);
const error = ref(null);
const commentsLoading = ref(true);
const commentsError = ref(null);
const commentSubmitting = ref(false);
const likeLoading = ref(false);
const commentLikeLoading = ref({});
const commentDeleteLoading = ref({});

// 계산된 속성
const isAuthor = computed(() => {
  return userId.value === post.value.userId;
});

// 사용자 정보 조회
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/member`, {
      withCredentials: true
    });
    
    userId.value = response.data.userId;
    currentUser.value = response.data.nickname || response.data.name;
    isAdmin.value = response.data.role === 'ADMIN';
    
  } catch (err) {
    console.error('사용자 정보 조회 실패:', err);
    userId.value = null;
    currentUser.value = '';
    isAdmin.value = false;
  }
};

// 게시글 상세 조회
const fetchPostDetail = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    console.log("Fetching post details for ID:", postId.value);
    const response = await axios.get(`${API_BASE_URL}/api/board/${postId.value}`, {
      withCredentials: true
    });
    
    console.log("Post detail response:", response.data);
    post.value = response.data;
    
    // 이미지 정보 확인
    if (post.value.images && post.value.images.length > 0) {
      console.log("Post has images:", post.value.images);
      
      // 이미지 경로가 없는 경우 추가 API 호출로 이미지 정보 가져오기
      if (!post.value.images[0].imagePath && post.value.boardNo) {
        try {
          const imagesResponse = await axios.get(`${API_BASE_URL}/api/board/${post.value.boardNo}/images`, {
            withCredentials: true
          });
          console.log("Additional images fetched:", imagesResponse.data);
          if (Array.isArray(imagesResponse.data) && imagesResponse.data.length > 0) {
            post.value.images = imagesResponse.data;
          }
        } catch (imgErr) {
          console.error("Failed to fetch additional image data:", imgErr);
        }
      }
    }
    
    // 좋아요 상태 확인
    await checkLikeStatus();
    
  } catch (err) {
    console.error('게시글 조회 실패:', err);
    
    if (err.response && err.response.status === 404) {
      error.value = '존재하지 않는 게시글입니다.';
    } else {
      error.value = '게시글을 불러오는데 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
};

// 좋아요 상태 확인
const checkLikeStatus = async () => {
  if (!userId.value) return;
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/board/liked`, {
      params: {
        page: 0,
        size: 100
      },
      withCredentials: true
    });
    
    const likedPosts = response.data.content;
    isLiked.value = likedPosts.some(item => item.boardNo === parseInt(postId.value));
    
  } catch (err) {
    console.error('좋아요 상태 확인 실패:', err);
    isLiked.value = false;
  }
};

// 좋아요 토글
const toggleLike = async () => {
  if (!userId.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }
  
  if (likeLoading.value) return;
  likeLoading.value = true;
  
  try {
    await axios.post(`${API_BASE_URL}/api/board/${postId.value}/like`, {}, {
      withCredentials: true
    });
    
    // 좋아요 상태 반전
    isLiked.value = !isLiked.value;
    
    // 좋아요 수 업데이트
    if (isLiked.value) {
      post.value.likes++;
    } else {
      post.value.likes = Math.max(0, post.value.likes - 1);
    }
    
  } catch (err) {
    console.error('좋아요 처리 실패:', err);
    alert('좋아요 처리 중 오류가 발생했습니다.');
  } finally {
    likeLoading.value = false;
  }
};

// 댓글 목록 조회
const fetchComments = async () => {
  commentsLoading.value = true;
  commentsError.value = null;
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/comment/${postId.value}/comments`, {
      params: {
        page: 0,
        size: 100,
        sort: 'writeDate',
        direction: 'asc'
      },
      withCredentials: true
    });
    
    comments.value = response.data.content;
    
  } catch (err) {
    console.error('댓글 조회 실패:', err);
    commentsError.value = '댓글을 불러오는데 실패했습니다.';
    comments.value = [];
  } finally {
    commentsLoading.value = false;
  }
};

// 댓글 작성
const addComment = async () => {
  if (!userId.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }
  
  if (!newComment.value.trim() || commentSubmitting.value) return;
  
  commentSubmitting.value = true;
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/comment/${postId.value}/comments`, {
      content: newComment.value.trim()
    }, {
      withCredentials: true
    });
    
    // 새 댓글 추가
    comments.value.push(response.data);
    
    // 게시글의 댓글 수 증가
    post.value.commentCount++;
    
    // 입력 필드 초기화
    newComment.value = '';
    
  } catch (err) {
    console.error('댓글 작성 실패:', err);
    alert('댓글 작성 중 오류가 발생했습니다.');
  } finally {
    commentSubmitting.value = false;
  }
};

// 댓글 좋아요 토글
const toggleCommentLike = async (commentId) => {
  if (!userId.value) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }
  
  if (commentLikeLoading.value[commentId]) return;
  
  // 로딩 상태 설정
  commentLikeLoading.value = {
    ...commentLikeLoading.value,
    [commentId]: true
  };
  
  try {
    await axios.post(`${API_BASE_URL}/api/comment/${commentId}/like`, {}, {
      withCredentials: true
    });
    
    // 좋아요 상태 및 카운트 업데이트
    const commentIndex = comments.value.findIndex(c => c.commentId === commentId);
    if (commentIndex > -1) {
      const comment = comments.value[commentIndex];
      comment.isLiked = !comment.isLiked;
      
      if (comment.isLiked) {
        comment.likes++;
      } else {
        comment.likes = Math.max(0, comment.likes - 1);
      }
    }
    
  } catch (err) {
    console.error('댓글 좋아요 처리 실패:', err);
    alert('댓글 좋아요 처리 중 오류가 발생했습니다.');
  } finally {
    commentLikeLoading.value = {
      ...commentLikeLoading.value,
      [commentId]: false
    };
  }
};

// 댓글 삭제
const deleteComment = async (commentId) => {
  if (!userId.value) {
    alert('로그인이 필요합니다.');
    return;
  }
  
  if (!confirm('댓글을 삭제하시겠습니까?')) return;
  
  if (commentDeleteLoading.value[commentId]) return;
  
  // 로딩 상태 설정
  commentDeleteLoading.value = {
    ...commentDeleteLoading.value,
    [commentId]: true
  };
  
  try {
    await axios.delete(`${API_BASE_URL}/api/comment/${commentId}`, {
      withCredentials: true
    });
    
    // 댓글 목록에서 제거
    const commentIndex = comments.value.findIndex(c => c.commentId === commentId);
    if (commentIndex > -1) {
      comments.value.splice(commentIndex, 1);
      
      // 게시글의 댓글 수 감소
      post.value.commentCount = Math.max(0, post.value.commentCount - 1);
    }
    
  } catch (err) {
    console.error('댓글 삭제 실패:', err);
    
    if (err.response && err.response.status === 403) {
      alert('댓글 삭제 권한이 없습니다.');
    } else {
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  } finally {
    commentDeleteLoading.value = {
      ...commentDeleteLoading.value,
      [commentId]: false
    };
  }
};

// 댓글 작성자 확인
const isCommentAuthor = (comment) => {
  return comment.userId === userId.value;
};

// 게시글 수정 페이지로 이동
const editPost = () => {
  router.push(`/board/${postId.value}/edit`);
};

// 게시글 삭제
const deletePost = async () => {
  if (!confirm('게시글을 삭제하시겠습니까?')) return;
  
  try {
    await axios.delete(`${API_BASE_URL}/api/board/${postId.value}`, {
      withCredentials: true
    });
    
    alert('게시글이 삭제되었습니다.');
    router.push('/board');
    
  } catch (err) {
    console.error('게시글 삭제 실패:', err);
    
    if (err.response && err.response.status === 403) {
      alert('게시글 삭제 권한이 없습니다.');
    } else {
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  }
};

// 이미지 모달 관련 메서드
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
  if (post.value.images && currentImageIndex.value < post.value.images.length - 1) {
    currentImageIndex.value++;
  }
};

// 날짜 포맷팅
const formatFullDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
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

// 이미지 URL 가져오기
const getImageUrl = (image) => {
  if (!image) return '';
  
  // 이미지 경로 확인 및 로깅
  console.log("Image data:", image);
  
  // 이미지 경로가 이미 전체 URL인 경우
  if (image.imagePath && (image.imagePath.startsWith('http://') || image.imagePath.startsWith('https://'))) {
    return image.imagePath;
  }
  
  // 백엔드가 제공하는 이미지 경로 구조에 따라 URL 생성
  if (image.imagePath) {
    // uploads/ 접두사가 있는지 확인
    if (image.imagePath.startsWith('uploads/')) {
      return `${API_BASE_URL}/${image.imagePath}`;
    } else {
      return `${API_BASE_URL}/uploads/${image.imagePath}`;
    }
  }
  
  // storedFileName이 있는 경우 (대체 경로)
  if (image.storedFileName) {
    return `${API_BASE_URL}/uploads/board/${image.storedFileName}`;
  }
  
  // 직접 URL 속성이 있는 경우 (클라이언트에서 추가한 임시 미리보기 등)
  if (image.url) {
    return image.url;
  }
  
  // 기본 이미지 또는 에러 이미지
  return `${API_BASE_URL}/uploads/default-image.png`;
};

onMounted(async() =>{
  // 사용자 정보 조회
  await fetchUserInfo();
  
  // 게시글 상세 정보 조회
  await fetchPostDetail();
  
  // 댓글 목록 조회
  await fetchComments();
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

  min-height: 100vh;
  background-image: url('https://i.pinimg.com/736x/91/72/b7/9172b7886a49d6649cb05dea79f55f53.jpg');
  background-repeat: repeat;
  background-size: auto;
  background-attachment: fixed;


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