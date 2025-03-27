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

        <div v-show="showUpdateSuccess" :class="{ 'fade-out': isFading }"  class="message-box">
            <i class="fa fa-info-circle"></i>
            <p>資料修改成功！</p>
        </div>

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
                    <button 
                        @click="updateUserData" 
                        class="btn btn-fix" 
                        :disabled="!dataUpdated" 
                        :class="{ 'btn-disabled': !dataUpdated, 'btn-active': dataUpdated }">更新內容</button>
                    <button 
                        @click="backToHome" 
                        class="btn btn-back">返回首頁</button>
                </div>

            </div>
        </main>
    </div>

    <ErrorModal
        v-if="isErrorModalVisible"
        :errorMessage="errorMessage"
        :isVisible="isErrorModalVisible"
        @close-error="isErrorModalVisible = false"
    />
</template>

<script>
import ErrorModal from '../components/ErrorModal.vue';
import { parkFlowService } from '../services/parkFlowService'

export default {
    name: 'UserView',
    components: {
        ErrorModal
    },
    mounted() {
        this.initialUserData();
    },
    data() {
        return {
            isDropdownOpen: false,
            isErrorModalVisible: false,
            showUpdateSuccess: false,
            errorMessage: '',
            originalUser:{
                chineseName: '',
                englishName: '',
                email: '',
                cellphone: '',
                carNumber1: '',
                carNumber2: '',
                carType: ''
            },
            userDataModel: {
                chineseName: '',
                englishName: '',
                email: '',
                cellphone: '',
                carNumber1: '',
                carNumber2: '',
                carType: ''
            },
            isFading: false,  // 是否觸發淡出效果
            dataUpdated: false
        }
    },
    watch: {
        userDataModel: {
            deep: true,  // 監聽物件內部的變化
            handler() {
                // 檢查是否有欄位被修改
                this.dataUpdated = JSON.stringify(this.originalUser) !== JSON.stringify(this.userDataModel);
            }
        }
    },
    methods: {
        async initialUserData(){
            let response = await parkFlowService.queryUserInformation();
            if(response.code === "0000") {
                this.originalUser.chineseName = response.data.chineseName;
                this.originalUser.englishName = response.data.englishName;
                this.originalUser.email = response.data.email;
                this.originalUser.cellphone = response.data.cellphone;
                this.originalUser.carNumber1 = response.data.carNumber.split('-')[0],
                this.originalUser.carNumber2 = response.data.carNumber.split('-')[1],
                this.originalUser.carType = response.data.carType;

                this.showUserData();
            }
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
        async showUserData(){
            this.userDataModel.chineseName = this.originalUser.chineseName;
            this.userDataModel.englishName = this.originalUser.englishName;
            this.userDataModel.email = this.originalUser.email;
            this.userDataModel.cellphone = this.originalUser.cellphone;
            this.userDataModel.carNumber1 = this.originalUser.carNumber1,
            this.userDataModel.carNumber2 = this.originalUser.carNumber2,
            this.userDataModel.carType = this.originalUser.carType;
        },
        async updateUserData(){
            const userData = { 
                chineseName: this.userDataModel.chineseName,
                englishName: this.userDataModel.englishName,
                cellphone: this.userDataModel.cellphone,
                carNumber: this.userDataModel.carNumber1 + "-" + this.userDataModel.carNumber2,
                carType: this.userDataModel.carType
            }
            let response = await parkFlowService.updateUserInformation(userData);
            
            if(response.code === "0000"){
                this.initialUserData();
                this.showUserData();
                this.showUpdateSuccessMessage();
            }
            else{
                this.errorMessage = response.message;
                this.isErrorModalVisible = true;
            }
        },
        showUpdateSuccessMessage() {
            this.showUpdateSuccess = true; // 顯示訊息
            this.isFading = false;  // 確保動畫重置

            setTimeout(() => {
                this.isFading = true; // 開始淡出
            }, 2000); // 2 秒後開始淡出

            setTimeout(() => {
                this.showUpdateSuccess = false; // 3秒後隱藏
            }, 3000);
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
        border: 1px solid lightgray;
        background-color: #e8f0fe;
        border-radius: 4px;
        min-width: 50%;
    }
    .input-field#email{
        border: 1px solid white;
        background-color: #ffffff;
        pointer-events: none;
    }

    .car-number-left{
        font-size: 18px;
        border: 1px solid lightgray;
        background-color: #e8f0fe;
        padding: 8px;
        margin-right: 8px;
        width: 3em; 
        border-radius: 4px;
        text-align: left;
    }
    .car-number-right{
        font-size: 18px;
        border: 1px solid lightgray;
        background-color: #e8f0fe;
        padding: 8px;
        width: 3em; 
        border-radius: 4px;
        margin-left: 10px;
        text-align: left;
    }
    .car-number-inputs {
        flex: 3;
        padding: 8px 0;
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

    /* 更新資料的按鈕控制 */
    .btn-disabled {
        background: gray;
        color: white;
        cursor: not-allowed;
    }
    .btn-active {
        background: green;
        color: white;
    }
    .btn-active:hover {
        background-color: #218838;
    }

    .message-box {
        position: fixed;
        top: 20px;
        left: 50%;
        display: flex;
        align-items: center;
        transform: translateX(-50%);
        padding: 5px 20px;
        background-color: rgba(0, 255, 0, 0.5); /* 半透明綠色 */
        color: white;
        border-radius: 5px;
        border: 2px solid green;
        font-size: 16px;
        opacity: 1;
        transition: opacity 1s ease-out; /* 1秒內淡出 */
    }

    .message-box.v-leave-active {
        opacity: 0;
    }

    /* 淡出動畫 */
    .fade-out {
        opacity: 0;
    }

    .message-box i{
        padding-right: 10px;
    }
</style> 