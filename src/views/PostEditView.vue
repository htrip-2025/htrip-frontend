<template>
  <div class="travel-container">
  
    <!-- 로딩 인디케이터 -->
    <div v-if="initialLoading" class="loading-indicator">
      <div class="spinner"></div>
      <p>게시글 정보를 불러오는 중입니다...</p>
    </div>

    <!-- 에러 메시지 -->
    <div v-else-if="initialError" class="error-message">
      <p>{{ initialError }}</p>
      <router-link to="/board" class="back-to-list-btn">목록으로</router-link>
    </div>

    <!-- 글 수정 섹션 -->
    <section v-else class="edit-section">
      <div class="edit-container">
        <div class="edit-header">
          <h2>글 수정하기</h2>
          <div class="edit-actions">
            <router-link :to="`/board/${postId}`" class="cancel-btn">취소</router-link>
            <button @click="updatePost" class="save-btn" :disabled="!isFormValid || isSubmitting">수정 완료</button>
          </div>
        </div>

        <!-- 제출 중 로딩 -->
        <div v-if="isSubmitting" class="loading-indicator">
          <div class="spinner"></div>
          <p>게시글을 수정하는 중입니다...</p>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>

        <form @submit.prevent="updatePost" class="edit-form">
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

          <!-- 기존 이미지 -->
          <div v-if="existingImages.length > 0" class="form-group">
            <label>기존 이미지</label>
            <div class="existing-images-container">
              <div 
                v-for="(image, index) in existingImages" 
                :key="image.imageId"
                class="existing-image-item"
              >
                <img :src="getImageUrl(image)" :alt="`기존 이미지 ${index + 1}`">
                <button type="button" @click="removeExistingImage(image.imageId)" class="remove-image-btn">×</button>
                <div class="image-info">
                  <span class="image-name">{{ image.originalFileName }}</span>
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
                <button type="button" @click="removeNewImage(index)" class="remove-image-btn">×</button>
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
        </form>
      </div>
    </section>
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

// 사용자 권한
const isAdmin = ref(false);
const userId = ref(null);

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

// 태그 입력
const tagInput = ref('');

// 이미지 관련
const existingImages = ref([]);
const newImages = ref([]);
const removedImageIds = ref([]);
const fileInput = ref(null);

// 상태 관리
const initialLoading = ref(true);
const initialError = ref(null);
const isSubmitting = ref(false);
const error = ref(null);

// 폼 유효성 검사
const isFormValid = computed(() => {
  return post.value.categoryNo && 
         post.value.title.trim() && 
         post.value.content.trim();
});

// 총 이미지 개수 체크
const totalImageCount = computed(() => {
  return existingImages.value.length + newImages.value.length;
});

