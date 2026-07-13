# 生態檢核資訊系統整合平台｜開發筆記

本專案是以 React、TypeScript、Vite 與 Tailwind CSS 建置的前端工具平台，提供生態檢核相關的入口儀表板與多個作業輔助模組。

目前專案主要功能包含：

- **關注議題工具板**：依設施與工程類型查詢生態關注議題。
- **數位地圖工具**：輸入經緯度座標後，輔助檢視外部 Google My Maps 圖資。
- **FAQ 知識庫**：整理生態檢核作業常見問題。
- **植栽建議工具**：提供原生植栽推薦模組的前端介面雛形。
- **Ecocheck AI 智慧助手入口**：目前為外部入口連結／介面入口，實際後端整合狀態需確認。

> 本 README 依照目前程式碼與 `package.json` 撰寫，避免列入尚未在專案中實作的部署、資料庫或 API 流程。

---

## 1. 專案狀態總覽

| 項目 | 目前狀態 |
| --- | --- |
| 前端框架 | React 19 + TypeScript |
| 建置工具 | Vite 6 |
| 樣式 | Tailwind CSS 4（透過 `@tailwindcss/vite`） |
| 路由 | React Router DOM 7 |
| 動畫 | motion |
| 圖示 | lucide-react |
| 主要資料來源 | 前端靜態資料檔 `src/data/*` |
| 後端 API | 需確認；目前 `src` 未看到實際 API 呼叫 |
| 資料庫 | 需確認；目前未看到 Supabase、D1、PostgreSQL 等資料庫設定 |
| Cloudflare / Wrangler | 需確認；目前專案內未看到 `wrangler.toml` |
| Gemini API | 需確認；套件與 `.env.example` 有保留設定，但目前 `src` 未看到實際呼叫 |

---

## 2. 目錄結構

```text
.
├── README.md
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── src
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── types.ts
    ├── components
    │   ├── Layout.tsx
    │   └── ContourOverlay.tsx
    ├── data
    │   ├── faqData.ts
    │   └── issuesData.ts
    └── pages
        ├── Dashboard.tsx
        ├── DigitalMap.tsx
        ├── FAQList.tsx
        ├── FocusedIssues.tsx
        └── PlantingSuggestion.tsx
```

### 主要檔案說明

| 檔案 | 用途 |
| --- | --- |
| `src/main.tsx` | React 進入點 |
| `src/App.tsx` | 路由設定與頁面 lazy loading |
| `src/components/Layout.tsx` | 全站版面、側邊欄與導覽 |
| `src/pages/Dashboard.tsx` | 首頁工具入口儀表板 |
| `src/pages/FocusedIssues.tsx` | 關注議題查詢頁 |
| `src/pages/DigitalMap.tsx` | 數位地圖與座標查詢頁 |
| `src/pages/FAQList.tsx` | FAQ 知識庫頁 |
| `src/pages/PlantingSuggestion.tsx` | 植栽建議工具頁 |
| `src/data/issuesData.ts` | 關注議題靜態資料 |
| `src/data/faqData.ts` | FAQ 靜態資料 |
| `vite.config.ts` | Vite、React plugin、Tailwind plugin 與 alias 設定 |
| `.env.example` | 環境變數範例；目前是否實際使用需確認 |

---

## 3. 本機開發環境設定

以下步驟假設你尚未安裝任何工具，請依順序操作。

### 3.1 安裝 Node.js

1. 到 Node.js 官方網站下載 LTS 版本：
   - https://nodejs.org/
2. 安裝完成後，開啟終端機確認版本：

```bash
node -v
npm -v
```

建議使用 Node.js 20 以上版本。若團隊有指定版本，請以團隊版本為準。

### 3.2 取得專案程式碼

如果你尚未下載專案，請先在 GitHub 或指定 Git 平台取得專案網址，然後執行：

```bash
git clone <請替換成專案 Git URL>
cd eco-platform-kcg-wrb
```

如果你已經在專案資料夾內，確認目前路徑：

```bash
pwd
```

### 3.3 安裝套件

本專案使用 `package-lock.json` 鎖定套件版本，建議使用：

```bash
npm ci
```

若你是第一次建立或需要重新整理 lockfile，才使用：

```bash
npm install
```

---

## 4. 環境變數設定

專案內有 `.env.example`，目前列出：

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

但依目前 `src` 程式碼檢查，尚未看到前端頁面實際讀取 `GEMINI_API_KEY`、`APP_URL` 或呼叫 Gemini API。

因此目前本機啟動前：

- 若只是開啟現有前端頁面：通常不需要設定環境變數。
- 若後續要接 Gemini、AI Studio、Cloud Run 或其他後端：需確認實際使用方式後再補完整設定流程。

如需先建立本機環境檔，可執行：

```bash
cp .env.example .env.local
```

然後依需求編輯 `.env.local`。

> 注意：不要把 `.env.local`、API key、token 或密碼提交到 Git。

---

## 5. 啟動開發伺服器

執行：

```bash
npm run dev
```

目前 `package.json` 內的 dev 指令為：

```bash
vite --port=3000 --host=0.0.0.0
```

啟動後，在瀏覽器開啟：

```text
http://localhost:3000
```

若是在雲端開發環境或容器中執行，請使用該環境提供的 3000 port preview URL。

---

## 6. 可用指令

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 啟動 Vite 開發伺服器，port 3000 |
| `npm run build` | 建立 production 靜態檔案到 `dist/` |
| `npm run preview` | 預覽 build 後的靜態檔案 |
| `npm run lint` | 執行 TypeScript 型別檢查：`tsc --noEmit` |
| `npm run clean` | 刪除 `dist` 與 `server.js` |

---

