# 生態檢核資訊系統整合平台｜開發筆記

本專案是以 React、TypeScript、Vite 與 Tailwind CSS 建置的前端工具平台，提供生態檢核相關的入口儀表板與多個作業輔助模組。

目前專案主要功能包含：

- **關注議題工具板**：依設施與工程類型查詢生態關注議題。
- **數位地圖工具**：輸入經緯度座標後，輔助檢視外部 Google My Maps 圖資。
- **FAQ 知識庫**：整理生態檢核作業常見問題。
- **生態保育措施**：依內部 Markdown 資料呈現主要措施、執行重點、設計建議與參考照片。
- **Ecocheck AI 智慧助手入口**：為不同網域的介面入口 Chat Bot，擁有獨立後端運算。

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
| 主要資料來源 | 易維護內容檔 `src/content/*`，由 `src/data/*` 轉成前端資料 |
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
├── public
│   ├── brand-icon.png
│   └── images
│       └── ecological-measures
│           ├── README.md
│           └── 重要棲地保留-01.webp
└── src
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── types.ts
    ├── components
    │   ├── Layout.tsx
    │   └── ContourOverlay.tsx
    ├── content
    │   ├── map.md
    │   ├── faq.md
    │   ├── issues.md
    │   └── ecoplan.md
    ├── data
    │   ├── contentParsers.ts
    │   ├── faqData.ts
    │   ├── issuesData.ts
    │   ├── mapData.ts
    │   └── ecoplanData.ts
    └── pages
        ├── Dashboard.tsx
        ├── DigitalMap.tsx
        ├── FAQList.tsx
        ├── FocusedIssues.tsx
        └── EcologicalMeasures.tsx
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
| `src/pages/EcologicalMeasures.tsx` | 生態保育措施頁 |
| `src/content/map.md` | 更換案件時修改地圖網址、預設座標及縮放層級 |
| `src/content/faq.md` | FAQ 知識庫內容，後續維護優先改此檔 |
| `src/content/issues.md` | 關注議題資料，後續維護優先改此檔 |
| `src/content/ecoplan.md` | 生態保育措施頁面文字與參考照片清單，後續維護只需改此檔 |
| `src/data/contentParsers.ts` | 將 Markdown 內容轉成前端可用資料 |
| `src/data/issuesData.ts` | 關注議題資料轉接檔，頁面 import 維持不變 |
| `src/data/faqData.ts` | FAQ Markdown 轉接檔，頁面 import 維持不變 |
| `src/data/mapData.ts` | 地圖 Markdown 設定轉接與數值檢查 |
| `src/data/ecoplanData.ts` | 生態保育措施 Markdown 轉接檔 |
| `vite.config.ts` | Vite、React plugin、Tailwind plugin 與 alias 設定 |
| `.env.example` | 環境變數範例；目前是否實際使用需確認 |

### 2.1 圖片檔案路徑與載入方式（2026-07-30 依目前程式碼確認）

目前專案**沒有後台圖片上傳頁面、上傳 API 或雲端儲存服務**。這裡的「上傳圖片」是指：將圖片放進 Git 專案的 `public/` 目錄、更新內容檔，經測試後提交 Git，再由既有部署流程發布。部署平台與 production 發布指令目前在專案內均**需確認**，不可直接假設是 Cloudflare、Supabase 或其他服務。

| 圖片種類 | 實際檔案或來源 | 程式使用位置 | 維護方式 |
| --- | --- | --- | --- |
| 網站品牌圖示（瀏覽器頁籤、Apple touch icon、頁首） | `public/brand-icon.png` | `index.html`、`src/components/Layout.tsx` | 用同名 PNG 覆蓋；程式固定讀取 `/brand-icon.png` |
| 生態保育措施參考照片 | `public/images/ecological-measures/*` | 清單寫在 `src/content/ecoplan.md`；`src/data/ecoplanData.ts` 組成 `/images/ecological-measures/<檔名>`；`src/pages/EcologicalMeasures.tsx` 顯示 | 將 JPG、PNG 或 WebP 放進該資料夾，再於 Markdown 登記完全相同的檔名與說明 |
| 首頁數位地圖卡片背景 | Unsplash 外部網址，沒有存放在本專案 | `src/pages/Dashboard.tsx` | 目前只能修改程式碼中的網址；不是本專案的上傳檔案，外部網址可用性與授權仍需維護者確認 |
| 首頁網格背景 | 程式碼內嵌的 SVG data URL，沒有獨立圖片檔 | `src/pages/Dashboard.tsx` | 修改程式碼；不需也不能透過圖片資料夾上傳 |
| 介面功能圖示與地形線 | `lucide-react` 元件與 Canvas 即時繪製，沒有獨立圖片檔 | `src/pages/*`、`src/components/*` | 修改元件程式碼；不是圖片上傳範圍 |

