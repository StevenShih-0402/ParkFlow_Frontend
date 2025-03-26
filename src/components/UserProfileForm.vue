<template>
  <div v-if="isVisible" class="model-overlay">
    <div class="model-content">
      <h2>用戶個人資訊</h2>
      <div class="input-group">
        <label for="chineseName"><strong>中文姓名</strong></label>
        <input id="chineseName" v-model="chineseName" class="input-field" placeholder="請輸入中文姓名" required/>
      </div>

      <div class="input-group">
        <label for="englishName"><strong>英文姓名</strong></label>
        <input id="englishName" v-model="englishName" class="input-field" placeholder="請輸入英文姓名" required/>
      </div>

      <div class="input-group">
        <label for="email"><strong>信箱</strong></label>
        <input id="email" v-model="email" class="input-field" placeholder="請輸入信箱" required/>
      </div>

      <div class="input-group">
        <label for="cellphone"><strong>手機號碼</strong></label>
        <input id="cellphone" v-model="cellphone" class="input-field" placeholder="請輸入手機號碼" required/>
      </div>

      <div class="input-group">
        <label for="carType"><strong>車型</strong></label>
        <input id="carType" v-model="carType" class="input-field" placeholder="請輸入車型" required/>
      </div>

      <div class="input-group">
        <label for="carNumber"><strong>車牌</strong></label>
        <div class="car-number-inputs">
          <input 
            type="text" 
            id="carNumber1"
            v-model="carNumber1"
            placeholder="請輸入車牌前碼"
            maxlength="4"
            required
            class="car-number-left"
          >
          <span class="separator">-</span>
          <input 
            type="text" 
            id="carNumber2"
            v-model="carNumber2"
            placeholder="請輸入車牌後碼"
            maxlength="4"
            required
            class="car-number-right"
          >
        </div>
      </div>
      
      <div class="model-actions">
        <button @click="fixModal" class="btn btn-fix">修改</button>
        <button @click="closeModal" class="btn btn-close">關閉</button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    userDataModel: {
      type: Object,
      default: null
    }
  },
  data() {
    return{
      chineseName: '',
      englishName: '',
      email: '',
      cellphone: '',
      carNumber1: '',
      carNumber2: '',
      carType: ''
    }
  },
  watch:{
    userDataModel:{
      immediate: true,
      handler(newData){
        this.chineseName = newData.chineseName;
        this.englishName = newData.englishName;
        this.email = newData.email;
        this.cellphone = newData.cellphone;
        this.carNumber1 = newData.carNumber.split('-')[0],
        this.carNumber2 = newData.carNumber.split('-')[1],
        this.carType = newData.carType;
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  },
};
</script>

<style scoped>
h2{
  text-align: center;
}
.model-overlay {
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
.model-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.model-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 0;
}
.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
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
  border: none;
  border-radius: 4px;
  pointer-events: none;
}

.car-number-left{
  width: 3em; 
  border: none;
  border-radius: 4px;
  pointer-events: none;
  text-align: left;
}
.car-number-right{
  width: 3em; 
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  pointer-events: none;
  text-align: left;
}
.car-number-inputs {
  flex: 2;
  padding: 8px;
}

.model-actions {
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
.btn-fix {
  background-color: #f79c00;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
}
.btn-close:hover {
  background-color: #c82333;
}
</style>