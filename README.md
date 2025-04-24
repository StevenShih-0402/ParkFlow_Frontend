>Backend：https://github.com/StevenShih-0402/ParkFlow_Backend

- 開發緣由

  由於當時公司在大樓尚未有固定配額的停車位，因此員工如果要開車上班，就需要每週向大樓提交臨時車位申請。為了簡化預約流程，主管決定要開發一套供辦公室內部申請車位的系統，由主管提出需求，我和同事們協作開發此系統，讓辦公室同仁可以清楚確認每週申請狀況，減少寫信、寄信等書面往來的時間成本。
  - 版控 & Code Review：Git/GitHub
  - 專案管理：Trello
  
- 使用情境

  系統會有申請停車位的一般使用者 (USER) 與審核申請的管理員 (FM)，USER 登入系統後，可以發送車位申請給 FM，FM 登入系統後就會去審核這些申請，回傳給 USER 他們這週的車位號碼，同時也要在系統設定每週能提供預約的車位數量。
  ![image](https://github.com/user-attachments/assets/510d414c-057f-4196-8a6a-c150a72cc6b2)

- 功能介紹與圖示
  
  1. 登入、註冊畫面
  
      - 由於系統目的是給辦公室內部人員使用，因此登入僅驗證電子信箱。
      - 註冊時會填入帳號預設的車牌號碼與車型，申請車位時可再修改。
      - 登入的信箱若格式正確但沒有註冊過，會跳轉到註冊介面。
      - 註冊完成後會自動登入系統。
    
        <details>
        <summary>系統畫面</summary>
          
        ![image](https://github.com/user-attachments/assets/432ecd97-ab16-482b-a689-8fc32874eeee)
          
        ![image](https://github.com/user-attachments/assets/c4b7cf71-4b56-4a0d-93d7-93903ddda360)
          
        </details>
  
  2. 一般使用者(USER)

      - 查看每週的申請紀錄與剩餘車位。
      - 用戶每週只能申請一次車位。
      - 綠色圖示表示審核通過，黃色圖示表示正在審核，紅色圖示表示審核駁回。
      - 若要申請下週的車位，必須要在當週的星期四前完成申請，為了給 FM 有足夠時間去和管委會溝通，但若有隔週的申請(如 FM 得知有三個星期的可申請車位數皆相同)，就不在此限。

        <details>
        <summary>主頁面</summary>
        
        ![image](https://github.com/user-attachments/assets/3459bc83-cbda-4427-90e2-d7826ba03dc7)
      
        ![image](https://github.com/user-attachments/assets/40d5e191-b110-40f7-af7e-35d86188610a)
   
        ![image](https://github.com/user-attachments/assets/a986d733-e8bf-48d1-ab6c-46cd27c3d56e)
      
        </details>
      
  3. 設備管理員(FM)

      - 查看並審核所有用戶的車位申請。
      - 查看並設定每週可供申請的車位。
     
        <details>
        <summary>主頁面</summary>
        
        ![image](https://github.com/user-attachments/assets/724f778b-1cc0-4bd5-9371-eac6b698ffcd)
      
        ![image](https://github.com/user-attachments/assets/12bc1c25-5817-4589-8aaf-176ec0670995)
      
        ![image](https://github.com/user-attachments/assets/baa74270-5c8d-48d5-bef7-98c32c7ef43b)
      
        設定當週可預約的車位數量，但不能低於已預約的車位數量。
        ![image](https://github.com/user-attachments/assets/35b8c87d-1ee8-4535-8bdf-de93c68aa716)
      
        駁回審核時，不會計算在預約車位。
        ![image](https://github.com/user-attachments/assets/0e4d9275-b05e-4845-9d0d-d978942f04d5)
      
        </details>
  
  4. 用戶資訊頁面
      <details>
      <summary>顯示用戶資訊，用戶可以修改除了電子信箱以外的資訊(因為電子信箱在系統是登入用的資訊)。</summary>
    
      資料未修改前不能更新。
      ![image](https://github.com/user-attachments/assets/62a6de20-75ed-4d87-8db0-31f359dacca6)
    
      與原資料不同才能更新。
      ![image](https://github.com/user-attachments/assets/d36880a8-f957-4368-90f2-f676f325cc19)
    
      更新成功後的提示訊息。
      ![image](https://github.com/user-attachments/assets/a83c00f8-e51f-4e0f-8544-ee99910fba5c)
    
      </details>
