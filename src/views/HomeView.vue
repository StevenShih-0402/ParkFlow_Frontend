<template>
  <div class="home-container">
    <header class="header">
      <h1>停車場預約系統</h1>
      <div class="user-controls">
        <span class="user-name">{{ userData.userName }}</span>
        <button class="logout-btn" @click="handleLogout">登出</button>
      </div>
    </header>

    <main class="main-content">
      <div class="week-navigation">
        <button @click="changeWeek(-1)" class="nav-button">上一週</button>
        <span class="current-week">{{ currentWeekRange }}</span>
        <button @click="changeWeek(1)" class="nav-button">下一週</button>
      </div>

      <FMRequestList
        v-if="userData.role === 'FM'"
        ref="fmRequestList"
        :parkingData="parkingData"
        :currentWeekStart="currentWeekStart"
        :modalMode="modalMode"
        :selectedRequest="selectedRequest"
        :weekStartDate="getWeekStartDate(this.currentWeekStart)"
        :isEditing="isEditing"
        @update:selectedRequest="selectedRequest = $event"
        @refresh-data="fetchParkingRequests"
      />

      <UserRequestList
        v-if="userData.role === 'USER'"
        ref="userRequestList"
        :parkingData="parkingData"
        :isDisabled="isDisabled"
        :weekStartDate="getWeekStartDate(this.currentWeekStart)"
        @refresh-data="fetchParkingRequests"
      />
      
    </main>

  </div>
</template>

<script>
import { parkFlowService } from '../services/parkFlowService'
import { jwtDecode } from 'jwt-decode';
import FMRequestList from '../components/FMRequestList.vue';
import UserRequestList from '../components/UserRequestList.vue';

export default {
  name: 'HomeView',
  components: {
    FMRequestList,
    UserRequestList
  },
  data() {
    return {
      selectedRequest: '',
      isEditing: false,
      isDisabled: false,
      modalMode: '',
      errorMessage: '',
      userData: {
        userName: '',
        role: '',
      },
      parkingData: {
        parkingRequestList: [],
        totalSlotsId: null,
        totalSlots: 0,
        remainingQuantity: 0,
      },
      currentWeekStart: new Date(),
    }
  },
  computed: {
    currentWeekRange() {
      const start = new Date(this.currentWeekStart);
      const dayOfWeek = start.getDay();

      // 讓 start 變成當週的星期一
      start.setDate(start.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek));

      // 讓 end 變成當週的星期日
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()} - ${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}`;
    }
  },
  methods: {
    async loadInitialData() {
      try {
        const token = this.getTokenFromCookie();
        const decodedToken = jwtDecode(token);
        this.userData.userName = decodedToken.englishName;
        this.userData.role = decodedToken.roleName;

        await this.fetchParkingRequests();
      } catch (error) {
        this.handleError(error, '初始化數據加載失敗');
      }
    },
    async fetchParkingRequests() {
      const weekStartDate = this.getWeekStartDate(this.currentWeekStart);
      const data = { weekStartDate };

      try {
        let response;
        if (this.userData.role === "FM") {
          response = await parkFlowService.getFMParkingRequests(data);
        } else {
          response = await parkFlowService.getUserParkingRequests(data);
        }
        this.checkJwtTokenError(response.code);
        this.parkingData = response.data;
      } catch (error) {
        this.handleError(error, '獲取停車請求失敗');
      }
    },
    getWeekStartDate(date) {
      const dayOfWeek = date.getDay();
      const sunday = new Date(date);
      sunday.setDate(date.getDate() - dayOfWeek);
      sunday.setHours(0, 0, 0, 0);

      const year = sunday.getFullYear();
      const month = String(sunday.getMonth() + 1).padStart(2, '0');
      const day = String(sunday.getDate()).padStart(2, '0');
      const hours = String(sunday.getHours()).padStart(2, '0');
      const minutes = String(sunday.getMinutes()).padStart(2, '0');
      const seconds = String(sunday.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    },
    changeWeek(direction) {
      this.currentWeekStart = new Date(this.currentWeekStart.getTime() + direction * 7 * 24 * 60 * 60 * 1000);

      this.fetchParkingRequests();

    },
    checkJwtTokenError(code) {
      if (code !== "0000") {
        this.$router.push('/login');
      }
    },
    getTokenFromCookie() {
      return document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    },
    async handleLogout() {
      try {
        await parkFlowService.logout();
        this.$router.push('/login');
      } catch (error) {
        this.handleError(error, '登出失敗');
      }
    },
    handleError(error, defaultMessage) {
      console.error(defaultMessage, error);
      const errorMessage = error.response?.data?.message || defaultMessage;
      alert(errorMessage);
    },
  },
  mounted() {
    this.loadInitialData();
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f4f8;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.week-navigation {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.nav-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin: 0 1rem;
}

.nav-button:hover {
  background-color: #2980b9;
}

.current-week {
  font-weight: bold;
  color: #34495e;
}
</style> 