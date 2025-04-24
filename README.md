# 🚗 商業大樓停車位預約系統

這是一個為辦公室員工設計的車位申請與管理系統，簡化申請流程、減少書面往來。

使用者可申請每週的臨時車位，管理員可進行審核並管理可供申請的車位數量。

>🔗 搭配後端專案：[ParkFlow_Backend](https://github.com/StevenShih-0402/ParkFlow_Backend)
>
> 預設連線 API 位址為 `http://localhost:8080`

---

## 📌 專案緣由

由於當時公司大樓尚無固定配額車位，需每週申請臨時停車位，因此開發此系統簡化申請流程。由主管提出需求，我與同事協作開發此系統，以方便同仁申請與查詢審核狀況。

---

## 🔧 技術棧

- **Frontend**： Vue 3 | Vite | Axios
- **Backend**： Spring Boot | JWT | JPA (Hibernate) | Oracle
- **其他**： GitHub (Code Review) | Trello (Project Management)

---

## 🚀 快速啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

---

## 📁 專案結構

```bash
.
├── src/
│   ├── components/        # Vue 元件
│   ├── views/             # 頁面檔案
│   ├── router/            # Vue Router 設定
│   ├── services/          # API 請求封裝
│   ├── App.vue            # 主組件
│   ├── main.js            # 入口點
│   └── vite.config.js     # API 連線設定
```

---

## 👥 使用者角色

| 角色 | 功能權限 |
|------|----------|
| 一般使用者 (USER) | - 提交每週車位申請<br>- 查詢申請狀態與剩餘名額 |
| 管理員 (FM) | - 審核車位申請<br>- 設定每週可用車位數 |

---

## 📚 功能總覽

- [x] 使用者登入 / 註冊（信箱驗證制）
- [x] 車位申請流程（申請 ➜ 審核 ➜ 結果）
- [x] 每週剩餘車位顯示
- [x] 用戶只能每週申請一次
- [x] 管理員可審核 / 駁回申請
- [x] 管理員設定各週可供預約車位數
- [x] 用戶個資編輯（車牌號碼 / 車型）

---

## 🖼️ 系統畫面預覽

### 🔐 登入 / 註冊

- 僅驗證信箱格式
- 未註冊者導向註冊頁
- 註冊後自動登入
<details>
<summary>點我展開畫面</summary>

![登入頁](https://github.com/user-attachments/assets/432ecd97-ab16-482b-a689-8fc32874eeee)  
![註冊頁](https://github.com/user-attachments/assets/c4b7cf71-4b56-4a0d-93d7-93903ddda360)

</details>

---

### 👤 一般使用者 (USER)

- 每週只能申請一次
- 可查看剩餘名額與歷史紀錄
- 車位審核狀態圖示：
  - 🟢 綠色：審核通過
  - 🟡 黃色：審核中
  - 🔴 紅色：駁回
- 申請需在週四前送出（可彈性由管理員調整）

<details>
<summary>點我展開畫面</summary>

![使用者首頁](https://github.com/user-attachments/assets/3459bc83-cbda-4427-90e2-d7826ba03dc7)  
![申請流程](https://github.com/user-attachments/assets/40d5e191-b110-40f7-af7e-35d86188610a)  
![歷史申請](https://github.com/user-attachments/assets/a986d733-e8bf-48d1-ab6c-46cd27c3d56e)

</details>

---

### 🛠️ 管理員 (FM)

- 查看所有用戶申請紀錄
- 核准 / 駁回申請
- 設定各週可預約車位數（不得低於已申請數）

<details>
<summary>點我展開畫面</summary>

![管理首頁](https://github.com/user-attachments/assets/724f778b-1cc0-4bd5-9371-eac6b698ffcd)  
![申請審核](https://github.com/user-attachments/assets/12bc1c25-5817-4589-8aaf-176ec0670995)  
![設定車位數](https://github.com/user-attachments/assets/35b8c87d-1ee8-4535-8bdf-de93c68aa716)  
![駁回操作](https://github.com/user-attachments/assets/0e4d9275-b05e-4845-9d0d-d978942f04d5)

</details>

---

### 🙍‍♂️ 用戶資訊頁面

- 修改車牌號碼 / 車型（信箱不可更改）
- 僅當資料變動才允許送出更新

<details>
<summary>點我展開畫面</summary>

![個資未變更](https://github.com/user-attachments/assets/62a6de20-75ed-4d87-8db0-31f359dacca6)  
![資料變更後](https://github.com/user-attachments/assets/d36880a8-f957-4368-90f2-f676f325cc19)  
![更新成功提示](https://github.com/user-attachments/assets/a83c00f8-e51f-4e0f-8544-ee99910fba5c)

</details>