// 사용자 정보 조회
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/member`, {
      withCredentials: true
    });
    
    userId.value = response.data.userId;
    isAdmin.value = response.data.role === 'ADMIN';
    
  } catch (err) {
    console.error('사용자 정보 조회 실패:', err);
    userId.value = null;
    isAdmin.value = false;
    initialError.value = '로그인이 필요합니다.';
    
    // 로그인 페이지로 리다이렉트
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  }
};

// 게시글 데이터 로드
const loadPostData = async () => {
  initialLoading.value = true;
  initialError.value = null;
  
  try {
    // 게시글 상세 정보 조회
    console.log("Loading post data for ID:", postId.value);
    const response = await axios.get(`${API_BASE_URL}/api/board/${postId.value}`, {
      withCredentials: true
    });
    
    console.log("Post edit data loaded:", response.data);
    const postData = response.data;
    
    // 본인 게시글인지 확인
    if (userId.value !== postData.userId && !isAdmin.value) {
      initialError.value = '게시글 수정 권한이 없습니다.';
      return;
    }
    
    // 게시글 데이터 설정
    post.value = {
      categoryNo: postData.categoryNo,
      title: postData.title,
      content: postData.content,
      tags: postData.tags || []
    };
    
    // 이미지 데이터가 있으면 설정
    if (postData.images && postData.images.length > 0) {
      console.log("Post has images:", postData.images);
      existingImages.value = [...postData.images];
      
      // 이미지 경로가 없는 경우 추가 API 호출로 이미지 정보 가져오기
      if (!existingImages.value[0].imagePath && postData.boardNo) {
        try {
          const imagesResponse = await axios.get(`${API_BASE_URL}/api/board/${postData.boardNo}/images`, {
            withCredentials: true
          });
          console.log("Additional images fetched for edit:", imagesResponse.data);
          if (Array.isArray(imagesResponse.data) && imagesResponse.data.length > 0) {
            existingImages.value = imagesResponse.data;
          }
        } catch (imgErr) {
          console.error("Failed to fetch additional image data for edit:", imgErr);
        }
      }
    }
    
  } catch (err) {
    console.error('게시글 로딩 실패:', err);
    
    if (err.response && err.response.status === 404) {
      initialError.value = '존재하지 않는 게시글입니다.';
    } else if (err.response && err.response.status === 403) {
      initialError.value = '게시글 수정 권한이 없습니다.';
    } else {
      initialError.value = '게시글을 불러오는데 실패했습니다.';
    }
  } finally {
    initialLoading.value = false;
  }
};

// 이미지 파일 업로드 처리
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

// 기존 이미지 삭제
const removeExistingImage = (imageId) => {
  if (confirm('기존 이미지를 삭제하시겠습니까?')) {
    const index = existingImages.value.findIndex(img => img.imageId === imageId);
    if (index > -1) {
      // 삭제할 이미지 ID 저장
      removedImageIds.value.push(imageId);
      existingImages.value.splice(index, 1);
    }
  }
};

// 새로 업로드한 이미지 삭제
const removeNewImage = (index) => {
  newImages.value.splice(index, 1);
};

// 파일 크기 포맷팅
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 태그 추가
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

// 태그 삭제
const removeTag = (index) => {
  post.value.tags.splice(index, 1);
};

// 게시글 수정
const updatePost = async () => {
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
    
    console.log("Edit data to send:", boardData);
    
    // JSON 데이터를 FormData에 추가
    formData.append('board', new Blob([JSON.stringify(boardData)], {
      type: 'application/json'
    }));
    
    // 새 이미지 파일들 추가
    if (newImages.value.length > 0) {
      console.log("Adding new images:", newImages.value.length);
      newImages.value.forEach((image, index) => {
        formData.append('files', image.file);
      });
    }
    
    // FormData 내용 확인을 위한 로깅
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof Blob ? 'Blob/File' : pair[1]));
    }
    
    // 게시글 수정 API 호출
    const response = await axios.put(`${API_BASE_URL}/api/board/${postId.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    
    console.log("Post update response:", response.data);
    
    // 삭제된 이미지 처리
    if (removedImageIds.value.length > 0) {
      console.log("Removing images:", removedImageIds.value);
      for (const imageId of removedImageIds.value) {
        try {
          await axios.delete(`${API_BASE_URL}/api/board/images/${imageId}`, {
            withCredentials: true
          });
        } catch (imageErr) {
          console.error(`이미지 ${imageId} 삭제 실패:`, imageErr);
        }
      }
    }
    
    // 성공 시 게시글 상세 페이지로 이동
    alert('게시글이 성공적으로 수정되었습니다.');
    router.push(`/board/${postId.value}`);
    
  } catch (err) {
    console.error('게시글 수정 실패:', err);
    
    if (err.response && err.response.status === 401) {
      error.value = '로그인이 필요합니다.';
      // 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else if (err.response && err.response.status === 403) {
      error.value = '게시글 수정 권한이 없습니다.';
    } else if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = '게시글 수정 중 오류가 발생했습니다.';
    }
  } finally {
    isSubmitting.value = false;
  }
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

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(async () => {
  // 사용자 정보 조회
  await fetchUserInfo();
  
  // 권한이 있으면 게시글 데이터 로드
  if (userId.value) {
    await loadPostData();
  }
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

   min-height: 100vh;
  background-image: url('https://i.pinimg.com/736x/91/72/b7/9172b7886a49d6649cb05dea79f55f53.jpg');
  background-repeat: repeat;
  background-size: auto;
  background-attachment: fixed;

}

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