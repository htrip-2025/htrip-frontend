<template>
  <div class="login-container">
    <!-- 왼쪽 콘텐츠 영역은 그대로 유지 -->
    <div class="content-section">
      <div class="branding">
        <div class="logo-area">
          <span class="logo-icon">T</span>rip
        </div>
        <h1 class="slogan">
          Move Fast.<br>
          Break Nothing.
        </h1>
      </div>
      
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">
            <div class="icon-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="feature-text">
            <h3>Remove Bottlenecks</h3>
            <p>Release testing and approvals are the most common bottleneck for tech, but you can now remove that bottleneck with Trip.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon dashboard-icon">
            <span></span>
            <span></span>
          </div>
          <div class="feature-text">
            <h3>Access Risk Analysis</h3>
            <p>We use machine learning and static analysis to assess risk, summarise code changes, and automate and delegate release management tasks. Integrate with a couple of clicks.</p>
          </div>
        </div>
      </div>
      
      <div class="brand-footer">
        <div class="logo-text">Trip</div>
      </div>
    </div>

    <!-- 오른쪽 로그인 폼 영역 수정 -->
    <div class="login-form-section">
      <div class="form-container">
        <h2 class="form-title">Create an account.</h2>
        <p class="form-subtitle">Already have an account? <a href="#" class="signin-link">Sign in</a></p>
        
        <!-- 알림 메시지 -->
        <div v-if="message" class="alert" :class="{'alert-success': isSuccess, 'alert-error': !isSuccess}">
          {{ message }}
        </div>
        
        <!-- 기존 폼 대신 소셜 로그인 버튼만 표시 -->
        <div class="social-login-buttons">
          <!-- Google 로그인 버튼 -->
          <a href="#" class="social-login-btn google-btn" @click.prevent="handleGoogleLogin">
            <div class="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span>Google로 시작하기</span>
          </a>
          
          <!-- Kakao 로그인 버튼 - 아직 구현하지 않음 -->
          <a href="#" class="social-login-btn kakao-btn">
            <div class="social-icon">
              <svg width="22" height="20" viewBox="0 0 24 22" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.371 0 0 4.292 0 9.592c0 3.307 2.186 6.213 5.5 7.861l-1.401 5.194c-.122.455.385.818.774.546l5.927-3.921c.402.039.812.06 1.231.06 6.629 0 12-4.292 12-9.592S18.629 0 12 0z" fill="#371D1E"/>
              </svg>
            </div>
            <span>Kakao로 시작하기</span>
          </a>
          
          <!-- Naver 로그인 버튼 - 아직 구현하지 않음 -->
          <a href="#" class="social-login-btn naver-btn">
            <div class="social-icon naver-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="0" fill="#03C75A"/>
                <path d="M16 7L16 17L13 17L8 10L8 17L8 17L5 17L5 7L8 7L13 14L13 7L16 7Z" fill="white"/>
              </svg>
            </div>
            <span>Naver로 시작하기</span>
          </a>
        </div>
      </div>
    </div>
    
    <!-- 배경 그라데이션 원형들 -->
    <div class="gradient-circle circle1"></div>
    <div class="gradient-circle circle2"></div>
    <div class="gradient-circle circle3"></div>
    <div class="gradient-circle circle4"></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      message: '',
      isSuccess: false,
      isLoading: false
    }
  },
  mounted() {
    // URL 파라미터에서 토큰 확인 (OAuth 리다이렉트 후)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (token) {
      this.handleLoginSuccess(token);
    } else if (error) {
      this.message = `로그인 실패: ${error}`;
      this.isSuccess = false;
    }
  },
  methods: {
    async handleGoogleLogin() {
      try {
        this.isLoading = true;
        
        // 방법 1: 백엔드에서 제공하는 Google OAuth 인증 URL로 리다이렉트
       // window.location.href = `${process.env.VUE_APP_API_URL}/oauth2/authorization/google`;
       
    // window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;

     const apiUrl = import.meta.env.VITE_API_URL || 'http://192.168.210.243:8080';
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
     
        
        // 방법 2: 백엔드로 요청을 보내고 리다이렉트 URL을 받아서 처리
        
       /* const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/auth/google/url`);
        if (response.data && response.data.authorizationUrl) {
          window.location.href = response.data.authorizationUrl;
        }*/
        
      } catch (error) {
        console.error('Google 로그인 중 오류 발생:', error);
        this.message = '로그인 과정에서 오류가 발생했습니다. 다시 시도해주세요.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    },
    
    handleLoginSuccess(token) {
      // JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem('jwt_token', token);
      
      // 인증 헤더 설정 (추후 API 요청에 사용)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      this.message = '로그인에 성공했습니다.';
      this.isSuccess = true;
      
      // 사용자 정보 가져오기
      this.fetchUserInfo();
      
      // 로그인 후 메인 페이지로 리다이렉트 (1초 후)
      setTimeout(() => {
        this.$router.push('/');
      }, 1000);
    },
    
    async fetchUserInfo() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/user/me`);
        // 사용자 정보 저장 (Vuex 스토어나 로컬 스토리지 등에)
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    },
    
    // 로그아웃 기능 (필요 시 사용)
    logout() {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
/* 기존 스타일 유지 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(120deg, #e0f7fa, #e8eaf6, #ede7f6);
  position: relative;
  overflow: hidden;
}

/* 왼쪽 콘텐츠 영역 스타일 유지 */
.content-section {
  flex: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 10;
}

.branding {
  margin-bottom: 3rem;
}

.logo-area {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
}

.logo-icon {
  color: #9581e8;
  background-color: #ffefd5;
  padding: 2px 8px;
  border-radius: 50%;
  margin-right: 2px;
}

.slogan {
  font-size: 3.5rem;
  font-weight: 800;
  color: #40316E;
  line-height: 1.2;
  margin-bottom: 3rem;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: rgba(149, 129, 232, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
}

.icon-lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
}

.icon-lines span {
  display: block;
  width: 4px;
  height: 20px;
  background-color: #9581e8;
  border-radius: 2px;
}

.icon-lines span:nth-child(2) {
  height: 15px;
  margin-left: 8px;
}

.icon-lines span:nth-child(3) {
  height: 10px;
}

.dashboard-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.dashboard-icon span {
  display: block;
  width: 25px;
  height: 6px;
  background-color: #9581e8;
  border-radius: 3px;
}

.dashboard-icon span:nth-child(2) {
  width: 18px;
}

.feature-text h3 {
  font-size: 1.3rem;
  color: #40316E;
  margin-bottom: 0.5rem;
}

.feature-text p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  max-width: 400px;
}

.brand-footer {
  margin-top: 2rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #9581e8;
}

/* 오른쪽 로그인 폼 영역 */
.login-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.form-container {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.signin-link {
  color: #9581e8;
  text-decoration: none;
  font-weight: 600;
}

/* 알림 메시지 스타일 */
.alert {
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.alert-success {
  background-color: rgba(52, 168, 83, 0.1);
  border: 1px solid rgba(52, 168, 83, 0.3);
  color: #34A853;
}

.alert-error {
  background-color: rgba(234, 67, 53, 0.1);
  border: 1px solid rgba(234, 67, 53, 0.3);
  color: #EA4335;
}

/* 소셜 로그인 버튼 스타일 추가 */
.social-login-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
  border: 1px solid #eee;
  cursor: pointer;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

/* Google 버튼 스타일 */
.google-btn {
  background-color: #fff;
  color: #333;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.google-btn:hover {
  background-color: #f8f8f8;
}

/* Kakao 버튼 스타일 */
.kakao-btn {
  background-color: #FEE500;
  color: #000;
}

.kakao-btn:hover {
  background-color: #FDD800;
}

/* Naver 버튼 스타일 */
.naver-btn {
  background-color: #03C75A;
  color: #fff;
}

.naver-btn:hover {
  background-color: #02B14A;
}

/* 네이버 아이콘 특별 스타일 */
.naver-icon svg {
  border-radius: 2px;
  overflow: hidden;
}

/* 그라데이션 원형 효과 */
.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.8;
}

.circle1 {
  width: 550px;
  height: 550px;
  top: -10%;
  left: -10%;
  background: radial-gradient(circle at center, #b6aceb 0%, transparent 70%);
  z-index: 1;
}

.circle2 {
  width: 500px;
  height: 500px;
  top: 70%;
  left: 30%;
  background: radial-gradient(circle at center, #7c8de3 0%, transparent 70%);
  z-index: 2;
}

.circle3 {
  width: 650px;
  height: 650px;
  top: 20%;
  right: -10%;
  background: radial-gradient(circle at center, #6bd5c5 0%, transparent 70%);
  z-index: 1;
}

.circle4 {
  width: 480px;
  height: 480px;
  bottom: -10%;
  right: 10%;
  background: radial-gradient(circle at center, #bfa9e9 0%, transparent 70%);
  z-index: 1;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }
  
  .content-section {
    padding: 2rem;
  }
  
  .form-container {
    margin: 2rem;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .content-section {
    padding: 2rem 1.5rem;
  }
  
  .slogan {
    font-size: 2.5rem;
  }
  
  .features {
    gap: 1.5rem;
  }
  
  .form-container {
    padding: 2rem;
    margin: 1.5rem;
  }
}
</style>