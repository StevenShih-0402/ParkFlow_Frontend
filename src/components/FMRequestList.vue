<template>
  <div class="request-list">
    <h2>FM 停車請求列表</h2>

    <!-- 修改當週可使用停車位 -->
    <div class="parking-info">
      <label for="availableSlots">當週可使用停車位：</label>
      <div class="editable-field">
        <input
          type="number"
          id="availableSlots"
          v-model="editableRemainingQuantity"
          min="0"
          class="input-field"
          :disabled="!isEditing"
        />
        <button :disabled="!isDisabled" @click="isEditing = true" class="btn btn-edit">
          <i class="fas fa-pen"></i>
        </button>
        <button v-if="isEditing" @click="updateRemainingSlots" class="btn btn-confirm">
          <i class="fas fa-check"></i>
        </button>
      </div>
    </div>

    <!-- 停車請求列表 -->
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
          <th></th>
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
          <td>
            <button
              v-if="request.status === 'REVIEW'"
              @click="openModel(request.status, request)"
              class="btn btn-warning"
              :disabled="!isDisabled">
              審核
            </button>
            <button
              v-if="request.status === 'APPROVED'"
              @click="openModel(request.status, request)"
              class="btn btn-info"
              :disabled="!isDisabled">
              編輯
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ modalMode === 'review' ? '審核申請' : '編輯申請' }}</h2>
        <div class="input-group">
          <label for="requestTime"><strong>申請時間：</strong></label>
          <input id="requestTime" :value="formattedRequestTime" class="input-field" disabled/>
        </div>
        <div class="input-group">
          <label for="chineseName"><strong>中文姓名：</strong></label>
          <input id="chineseName" v-model="selectedRequest.chineseName" class="input-field" disabled/>
        </div>
        <div class="input-group">
          <label for="carType"><strong>車型：</strong></label>
          <input id="carType" v-model="selectedRequest.carType" class="input-field" disabled/>
        </div>
        <div class="input-group">
          <label for="carNumber"><strong>車牌號碼：</strong></label>
          <input id="carNumber" v-model="selectedRequest.carNumber" class="input-field" disabled/>
        </div>
        <div class="input-group">
          <label for="cellphone"><strong>手機號碼：</strong></label>
          <input id="cellphone" v-model="selectedRequest.cellphone" class="input-field" disabled/>
        </div>
        <div class="input-group">
          <label for="parkingSlotNumber"><strong>車位號碼：</strong></label>
          <input id="parkingSlotNumber" v-model="selectedRequest.parkingSlotNumber" class="input-field" type="number" placeholder="請輸入車位號碼"/>
        </div>
        <div class="modal-actions">
          <button @click="sendModal" class="btn btn-send">送出</button>
          <button @click="closeModal" class="btn btn-close">關閉</button>
        </div>
      </div>
    </div>

    <!-- 總車位資訊 -->
    <div class="parking-summary">
      <p>總車位: {{ parkingData.totalSlots }}</p>
      <p>剩餘車位: {{ parkingData.remainingQuantity }}</p>
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
      isEditing: false,
      isModalOpen: false,
      modalMode: '',
      selectedRequest: null,
    };
  },
  watch: {
    editableRemainingQuantity(newValue) {
      this.parkingData.totalSlots = newValue;
    },
    weekStartDate: {
      immediate: true,
      handler(newDate) {
        this.updateDisabledState(newDate);
      }
    }
  },
  computed: {
    editableRemainingQuantity: {
      get() {
        return this.parkingData.totalSlots || 0;
      },
      set(value) {
        this.parkingData.totalSlots = value; // 手動同步變更
      }
    },
    formattedRequestTime() {
      return this.formatDate(this.selectedRequest.requestTime);
    }
  },
  methods: {
    openModel(mode, request) {
      this.isModalOpen = true;
      this.modalMode = mode;
      this.selectedRequest = request;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedRequest = null;
    },
    async sendModal() {
      // send data

      const data = {
        'id': this.selectedRequest.requestId,
        'status': 'APPROVED',
        'parkingSlotNumber': this.selectedRequest.parkingSlotNumber
      }

      let response = await parkFlowService.updateParkingRequest(data);
      
      if(response.code != "0000") {
        alert(response.message)
      }

      this.$emit("refresh-data");
      this.isModalOpen = false;
      this.selectedRequest = null;
    },
    formatDate(dateString) {
      if (!dateString) return "無資料";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getStatusIcon(status) {
      switch (status) {
        case "APPROVED":
          return "fas fa-check-circle text-success";
        case "REVIEW":
          return "fas fa-hourglass-half text-warning";
        case "REJECTED":
          return "fas fa-times-circle text-danger";
        default:
          return "fas fa-question-circle text-secondary";
      }
    },
    // 更新
    async updateRemainingSlots() {
      try {
        let response;
        
        if (this.parkingData.totalSlotsId === null) {
          // 新增
          const data = {
            'weekStartDate': this.weekStartDate,
            'totalSlots': this.parkingData.totalSlots
          };
        
          response = await parkFlowService.createParkingQuota(data);
        } else {
          // 更新
          const data = {
            'id': this.parkingData.totalSlotsId,
            'weekStartDate': this.weekStartDate,
            'totalSlots': this.parkingData.totalSlots
          };
        
          response = await parkFlowService.updateParkingQuota(data);
          
        }
      
        console.log("🔄 API Response:", response);
      
        if (response && response.code === "0000") {
          console.log("✅ API 成功，Emitting refresh-data...");
          this.$emit("refresh-data");
          this.isEditing = false;
        } else {
          console.error("🚨 API 失敗，未觸發 refresh-data，錯誤訊息:", response?.message);
        }
      } catch (error) {
        console.error("🚨 發生錯誤:", error);
      }
    },
    updateDisabledState(dateString) {
      let date = new Date(dateString)

      // 取得選擇的週開始日期
      let selectedWeekStartDate = new Date(this.getWeekStartDate(date));

      // 取得今天的日期
      let today = new Date();
      let todayWeekStartDate = new Date(this.getWeekStartDate(today)); // 取得當週的週一

      // 比較選擇的週是否 >= 當週
      this.isDisabled = selectedWeekStartDate >= todayWeekStartDate;

      console.log("是否禁用:", this.isDisabled);
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
};
</script>

<style scoped>
.request-list {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
}

.request-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.request-table th,
.request-table td {
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

.parking-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.editable-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-field {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 80px;
  text-align: center;
  background-color: #f8f9fa;
  transition: background-color 0.3s;
}

.input-field:disabled {
  background-color: #e9ecef;
  cursor: not-allowed; /* 顯示禁止符號 */
}

.btn-edit:disabled {
  background-color: #b0b0b0 !important; /* 灰色背景 */
  color: #ffffff; /* 文字顏色 */
  cursor: not-allowed; /* 顯示禁止符號 */
  opacity: 0.6; /* 透明度降低 */
}

/* 按鈕樣式 */
.btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

/* 鉛筆按鈕 */
.btn-edit {
  background-color: #007bff;
  color: white;
}

.btn-edit:hover {
  background-color: #0056b3;
}

/* 確認按鈕 */
.btn-confirm {
  background-color: #28a745;
  color: white;
}

.btn-confirm:hover {
  background-color: #218838;
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
  z-index: 9999;
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
}
.btn-close:hover {
  background-color: #c82333;
}


</style>
