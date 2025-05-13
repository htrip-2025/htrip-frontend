```vue
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
    
    <!-- 헤더 -->
    <header class="header">
      <div class="logo">
        <span class="logo-icon">T</span>ravel
      </div>
      <div class="menu-items">
        <router-link to="/" class="menu-link">Home</router-link>
        <router-link to="/trip-info" class="menu-link active">Trip Info</router-link>
        <a href="#" class="menu-link">Reviews</a>
        <a href="#" class="menu-link contact-btn">Contact Us</a>
      </div>
    </header>

    <!-- 검색 섹션 -->
    <section class="search-section">
      <div class="search-content">
        <h1 class="search-title">Discover Your <span class="highlight">Dream Destination</span></h1>
        <p class="search-subtitle">Search for destinations and find detailed information about attractions, accommodations, and local experiences.</p>
        
        <div class="search-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" v-model="searchQuery" placeholder="Search for destinations (e.g. Bali, Tokyo, Paris)" class="search-input" @keyup.enter="searchDestination">
            <button class="search-button" @click="searchDestination">Search</button>
          </div>
          
          <div class="filter-options">
            <div class="filter-pill" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">All</div>
            <div class="filter-pill" :class="{ active: activeFilter === 'attractions' }" @click="setFilter('attractions')">Attractions</div>
            <div class="filter-pill" :class="{ active: activeFilter === 'hotels' }" @click="setFilter('hotels')">Hotels</div>
            <div class="filter-pill" :class="{ active: activeFilter === 'foods' }" @click="setFilter('foods')">Local Food</div>
            <div class="filter-pill" :class="{ active: activeFilter === 'activities' }" @click="setFilter('activities')">Activities</div>
          </div>
        </div>
      </div>
      
      <div class="featured-destinations">
        <h2 class="section-subtitle">POPULAR SEARCHES</h2>
        <div class="featured-grid">
          <div class="featured-item" @click="selectFeatured('Bali, Indonesia')">
            <div class="featured-image">
              <img src="https://i.pinimg.com/736x/61/7c/5f/617c5fdb6822357b548cf2ff25c17291.jpg" alt="Bali">
              <div class="featured-overlay">
                <h3>Bali, Indonesia</h3>
              </div>
            </div>
          </div>
          
          <div class="featured-item" @click="selectFeatured('Kyoto, Japan')">
            <div class="featured-image">
              <img src="https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg" alt="Kyoto">
              <div class="featured-overlay">
                <h3>Kyoto, Japan</h3>
              </div>
            </div>
          </div>
          
          <div class="featured-item" @click="selectFeatured('Santorini, Greece')">
            <div class="featured-image">
              <img src="https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg" alt="Santorini">
              <div class="featured-overlay">
                <h3>Santorini, Greece</h3>
              </div>
            </div>
          </div>
          
          <div class="featured-item" @click="selectFeatured('Seoul, Korea')">
            <div class="featured-image">
              <img src="https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg" alt="Seoul">
              <div class="featured-overlay">
                <h3>Seoul, Korea</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 검색 결과 섹션 -->
    <section class="results-section" v-if="searchResults.length > 0 || isSearched">
      <div class="results-header">
        <h2 class="results-title" v-if="searchResults.length > 0">Discover <span class="highlight">{{ currentDestination }}</span></h2>
        <h2 class="results-title" v-else>No results found for "{{ currentDestination }}"</h2>
        <p class="results-subtitle" v-if="searchResults.length > 0">We found {{ searchResults.length }} places for you to explore.</p>
      </div>
      
      <div class="results-tabs" v-if="searchResults.length > 0">
        <div class="tab" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">Overview</div>
        <div class="tab" :class="{ active: activeTab === 'attractions' }" @click="activeTab = 'attractions'">Attractions</div>
        <div class="tab" :class="{ active: activeTab === 'hotels' }" @click="activeTab = 'hotels'">Hotels</div>
        <div class="tab" :class="{ active: activeTab === 'food' }" @click="activeTab = 'food'">Local Food</div>
        <div class="tab" :class="{ active: activeTab === 'tips' }" @click="activeTab = 'tips'">Travel Tips</div>
      </div>
      
      <!-- 검색 결과 컨텐츠 -->
      <div class="results-content" v-if="searchResults.length > 0">
        <!-- 지도 및 개요 섹션 - Overview 탭 -->
        <div class="overview-section" v-if="activeTab === 'overview'">
          <div class="destination-info">
            <div class="info-card">
              <div class="info-icon">🗓️</div>
              <h4>Best Time to Visit</h4>
              <p>April to October</p>
            </div>
            
            <div class="info-card">
              <div class="info-icon">💵</div>
              <h4>Local Currency</h4>
              <p>Indonesian Rupiah (IDR)</p>
            </div>
            
            <div class="info-card">
              <div class="info-icon">🔌</div>
              <h4>Power Socket</h4>
              <p>Type C & F, 230V</p>
            </div>
            
            <div class="info-card">
              <div class="info-icon">🗣️</div>
              <h4>Language</h4>
              <p>Indonesian, Balinese</p>
            </div>
          </div>
          
          <div class="destination-map">
            <img src="https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg" alt="Destination Map" class="map-image">
            <div class="map-overlay">
              <span class="map-pin">📍</span>
            </div>
          </div>
          
          <div class="destination-description">
            <h3>About {{ currentDestination }}</h3>
            <p>Bali is a Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple. To the south, the beachside city of Kuta has lively bars, while Seminyak, Sanur and Nusa Dua are popular resort towns. The island is also known for its yoga and meditation retreats.</p>
            <p>Bali's rich cultural heritage is visible in its traditional dances, elaborate temple ceremonies, and delicious cuisine. The island's natural beauty ranges from stunning beaches perfect for surfing to lush terraced rice fields that offer incredible hiking experiences.</p>
          </div>
          
          <div class="weather-forecast">
            <h3>Weather Forecast</h3>
            <div class="forecast-days">
              <div class="forecast-day">
                <div class="day-name">Today</div>
                <div class="weather-icon">☀️</div>
                <div class="temperature">31°C</div>
              </div>
              
              <div class="forecast-day">
                <div class="day-name">Tue</div>
                <div class="weather-icon">⛅</div>
                <div class="temperature">29°C</div>
              </div>
              
              <div class="forecast-day">
                <div class="day-name">Wed</div>
                <div class="weather-icon">🌦️</div>
                <div class="temperature">28°C</div>
              </div>
              
              <div class="forecast-day">
                <div class="day-name">Thu</div>
                <div class="weather-icon">🌧️</div>
                <div class="temperature">27°C</div>
              </div>
              
              <div class="forecast-day">
                <div class="day-name">Fri</div>
                <div class="weather-icon">⛅</div>
                <div class="temperature">30°C</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 명소 탭 -->
        <div class="attractions-section" v-if="activeTab === 'attractions'">
          <div class="attractions-grid">
            <div class="attraction-card" v-for="(attraction, index) in filteredAttractions" :key="index">
              <div class="attraction-image">
                <img :src="attraction.image" :alt="attraction.name">
              </div>
              <div class="attraction-info">
                <h3>{{ attraction.name }}</h3>
                <div class="attraction-rating">
                  <span class="stars">★★★★★</span>
                  <span class="rating-number">{{ attraction.rating }}</span>
                </div>
                <p class="attraction-description">{{ attraction.description }}</p>
                <div class="attraction-details">
                  <span class="detail"><i class="detail-icon">⏱️</i> {{ attraction.duration }}</span>
                  <span class="detail"><i class="detail-icon">💵</i> {{ attraction.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 호텔 탭 -->
        <div class="hotels-section" v-if="activeTab === 'hotels'">
          <div class="filter-row">
            <div class="filter-group">
              <label>Price Range:</label>
              <select v-model="priceFilter" class="filter-select">
                <option value="all">All Prices</option>
                <option value="budget">Budget (Under $50)</option>
                <option value="mid">Mid-range ($50-$150)</option>
                <option value="luxury">Luxury ($150+)</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Facilities:</label>
              <select v-model="facilityFilter" class="filter-select">
                <option value="all">All Facilities</option>
                <option value="pool">Swimming Pool</option>
                <option value="spa">Spa</option>
                <option value="beach">Beach Access</option>
              </select>
            </div>
          </div>
          
          <div class="hotels-grid">
            <div class="hotel-card" v-for="(hotel, index) in filteredHotels" :key="index">
              <div class="hotel-images">
                <img :src="hotel.image" :alt="hotel.name" class="hotel-main-image">
                <div class="hotel-small-images">
                  <img :src="hotel.roomImage" alt="Room" class="hotel-small-image">
                  <img :src="hotel.amenityImage" alt="Amenity" class="hotel-small-image">
                </div>
              </div>
              
              <div class="hotel-info">
                <div class="hotel-header">
                  <h3>{{ hotel.name }}</h3>
                  <div class="hotel-rating">
                    <span class="stars">★★★★★</span>
                    <span class="rating-number">{{ hotel.rating }}</span>
                  </div>
                </div>
                
                <div class="hotel-location">
                  <i class="location-icon">📍</i> {{ hotel.location }}
                </div>
                
                <div class="hotel-amenities">
                  <span class="amenity" v-for="(amenity, i) in hotel.amenities" :key="i">{{ amenity }}</span>
                </div>
                
                <div class="hotel-bottom">
                  <div class="hotel-price">
                    <span class="price-amount">{{ hotel.price }}</span>
                    <span class="price-night">/ night</span>
                  </div>
                  
                  <button class="view-hotel-btn">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 음식 탭 -->
        <div class="food-section" v-if="activeTab === 'food'">
          <div class="food-categories">
            <div class="category-pill" :class="{ active: foodCategory === 'all' }" @click="foodCategory = 'all'">All</div>
            <div class="category-pill" :class="{ active: foodCategory === 'traditional' }" @click="foodCategory = 'traditional'">Traditional</div>
            <div class="category-pill" :class="{ active: foodCategory === 'seafood' }" @click="foodCategory = 'seafood'">Seafood</div>
            <div class="category-pill" :class="{ active: foodCategory === 'vegetarian' }" @click="foodCategory = 'vegetarian'">Vegetarian</div>
            <div class="category-pill" :class="{ active: foodCategory === 'desserts' }" @click="foodCategory = 'desserts'">Desserts</div>
          </div>
          
          <div class="local-dishes">
            <div class="dish-card" v-for="(dish, index) in filteredDishes" :key="index">
              <div class="dish-image">
                <img :src="dish.image" :alt="dish.name">
              </div>
              <div class="dish-info">
                <h3>{{ dish.name }}</h3>
                <p class="dish-description">{{ dish.description }}</p>
                <div class="dish-places">
                  <h4>Where to try:</h4>
                  <ul class="places-list">
                    <li v-for="(place, i) in dish.whereToTry" :key="i">
                      {{ place.name }} <span class="place-location">{{ place.location }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 여행 팁 탭 -->
        <div class="tips-section" v-if="activeTab === 'tips'">
          <div class="tips-container">
            <div class="tips-category">
              <h3><span class="tips-icon">✈️</span> Transportation Tips</h3>
              <ul class="tips-list">
                <li>Rent a scooter for flexibility, but be cautious as traffic can be chaotic.</li>
                <li>Use Gojek or Grab apps for reliable taxi services.</li>
                <li>For longer distances, consider hiring a private driver for the day.</li>
                <li>Book transfers from the airport in advance to avoid inflated prices.</li>
              </ul>
            </div>
            
            <div class="tips-category">
              <h3><span class="tips-icon">🏠</span> Accommodation Tips</h3>
              <ul class="tips-list">
                <li>Book accommodations in advance during high season (July-August).</li>
                <li>Consider staying in Ubud for culture, Seminyak for dining, or Kuta for nightlife.</li>
                <li>Many villas offer better value than hotels for groups or families.</li>
                <li>Check if your accommodation offers airport pickup services.</li>
              </ul>
            </div>
            
            <div class="tips-category">
              <h3><span class="tips-icon">💰</span> Money Tips</h3>
              <ul class="tips-list">
                <li>Always carry cash as many places don't accept cards, especially in rural areas.</li>
                <li>Use ATMs attached to banks for better security.</li>
                <li>Expect to bargain in markets, but do so respectfully.</li>
                <li>Tipping is not mandatory but appreciated for good service (10% is standard).</li>
              </ul>
            </div>
            
            <div class="tips-category">
              <h3><span class="tips-icon">🌡️</span> Weather & Packing Tips</h3>
              <ul class="tips-list">
                <li>Pack light, breathable clothing as humidity is high year-round.</li>
                <li>Bring a light rain jacket during the rainy season (November-March).</li>
                <li>Always carry sunscreen, insect repellent, and a reusable water bottle.</li>
                <li>Modest clothing is required when visiting temples (covered shoulders and knees).</li>
              </ul>
            </div>
            
            <div class="tips-category">
              <h3><span class="tips-icon">🚨</span> Safety Tips</h3>
              <ul class="tips-list">
                <li>Purchase travel insurance that covers scooter accidents.</li>
                <li>Be cautious of wild and stray animals, especially monkeys.</li>
                <li>Respect the ocean - pay attention to red flags on beaches.</li>
                <li>Keep valuables secure and be wary of bag snatching in busy areas.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 추천 여행 계획 섹션 -->
    <section class="suggested-plans" v-if="!isSearched || searchResults.length === 0">
      <div class="section-header">
        <div>
          <h2 class="section-title">TRAVEL INSPIRATIONS</h2>
          <h3 class="suggested-title">Popular Travel Plans</h3>
        </div>
      </div>
      
      <div class="plans-grid">
        <div class="plan-card">
          <div class="plan-image">
            <img src="https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg" alt="Swiss Alps">
          </div>
          <div class="plan-content">
            <div class="plan-badge">MOST POPULAR</div>
            <h3>7 Days in Swiss Alps</h3>
            <p class="plan-description">Experience the breathtaking landscapes of Switzerland with this curated 7-day itinerary through the Swiss Alps.</p>
            <div class="plan-details">
              <div class="detail-item">
                <span class="detail-icon">🏨</span>
                <span>6 nights</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🚶‍♂️</span>
                <span>12 activities</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🍽️</span>
                <span>15 meals</span>
              </div>
            </div>
            <button class="view-plan-btn">View Itinerary</button>
          </div>
        </div>
        
        <div class="plan-card">
          <div class="plan-image">
            <img src="https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg" alt="Coastal Italy">
          </div>
          <div class="plan-content">
            <div class="plan-badge">FAMILY FRIENDLY</div>
            <h3>10 Days Italian Coast</h3>
            <p class="plan-description">Journey along the beautiful coastline of Italy, exploring charming villages and enjoying Mediterranean cuisine.</p>
            <div class="plan-details">
              <div class="detail-item">
                <span class="detail-icon">🏨</span>
                <span>9 nights</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🚶‍♂️</span>
                <span>14 activities</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🍽️</span>
                <span>18 meals</span>
              </div>
            </div>
            <button class="view-plan-btn">View Itinerary</button>
          </div>
        </div>
        
        <div class="plan-card">
          <div class="plan-image">
            <img src="https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg" alt="Seoul City">
          </div>
          <div class="plan-content">
            <div class="plan-badge">TRENDING</div>
            <h3>5 Days in Seoul</h3>
            <p class="plan-description">Explore the vibrant city of Seoul with this perfect mix of traditional culture and modern attractions.</p>
            <div class="plan-details">
              <div class="detail-item">
                <span class="detail-icon">🏨</span>
                <span>4 nights</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🚶‍♂️</span>
                <span>10 activities</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🍽️</span>
                <span>8 meals</span>
              </div>
            </div>
            <button class="view-plan-btn">View Itinerary</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-logo">
          <span class="logo-icon">T</span>ravel
          <p class="footer-slogan">Your journey begins with us</p>
        </div>
        
        <div class="footer-links">
          <div class="footer-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Blog</a>
          </div>
          
          <div class="footer-column">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          
          <div class="footer-column">
            <h4>Stay Connected</h4>
            <div class="social-icons">
              <a href="#" class="social-icon">📱</a>
              <a href="#" class="social-icon">📷</a>
              <a href="#" class="social-icon">📘</a>
              <a href="#" class="social-icon">🐦</a>
            </div>
            <p>Subscribe to our newsletter</p>
            <div class="newsletter-signup">
              <input type="email" placeholder="Your email address" class="newsletter-input">
              <button class="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2025 Travel | Your AI-Powered Travel Companion</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 검색 관련 상태
const searchQuery = ref('');
const currentDestination = ref('Bali, Indonesia');
const isSearched = ref(false);
const activeFilter = ref('all');
const activeTab = ref('overview');
const foodCategory = ref('all');
const priceFilter = ref('all');
const facilityFilter = ref('all');

// 샘플 검색 결과 데이터
const searchResults = ref([
  { type: 'attraction', name: 'Tegallalang Rice Terraces', rating: 4.7, image: 'https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg', description: 'Beautiful rice terraces offering spectacular views and a glimpse into Bali\'s agricultural heritage.', duration: '2-3 hours', price: '$5 entrance' },
  { type: 'attraction', name: 'Uluwatu Temple', rating: 4.8, image: 'https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg', description: 'Ancient sea temple perched on a steep cliff with stunning sunset views and traditional Kecak dance performances.', duration: '3-4 hours', price: '$10 entrance' },
  { type: 'attraction', name: 'Sacred Monkey Forest', rating: 4.5, image: 'https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg', description: 'Natural sanctuary home to over 700 monkeys and ancient temples within a lush jungle setting.', duration: '1-2 hours', price: '$8 entrance' },
  { type: 'hotel', name: 'Four Seasons Resort Bali', rating: 4.9, image: 'https://i.pinimg.com/736x/16/8a/e2/168ae26e5c9d8c3edc22a687bc7cab56.jpg', roomImage: 'https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg', amenityImage: 'https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg', price: '$550', location: 'Sayan, Ubud', amenities: ['Pool', 'Spa', 'Restaurant', 'Free WiFi'], category: 'luxury' },
  { type: 'hotel', name: 'The Udaya Resort', rating: 4.7, image: 'https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg', roomImage: 'https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg', amenityImage: 'https://i.pinimg.com/736x/7d/43/ff/7d43ff51a9f3ecedda6f12a43abdb5d8.jpg', price: '$120', location: 'Ubud Center', amenities: ['Pool', 'Spa', 'Breakfast', 'Free WiFi'], category: 'mid' },
  { type: 'hotel', name: 'Bali Bohemia', rating: 4.2, image: 'https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg', roomImage: 'https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg', amenityImage: 'https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg', price: '$45', location: 'Ubud Outskirts', amenities: ['Breakfast', 'Free WiFi', 'Yoga'], category: 'budget' },
  { type: 'food', name: 'Babi Guling', image: 'https://i.pinimg.com/736x/e4/1c/12/e41c125a6efb4777d8e93c74eb870ed5.jpg', description: 'Balinese suckling pig roasted with a traditional spice paste. A must-try local delicacy.', category: 'traditional', whereToTry: [{ name: 'Warung Ibu Oka', location: 'Ubud' }, { name: 'Warung Babi Guling Pak Malen', location: 'Seminyak' }] },
  { type: 'food', name: 'Nasi Campur', image: 'https://i.pinimg.com/736x/76/46/99/764699652914504ce8abfc463c5fa760.jpg', description: 'Mixed rice dish with various small portions of vegetables, meat, and spicy sambal. A complete meal on one plate.', category: 'traditional', whereToTry: [{ name: 'Warung Nasi Campur', location: 'Ubud' }, { name: 'Warung Wardani', location: 'Denpasar' }] },
  { type: 'food', name: 'Jimbaran Seafood', image: 'https://i.pinimg.com/736x/dc/7a/35/dc7a35cd27dde9c34efc6844c6a80e26.jpg', description: 'Fresh seafood grilled over coconut husks on the beach. Known for its unique smoky flavor.', category: 'seafood', whereToTry: [{ name: 'Menega Cafe', location: 'Jimbaran Bay' }, { name: 'Lia Cafe', location: 'Jimbaran Bay' }] },
  { type: 'food', name: 'Gado-Gado', image: 'https://i.pinimg.com/736x/4a/34/d8/4a34d822347942c4ff07e8417426daf6.jpg', description: 'Indonesian salad of slightly boiled vegetables, eggs, and peanut sauce. Perfect for vegetarians.', category: 'vegetarian', whereToTry: [{ name: 'Santika Premiere', location: 'Kuta' }] },
  { type: 'food', name: 'Klepon', image: 'https://i.pinimg.com/736x/59/57/a1/5957a1fb6b4f091d0ddde2cf2200d030.jpg', description: 'Sweet rice cake balls filled with palm sugar and coated in grated coconut. A perfect sweet treat.', category: 'desserts', whereToTry: [{ name: 'Pasar Traditional', location: 'Ubud' }, { name: 'Bali Street Market', location: 'Seminyak' }] },
]);

// 필터링된 결과
const filteredAttractions = computed(() => {
  return searchResults.value.filter(item => item.type === 'attraction');
});

const filteredHotels = computed(() => {
  let hotels = searchResults.value.filter(item => item.type === 'hotel');
  
  if (priceFilter.value !== 'all') {
    hotels = hotels.filter(hotel => hotel.category === priceFilter.value);
  }
  
  if (facilityFilter.value !== 'all') {
    const facilityMap = {
      'pool': 'Pool',
      'spa': 'Spa',
      'beach': 'Beach Access'
    };
    
    hotels = hotels.filter(hotel => 
      hotel.amenities.includes(facilityMap[facilityFilter.value])
    );
  }
  
  return hotels;
});

const filteredDishes = computed(() => {
  let dishes = searchResults.value.filter(item => item.type === 'food');
  
  if (foodCategory.value !== 'all') {
    dishes = dishes.filter(dish => dish.category === foodCategory.value);
  }
  
  return dishes;
});

// 검색 함수
const searchDestination = () => {
  if (searchQuery.value.trim() === '') return;
  
  currentDestination.value = searchQuery.value;
  isSearched.value = true;
  activeTab.value = 'overview';
  
  // 실제 API 호출 대신 샘플 데이터 사용
  // 여기서는 검색어가 'Bali'를 포함하는 경우에만 결과를 표시
  if (searchQuery.value.toLowerCase().includes('bali')) {
    // 이미 샘플 데이터가 있으므로 그대로 유지
  } else {
    // 결과 없음
    searchResults.value = [];
  }
  
  // 페이지 상단으로 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 필터 설정 함수
const setFilter = (filter) => {
  activeFilter.value = filter;
};

// 추천 목적지 선택 함수
const selectFeatured = (destination) => {
  searchQuery.value = destination;
  searchDestination();
};

onMounted(() => {
  // URL 파라미터에서 검색어 가져오기
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  
  if (query) {
    searchQuery.value = query;
    searchDestination();
  }
});
</script>

<style scoped>
/* 기본 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/* 전체 컨테이너 */
.travel-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

/* 그라데이션 원형(타원형) 스타일 */
.gradient-circle {
  position: absolute;
  border-radius: 65% 35% 60% 40% / 60% 40% 60% 40%;
  z-index: 0;
  transform: skew(-5deg, -10deg);
}

/* 개별 그라데이션 타원형 위치 및 스타일 */
.circle1 {
  top: -10%;
  left: -5%;
  width: 45vw;
  height: 35vw;
  background: radial-gradient(ellipse, rgba(204, 228, 255, 0.9) 0%, rgba(204, 228, 255, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-15deg);
}

.circle2 {
  bottom: -15%;
  right: -10%;
  width: 50vw;
  height: 38vw;
  background: radial-gradient(ellipse, rgba(255, 219, 240, 0.9) 0%, rgba(255, 219, 240, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(10deg);
}

.circle3 {
  top: 20%;
  right: 10%;
  width: 35vw;
  height: 25vw;
  background: radial-gradient(ellipse, rgba(225, 204, 255, 0.85) 0%, rgba(225, 204, 255, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-8deg);
}

.circle4 {
  bottom: 30%;
  left: 5%;
  width: 28vw;
  height: 22vw;
  background: radial-gradient(ellipse, rgba(204, 240, 255, 0.9) 0%, rgba(204, 240, 255, 0.5) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(12deg);
}

/* 추가된 타원형들 */
.circle5 {
  top: 45%;
  left: 30%;
  width: 40vw;
  height: 28vw;
  background: radial-gradient(ellipse, rgba(210, 200, 255, 0.85) 0%, rgba(210, 200, 255, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-5deg);
}

.circle6 {
  bottom: 50%;
  right: 30%;
  width: 45vw;
  height: 32vw;
  background: radial-gradient(ellipse, rgba(195, 195, 245, 0.8) 0%, rgba(195, 195, 245, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(15deg);
}

.circle7 {
  bottom: 10%;
  left: 40%;
  width: 42vw;
  height: 30vw;
  background: radial-gradient(ellipse, rgba(180, 210, 240, 0.85) 0%, rgba(180, 210, 240, 0.4) 40%, rgba(255, 255, 255, 0) 70%);
  transform: rotate(-12deg);
}

/* 헤더 스타일 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.logo-icon {
  color: #ff8c00;
  background-color: #ffefd5;
  padding: 2px 8px;
  border-radius: 50%;
  margin-right: 2px;
}

.menu-items {
  display: flex;
  gap: 2rem;
}

.menu-link {
  text-decoration: none;
  color: #666;
  font-size: 1rem;
  transition: color 0.3s;
}

.menu-link.active {
  color: #ff8c00;
  font-weight: 600;
}

.contact-btn {
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

/* 검색 섹션 */
.search-section {
  position: relative;
  z-index: 1;
  margin-bottom: 4rem;
}

.search-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.search-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
}

.highlight {
  color: #ff8c00;
}

.search-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.search-container {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
}

.search-icon {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.8rem 0;
  font-size: 1rem;
}

.search-button {
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.search-button:hover {
  background-color: #e67e00;
  transform: translateY(-2px);
}

.filter-options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-pill {
  background-color: #f5f5f5;
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-pill:hover, .filter-pill.active {
  background-color: #ff8c00;
  color: white;
}

/* 추천 목적지 */
.featured-destinations {
  padding: 2rem 0;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #ff8c00;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.featured-item {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.3s;
}

.featured-item:hover {
  transform: translateY(-5px);
}

.featured-image {
  position: relative;
  height: 200px;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  -webkit-mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
  mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
}

.featured-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 1.5rem 1rem 1rem;
  color: white;
}

.featured-overlay h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

/* 검색 결과 섹션 */
.results-section {
  position: relative;
  z-index: 1;
  margin-bottom: 4rem;
}

.results-header {
  text-align: center;
  margin-bottom: 2rem;
}

.results-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
}

.results-subtitle {
  color: #666;
  font-size: 1rem;
}

.results-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab {
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #f5f5f5;
}

.tab:hover, .tab.active {
  background-color: #ff8c00;
  color: white;
}

/* 개요 탭 스타일 */
.overview-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.destination-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.info-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.info-card h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.info-card p {
  color: #666;
  font-size: 0.9rem;
}

.destination-map {
  grid-column: span 2;
  position: relative;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  -webkit-mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
  mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
}

.map-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.map-pin {
  font-size: 3rem;
  color: #ff8c00;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3));
}

.destination-description {
  grid-column: span 2;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.destination-description h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.destination-description p {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.weather-forecast {
  grid-column: span 2;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.weather-forecast h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.forecast-days {
  display: flex;
  justify-content: space-between;
}

.forecast-day {
  text-align: center;
  flex: 1;
}

.day-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.weather-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.temperature {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff8c00;
}

/* 명소 탭 스타일 */
.attractions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.attraction-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.attraction-image {
  height: 200px;
  overflow: hidden;
}

.attraction-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  -webkit-mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
  mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
}

.attraction-card:hover .attraction-image img {
  transform: scale(1.05);
}

.attraction-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.attraction-info h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.attraction-rating {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.stars {
  color: #ffc107;
  margin-right: 0.5rem;
}

.rating-number {
  color: #555;
}

.attraction-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  flex: 1;
}

.attraction-details {
  display: flex;
  justify-content: space-between;
}

.detail {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #555;
}

.detail-icon {
  margin-right: 0.5rem;
}

/* 호텔 탭 스타일 */
.filter-row {
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.filter-group label {
  font-size: 0.9rem;
  color: #555;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  font-size: 0.9rem;
}

.hotels-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

.hotel-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
}

.hotel-images {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hotel-main-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  -webkit-mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
  mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
}

.hotel-small-images {
  display: flex;
  height: 100px;
}

.hotel-small-image {
  flex: 1;
  object-fit: cover;
  -webkit-mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
  mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
}

.hotel-info {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.hotel-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.hotel-header h3 {
  font-size: 1.5rem;
  color: #333;
}

.hotel-rating {
  display: flex;
  align-items: center;
}

.hotel-location {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #666;
}

.location-icon {
  margin-right: 0.5rem;
}

.hotel-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  flex: 1;
}

.amenity {
  background-color: #f5f5f5;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-size: 0.85rem;
  color: #555;
}

.hotel-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hotel-price {
  display: flex;
  align-items: baseline;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ff8c00;
}

.price-night {
  font-size: 0.9rem;
  color: #666;
  margin-left: 0.5rem;
}

.view-hotel-btn {
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.view-hotel-btn:hover {
  background-color: #e67e00;
  transform: translateY(-2px);
}

/* 음식 탭 스타일 */
.food-categories {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-pill {
  background-color: #f5f5f5;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.category-pill:hover, .category-pill.active {
  background-color: #ff8c00;
  color: white;
}

.local-dishes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.dish-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.dish-image {
  height: 200px;
  overflow: hidden;
}

.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  -webkit-mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
  mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
}

.dish-info {
  padding: 1.5rem;
}

.dish-info h3 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #333;
}

.dish-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.dish-places {
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.dish-places h4 {
  font-size: 1rem;
  margin-bottom: 0.8rem;
  color: #333;
}

.places-list {
  list-style: none;
}

.places-list li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.place-location {
  color: #888;
  font-size: 0.85rem;
  margin-left: 0.5rem;
}

/* 여행 팁 탭 스타일 */
.tips-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.tips-category {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.tips-category h3 {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.tips-icon {
  margin-right: 0.8rem;
  font-size: 1.5rem;
}

.tips-list {
  list-style: none;
}

.tips-list li {
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
  position: relative;
  color: #555;
  line-height: 1.5;
}

.tips-list li:before {
  content: "•";
  color: #ff8c00;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* 추천 여행 계획 섹션 */
.suggested-plans {
  margin-bottom: 5rem;
  position: relative;
  z-index: 1;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.9rem;
  color: #ff8c00;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.suggested-title {
  font-size: 1.8rem;
  color: #333;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.plan-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.plan-card:hover {
  transform: translateY(-5px);
}

.plan-image {
  height: 200px;
  overflow: hidden;
}

.plan-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  -webkit-mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
  mask-image: radial-gradient(ellipse 85% 85% at center, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 85%, transparent 90%);
}

.plan-card:hover .plan-image img {
  transform: scale(1.05);
}

.plan-content {
  padding: 1.5rem;
  position: relative;
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff8c00;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
}

.plan-content h3 {
  font-size: 1.3rem;
  margin: 1rem 0 0.8rem;
  color: #333;
  text-align: center;
}

.plan-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  text-align: center;
}

.plan-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-icon {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.view-plan-btn {
  display: block;
  width: 100%;
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.8rem 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.view-plan-btn:hover {
  background-color: #e67e00;
}

/* 푸터 */
.site-footer {
  background-color: #f8f9fa;
  padding: 4rem 0 2rem;
  position: relative;
  z-index: 1;
  border-top: 1px solid #eee;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  padding: 0 2rem;
}

.footer-logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.footer-slogan {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

.footer-links {
  display: flex;
  gap: 4rem;
}

.footer-column h4 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.footer-column a {
  display: block;
  color: #666;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #ff8c00;
}

.social-icons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #f0f0f0;
  border-radius: 50%;
  font-size: 1.2rem;
  color: #666;
  transition: all 0.3s;
}

.social-icon:hover {
  background-color: #ff8c00;
  color: white;
}

.newsletter-signup {
  display: flex;
  margin-top: 0.8rem;
}

.newsletter-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  padding: 0.6rem 1rem;
  outline: none;
}

.newsletter-btn {
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  padding: 0 1.2rem;
  cursor: pointer;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  color: #888;
  font-size: 0.9rem;
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .featured-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .attractions-grid,
  .local-dishes,
  .tips-container {
    grid-template-columns: 1fr;
  }
  
  .plans-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .menu-items {
    width: 100%;
    justify-content: space-between;
    gap: 0.5rem;
  }
  
  .menu-link {
    font-size: 0.9rem;
    padding: 0.3rem 0.5rem;
  }
  
  .search-title {
    font-size: 2rem;
  }
  
  .featured-grid,
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .overview-section {
    grid-template-columns: 1fr;
  }
  
  .destination-info {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .hotel-card {
    flex-direction: column;
  }
  
  .hotel-images {
    width: 100%;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }
  
  .destination-description,
  .weather-forecast,
  .destination-map {
    grid-column: span 1;
  }
}
</style>
```