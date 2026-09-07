# 登入與權限管理導入計畫

## 1. 目前狀態與安全邊界

目前網站是 React + Vite 靜態前端，路由集中在 `src/App.tsx`；專案內沒有登入 API、使用者資料庫、session、Cloudflare 設定或 Supabase client。因為瀏覽器會收到完整的前端檔案，**只隱藏按鈕、在 React 判斷角色，或在 `localStorage` 寫入 `isAdmin` 都不構成權限保護**。

真正需要限制的頁面、API 與資料，必須在瀏覽器拿到內容以前，由受信任的服務驗證身分與權限。任何密鑰都不可放在 `VITE_*` 變數或前端程式碼中。

## 2. 建議選擇

先回答以下兩題，再開始實作：

1. **是否整個網站只有特定人員可看？**
   - 是：優先採用方案 A「網站入口保護」。
   - 否，公開頁面與內部頁面並存：採用方案 B「應用程式登入」。
2. **登入後是否需要管理者、編輯者、檢視者等不同權限？**
   - 否：方案 A 最省維護。
   - 是：採用方案 B，且權限必須在後端／資料庫執行。

### 方案 A（建議第一階段）：網站入口保護

適合「整站僅供核准人員使用」。可在實際代管平台前加一層身分代理，例如 Cloudflare Access，讓使用者以組織帳號登入，或用電子郵件一次性驗證碼登入。通過後才會取得網站檔案，因此本專案通常不需加入登入套件，也不需自行保存密碼。

使用者流程最短可設為：

1. 開啟既有網站網址。
2. 輸入已核准的電子郵件（若已串組織 Google／Microsoft 帳號，直接選該帳號）。
3. 第一次或 session 到期時完成一次性驗證碼／組織帳號驗證。
4. 進入網站；未列入政策者無法取得網站內容。

限制：通常只能控制「能否進整站」。若同一網站內還要依角色限制修改、審核或匯出，仍需方案 B。

### 方案 B（第二階段）：應用程式登入 + 後端授權

適合公開頁面與內部頁面並存，或需要 `viewer`、`editor`、`admin`。可使用託管式 Auth（例如 Supabase Auth 的電子郵件 magic link／OTP）減少密碼操作，但仍須新增後端或資料庫政策，不能只做前端路由守門。

建議角色保持三種，避免過度複雜：

| 角色 | 可做的事 |
| --- | --- |
| `viewer` | 查看核准內容 |
| `editor` | 查看與編輯內容，不可管理帳號 |
| `admin` | 管理帳號、角色與全部內容 |

使用者流程可設為：

1. 管理者先邀請使用者並指定角色，不開放公開註冊。
2. 使用者開啟邀請信，完成 magic link／OTP 登入，不另設密碼。
3. 前端取得 session 後顯示可用功能。
4. 每次讀寫受保護資料時，後端再次驗證 session 與角色；權限不足即回傳 `403`。

## 3. 方案 A 的實作順序（選定 Cloudflare Access 時）

> **需確認**：目前專案沒有 Git remote、正式網址與部署設定。必須先由專案管理者確認網站是否已透過 Cloudflare 代理、網域管理者、付費方案限制，以及實際 production 發布流程。Cloudflare 控制台文字可能更新，操作時應以官方文件為準。

1. **準備帳號與權限**（Cloudflare 平台）
   - 由組織管理者建立或登入 Cloudflare 帳號。
   - 將正式網域加入正確的 Cloudflare account；不可拿測試 account 直接改 production。
   - 由管理者授予執行人員 Zero Trust／Access 的必要管理權，不共用密碼或 API token。
2. **確認 DNS 與來源站**（Cloudflare 平台及現行代管平台）
   - 記錄正式 hostname、來源站網址、現行 DNS、SPA fallback 與回滾方式。
   - 先建立測試 hostname；不要先鎖正式站。
3. **設定登入方式**（Cloudflare Zero Trust 控制台）
   - 若已有 Google Workspace／Microsoft Entra ID，優先串組織 IdP。
   - 若沒有 IdP，才採電子郵件一次性驗證碼；確認郵件網域與實際使用者均能收信。
4. **建立 Access application**（Cloudflare Zero Trust 控制台）
   - 建立 self-hosted application，填入測試 hostname。
   - 建立預設拒絕、僅允許核准 email／email domain／IdP group 的政策。
   - 若使用 email domain，先確認該網域只有組織可控帳號；否則改用明確 email 清單。
   - 設定合理 session 有效期；高敏感資料應縮短期限。
5. **驗收測試**
   - 核准帳號可登入、session 到期可重新驗證。
   - 未核准帳號與無痕視窗無法取得首頁及 `/issues`、`/map`、`/faq`、`/plants`。
   - 直接輸入子路由與重新整理也必須被攔截。
6. **套用 production**
   - 保存設定截圖／匯出資訊與緊急管理者聯絡方式。
   - 在低使用時段把已驗收政策套至正式 hostname。
   - 不刪除原部署；確認穩定後才移除測試 application。

此方案不需要修改 `.env.example`、安裝 npm 套件或建立 application token。若自動化 Cloudflare 設定才需要 API token；屆時必須另行記錄 token 的建立位置、最小 scope、保存位置與輪替方式，且不可提交 Git。

