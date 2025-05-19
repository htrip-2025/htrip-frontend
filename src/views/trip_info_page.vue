 <template>
  <header class="header">
      <div class="logo">
        <span class="logo-icon">T</span>rip
      </div>
      <div class="menu-items">
        <a href="#" class="menu-link">AI 추천</a>
        <a href="/info" class="menu-link">여행정보</a>
        <a href="#" class="menu-link">여행계획</a>
        <a href="#" class="menu-link">커뮤니티</a>
        <a href="#" class="menu-link search-icon">🔍</a>
      </div>
     <div class="login-section">
      <a href="#" class="login-button">
        <span class="button-text">로그인</span>
      </a>
    </div>
    </header>
    <!-- 검색 영역 -->
    <div class="search-container">
      <input type="text" class="search-input" placeholder="어디로 여행을 떠나시나요?" v-model="searchQuery" />
      <button class="search-btn" @click="search">
        <i class="fas fa-search"></i> 검색
      </button>
    </div>

    <!-- 지역 아이콘 영역 -->
    <div class="region-icons-container">
      <h2>한국의 지역</h2>
      <div class="region-icons">
        <div 
          v-for="region in regions" 
          :key="region.id" 
          class="region-icon" 
          :class="{ active: selectedRegion === region.id }"
          @click="selectRegion(region.id)"
        >
          <img :src="region.icon" :alt="region.name" class="region-img" />
          <div class="region-name">{{ region.name }}</div>
        </div>
      </div>
    </div>

    <!-- 여행지 표시 영역 -->
    <div class="destinations-container">
      <!-- 지역 선택 전 인기 여행지 표시 -->
      <div v-if="!selectedRegion" class="popular-destinations">
        <h2>인기 여행지</h2>
        <div class="destinations-grid">
          <div 
            v-for="destination in popularDestinations" 
            :key="destination.id" 
            class="destination-card"
            @click="viewDestination(destination.id)"
          >
            <img :src="destination.image" :alt="destination.name" class="destination-img" />
            <div class="destination-info">
              <h3>{{ destination.name }}</h3>
              <p>{{ destination.description }}</p>
              <div class="destination-rating">
                <i class="fas fa-star"></i>
                <span>{{ destination.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 지역 선택 후 해당 지역 여행지 표시 -->
      <div v-else class="region-destinations">
        <h2>{{ getSelectedRegionName() }} 여행지</h2>
        <div class="destinations-grid">
          <div 
            v-for="destination in regionDestinations" 
            :key="destination.id" 
            class="destination-card"
            @click="viewDestination(destination.id)"
          >
            <img :src="destination.image" :alt="destination.name" class="destination-img" />
            <div class="destination-info">
              <h3>{{ destination.name }}</h3>
              <p>{{ destination.description }}</p>
              <div class="destination-rating">
                <i class="fas fa-star"></i>
                <span>{{ destination.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
 </template>

<script>
export default {
  name: 'TripInfoPage',
  data() {
    return {
      searchQuery: '',
      selectedRegion: null,
      regions: [
        { id: 'seoul', name: '서울', icon: require('@/assets/regions/seoul.png') },
        { id: 'busan', name: '부산', icon: require('@/assets/regions/busan.png') },
        { id: 'jeju', name: '제주', icon: require('@/assets/regions/jeju.png') },
        { id: 'gangwon', name: '강원', icon: require('@/assets/regions/gangwon.png') },
        { id: 'gyeonggi', name: '경기', icon: require('@/assets/regions/gyeonggi.png') },
        { id: 'gyeongsang', name: '경상', icon: require('@/assets/regions/gyeongsang.png') },
        { id: 'jeonla', name: '전라', icon: require('@/assets/regions/jeonla.png') },
        { id: 'chungcheong', name: '충청', icon: require('@/assets/regions/chungcheong.png') }
      ],
      popularDestinations: [
        {
          id: 1,
          name: '경복궁',
          description: '조선시대 대표적인 궁궐로, 아름다운 전통 건축물을 감상할 수 있는 곳입니다.',
          image: require('@/assets/destinations/gyeongbokgung.jpg'),
          rating: 4.7
        },
        {
          id: 2,
          name: '해운대 해변',
          description: '부산의 대표 해변으로, 아름다운 해안선과 다양한 축제가 열리는 인기 관광지입니다.',
          image: require('@/assets/destinations/haeundae.jpg'),
          rating: 4.8
        },
        {
          id: 3,
          name: '제주 성산일출봉',
          description: '유네스코 세계자연유산으로 등재된 제주의 상징적인 명소입니다.',
          image: require('@/assets/destinations/seongsan.jpg'),
          rating: 4.9
        },
        {
          id: 4,
          name: '남산 서울타워',
          description: '서울의 중심에서 도시 전체를 조망할 수 있는 전망대입니다.',
          image: require('@/assets/destinations/namsan.jpg'),
          rating: 4.6
        }
      ],
      regionDestinations: []
    }
  },
  methods: {
    navigateTo(route) {
      console.log(`Navigating to ${route}`)
      // 실제 라우팅 로직 구현
    },
    login() {
      console.log('Login clicked')
      // 로그인 로직 구현
    },
    signup() {
      console.log('Sign up clicked')
      // 회원가입 로직 구현
    },
    search() {
      console.log(`Searching for: ${this.searchQuery}`)
      // 검색 로직 구현
    },
    selectRegion(regionId) {
      this.selectedRegion = regionId
      this.loadRegionDestinations(regionId)
    },
    getSelectedRegionName() {
      const region = this.regions.find(r => r.id === this.selectedRegion)
      return region ? region.name : ''
    },
    loadRegionDestinations(regionId) {
      // 실제로는 API 호출 또는 다른 방법으로 데이터를 가져옴
      // 여기서는 예시 데이터 사용
      
      // 서울 지역이 선택된 경우의 예시 데이터
      if (regionId === 'seoul') {
        this.regionDestinations = [
          {
            id: 101,
            name: '경복궁',
            description: '조선시대 대표적인 궁궐로, 아름다운 전통 건축물을 감상할 수 있는 곳입니다.',
            image: require('@/assets/destinations/gyeongbokgung.jpg'),
            rating: 4.7
          },
          {
            id: 102,
            name: '남산 서울타워',
            description: '서울의 중심에서 도시 전체를 조망할 수 있는 전망대입니다.',
            image: require('@/assets/destinations/namsan.jpg'),
            rating: 4.6
          },
          {
            id: 103,
            name: '인사동',
            description: '전통 문화의 중심지로, 다양한 전통 상점과 갤러리가 모여있는 곳입니다.',
            image: require('@/assets/destinations/insadong.jpg'),
            rating: 4.5
          },
          {
            id: 104,
            name: '북촌 한옥마을',
            description: '전통 한옥이 밀집해 있는 지역으로, 한국의 전통적인 주거 문화를 체험할 수 있습니다.',
            image: require('@/assets/destinations/bukchon.jpg'),
            rating: 4.4
          }
        ]
      }
      // 다른 지역들에 대한 데이터도 유사하게 구현
    },
    viewDestination(destinationId) {
      console.log(`Viewing destination: ${destinationId}`)
      // 여행지 상세 페이지로 이동하는 로직 구현
    }
  }
}
</script>

<style scoped>
/* MainPage01.vue와 동일한 배경 스타일 */
.main-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Noto Sans KR', sans-serif;
  padding-bottom: 50px;
}

/* 메뉴바 스타일 */
.menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logo {
  height: 40px;
  cursor: pointer;
}

.menu-items {
  display: flex;
  gap: 30px;
}

.menu-item {
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.user-actions {
  display: flex;
  gap: 15px;
}

/* MainPage01.vue와 동일한 버튼 스타일 */
.login-btn, .search-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #4285f4;
  color: white;
}

.login-btn:hover, .search-btn:hover {
  background-color: #3367d6;
  transform: translateY(-2px);
}

.signup-btn {
  padding: 8px 20px;
  border: 1px solid #4285f4;
  border-radius: 5px;
  background-color: white;
  color: #4285f4;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.signup-btn:hover {
  background-color: #f0f7ff;
  transform: translateY(-2px);
}

/* 검색 영역 스타일 */
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  gap: 10px;
}

.search-input {
  width: 500px;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 8px rgba(66, 133, 244, 0.4);
}

/* 지역 아이콘 영역 스타일 */
.region-icons-container {
  padding: 20px 50px;
}

.region-icons-container h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.region-icons {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.region-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.region-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.region-name {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
}

.region-icon:hover .region-img {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.region-icon.active .region-img {
  border: 3px solid #4285f4;
  transform: translateY(-5px);
}

/* 여행지 표시 영역 스타일 */
.destinations-container {
  padding: 30px 50px;
}

.destinations-container h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.destination-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.destination-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.destination-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.destination-info {
  padding: 15px;
}

.destination-info h3 {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.destination-info p {
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.destination-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.destination-rating i {
  color: #ffc107;
}

.destination-rating span {
  font-weight: 500;
}
</style>