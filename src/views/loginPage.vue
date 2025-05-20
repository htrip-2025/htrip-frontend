<template>
  <div class="login-container">
    <!-- 왼쪽 콘텐츠 영역 -->
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

    <!-- 오른쪽 로그인 폼 영역 -->
    <div class="login-form-section">
      <div class="form-container">
        <h2 class="form-title">Create an account.</h2>
        <p class="form-subtitle">Already have an account? <a href="#" class="signin-link">Sign in</a></p>
        
        <form class="login-form">
          <div class="form-group">
            <input type="text" id="name" placeholder="Name" required />
          </div>
          
          <div class="form-group">
            <input type="email" id="email" placeholder="Email address" required />
          </div>
          
          <div class="form-group password-group">
            <input type="password" id="password" placeholder="Password" required />
            <button type="button" class="show-password">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          
          <div class="terms-text">
            <p>By login in you agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a></p>
          </div>
          
          <button type="submit" class="signup-button">Sign Up</button>
          
          <!-- 소셜 로그인 구분선 -->
          <div class="social-divider">
            <span>or sign up with</span>
          </div>
          
          <!-- 소셜 로그인 버튼 영역 (기존 코드 유지) -->
          <div class="social-buttons">
            <!-- 깃허브 버튼 추가 -->
            <button type="button" class="social-button github-button">
              <div class="social-icon github-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="#333"/>
                </svg>
              </div>
              <span>Github</span>
            </button>
            
            <!-- 구글 로그인 버튼 -->
            <button type="button" class="social-button google-button">
              <div class="social-icon google-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
                  <path d="M7,10.969 L7,13.031 L10.5,13.031 L10.5,10.969 L7,10.969 Z" fill="#34A853" transform="translate(8.75, 12) scale(0.9, 0.9) translate(-8.75, -12)"/>
                  <path d="M14,10.969 L14,13.031 L17.5,13.031 L17.5,10.969 L14,10.969 Z" fill="#FBBC05" transform="translate(15.75, 12) scale(0.9, 0.9) translate(-15.75, -12)"/>
                  <path d="M10.5,7.469 L10.5,9.531 L17.5,9.531 L17.5,7.469 L10.5,7.469 Z" fill="#EA4335" transform="translate(14, 8.5) scale(0.9, 0.9) translate(-14, -8.5)"/>
                </svg>
              </div>
              <span>Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 배경 그라데이션 원형들 -->
    <div class="gradient-circle circle1"></div>
    <div class="gradient-circle circle2"></div>
    <div class="gradient-circle circle3"></div>
    <div class="gradient-circle circle4"></div>
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
  background: linear-gradient(120deg, #e0f7fa, #e8eaf6, #ede7f6);
  position: relative;
  overflow: hidden;
}

/* 왼쪽 콘텐츠 영역 */
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

.form-group {
  margin-bottom: 1.2rem;
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

.password-group {
  position: relative;
}

.show-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.terms-text {
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 1.5rem;
}

.terms-text a {
  color: #9581e8;
  text-decoration: none;
}

.signup-button {
  width: 100%;
  padding: 1rem;
  background: #51B27C;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
}

.signup-button:hover {
  background: #44a16d;
  box-shadow: 0 4px 10px rgba(81, 178, 124, 0.2);
}

.social-divider {
  position: relative;
  text-align: center;
  margin-bottom: 1.5rem;
}

.social-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #eee;
}

.social-divider span {
  display: inline-block;
  position: relative;
  background-color: white;
  padding: 0 15px;
  font-size: 0.9rem;
  color: #888;
}

.social-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.social-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.8rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  color: #333;
}

.social-button:hover {
  background-color: #f9f9f9;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 그라데이션 원형 효과 - 기존 색상 유지 */
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
  
  .social-buttons {
    flex-direction: column;
  }
}
</style>