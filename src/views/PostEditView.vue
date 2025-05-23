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

    <!-- 글 수정 섹션 -->
    <section class="edit-section">
      <div class="edit-container">
        <div class="edit-header">
          <h2>글 수정하기</h2>
          <div class="edit-actions">
            <router-link :to="`/board/${postId}`" class="cancel-btn">취소</router-link>
            <button @click="updatePost" class="save-btn" :disabled="!isFormValid">수정 완료</button>
          </div>
        </div>

        <form @submit.prevent="updatePost" class="edit-form">
          <!-- 카테고리 선택 -->
          <div class="form-group">
            <label for="category">카테고리</label>
            <select v-model="post.category" id="category" class="form-select" required>
              <option value="">카테고리를 선택하세요</option>
              <option value="free">자유게시판</option>
              <option value="tips">여행 팁</option>
              <option value="qna">질문/답변</option>
              <option value="companion">동행 구하기</option>
            </select>
          </div>

          <!-- 제목 -->
          <div class="form-group">
            <label for="title">제목</label>
            <input 
              type="text" 
              v-model="post.title" 
              id="title" 
              class="form-input" 
              placeholder="제목을 입력하세요"
              maxlength="100"
              required
            >
            <div class="char-count">{{ post.title.length }}/100</div>
          </div>

          <!-- 내용 -->
          <div class="form-group">
            <label for="content">내용</label>
            <textarea 
              v-model="post.content" 
              id="content" 
              class="form-textarea" 
              placeholder="내용을 입력하세요"
              rows="15"
              maxlength="5000"
              required
            ></textarea>
            <div class="char-count">{{ post.content.length }}/5000</div>
          </div>

          <!-- 기존 이미지 -->
          <div v-if="existingImages.length > 0" class="form-group">
            <label>기존 이미지</label>
            <div class="existing-images-container">
              <div 
                v-for="(image, index) in existingImages" 
                :key="image.id"
                class="existing-image-item"
              >
                <img :src="image.url" :alt="`기존 이미지 ${index + 1}`">
                <button @click="removeExistingImage(index)" class="remove-image-btn">×</button>
                <div class="image-info">
                  <span class="image-name">{{ image.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 새 이미지 업로드 -->
          <div class="form-group">
            <label>새 이미지 추가</label>
            <div class="image-upload-area">
              <input 
                type="file" 
                ref="fileInput"
                @change="handleFileUpload" 
                multiple 
                accept="image/*"
                class="file-input"
                id="image-upload"
              >
              <label for="image-upload" class="file-upload-btn">
                <span class="upload-icon">📷</span>
                이미지 선택 (최대 5장)
              </label>
              <div class="upload-info">
                JPG, PNG, GIF 파일만 업로드 가능 (각 파일 최대 10MB)
              </div>
            </div>

            <!-- 새로 업로드된 이미지 미리보기 -->
            <div v-if="newImages.length > 0" class="image-preview-container">
              <div 
                v-for="(image, index) in newImages" 
                :key="index"
                class="image-preview-item"
              >
                <img :src="image.url" :alt="`새 이미지 ${index + 1}`">
                <button @click="removeNewImage(index)" class="remove-image-btn">×</button>
                <div class="image-info">
                  <span class="image-name">{{ image.name }}</span>
                  <span class="image-size">{{ formatFileSize(image.size) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 태그 -->
          <div class="form-group">
            <label for="tags">태그</label>
            <div class="tag-input-container">
              <input 
                type="text" 
                v-model="tagInput"
                @keyup.enter="addTag"
                @keyup.space="addTag"
                class="tag-input" 
                placeholder="태그를 입력하고 엔터나 스페이스를 눌러주세요"
                maxlength="20"
              >
              <button type="button" @click="addTag" class="tag-add-btn">추가</button>
            </div>
            <div class="tag-list">
              <span 
                v-for="(tag, index) in post.tags" 
                :key="index"
                class="tag-item"
              >
                #{{ tag }}
                <button @click="removeTag(index)" class="tag-remove-btn">×</button>
              </span>
            </div>
            <div class="tag-help">최대 10개까지 추가 가능합니다.</div>
          </div>

          <!-- 공지사항 설정 (관리자 권한이 있는 경우만) -->
          <div v-if="isAdmin" class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="post.isNotice" class="form-checkbox">
              공지사항으로 등록
            </label>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 게시글 ID
const postId = route.params.id;

// 사용자 권한
const isAdmin = ref(false);

// 게시글 데이터
const post = ref({
  category: '',
  title: '',
  content: '',
  tags: [],
  isNotice: false
});

// 이미지 관련
const existingImages = ref([]);
const newImages = ref([]);
const fileInput = ref(null);

// 태그 입력
const tagInput = ref('');

// 폼 유효성 검사
const isFormValid = computed(() => {
  return post.value.category && 
         post.value.title.trim() && 
         post.value.content.trim();
});

// 총 이미지 개수 체크
const totalImageCount = computed(() => {
  return existingImages.value.length + newImages.value.length;
});

// 메서드
const loadPostData = async () => {
  try {
    // 실제로는 API에서 게시글 데이터 가져오기
    // const response = await fetch(`/api/posts/${postId}`);
    // const data = await response.json();
    
    // 더미 데이터로 시뮬레이션
    const dummyPost = {
      id: postId,
      category: 'tips',
      title: '제주도 여행시 꼭 방문해야 할 맛집 추천합니다!',
      content: `안녕하세요! 제주도 3박 4일 여행을 다녀온 제주사랑입니다.

이번 여행에서 발견한 정말 맛있었던 맛집들을 여러분께 소개해드리고 싶어요!

🍽️ 첫 번째 맛집: 성산일출봉 근처 '해녀의 집'
- 위치: 성산일출봉에서 도보 5분 거리
- 추천메뉴: 성게미역국, 전복죽
- 가격대: 1만원~2만원
- 특징: 해녀분들이 직접 따온 신선한 해산물 사용`,
      tags: ['제주도', '맛집', '여행', '음식', '추천'],
      isNotice: false,
      images: [
        { id: 1, url: 'https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg', name: '해녀의집.jpg' },
        { id: 2, url: 'https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg', name: '올레국수.jpg' }
      ]
    };
    
    post.value = {
      category: dummyPost.category,
      title: dummyPost.title,
      content: dummyPost.content,
      tags: [...dummyPost.tags],
      isNotice: dummyPost.isNotice
    };
    
    existingImages.value = [...dummyPost.images];
    
  } catch (error) {
    console.error('게시글 로딩 실패:', error);
    alert('게시글을 불러오는 중 오류가 발생했습니다.');
    router.push('/board');
  }
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  
  if (totalImageCount.value + files.length > 5) {
    alert('이미지는 최대 5장까지 업로드할 수 있습니다.');
    return;
  }
  
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name} 파일이 너무 큽니다. (최대 10MB)`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      newImages.value.push({
        file: file,
        url: e.target.result,
        name: file.name,
        size: file.size
      });
    };
    reader.readAsDataURL(file);
  });
  
  event.target.value = '';
};

const removeExistingImage = (index) => {
  if (confirm('기존 이미지를 삭제하시겠습니까?')) {
    existingImages.value.splice(index, 1);
  }
};

const removeNewImage = (index) => {
  newImages.value.splice(index, 1);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const addTag = () => {
  const tag = tagInput.value.trim().replace(/^#/, '');
  
  if (!tag) return;
  
  if (post.value.tags.length >= 10) {
    alert('태그는 최대 10개까지 추가할 수 있습니다.');
    return;
  }
  
  if (post.value.tags.includes(tag)) {
    alert('이미 추가된 태그입니다.');
    return;
  }
  
  post.value.tags.push(tag);
  tagInput.value = '';
};

const removeTag = (index) => {
  post.value.tags.splice(index, 1);
};

const updatePost = async () => {
  if (!isFormValid.value) {
    alert('필수 항목을 모두 입력해주세요.');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('category', post.value.category);
    formData.append('title', post.value.title);
    formData.append('content', post.value.content);
    formData.append('tags', JSON.stringify(post.value.tags));
    formData.append('isNotice', post.value.isNotice);
    
    // 기존 이미지 ID들 (삭제되지 않은 것들)
    formData.append('existingImageIds', JSON.stringify(existingImages.value.map(img => img.id)));
    
    // 새로운 이미지 파일들
    newImages.value.forEach((image, index) => {
      formData.append(`newImages[${index}]`, image.file);
    });
    
    // API 호출 시뮬레이션
    console.log('게시글 수정:', {
      ...post.value,
      existingImages: existingImages.value.map(img => img.name),
      newImages: newImages.value.map(img => img.name),
      updatedAt: new Date().toISOString().split('T')[0]
    });
    
    alert('게시글이 성공적으로 수정되었습니다.');
    router.push(`/board/${postId}`);
    
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    alert('게시글 수정 중 오류가 발생했습니다.');
  }
};

onMounted(() => {
  loadPostData();
});
</script>

<style scoped>
/* PostWriteView.vue와 동일한 스타일 사용 */
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

.circle1 { top: -10%; left: -5%; width: 45vw; height: 35vw; background: radial-gradient(ellipse, rgba(213, 224, 251, 0.9) 0%, rgba(213, 224, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-15deg); }
.circle2 { bottom: -15%; right: -10%; width: 50vw; height: 38vw; background: radial-gradient(ellipse, rgba(213, 237, 251, 0.9) 0%, rgba(213, 237, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(10deg); }
.circle3 { top: 20%; right: 10%; width: 35vw; height: 25vw; background: radial-gradient(ellipse, rgba(213, 222, 251, 0.85) 0%, rgba(213, 222, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-8deg); }
.circle4 { bottom: 30%; left: 5%; width: 28vw; height: 22vw; background: radial-gradient(ellipse, rgba(213, 232, 251, 0.9) 0%, rgba(213, 232, 251, 0.5) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(12deg); }
.circle5 { top: 45%; left: 30%; width: 40vw; height: 28vw; background: radial-gradient(ellipse, rgba(213, 224, 251, 0.85) 0%, rgba(213, 224, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-5deg); }
.circle6 { bottom: 50%; right: 30%; width: 45vw; height: 32vw; background: radial-gradient(ellipse, rgba(213, 237, 251, 0.8) 0%, rgba(213, 237, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(15deg); }
.circle7 { bottom: 10%; left: 40%; width: 42vw; height: 30vw; background: radial-gradient(ellipse, rgba(213, 232, 251, 0.85) 0%, rgba(213, 232, 251, 0.4) 40%, rgba(255, 255, 255, 0) 70%); transform: rotate(-12deg); }

/* 수정 섹션 */
.edit-section {
  position: relative;
  z-index: 1;
  margin-top: 1rem;
}

.edit-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.edit-header h2 {
  font-size: 1.8rem;
  color: #333;
}

.edit-actions {
  display: flex;
  gap: 1rem;
}

.cancel-btn, .save-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.save-btn {
  background-color: #9581e8;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background-color: #8571d8;
  transform: translateY(-2px);
}

.save-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 기존 이미지 컨테이너 */
.existing-images-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.existing-image-item {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.existing-image-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

/* 나머지 폼 스타일들은 PostWriteView.vue와 동일 */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-select, .form-input, .form-textarea {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.3s;
}

.form-select:focus, .form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #9581e8;
  box-shadow: 0 0 0 2px rgba(149, 129, 232, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 300px;
  font-family: inherit;
}

.char-count {
  align-self: flex-end;
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.3rem;
}

.image-upload-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-input {
  display: none;
}

.file-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fafafa;
  width: fit-content;
}

.file-upload-btn:hover {
  border-color: #9581e8;
  background-color: #f0f4ff;
}

.upload-icon {
  font-size: 1.2rem;
}

.upload-info {
  font-size: 0.8rem;
  color: #666;
}

.image-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-preview-item {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.image-preview-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
}

.image-info {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.image-name {
  font-size: 0.8rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-size {
  font-size: 0.7rem;
  color: #666;
}

.tag-input-container {
  display: flex;
  gap: 0.5rem;
}

.tag-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}

.tag-add-btn {
  padding: 0.8rem 1rem;
  background-color: #9581e8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background-color: #f0f4ff;
  color: #9581e8;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tag-remove-btn {
  background: none;
  border: none;
  color: #9581e8;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.2rem;
}

.tag-help {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.3rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .travel-container {
    padding: 2rem 2rem;
  }
  
  .edit-container {
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
  
  .edit-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .edit-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .tag-input-container {
    flex-direction: column;
  }
  
  .image-preview-container, .existing-images-container {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>