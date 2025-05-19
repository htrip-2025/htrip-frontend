<template>
  <div class="login-container">
    <!-- 왼쪽 로그인 폼 영역 -->
    <div class="login-form-section">
      <div class="form-container">
        <div class="logo-area">
          <span class="logo-icon">T</span>rip
        </div>
        
        <h1 class="login-title">로그인</h1>
        <p class="login-subtitle">계정에 로그인하여 여행을 시작하세요</p>
        
        <form class="login-form">
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" placeholder="이메일을 입력하세요" required />
          </div>
          
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" placeholder="비밀번호를 입력하세요" required />
            <div class="forgot-password">
              <a href="#">비밀번호를 잊으셨나요?</a>
            </div>
          </div>
          
          <!-- 소셜 로그인 버튼 영역 -->
          <div class="social-login-section">
            <p class="social-login-text">간편하게 시작하기</p>
            <div class="social-buttons">
              <!-- 카카오 로그인 버튼 -->
              <button type="button" class="social-button kakao-button">
                <div class="social-icon kakao-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12,3C7.03,3 3,6.16 3,10C3,12.3 4.29,14.33 6.34,15.55C6.12,16.27 5.33,18.04 5.26,18.26C5.18,18.5 5.38,18.69 5.61,18.58C5.79,18.5 8.07,17.27 9.08,16.69C10.03,16.89 11,17 12,17C16.97,17 21,13.84 21,10C21,6.16 16.97,3 12,3Z" fill="#381F1E"/>
                  </svg>
                </div>
              </button>
              
              <!-- 네이버 로그인 버튼 -->
              <button type="button" class="social-button naver-button">
                <div class="social-icon naver-icon">
                  <span>N</span>
                </div>
              </button>
              
              <!-- 구글 로그인 버튼 -->
              <button type="button" class="social-button google-button">
                <div class="social-icon google-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
                    <path d="M7,10.969 L7,13.031 L10.5,13.031 L10.5,10.969 L7,10.969 Z" fill="#34A853" transform="translate(8.75, 12) scale(0.9, 0.9) translate(-8.75, -12)"/>
                    <path d="M14,10.969 L14,13.031 L17.5,13.031 L17.5,10.969 L14,10.969 Z" fill="#FBBC05" transform="translate(15.75, 12) scale(0.9, 0.9) translate(-15.75, -12)"/>
                    <path d="M10.5,7.469 L10.5,9.531 L17.5,9.531 L17.5,7.469 L10.5,7.469 Z" fill="#EA4335" transform="translate(14, 8.5) scale(0.9, 0.9) translate(-14, -8.5)"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </form>
        
        <div class="register-link">
          <p>계정이 없으신가요? <a href="#">회원가입</a></p>
        </div>
      </div>
    </div>
    
    <!-- 오른쪽 그라데이션 영역 -->
    <div class="visual-section">
      <div class="gradient-circle circle1"></div>
      <div class="gradient-circle circle2"></div>
      <div class="gradient-circle circle3"></div>
      <div class="gradient-circle circle4"></div>
      
      <!-- 흰색 곡선 SVG -->
      <svg class="curve-container" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path d="M0,300 C250,250 350,450 500,380 C650,320 750,420 1000,300" 
              fill="none" 
              stroke="white" 
              stroke-width="3"
              stroke-opacity="0.6"></path>
        <path d="M0,600 C200,650 400,500 600,550 C800,600 900,500 1000,580" 
              fill="none" 
              stroke="white" 
              stroke-width="2"
              stroke-opacity="0.5"></path>
      </svg>
      
      <div class="welcome-text">
        <h2>Welcome</h2>
        <p>여행을 함께 시작해요</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 필요한 Vue 관련 로직을 여기에 추가
</script>

<style scoped>
/* 기본 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
}

/* 전체 로그인 컨테이너 */
.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

/* 왼쪽 로그인 폼 영역 */
.login-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.form-container {
  width: 100%;
  max-width: 400px;
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

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
}

.login-subtitle {
  color: #666;
  margin-bottom: 2.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #444;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #9581e8;
}

.forgot-password {
  text-align: right;
  margin-top: 0.5rem;
}

.forgot-password a {
  color: #9581e8;
  text-decoration: none;
  font-size: 0.9rem;
}

/* 소셜 로그인 영역 */
.social-login-section {
  margin-top: 2rem;
  text-align: center;
}

.social-login-text {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.social-button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s;
}

.social-button:hover {
  transform: translateY(-3px);
}

.social-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 카카오 버튼 스타일 */
.kakao-icon {
  background-color: #FEE500;
}

/* 네이버 버튼 스타일 */
.naver-icon {
  background-color: #03C75A;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
}

/* 구글 버튼 스타일 */
.google-icon {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.register-link {
  text-align: center;
  margin-top: 2rem;
}

.register-link a {
  color: #9581e8;
  text-decoration: none;
  font-weight: 600;
}

/* 오른쪽 시각적 영역 */
.visual-section {
  flex: 1;
  position: relative;
  background-color: #f4f4f4; /* 배경색 변경 */
  overflow: hidden;
}

/* 곡선 효과 */
.visual-section::before {
  content: '';
  position: absolute;
  top: 25%;
  left: 10%;
  right: 10%;
  height: 200px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
  border-radius: 50%;
  transform: rotate(-5deg) scale(1, 0.2);
  z-index: 6;
  opacity: 0.6;
}

.visual-section::after {
  content: '';
  position: absolute;
  bottom: 30%;
  left: 5%;
  right: 5%;
  height: 150px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  border-radius: 50%;
  transform: rotate(8deg) scale(1, 0.15);
  z-index: 6;
  opacity: 0.5;
}

/* 추가 곡선 SVG */
.curve-container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 6;
  pointer-events: none;
  opacity: 0.7;
}

/* 그라데이션 원형 효과 */
.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
}

.circle1 {
  width: 550px;
  height: 550px;
  top: 45%;
  left: 45%;
  transform: translate(-45%, -50%);
  background: radial-gradient(circle at center, #b6aceb 0%, transparent 70%);
  z-index: 1;
}

.circle2 {
  width: 500px;
  height: 500px;
  top: 55%;
  left: 50%;
  transform: translate(-45%, -45%);
  background: radial-gradient(circle at center, #7c8de3 0%, transparent 70%);
  z-index: 2;
}

.circle3 {
  width: 520px;
  height: 520px;
  top: 40%;
  left: 55%;
  transform: translate(-50%, -40%);
  background: radial-gradient(circle at center, #6bd5c5 0%, transparent 70%);
  z-index: 3;
}

.circle4 {
  width: 480px;
  height: 480px;
  top: 55%;
  left: 40%;
  transform: translate(-40%, -55%);
  background: radial-gradient(circle at center, #bfa9e9 0%, transparent 70%);
  z-index: 4;
}

/* 환영 텍스트 */
.welcome-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  font-weight: 600;
  z-index: 5;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.welcome-text h2 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.welcome-text p {
  font-size: 1.2rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .visual-section {
    display: none; /* 모바일에서는 시각적 영역 숨김 */
  }
  
  .login-form-section {
    width: 100%;
    padding: 2rem 1.5rem;
  }
}
</style>