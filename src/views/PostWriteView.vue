<template>
  <div class="travel-container">
    
    <!-- 글 작성 섹션 -->
    <section class="write-section">
      <div class="write-container">
        <div class="write-header">
          <h2>글 작성하기</h2>
          <div class="write-actions">
            <router-link to="/board" class="cancel-btn">취소</router-link>
            <button @click="savePost" class="save-btn" :disabled="!isFormValid || isSubmitting">등록</button>
          </div>
        </div>

        <!-- 로딩 인디케이터 -->
        <div v-if="isSubmitting" class="loading-indicator">
          <div class="spinner"></div>
          <p>게시글을 등록하는 중입니다...</p>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>

        <form @submit.prevent="savePost" class="write-form">
          <!-- 카테고리 선택 -->
          <div class="form-group">
            <label for="category">카테고리</label>
            <select v-model="post.categoryNo" id="category" class="form-select" required>
              <option value="">카테고리를 선택하세요</option>
              <option v-for="category in categories" :key="category.value" :value="category.value">
                {{ category.name }}
              </option>
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

          <!-- 이미지 업로드 -->
          <div class="form-group">
            <label>이미지 첨부</label>
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

            <!-- 업로드된 이미지 미리보기 -->
            <div v-if="uploadedImages.length > 0" class="image-preview-container">
              <div 
                v-for="(image, index) in uploadedImages" 
                :key="index"
                class="image-preview-item"
              >
                <img :src="image.url" :alt="`미리보기 ${index + 1}`">
                <button type="button" @click="removeImage(index)" class="remove-image-btn">×</button>
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
                <button type="button" @click="removeTag(index)" class="tag-remove-btn">×</button>
              </span>
            </div>
            <div class="tag-help">최대 10개까지 추가 가능합니다.</div>
          </div>

          <!-- 공지사항 설정 (관리자 권한이 있는 경우만) -->
          <div v-if="isAdmin" class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="isNotice" class="form-checkbox">
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
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 사용자 권한 (실제로는 로그인 상태에서 가져와야 함)
const isAdmin = ref(false);

// 카테고리 목록
const categories = [
  { value: 2, name: '자유게시판' },
  { value: 3, name: '여행 팁' },
  { value: 4, name: '질문/답변' },
  { value: 5, name: '동행 구하기' },
  { value: 1, name: '공지사항' }, // 관리자만 표시
];

// 게시글 데이터
const post = ref({
  categoryNo: '',
  title: '',
  content: '',
  tags: []
});

// 공지사항 설정 (백엔드의 dto 구조 상 별도 플래그로 처리)
const isNotice = ref(false);

// 태그 입력
const tagInput = ref('');

// 업로드된 이미지
const uploadedImages = ref([]);
const fileInput = ref(null);

// 상태 관리
const isSubmitting = ref(false);
const error = ref(null);

// 폼 유효성 검사
const isFormValid = computed(() => {
  return post.value.categoryNo && 
         post.value.title.trim() && 
         post.value.content.trim();
});

// 메서드
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  
  if (uploadedImages.value.length + files.length > 5) {
    alert('이미지는 최대 5장까지 업로드할 수 있습니다.');
    return;
  }
  
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) { // 10MB 제한
      alert(`${file.name} 파일이 너무 큽니다. (최대 10MB)`);
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImages.value.push({
        file: file,
        url: e.target.result,
        name: file.name,
        size: file.size
      });
    };
    reader.readAsDataURL(file);
  });
  
  // 파일 입력 초기화
  event.target.value = '';
};

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const addTag = () => {
  const tag = tagInput.value.trim().replace(/^#/, ''); // # 제거
  
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

const savePost = async () => {
  if (!isFormValid.value) {
    alert('필수 항목을 모두 입력해주세요.');
    return;
  }
  
  if (isSubmitting.value) return; // 중복 제출 방지
  
  isSubmitting.value = true;
  error.value = null;
  
  try {
    // FormData 객체 생성
    const formData = new FormData();
    
    // 카테고리 번호가 1인 경우 공지사항으로 처리
    if (post.value.categoryNo === 1 && !isAdmin.value) {
      alert('공지사항은 관리자만 작성할 수 있습니다.');
      isSubmitting.value = false;
      return;
    }
    
    // 게시글 데이터
    const boardData = {
      categoryNo: post.value.categoryNo,
      title: post.value.title,
      content: post.value.content,
      tags: post.value.tags
    };
    
    // JSON 데이터를 FormData에 추가
    formData.append('board', new Blob([JSON.stringify(boardData)], {
      type: 'application/json'
    }));
    
    // 이미지 파일들 추가
    uploadedImages.value.forEach((image, index) => {
      formData.append('files', image.file);
    });
    
    // API 호출
    const response = await axios.post(`${API_BASE_URL}/api/board`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true // 쿠키 포함
    });
    
    // 성공 시 게시글 상세 페이지로 이동
    alert('게시글이 성공적으로 등록되었습니다.');
    router.push(`/board/${response.data.boardNo}`);
    
  } catch (err) {
    console.error('게시글 저장 실패:', err);
    
    if (err.response && err.response.status === 401) {
      error.value = '로그인이 필요합니다.';
      // 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = '게시글 등록 중 오류가 발생했습니다.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

// 사용자 권한 확인
const checkUserPermission = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/member`, {
      withCredentials: true
    });
    
    // 관리자 권한 확인
    isAdmin.value = response.data.role === 'ADMIN';
    
  } catch (err) {
    console.error('사용자 정보 조회 실패:', err);
    isAdmin.value = false;
  }
};

onMounted(() => {
  // 사용자 권한 확인
  checkUserPermission();
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
  background-image: url('https://i.pinimg.com/736x/5e/9f/07/5e9f07d84b763d9fd5becff18cc6e99e.jpg');
  background-repeat: repeat;
  background-size: cover;
  background-attachment: fixed;

}

/* 글 작성 섹션 */
.write-section {
  position: relative;
  z-index: 1;
  margin-top: 1rem;
}

.write-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.write-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.write-header h2 {
  font-size: 1.8rem;
  color: #333;
}

.write-actions {
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

/* 폼 스타일 */
.write-form {
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

/* 이미지 업로드 */
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

/* 이미지 미리보기 */
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

/* 태그 입력 */
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

/* 체크박스 */
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
  
  .write-container {
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
  
  .write-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .write-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .tag-input-container {
    flex-direction: column;
  }
  
  .image-preview-container {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>