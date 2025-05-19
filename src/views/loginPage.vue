<template>
  <div class="login-container">
    <!-- 왼쪽 로그인 폼 섹션 -->
    <div class="login-form">
      <button class="sign-up-btn">SIGN UP</button>
      
      <h1 class="welcome-text">WELCOME!</h1>
      
      <p class="description">
        Log in to access your customized mindfulness exercises,
        track your progress, and unlock new insights into your
        mental wellbeing.
      </p>
      
      <div class="input-container">
        <input type="email" placeholder="Email" class="email-input" />
      </div>
      
      <button class="continue-btn">Continue</button>
      
      <div class="divider">OR</div>
      
      <div class="social-login">
        <button class="social-btn google"><span>G</span></button>
        <button class="social-btn apple"><span>&#xF8FF;</span></button>
        <button class="social-btn twitter"><span>𝕏</span></button>
        <button class="social-btn facebook"><span>f</span></button>
      </div>
      
      <div class="terms">
        <p>By proceeding, you agree to our <a href="#">Terms of use</a>.</p>
        <p>Read our <a href="#">Privacy Policy</a></p>
      </div>
    </div>
    
    <!-- 오른쪽 그라데이션 섹션 -->
    <div class="gradient-section">
      <div class="gradient-circle circle-1"></div>
      <div class="gradient-circle circle-2"></div>
      <div class="gradient-line line-1"></div>
      <div class="gradient-line line-2"></div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 왼쪽 로그인 폼 스타일 */
.login-form {
  width: 50%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 5rem;
}

.sign-up-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 0.5rem 1rem;
  background-color: #f0f0f4;
  border: none;
  border-radius: 4px;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
}

.welcome-text {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  margin-top: 3rem;
}

.description {
  text-align: center;
  color: #666;
  max-width: 80%;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.input-container {
  width: 100%;
  max-width: 400px;
  margin-bottom: 1.5rem;
}

.email-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.continue-btn {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  background-color: #a698df; /* 라벤더 색상, 메인 페이지 색상에 맞게 조정 */
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.divider {
  color: #999;
  margin: 1rem 0;
  position: relative;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.social-login {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.social-btn {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: #f0f0f4;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.terms {
  font-size: 0.8rem;
  color: #999;
  text-align: center;
}

.terms a {
  color: #666;
  text-decoration: none;
}

/* 오른쪽 그라데이션 섹션 스타일 */
.gradient-section {
  width: 50%;
  position: relative;
  background: linear-gradient(145deg, #f8e8ff 0%, #f1e5ff 30%, #e8e7ff 60%, #e5eaff 100%);
  overflow: hidden;
}

/* 그라데이션 원 */
.gradient-circle {
  position: absolute;
  border-radius: 50%;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -50px;
  left: -100px;
  background: linear-gradient(135deg, rgba(204, 181, 255, 0.6) 0%, rgba(178, 170, 255, 0.4) 100%);
  filter: blur(40px);
}

.circle-2 {
  width: 500px;
  height: 500px;
  bottom: -100px;
  right: -100px;
  background: linear-gradient(135deg, rgba(255, 207, 235, 0.4) 0%, rgba(209, 187, 255, 0.3) 100%);
  filter: blur(60px);
}

/* 그라데이션 선 */
.gradient-line {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.line-1 {
  width: 800px;
  height: 800px;
  top: 30%;
  right: -300px;
  border-width: 1px;
}

.line-2 {
  width: 600px;
  height: 600px;
  bottom: -200px;
  left: 30%;
  border-width: 2px;
}
</style>