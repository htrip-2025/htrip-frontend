<template>
  <div class="login-container">
    <!-- 왼쪽 배경 이미지 영역 -->
    <div class="background-section">
      <div class="overlay">
        <div class="branding">
          <div class="logo-area">
            <span class="logo-icon">T</span>ripmind
          </div>
          <h1 class="slogan">
            <br>
            <br>
            <br>
            당신의 다음 여행,<br>
            &ensp; &ensp;&ensp;이곳에서 시작됩니다.
          
          </h1>
        </div>
        
       
      </div>
    </div>

    <!-- 오른쪽 로그인 폼 영역 -->
    <div class="login-form-section">
      <div class="form-container">
        <h2 class="form-title">Login</h2>
        <!-- <p class="form-subtitle">Already have an account? <a href="#" class="signin-link">Sign in</a></p>
         -->
        <!-- 알림 메시지 -->
        <div v-if="message" class="alert" :class="{'alert-success': isSuccess, 'alert-error': !isSuccess}">
          {{ message }}
        </div>
        
        <!-- 소셜 로그인 버튼들 -->
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
          
          <!-- Kakao 로그인 버튼 -->
          <a href="#" class="social-login-btn kakao-btn" @click.prevent="handleKakaoLogin">
            <div class="social-icon">
              <svg width="22" height="20" viewBox="0 0 24 22" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.371 0 0 4.292 0 9.592c0 3.307 2.186 6.213 5.5 7.861l-1.401 5.194c-.122.455.385.818.774.546l5.927-3.921c.402.039.812.06 1.231.06 6.629 0 12-4.292 12-9.592S18.629 0 12 0z" fill="#371D1E"/>
              </svg>
            </div>
            <span>Kakao로 시작하기</span>
          </a>
          
          <!-- Naver 로그인 버튼 -->
          <a href="#" class="social-login-btn naver-btn" @click.prevent="handleNaverLogin">
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
    // URL 파라미터에서 결과 확인 (OAuth 리다이렉트 후)
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'true') {
      this.handleLoginSuccess();
    } else if (error) {
      this.message = `로그인 실패: ${error}`;
      this.isSuccess = false;
    }
  },
  methods: {
    async handleGoogleLogin() {
      try {
        this.isLoading = true;
        
        // Google OAuth 인증 URL로 리다이렉트
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        window.location.href = `${apiUrl}/oauth2/authorization/google`;
        
      } catch (error) {
        console.error('Google 로그인 중 오류 발생:', error);
        this.message = '로그인 과정에서 오류가 발생했습니다. 다시 시도해주세요.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    },

    async handleKakaoLogin() {
      try {
        this.isLoading = true;
        
        // Kakao OAuth 인증 URL로 리다이렉트
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        window.location.href = `${apiUrl}/oauth2/authorization/kakao`;
        
      } catch (error) {
        console.error('Kakao 로그인 중 오류 발생:', error);
        this.message = '로그인 과정에서 오류가 발생했습니다. 다시 시도해주세요.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    },

    async handleNaverLogin() {
      try {
        this.isLoading = true;
        
        // Naver OAuth 인증 URL로 리다이렉트
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        window.location.href = `${apiUrl}/oauth2/authorization/naver`;
        
      } catch (error) {
        console.error('Naver 로그인 중 오류 발생:', error);
        this.message = '로그인 과정에서 오류가 발생했습니다. 다시 시도해주세요.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    },
    
    async handleLoginSuccess() {
      try {
        // 로그인 성공 메시지 표시
        this.message = '로그인에 성공했습니다.';
        this.isSuccess = true;
        
        console.log('로그인 성공, 메인 페이지로 이동');
        
        // 1초 후 메인 페이지로 리다이렉트
        setTimeout(() => {
          this.$router.push('/');
        }, 1000);
        
      } catch (error) {
        console.error('로그인 처리 중 오류:', error);
        this.message = '로그인 처리 중 오류가 발생했습니다.';
        this.isSuccess = false;
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
   font-family: 'LeeSeoyun';
}

.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 왼쪽 배경 이미지 영역 */
.background-section {
  flex: 1;
  background-image: url('https://i.pinimg.com/736x/c2/ef/69/c2ef693e49bed87f90e7f0b8b909ff23.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.overlay {
  background: rgba(0, 0, 0, 0.4);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rem;
  z-index: 10;
}

.branding {
  margin-bottom: 3rem;
}

.logo-area {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 2rem;
   font-family: 'LeeSeoyun';
}

.logo-icon {
  color: #2172ce;
  background-color: #dfe0e1;
  padding: 2px 8px;
  border-radius: 50%;
  margin-right: 2px;
}

.slogan {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
   font-family: 'LeeSeoyun';
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
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  backdrop-filter: blur(10px);
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
  background-color: white;
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
  background-color: white;
  border-radius: 3px;
}

.dashboard-icon span:nth-child(2) {
  width: 18px;
}

.feature-text h3 {
  font-size: 1.3rem;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.feature-text p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 400px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.brand-footer {
  margin-top: 2rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 오른쪽 로그인 폼 영역 */
.login-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  z-index: 10;
  background-image: url('https://i.pinimg.com/736x/a9/21/72/a92172a74650d9d2cd6a446dc69275b7.jpg');


}

.form-container {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 2rem;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
  font-family: 'MoveSans-Bold';

}
@font-face {
    font-family: 'MoveSans-Bold';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2405-2@1.0/MoveSans-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
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

/* 소셜 로그인 버튼 스타일 */
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
  transform: translateY(-2px);
}

/* Kakao 버튼 스타일 */
.kakao-btn {
  background-color: #FEE500;
  color: #000;
}

.kakao-btn:hover {
  background-color: #FDD800;
  transform: translateY(-2px);
}

/* Naver 버튼 스타일 */
.naver-btn {
  background-color: #03C75A;
  color: #fff;
}

.naver-btn:hover {
  background-color: #02B14A;
  transform: translateY(-2px);
}

/* 네이버 아이콘 특별 스타일 */
.naver-icon svg {
  border-radius: 2px;
  overflow: hidden;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }
  
  .background-section {
    min-height: 40vh;
  }
  
  .overlay {
    padding: 2rem;
  }
  
  .slogan {
    font-size: 2.5rem;
  }
  
  .form-container {
    margin: 1rem;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .background-section {
    min-height: 35vh;
  }
  
  .overlay {
    padding: 1.5rem;
  }
  
  .slogan {
    font-size: 2rem;
  }
  
  .features {
    gap: 1.5rem;
  }
  
  .feature-text h3 {
    font-size: 1.1rem;
  }
  
  .feature-text p {
    font-size: 0.9rem;
  }
  
  .form-container {
    padding: 2rem;
    margin: 1rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
}
</style>