Vite 會在建置時把 `public/` 的內容複製到 `dist/` 根目錄。因此原始檔 `public/brand-icon.png` 的網站路徑是 `/brand-icon.png`，而 `public/images/ecological-measures/照片.webp` 的網站路徑是 `/images/ecological-measures/照片.webp`。請勿在 Markdown 中填入 `public/`，也不要手動修改或提交建置產物 `dist/`。

#### A. 新增生態保育措施照片（目前唯一的內容圖片新增方式）

以下指令都在專案根目錄 `eco-platform-kcg-wrb` 執行：

1. 先準備圖片。支援 JPG、PNG 或 WebP；建議使用 WebP、橫式約 4:3、寬度至少 1200 像素。
2. 將圖片命名為「`措施名稱-兩位數流水號.副檔名`」，例如 `重要棲地保留-02.webp`。檔名不可包含 `/`、`\`、`:`、`*`、`?`、`"`、`<`、`>`、`|`。
3. 將本機圖片複製到專案；請把範例來源路徑換成你的實際檔案位置：

   ```bash
   cp "/請替換成圖片所在路徑/重要棲地保留-02.webp" "public/images/ecological-measures/重要棲地保留-02.webp"
   ```

4. 開啟 `src/content/ecoplan.md`，在對應措施的 `### 參考照片` 下加入一行：

   ```markdown
   - 重要棲地保留-02.webp｜請填寫照片說明
   ```

   `｜` 前的檔名必須與實際檔案逐字相同（包含中文字、流水號、副檔名與大小寫）。請直接填檔名，不要加 `public/` 或完整網址。同一措施可逐行加入多張照片；沒有照片時保留空白的 `### 參考照片`。
5. 安裝套件（尚未安裝時才需要），再依序檢查：

   ```bash
   npm ci
   npm run lint
   npm run build
   npm run dev
   ```

6. 在瀏覽器開啟 `http://localhost:3000/plants`，選取對應措施，確認圖片、裁切與說明。若顯示預留圖示，先核對步驟 3 的實際檔名與步驟 4 的 Markdown 檔名。
7. 確認無誤後提交 Git；`<分支名稱>` 與提交訊息可依團隊規範調整：

   ```bash
   git status
   git switch -c <分支名稱>
   git add public/images/ecological-measures/ src/content/ecoplan.md
   git commit -m "新增生態保育措施參考照片"
   git push -u origin <分支名稱>
   ```

8. 到專案實際使用的 Git 平台（例如 GitHub）建立 Pull Request，審核合併後再走團隊既有發布流程。**目前 Git remote、代管平台、登入方式、token 建立方式與 production 部署流程均未記錄在此專案，需向專案管理者確認後才能執行 `git push` 與發布。**

更完整的照片命名規則也可查看 `public/images/ecological-measures/README.md`。

#### B. 更換品牌圖示

1. 準備 PNG 圖片並命名為 `brand-icon.png`。
2. 先備份現有檔案，再用新檔覆蓋：

   ```bash
   cp public/brand-icon.png public/brand-icon.png.bak
   cp "/請替換成新圖示所在路徑/brand-icon.png" public/brand-icon.png
   npm run lint
   npm run build
   npm run dev
   ```

3. 開啟 `http://localhost:3000`，確認瀏覽器頁籤與頁首圖示。確認完成後刪除本機備份 `public/brand-icon.png.bak`，不要將備份加入 Git。
4. 依前一節步驟 7、8 提交 Pull Request 與發布；不需修改檔名或程式路徑。

