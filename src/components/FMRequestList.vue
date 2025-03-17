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
          v-model="totalSlots"
          min="0"
          class="input-field"
          :disabled="!isEditing"
        />
        <button
          v-if="!isEditing"
          @click="startEditing"
          class="btn btn-edit"
          :disabled="isPastWeek"
        >
          <i class="fas fa-pen"></i>
        </button>
        <button v-if="isEditing" @click="updateTotalSlots" class="btn btn-confirm">
          <i class="fas fa-check"></i>
        </button>
        <button v-if="isEditing" @click="cancelTotalSlots" class="btn btn-cancel">
          <i class="fas fa-times"></i>
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
          <th>操作</th>
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
          <td><i :class="getStatusIcon(request.status)" class="status-icon"></i></td>
          <td>
            <button
              v-if="request.status === 'REVIEW'"
              @click="openModel('review', request)"
              class="btn btn-warning"
              :disabled="isPastWeek"
            >
              審核
            </button>
            <button
              v-if="request.status === 'APPROVED'"
              @click="openModel('edit', request)"
              class="btn btn-info"
              :disabled="isPastWeek"
            >
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
          <input id="parkingSlotNumber" v-model="selectedRequest.parkingSlotNumber" class="input-field" type="number" />
        </div>
        <div class="modal-actions">
          <div class="empty"></div>
          <button @click="sendModel" class="btn btn-send">送出</button>
          <div class="empty"></div>
          <button @click="closeModel" class="btn btn-close">關閉</button>
          <div class="empty"></div>
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
import { parkFlowService } from '@/services/parkFlowService'

export default {
  emits: ["refresh-data"],
  props: {
    parkingData: Object,
    currentWeekStart: Date,
  },
  data() {
    return {
      isEditing: false,
      isModalOpen: false,
      modalMode: '',
      selectedRequest: null,
      originalTotalSlots: null
    };
  },
  computed: {
    formattedRequestTime() {
      return this.selectedRequest?.requestTime ? new Date(this.selectedRequest.requestTime).toLocaleString("zh-TW") : "無資料";
    },
    totalSlots: {
      get() {
      return this.parkingData.totalSlots || 0;
      },
      set(value) {
      this.parkingData.totalSlots = value;
      }
    },
    isPastWeek() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 設定當週的「星期日」為開始日
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay()); // 計算本週的「星期日」

      // 確保 `this.currentWeekStart` 是 Date 物件
      const selectedWeekStart = new Date(this.getWeekStartDate(this.currentWeekStart) + "Z");
      selectedWeekStart.setHours(0, 0, 0, 0);

      return selectedWeekStart <= currentWeekStart; 
    }
  },
  methods: {
    openModel(mode, request) {
      this.isModalOpen = true;
      this.modalMode = mode;
      this.selectedRequest = request;
    },
    async sendModel() {
      try {
        let payload = {
          id: this.selectedRequest.requestId,
          parkingSlotNumber: this.selectedRequest.parkingSlotNumber,
          status: "APPROVED"
        }

        let response = await parkFlowService.updateParkingRequest(payload);

        if(response.code != "0000") {
          this.$emit('error', response.message)
        }
      } catch (error) {
        this.$emit('error', error);
      }

      
      this.$emit("refresh-data");
      this.isModalOpen = false;
      this.selectedRequest = null;
    },
    closeModel() {
      this.isModalOpen = false;
      this.selectedRequest = null;
    },
    formatDate(dateString) {
      if (!dateString) return "無資料";
      return new Date(dateString).toLocaleString("zh-TW");
    },
    getStatusIcon(status) {
      const statusIcons = {
        "APPROVED": "fas fa-check-circle text-success",
        "REVIEW": "fas fa-hourglass-half text-warning",
        "REJECTED": "fas fa-times-circle text-danger"
      };
      return statusIcons[status] || "fas fa-question-circle text-secondary";
    },
    async updateTotalSlots() {
      
      if (this.parkingData.totalSlotsId === null) {
        try {
          
          let requestBody = {
            weekStartDate: this.getWeekStartDate(this.currentWeekStart),
            totalSlots: this.parkingData.totalSlots
          }

          let response = await parkFlowService.createParkingQuota(requestBody);

          if(response.code != "0000") {
            this.$emit('error', response.message);
          }
 
        } catch (error) {
          this.$emit('error', error);
        }

      } else if (this.parkingData.totalSlotsId !== null && this.parkingData.totalSlots !== this.originalTotalSlots) {
        try {
          let requestBody = {
            id: this.parkingData.totalSlotsId,
            totalSlots: this.parkingData.totalSlots
          }

          let response = await parkFlowService.updatearkingQuota(requestBody);

          if(response.code != "0000") {
            this.$emit('error', response.message);
          }
        } catch (error) {
          this.$emit('error', error);
        }
      }

      this.$emit("refresh-data");
      this.isEditing = false;
    },
    cancelTotalSlots() {
      this.$emit("refresh-data");
      this.isEditing = false;
    },
    startEditing() {
      if (!this.isPastWeek) {
        this.originalTotalSlots = this.parkingData.totalSlots;
        this.isEditing = true;
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
    }
  }
};
</script>

<style scoped>
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
  border-radius: 12px;
  width: 420px;
  text-align: left;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
}
.input-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 5px;
}
.input-group label {
  flex: 1;
  text-align: right;
  padding-right: 10px;
}
.input-field {
  flex: 2;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #ffffff;
}
.modal-actions {
  display: flex;
  justify-content: space-evenly;
  margin-top: 15px;
}
.btn-close {
  background-color: #dc3545;
  color: white;
}

.btn-send {
  background: #28a746;
  color: white;
}

.btn-close:hover {
  background-color: #c82333;
}

/* 鉛筆按鈕 */
.btn-edit {
  background-color: #007bff;
  color: white;
}

/* 當週以前的鉛筆按鈕變灰色 */
.btn-edit:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  pointer-events: none;
}

/* 確認按鈕 */
.btn-confirm {
  background-color: #28a745;
  color: white;
  width: 36px;
  height: 30px;
}

.btn-cancel {
  background-color: #fd0e35;
  color: white;
  width: 36px;
  height: 30px;
}

.btn-confirm:hover {
  background-color: #218838;
}

.btn-cancel:hover {
  background-color: #dd3439;
}

/* 審核與編輯按鈕變灰色 */
.btn-warning:disabled,
.btn-info:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  pointer-events: none;
}
</style>

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
  cursor: not-allowed;
}

/* 按鈕樣式 */
.btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

/* 審核與編輯按鈕變灰色 */
.btn-warning:disabled,
.btn-info:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  pointer-events: none;
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
}
</style>