## 4. 方案 B 的實作順序（選定 Supabase 時）

> **需確認**：Supabase 只是可選方案，目前並未決定使用。開始前需由負責人確認資料所在地、個資／資安規範、寄信網域、正式網址與費用。下列名稱是建議規格，實作 PR 必須讓程式碼、環境變數與 migration 完全一致。

1. **建立平台資源**（Supabase Dashboard）
   - 建立或登入 Supabase 帳號，建立 organization，再建立 dev project；production 應使用不同 project。
   - 在 Project Settings / API 取得 Project URL 與前端可用的 publishable／anon key。`service_role` key 只能存放在後端 secret，絕不可放進 Vite。
   - 在 Authentication 設定 Site URL、允許的 redirect URL、寄信方式與關閉公開註冊。
2. **建立可稽核的資料結構**（Supabase SQL migration）
   - 建立 `profiles`，以 Auth user id 為主鍵，保存顯示名稱、角色、停用狀態與時間戳記。
   - 角色欄位只允許 `viewer`、`editor`、`admin`，預設為 `viewer`。
   - 對所有受保護資料表啟用 Row Level Security（RLS）；未建立 policy 前一律拒絕。
   - 只有 `admin` 可調整角色；使用者不可更新自己的角色。角色異動應留 audit log。
3. **本機環境變數**（專案根目錄）
   - 實作時才在 `.env.example` 新增確定採用的名稱，例如 `VITE_SUPABASE_URL` 與 `VITE_SUPABASE_ANON_KEY`，再執行 `cp .env.example .env.local` 填入 dev project 值。
   - 不可預先新增尚未使用的變數，也不可將 `.env.local` 提交 Git。
4. **最小前端修改**（本專案）
   - 安裝官方 client 並鎖定 package lock；建立單一 auth client 與 session provider。
   - 新增登入／callback 頁；保留目前 `/`、`/issues`、`/map`、`/faq`、`/plants` 命名。
   - 前端 route guard 只改善操作體驗，不作為安全邊界；真正限制由 RLS／後端完成。
5. **管理者建立使用者**（Supabase Dashboard 或受保護的後端管理功能）
   - 第一位 `admin` 必須由具平台權限者建立並核對 email。
   - 後續使用者由管理者邀請，不讓一般瀏覽者自行升級角色。
   - 邀請完成後，由另一位管理者核對角色與停用流程。
6. **完整測試後才上 production**
   - 測試無 session、過期 session、三種角色、停用帳號、直接呼叫 API、竄改前端角色與登出。
   - 在 production project 重跑已審核 migration；重新設定 production URL、redirect URL、寄信與 secrets。
   - 不可把 dev database、dev key 或測試帳號沿用到 production。

## 5. 驗收條件

- 未登入使用者無法從網址、API、前端 bundle 或儲存服務取得受保護資料。
- 權限不足時由伺服器／資料庫拒絕，而非僅隱藏 UI。
- 不儲存自建密碼；token 不出現在 Git、log、錯誤畫面或前端環境變數（公開 anon key 除外，但仍須搭配 RLS）。
- 可停用單一帳號，可撤銷 session，且至少有兩位緊急管理者。
- 邀請、角色變更、停用與敏感資料異動可追蹤。
- 登出、逾時、邀請連結失效與收不到信都有明確提示與聯絡方式。

## 6. 風險、回滾與尚未解決事項

### 風險

- 誤設 allow policy 或 redirect URL 可能讓所有人被擋，或意外放行未核准使用者。
- 只做前端 route guard 會造成「看似有登入、實際可繞過」的漏洞。
- magic link 依賴信箱安全與寄信到達率；共用信箱不利稽核。
- Access 保護整站時，公開搜尋、公開分享與監測服務也會被擋，需先盤點。

### 回滾

- **方案 A**：保留原部署與 DNS 記錄；若登入服務異常，先由 Cloudflare 管理者停用／移除該 hostname 的 Access application 或還原先前政策。不得為了搶修建立永久公開放行規則。
- **方案 B 尚未合併**：用 `git restore` 還原程式與文件，移除本機未提交的 `.env.local`；不要刪除他人的平台資源。
- **方案 B 已合併**：對該 PR 執行 Revert，重新建置發布；資料庫 schema 以新的反向 migration 回滾，不直接改寫已執行的 migration。若已產生使用者資料，需先備份並確認個資保存規範。

### 尚未解決（開始實作前必須確認）

- production 實際代管平台、正式網域、DNS 管理者與發布流程。
- 整站限制或僅限制部分功能，以及是否有敏感資料／寫入 API。
- 核准使用者來源、預估人數、是否已有組織 IdP。
- 角色與各功能的權限矩陣、帳號審核人、停用與稽核期限。
- 是否採 Cloudflare Access、Supabase 或組織既有身分服務；未確認前不應加入依賴。

## 7. 本次文件變更影響

- **修改原因**：提供可先決策、再最小實作的登入與授權路線，避免把前端顯示控制誤當安全機制。
- **修改檔案**：本文件及 README 入口連結。
- **production 影響**：無；未變更程式、依賴、環境變數或部署設定。
- **後續建議**：先以測試 hostname 驗證方案 A；只有確認需要站內角色與資料寫入時，再另開 PR 實作方案 B。
