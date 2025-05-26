<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="spinner"></div>
      <h2 class="loading-title">{{ title }}</h2>
      <p class="loading-description">{{ currentMessage }}</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="loading-percent">{{ progress }}%</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'AI가 최적의 여행 경로를 찾고 있어요'
  },
  messages: {
    type: Array,
    default: () => [
      "여행지 정보를 수집하고 있어요...",
      "당신의 취향을 분석하고 있어요...",
      "최적의 경로를 계산하고 있어요...",
      "맛있는 식당을 찾고 있어요...",
      "특별한 장소를 발견했어요!",
      "여행 일정을 최종 정리하고 있어요..."
    ]
  },
  initialProgress: {
    type: Number,
    default: 0
  },
  autoProgress: {
    type: Boolean,
    default: true
  }
});

const progress = ref(props.initialProgress);
const messageIndex = ref(0);
const messageInterval = ref(null);
const progressInterval = ref(null);

const currentMessage = computed(() => {
  return props.messages[messageIndex.value % props.messages.length];
});

// 자동 진행 기능 설정
onMounted(() => {
  if (props.autoProgress) {
    // 메시지 자동 변경
    messageInterval.value = setInterval(() => {
      messageIndex.value = (messageIndex.value + 1) % props.messages.length;
    }, 3000);
    
    // 진행도 자동 증가
    progressInterval.value = setInterval(() => {
      if (progress.value < 95) {
        progress.value += Math.floor(Math.random() * 5) + 1;
        if (progress.value > 95) {
          progress.value = 95;
        }
      }
    }, 500);
  }
});

// 컴포넌트 제거 시 인터벌 정리
onUnmounted(() => {
  if (messageInterval.value) {
    clearInterval(messageInterval.value);
  }
  if (progressInterval.value) {
    clearInterval(progressInterval.value);
  }
});

// 진행 상태를 외부에서 제어할 수 있는 메서드들
defineExpose({
  // 진행도 수동 설정
  setProgress: (value) => {
    progress.value = value;
  },
  // 진행 완료
  complete: () => {
    progress.value = 100;
  }
});
</script>

<style scoped>
.loading-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  width: 100%;
}

.loading-content {
  text-align: center;
  max-width: 600px;
  padding: 3rem;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 70px;
  height: 70px;
  margin: 0 auto 2rem;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #9581e8;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

.loading-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  min-height: 3.3rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #9581e8 0%, #a2b3f8 100%);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.loading-percent {
  font-size: 1rem;
  color: #666;
}
</style>