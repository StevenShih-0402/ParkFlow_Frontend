<template>
    <div class="home-container">
        <header class="header">
            <h1><a href=/home>停車場預約系統</a></h1>
            <div class="user-controls">
                <div class="dropdown">
                    <button class="dropdown-btn" @click="toggleDropdown"><i class="fa fa-bars fa-2x"></i></button>
                    <div class="dropdown-menu" v-show="isDropdownOpen">
                        <button @click="goToUserView">個人資料</button>
                        <button @click="handleLogout">登出</button>
                    </div>
                </div>
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
                @error="handleError"
            />

            <UserRequestList
                v-if="userData.role === 'USER'"
                ref="userRequestList"
                :parkingData="parkingData"
                :isDisabled="isDisabled"
                :weekStartDate="getWeekStartDate(this.currentWeekStart)"
                @refresh-data="fetchParkingRequests"
                @error="handleError"
            />

            <ErrorModal
                v-if="isErrorModalVisible"
                :errorMessage="errorMessage"
                :isVisible="isErrorModalVisible"
                @close-error="isErrorModalVisible = false"
            />

        </main>
    </div>
</template>

<script>
import { parkFlowService } from '../services/parkFlowService'
import { jwtDecode } from 'jwt-decode';
import FMRequestList from '../components/FMRequestList.vue';
import UserRequestList from '../components/UserRequestList.vue';
import ErrorModal from '../components/ErrorModal.vue';

export default {
    name: 'HomeView',
    components: {
        FMRequestList,
        UserRequestList,
        ErrorModal
    },
    data() {
        return {
            selectedRequest: '',
            isEditing: false,
            isDisabled: false,
            isDropdownOpen: false,
            modalMode: '',
            isErrorModalVisible: false,
            isUserProfileFormVisible: false,
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
            userDataModel: null,
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

                let response = await parkFlowService.queryUserInformation()

                if(response.code === "0000") {
                    this.userData.userName = response.data.englishName;
                    this.userData.role = decodedToken.roleName;
                } else {
                    this.handleError(response.message);
                }   

                await this.fetchParkingRequests();

            } catch (error) {
                this.handleError(error);
            }
        },
        async fetchParkingRequests() {
            const startDate = this.getWeekStartDate(this.currentWeekStart);
            const data = { 
                startDate: startDate 
            };

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
            this.handleError(error);
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
                this.isDropdownOpen = false;
                this.$router.push('/login');
            } catch (error) {
                this.handleError(error);
            }
        },
        handleError(error) {
            this.errorMessage = error;
            this.isErrorModalVisible = true;
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        async goToUserView(){
            this.$router.push('/user')
            this.isDropdownOpen = false;
        }
    },
    mounted() {
        this.loadInitialData();
    }
}
</script>

<style scoped>

    h1 a{
        color: white;
        text-decoration: none;
    }
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

    .user-profile-btn{
        padding: 0.5rem 1rem;
        background-color: #2c3e50;
        color: white;
        border: none;
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

    .user-controls {
        position: relative;
        display: inline-block;
    }

    .dropdown {
        position: relative;
    }

    /* 下拉選單 */
    .dropdown-btn {
        background-color: #2c3e50;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
    }

    .dropdown-btn:hover {
        background-color: #386088;
        border: none;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0%;
        background: white;
        border: 1px solid #ddd;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        min-width: 200px;
    }

    .dropdown-menu button {
        background: none;
        border: none;
        padding: 15px;
        font-size: 16px;
        text-align: left;
        width: 100%;
        cursor: pointer;
    }

    .dropdown-menu button:hover {
        background: #f5f5f5;
    }
</style> 