## 7. 建置與預覽

### 7.1 型別檢查

```bash
npm run lint
```

### 7.2 建置 production 檔案

```bash
npm run build
```

成功後會產生：

```text
dist/
```

### 7.3 本機預覽 production build

```bash
npm run preview
```

Vite 會顯示可開啟的本機網址，請依終端機輸出為準。

---

## 8. 路由與頁面

目前路由定義在 `src/App.tsx`。

| 路徑 | 頁面 | 說明 |
| --- | --- | --- |
| `/` | `Dashboard` | 首頁工具入口 |
| `/issues` | `FocusedIssues` | 生態檢核工程關注議題工具 |
| `/map` | `DigitalMap` | 生態檢核作業數位地圖工具 |
| `/faq` | `FAQList` | 生態檢核作業 FAQ 工具 |
| `/plants` | `PlantingSuggestion` | 植栽建議工具 |

頁面元件採 lazy loading 載入，以降低初始 bundle 負擔。

---

## 9. 資料維護方式

### 9.1 關注議題資料

資料位於：

```text
src/data/issuesData.ts
```

維護原則：

1. 優先新增或修正既有資料欄位，不要任意改變資料結構。
2. 修改後請確認 `/issues` 頁面的設施、類型篩選仍可正常運作。
3. 若資料來源來自正式公文、調查報告或外部資料庫，請在 PR 說明中標示來源與更新日期。

### 9.2 FAQ 資料

資料位於：

```text
src/data/faqData.ts
```

維護原則：

1. 題目分類、題數與頁面顯示需保持一致。
2. 若新增或刪除題目，請同步檢查頁面中的總題數文字是否需要更新。
3. 法規、流程或平台操作類內容若有時效性，請標示「最後確認日期」。

---

## 10. 外部服務與需確認事項

以下項目目前在專案中有線索，但尚未看到完整實作或設定檔，因此不可直接假設已可使用。

### 10.1 Gemini / Google AI

目前狀態：

- `package.json` 有 `@google/genai`。
- `.env.example` 有 `GEMINI_API_KEY`。
- `metadata.json` 有 Gemini server-side capability 描述。
- 但目前 `src` 未看到 Gemini API 呼叫。

若後續要正式啟用 Gemini，需確認：

1. API 是放在前端、後端，或 AI Studio runtime。
2. API key 由哪個平台管理。
3. 是否需要建立 Google AI Studio API key。
4. 是否要新增 server endpoint，避免把 key 暴露在前端。

### 10.2 Cloudflare / Wrangler

目前狀態：

- 專案內未看到 `wrangler.toml`。
- 未看到 Cloudflare Workers、Pages Functions 或 D1 binding 設定。

若後續要部署到 Cloudflare，需確認：

1. 使用 Cloudflare Pages 還是 Workers。
2. 是否需要 D1、R2、KV 或其他 binding。
3. binding 名稱需與程式碼完全一致。
4. 若需要 `wrangler.toml`，必須補上明確設定與取得方式。

### 10.3 Supabase / 其他資料庫

目前狀態：

- 未看到 Supabase client、資料庫 URL、anon key 或 migration 檔案。

若後續要接 Supabase，需確認：

1. Supabase 專案建立在哪個帳號。
2. Project URL 與 anon key 如何取得。
3. 資料表 schema。
4. RLS policy。
5. 前端環境變數命名。

---

## 11. 開發協作規範

### 11.1 修改前檢查

每次修改前建議先確認：

```bash
git status
npm run lint
```

若已有未提交變更，請先確認是否為他人修改，避免覆蓋。

### 11.2 修改原則

1. 優先最小修改，不做無關重構。
2. 不任意更改路由名稱、資料結構或 API 命名。
3. 不新增大型框架依賴，除非 PR 中明確說明原因與替代方案。
4. 若資訊不確定，文件中請標示「需確認」，不要猜測。
5. UI 修改後請至少檢查相關頁面是否可正常開啟。

### 11.3 PR 說明需包含

每次 PR 建議包含：

```markdown
## 變更摘要
- 

## 測試方式
- 

## 尚未解決問題
- 

## 是否影響 production
- 是／否；原因：

## 回滾方式
- 
```

---

## 12. 常見問題排查

### 12.1 `npm ci` 失敗

請先確認 Node.js 與 npm 已安裝：

```bash
node -v
npm -v
```

若版本過舊，請升級 Node.js LTS 後再執行。

### 12.2 port 3000 被占用

目前 `npm run dev` 固定使用 port 3000。若 port 被占用，請先關閉佔用該 port 的程式，或暫時用 Vite 指令指定其他 port：

```bash
npx vite --port=3001 --host=0.0.0.0
```

### 12.3 頁面空白或路由無法開啟

請依序檢查：

```bash
npm run lint
npm run build
npm run dev
```

若 build 成功但重新整理子路由失敗，可能與部署平台的 SPA fallback 設定有關，需依實際部署平台補設定。

---

## 13. Production 影響說明

本專案目前以靜態前端為主。一般資料或 UI 修改會影響前端顯示；若涉及以下項目，需額外審查 production 風險：

- 新增或修改環境變數。
- 接入外部 API 或資料庫。
- 修改路由規則。
- 修改 build 或部署設定。
- 更動 `package.json` 依賴或版本。

---

## 14. 回滾方式

若 README 或一般前端修改造成問題，可使用 Git 回滾。

查看最近提交：

```bash
git log --oneline -5
```

回滾單一 commit：

```bash
git revert <commit-hash>
```

若只是尚未提交的本機修改，可查看差異後還原：

```bash
git diff
git checkout -- <檔案路徑>
```

> 注意：回滾前請先確認是否會覆蓋其他人的修改。
