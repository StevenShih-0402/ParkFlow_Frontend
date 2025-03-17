<template>
  <div class="register-container">
    <div class="register-box">
      <h2>停車場預約系統</h2>
      <p class="subtitle">註冊新使用者</p>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="chineseName">
            <i class="fas fa-user"></i>
            中文姓名
          </label>
          <input 
            type="text" 
            id="chineseName"
            v-model="chineseName"
            placeholder="請輸入中文姓名"
            required
          >
        </div>

        <div class="form-group">
          <label for="englishName">
            <i class="fas fa-user"></i>
            英文名字
          </label>
          <input 
            type="text" 
            id="englishName"
            v-model="englishName"
            placeholder="請輸入英文名字"
            required
          >
        </div>

        <div class="form-group">
          <label for="email">
            <i class="fas fa-envelope"></i>
            電子信箱
          </label>
          <input 
            type="email" 
            id="email"
            v-model="email"
            placeholder="請輸入電子信箱"
            required
          >
        </div>

        <div class="form-group">
          <label for="mobileNumber">
            <i class="fas fa-phone"></i>
            手機號碼
          </label>
          <input 
            type="mobileNumber" 
            id="mobileNumber"
            v-model="mobileNumber"
            placeholder="請輸入手機號碼"
            maxlength=10
            required
          >
        </div>

        <div class="form-group">
          <label for="carNumber">
            <i class="fas fa-car-side"></i>
            車牌號碼
          </label>
          <div class="car-number-inputs">
            <input 
              type="text" 
              id="carNumber1"
              v-model="carNumber1"
              placeholder="請輸入車牌前碼"
              maxlength="4"
              required
              class="car-number-input"
            >
            <span class="separator">-</span>
            <input 
              type="text" 
              id="carNumber2"
              v-model="carNumber2"
              placeholder="請輸入車牌後碼"
              maxlength="4"
              required
              class="car-number-input"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="carType">
            <i class="fas fa-car"></i>
            車型
          </label>
          <input 
            type="carType" 
            id="carType"
            v-model="carType"
            placeholder="請輸入車型"
            required
          >
        </div>

        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading">
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i>
            註冊中...
          </span>
          <span v-else>註冊</span>
        </button>

        <div class="additional-links">
          <router-link to="/login">返回登入</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { parkFlowService } from '@/services/parkFlowService'

export default {
  name: 'RegisterForm',
  data() {
    return {
      chineseName: '',
      englishName: '',
      email: '',
      mobileNumber: '',
      carNumber1: '',
      carNumber2: '',
      carType: '',
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const payload = {
            chineseName: this.chineseName,
            englishName: this.englishName,
            email: this.email,
            cellphone: this.mobileNumber,
            carNumber: this.carNumber1 + "-" + this.carNumber2,
            carType: this.carType
        }

        const response = await parkFlowService.createUser(payload)
        
        if (response.code != "0000") {
          this.errorMessage = response.message;
        } else if(response.status == "0000") {
          // 註冊成功，導向登入頁
          document.cookie = `token=${response.data}; path=/; max-age=86400; secure; samesite=strict`;
          this.$router.push('/home');
        }
        
      } catch (error) {
        if (error.name === 'TypeError') {
          this.errorMessage = '網路連接錯誤，請檢查網路狀態'
        } else {
          this.errorMessage = error.message || '註冊失敗，請稍後再試'
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
  font-size: 28px;
}

.subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 500;
}

label i {
  margin-right: 8px;
  color: #7f8c8d;
}

input {
  width: 92%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

button {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
}

button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.error-message {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.error-message i {
  margin-right: 8px;
}

.additional-links {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.additional-links a {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
}

.additional-links a:hover {
  color: #2980b9;
}

@media (max-width: 480px) {
  .register-box {
    padding: 20px;
  }
}

.car-number-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.car-number-input {
  width: 45%;
}

.separator {
  color: #34495e;
  font-weight: bold;
}
</style> 