<template>
  <div class="login-container">
    <div class="login-box">
      <h2>停車場預約系統</h2>
      <p class="subtitle">請登入您的電子信箱</p>
      
      <form @submit.prevent="handleSubmit">
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

        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading">
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i>
            登入中...
          </span>
          <span v-else>登入</span>
        </button>

        <div class="additional-links">
          <router-link to="/register">註冊使用者</router-link>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import { parkFlowService } from '@/services/parkFlowService'

export default {
  name: 'LoginForm',
  props: {
    width: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      email: '',
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {

    async handleSubmit() {
      this.isLoading = true
      this.errorMessage = ''
      
      const payload = {
        email: this.email
      }
        
      const response = await parkFlowService.generallyLogin(payload);

      console.log(response)

      if (response.code == "0001") {
        this.$router.push('/RegisterForm')
      } else if (response.code != "0000") {
        this.errorMessage  = response.message;
      } else {
        // 登入成功處理可以更完整
        document.cookie = `token=${response.data}; path=/; max-age=86400; secure; samesite=strict`;
        // 轉跳到首頁
        console.log("登入成功");
        this.$router.push('/home');
      }

      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.login-box {
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
  display: flex;
  justify-content: space-between;
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
  .login-box {
    padding: 20px;
  }
}
</style> 