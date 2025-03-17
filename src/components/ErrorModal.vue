<template>
  <div v-if="isVisible" class="error-modal">
    <div class="error-modal-content">
      <h2>錯誤發生</h2>
      <p>{{ errorMessage }}</p>
      <button class="btn-close" @click="closeModal">關閉</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close-error")
    },
  },
};
</script>

<style scoped>
.error-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
}

h2 {
  color: red;
  margin-bottom: 10px;
}

p {
  margin-bottom: 20px;
}

.btn-close {
  background: red;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

.btn-close:hover {
  background: darkred;
}
</style>
