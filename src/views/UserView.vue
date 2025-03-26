<template>
    <div class="home-container">
        <header class="header">
            <h1><a href=/home>停車場預約系統</a></h1>
            <div class="user-controls">
                <div class="dropdown">
                    <button class="dropdown-btn" @click="toggleDropdown"><i class="fa fa-bars fa-2x"></i></button>
                    <div class="dropdown-menu" v-show="isDropdownOpen">
                        <button @click="backToHome">首頁</button>
                        <button @click="handleLogout">登出</button>
                    </div>
                </div>
            </div>
        </header>

        <main class="main-content">
            <div class="model-content">
                <h2>用戶個人資訊</h2>
                <div class="input-area">
                    <div class="input-group">
                        <label for="chineseName"><strong>中文姓名</strong></label>
                        <input id="chineseName" v-model="userDataModel.chineseName" class="input-field" placeholder="請輸入中文姓名" required/>
                    </div>

                    <div class="input-group">
                        <label for="englishName"><strong>英文姓名</strong></label>
                        <input id="englishName" v-model="userDataModel.englishName" class="input-field" placeholder="請輸入英文姓名" required/>
                    </div>

                    <div class="input-group">
                        <label for="email"><strong>信箱</strong></label>
                        <input id="email" v-model="userDataModel.email" class="input-field" placeholder="請輸入信箱" required/>
                    </div>

                    <div class="input-group">
                        <label for="cellphone"><strong>手機號碼</strong></label>
                        <input id="cellphone" v-model="userDataModel.cellphone" class="input-field" placeholder="請輸入手機號碼" required/>
                    </div>

                    <div class="input-group">
                        <label for="carType"><strong>車型</strong></label>
                        <input id="carType" v-model="userDataModel.carType" class="input-field" placeholder="請輸入車型" required/>
                    </div>

                    <div class="input-group">
                        <label for="carNumber"><strong>車牌</strong></label>
                        <div class="car-number-inputs">
                        <input 
                            type="text" 
                            id="carNumber1"
                            v-model="userDataModel.carNumber1"
                            placeholder="請輸入車牌前碼"
                            maxlength="4"
                            required
                            class="car-number-left"
                        >
                        <span class="separator">-</span>
                        <input 
                            type="text" 
                            id="carNumber2"
                            v-model="userDataModel.carNumber2"
                            placeholder="請輸入車牌後碼"
                            maxlength="4"
                            required
                            class="car-number-right"
                        >
                        </div>
                    </div>
                </div>
                <div class="model-actions">
                    <button @click="fixModel" class="btn btn-fix">儲存內容</button>
                    <button @click="backToHome" class="btn btn-back">返回首頁</button>
                </div>

            </div>
        </main>
    </div>
</template>

<script>
import { parkFlowService } from '../services/parkFlowService'

export default {
    name: 'UserView',
    components: {

    },
    mounted() {
        this.showUserData();
    },
    data() {
        return {
            isDropdownOpen: false,
            isErrorModalVisible: false,
            errorMessage: '',
            userDataModel: {
                chineseName: '',
                englishName: '',
                email: '',
                cellphone: '',
                carNumber1: '',
                carNumber2: '',
                carType: ''
            }
        }
    },
    methods: {
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
        async showUserData(){
            let response = await parkFlowService.queryUserInformation();
            if(response.code === "0000") {
                // this.isUserProfileFormVisible = true;
                this.$router.push('/user')
                this.userDataModel.chineseName = response.data.chineseName;
                this.userDataModel.englishName = response.data.englishName;
                this.userDataModel.email = response.data.email;
                this.userDataModel.cellphone = response.data.cellphone;
                this.userDataModel.carNumber1 = response.data.carNumber.split('-')[0],
                this.userDataModel.carNumber2 = response.data.carNumber.split('-')[1],
                this.userDataModel.carType = response.data.carType;
            }
        },
        backToHome(){
            this.$router.push("/home");
        }
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
        position: relative;
        display: inline-block;
        gap: 1rem;
    }

    .main-content {
        flex: 1;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
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

    /* 用戶資訊區塊 */
    h2{
        text-align: center;
    }
    .model-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 40%;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
    .model-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 10px 0;
    }
    .input-area{
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 80%
    }
    .input-group {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80%;
        margin-bottom: 5px;
        padding: 5px 30px;
        font-size: 18px;
    }
    .input-group label {
        flex: 1;
        text-align: right;
        padding-right: 20px;
    }
    .input-field {
        flex: 3;
        font-size: 18px;
        padding: 8px;
        border: 1px solid white;
        border-radius: 4px;
        min-width: 50%;
    }
    .input-field:hover {
        border: 1px solid lightgray;
    }

    .car-number-left{
        font-size: 18px;
        border: 1px solid white;
        padding: 8px;
        margin-right: 8px;
        width: 3em; 
        border-radius: 4px;
        text-align: left;
    }
    .car-number-left:hover {
        border: 1px solid lightgray;
    }
    .car-number-right{
        font-size: 18px;
        border: 1px solid white;
        padding: 8px;
        width: 3em; 
        border-radius: 4px;
        margin-left: 10px;
        text-align: left;
    }
    .car-number-right:hover {
        border: 1px solid lightgray;
    }
    .car-number-inputs {
        flex: 3;
        padding: 8px;
    }

    .model-actions {
        display: flex;
        justify-content: center;
        margin-top: 15px;
    }
    .btn-back {
        background-color: #dc3545;
        color: white;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        border: none;
        margin-left: 5em;
        font-size: 16px;
        font-weight: bold;
    }
    .btn-fix {
        background-color: #28a745;
        color: white;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        border: none;
        font-size: 16px;
        font-weight: bold;
    }
    .btn-back:hover {
        background-color: #c82333;
    }
    .btn-fix:hover {
        background-color: #218838;
    }
</style> 