<template>
  <div class="request-list">
    <div>
      <h2>用戶 停車請求列表</h2>
      <button :disabled="!isDisabled" @click="applyParking" class="btn btn-applyParking">
        <i class="fas fa-plus"></i>
      </button>
    </div>
    <table class="request-table">
      <thead>
        <tr>
          <th>申請時間</th>
          <th>中文姓名</th>
          <th>車型</th>
          <th>車牌號碼</th>
          <th>手機號碼</th>
          <th>車位號碼</th>
          <th>申請狀態</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in parkingData.parkingRequestList" :key="request.requestTime">
          <td>{{ formatDate(request.requestTime) }}</td>
          <td>{{ request.chineseName }}</td>
          <td>{{ request.carType }}</td>
          <td>{{ request.carNumber }}</td>
          <td>{{ request.cellphone }}</td>
          <td>{{ request.parkingSlotNumber }}</td>
          <td>
            <i :class="getStatusIcon(request.status)" class="status-icon"></i>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 剩餘車位資訊 -->
    <div class="parking-summary">
      <p>剩餘車位: {{ parkingData.remainingQuantity }}</p>
    </div>
  </div>

  <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>停車位申請</h2>
        <div class="input-group">
          <label for="carType"><strong>車型：</strong></label>
          <input id="carType" v-model="carType" class="input-field" placeholder="請輸入車型" required/>
        </div>
        <div class="input-group">
          <label for="carNumber"><strong>車牌號碼：</strong></label>
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
        <div class="input-group">
          <label for="cellphone"><strong>手機號碼：</strong></label>
          <input id="cellphone" v-model="cellphone" class="input-field" placeholder="請輸入手機號碼" required/>
        </div>
        <div class="modal-actions">
          <button @click="sendModal" class="btn btn-send">送出</button>
          <button @click="closeModal" class="btn btn-close">關閉</button>
        </div>
      </div>
    </div>
</template>

<script>
import { parkFlowService } from '../services/parkFlowService'

export default {
  props: {
    parkingData: Object,
    weekStartDate: String
  },
  data() {
    return {
      isDisabled: false,
      isModalOpen: false,
      carType: '',
      carNumber1: '',
      carNumber2: '',
      cellphone: ''
    }
  },
  watch: {
      weekStartDate: {
        immediate: true,
        handler(newDate) {
          this.updateDisabledState(newDate);
        }
      }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '無資料';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getStatusIcon(status) {
      switch (status) {
        case 'APPROVED':
          return 'fas fa-check-circle text-success';
        case 'REVIEW':
          return 'fas fa-hourglass-half text-warning';
        case 'REJECTED':
          return 'fas fa-times-circle text-danger';
        default:
          return 'fas fa-question-circle text-secondary';
      }
    },
    async applyParking() {
      try {
        let response = await parkFlowService.queryUserInformation()

        if(response.code === "0000") {
          this.chineseName = response.data.chineseName
          this.carType = response.data.carType
          this.cellphone = response.data.cellphone

          this.carNumber1 = response.data.carNumber.split('-')[0]
          this.carNumber2 = response.data.carNumber.split('-')[1]
        
          this.isModalOpen = true
        } else {
          this.$emit('error', response.message);
        }   
      } catch (error) {
        this.$emit('error', error);
      }

    },
    async sendModal() {
      try {
        if (!this.carType) {
          alert("請填寫車型");
          return;
        } else if (!this.carNumber1 || !this.carNumber2) {
          alert("請填寫車牌號碼");
          return;
        } else if(!this.cellphone) {
          alert("請填寫電話號碼");
          return;
        }

        const data = {
          startDate: this.weekStartDate,
          carType: this.carType,
          carNumber: `${this.carNumber1}-${this.carNumber2}`, // 組合前後車牌
          cellPhone: this.cellphone
        };

        let response = await parkFlowService.createParkingRequest(data);
        
        if(response.code != "0000") {
          this.$emit('error', response.message);
        }
      } catch (error) {
        this.$emit('error', error);
      }

      this.isModalOpen = false

      this.carType = ''
      this.carNumber1 = ''
      this.carNumber2 = ''
      this.cellphone = ''

      this.$emit("refresh-data")
    },
    closeModal() {
      this.isModalOpen = false

      this.carType = ''
      this.carNumber1 = ''
      this.carNumber2 = ''
      this.cellphone = ''
    },
    updateDisabledState(dateString) {
      let date = new Date(dateString)

      // 取得選擇的週開始日期
      let selectedWeekStartDate = new Date(this.getWeekStartDate(date));

      // 取得今天的日期
      let today = new Date();
      let todayWeekStartDate = new Date(this.getWeekStartDate(today)); // 取得當週的週一

      // 比較選擇的週是否 >= 當週
      this.isDisabled = selectedWeekStartDate > todayWeekStartDate;
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
    }
  }
}
</script>

<style scoped>
.request-list {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
}

.request-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.request-table th, .request-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: center;
}

.request-table th {
  background-color: #f4f4f4;
  color: #333;
}

.request-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.status-icon {
  font-size: 1.2rem;
}

.text-success {
  color: #28a745;
}

.text-warning {
  color: #ffc107;
}

.text-danger {
  color: #dc3545;
}

.text-secondary {
  color: #6c757d;
}

h2 {
  margin-bottom: 1rem;
  color: #34495e;
}

p {
  margin: 0.5rem 0;
  color: #555;
}

.btn-applyParking {
  float: right;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-bottom: 10px;
}

.btn-applyParking:hover {
  float: right;
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9998;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.modal-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 0;
}
.input-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 5px;
}
.input-group label {
  flex: 1;
  text-align: right;
  padding-right: 10px;
}
.input-field {
  flex: 2;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.btn-close {
  background-color: #dc3545;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  margin-left: 5em;
}
.btn-send {
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
}
.btn-close:hover {
  background-color: #c82333;
}

.car-number-inputs {
  display: flex;
  align-items: center;
  gap: 7px;
}

.car-number-input {
  width: 100px; /* 設定輸入框的寬度 */
  flex: 2;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.separator {
  font-size: 18px;
  font-weight: bold;
  margin: 0 5px;
}

.btn-applyParking:disabled {
  background-color: #b0b0b0 !important; /* 灰色背景 */
  color: #ffffff; /* 文字顏色 */
  cursor: not-allowed; /* 顯示禁止符號 */
  opacity: 0.6; /* 透明度降低 */
}

</style> 