#### 圖片修改風險與回滾

- **風險**：檔名不一致會顯示預留圖示；大檔案會增加下載量；直接刪除仍被 Markdown 引用的照片會造成破圖；外部 Unsplash 圖片可能因網路、來源變更或授權狀態而無法顯示。
- **回滾尚未提交的變更**：先用 `git status` 確認，再用 `git restore src/content/ecoplan.md public/brand-icon.png` 還原追蹤中的檔案；新加入且尚未追蹤的圖片請確認檔名後手動刪除。
- **回滾已合併變更**：在 Git 平台對該次 Pull Request 執行 Revert，或由維護者執行 `git revert <需回滾的提交 ID>`，重新測試後再依既有流程發布；不要用強制推送改寫 production 分支歷史。

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


### 7.5 維護內容資料

後續若只要替換地圖、FAQ、生態保育措施或關注議題資料，優先修改 `src/content` 內的內容檔，不需要改 React 頁面。

| 內容 | 維護檔案 | 注意事項 |
| --- | --- | --- |
| 數位地圖 | `src/content/map.md` | 更換案件時只修改檔案內的 5 個值：兩張完整地圖網址、預設緯度、預設經度及預設縮放層級。保留欄位名稱、冒號與其他說明文字。 |
| FAQ 知識庫 | `src/content/faq.md` | 每個分類使用 `##`，每題使用 `###`；答案可保留目前頁面已支援的 HTML 片段。 |
| 生態保育措施 | `src/content/ecoplan.md`、`public/images/ecological-measures/` | 每個 `##` 是一項左欄頁籤；內含 `### 執行重點`、`### 設計建議`、`### 參考照片`。文字均在 Markdown 維護；照片使用 `- 中文檔名.webp｜中文說明`，完整放置與命名步驟請見圖片資料夾內的 README。 |
| 關注議題 | `src/content/issues.md` | 每組資料使用 `## 設施名稱｜工程類型`；依範例填寫中文欄位，不需編輯 JSON。棲地與物種使用「、」分隔，每項保育原則使用一行 `- ` 清單。 |

修改後請依序執行：

```bash
npm run lint
npm run build
```

## 8. 路由與頁面

目前路由定義在 `src/App.tsx`。

| 路徑 | 頁面 | 說明 |
| --- | --- | --- |
| `/` | `Dashboard` | 首頁工具入口 |
| `/issues` | `FocusedIssues` | 生態檢核工程關注議題工具 |
| `/map` | `DigitalMap` | 生態檢核作業數位地圖工具 |
| `/faq` | `FAQList` | 生態檢核作業 FAQ 工具 |
| `/plants` | `EcologicalMeasures` | 生態保育措施 |

頁面元件採 lazy loading 載入，以降低初始 bundle 負擔。

---

## 9. 資料維護方式

### 9.1 關注議題資料

資料位於：

```text
src/content/issues.md
```

不需要修改程式碼或 JSON。請依下列順序維護：

1. 用文字編輯器開啟 `src/content/issues.md`。
2. 找到既有的 `## 設施名稱｜工程類型` 區塊；若要新增組合，請複製一整個既有區塊再修改。
3. 依照檔案內的中文欄位填入資料。棲地與物種之間使用全形頓號「、」分隔。
4. 每個議題使用 `### 議題名稱`，每項生態保育原則各自使用一行 `- ` 清單。
5. 儲存後執行 `npm run lint` 與 `npm run build`，再開啟 `/issues` 確認篩選與內容。

可直接複製的最小範例如下：

```markdown
## 設施名稱｜工程類型

- 設施簡介：請填寫
- 敏感程度：低
- 關注團體：請填寫
- 棲地：河川、草生地
- 物種：物種甲、物種乙

### 議題名稱

- 議題說明：請填寫

#### 生態保育原則

- [迴避] 請填寫措施
- [減輕] 請填寫措施
```

> 請保留 `##`、`###`、`####`、中文欄位名稱、全形冒號「：」與標題中的全形直線「｜」，程式會依這些標記讀取資料。

維護原則：

1. 優先新增或修正既有資料欄位，不要任意改變標題層級與欄位名稱。
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
