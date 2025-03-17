import axios from 'axios'
// import mitt from 'mitt'

const API_BASE_URL = 'http://localhost:8080/v1'

// export const eventBus = mitt()

// 創建帶有默認配置的 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加請求攔截器，自動添加 token
apiClient.interceptors.request.use(config => {
  const token = getCookie('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// **回應攔截器 (自動處理錯誤)**
// apiClient.interceptors.response.use(
//   (response) => {
//     const { code, message } = response.data // 取得 API 回應的 `code` 和 `message`

//     if (code !== '0000' || code !== '0001') {
//       // **1️⃣ 如果 `code` 不是 `"0000"`，視為錯誤**
//       eventBus.emit("Error : ", message)
//       return Promise.reject(new Error(message)) // 讓 API 仍然回傳錯誤
//     }

//     return response.data // **回傳 API `data`，讓呼叫端拿到真正的資料**
//   },
//   (error) => {
//     // **2️⃣ 如果有額外的 HTTP 錯誤 (雖然 API 都是 `200`，但可能仍然有網路錯誤)**
//     let errorMessage = "系統錯誤，請稍後再試"
//     if (error.response) {
//       errorMessage = error.response.data?.message || errorMessage
//     }

//     eventBus.emit("Error : ", errorMessage) // **彈出錯誤視窗**
//     return Promise.reject(error)
//   }
// )

// 工具函數
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

export const parkFlowService = {

  //取得FM停車列表
  async getFMParkingRequests(parkingRequest) {
    const response = await apiClient.post(`/parking/query-fm-parking-request`, parkingRequest)
    return response.data;
  },
  
  //取得一般使用者停車列表
  async getUserParkingRequests(parkingRequest) {
    const response = await apiClient.post(`/parking/query-user-parking-request`, parkingRequest)
    return response.data;
  },

  //USER 申請停車位
  async createParkingRequest(parkingRequest) {
    const response = await apiClient.post(`/parking/create-parking-request`, parkingRequest)
    return response.data;
  },

  //FM 審核停車位
  async updateParkingRequest(parkingRequest) {
    const response = await apiClient.put(`/parking/update-parking-request`, parkingRequest)
    return response.data;
  
  },

  //新增可以停車上限
  async createParkingQuota(parkingQuotaRequest) {
    const response = await apiClient.post(`/parking/create-parking-quota`, parkingQuotaRequest)
    return response.data;
  },

  //更新可以停車上限
  async updateParkingQuota(parkingQuotaRequest) {
    const response = await apiClient.put(`/parking/update-parking-quota`, parkingQuotaRequest)
    return response.data;
  },

  // 登入
  async generallyLogin(userData) {
    const response = await apiClient.post('/users/login', userData)
    return response.data
  },

  // 註冊新用戶
  async createUser(userData) {
    const response = await apiClient.post('/users/create', userData)
    return response.data
  },

  //登出
  async logout() {
    const response = await apiClient.post('/users/logout')
    return response.data
  },

  //搜尋使用者資料
  async queryUserInformation() {
    const response = await apiClient.post('/users/query')
    return response.data
  }
} 