---
title: 植栽建議工具
lastUpdated: 2026-07-21
note: 以下為前端排版確認用假資料，正式上線前請替換為審定植栽資料。
---

# 植栽建議資料維護說明

> 這個檔案控制網站「植栽建議」頁面的環境分組、篩選條件與植栽卡片。只要用文字編輯器修改並儲存即可；只有新增本機圖片時需要把圖片放入指定資料夾。

> 修改步驟：先複製一份本檔案備份 → 找到要調整的環境分組或植栽 → 依下方格式修改 → 儲存 → 在專案根目錄執行 `npm run dev` → 開啟終端機顯示的網址並進入「植栽建議」測試篩選及圖片。

## 維護時務必遵守

1. 檔案最上方兩條 `---` 之間是頁面設定：`title` 是頁面名稱、`lastUpdated` 是更新日期（格式固定為 `西元年-月-日`）、`note` 是頁面提醒文字。
2. 一個環境分組固定使用 `## 分組名稱`，其下依序填 `id:`、`altitude:`、`sunlight:`、`soil:`。`id` 不可重複，且只使用小寫英文字母、數字及連字號，例如 `wetland-edge`。
3. 一種植栽固定使用 `### 植栽名稱`，其下 7 個欄位 `imageFile`、`image`、`type`、`tags`、`summary`、`maintenance` 都必須保留；欄位名稱、開頭的 `- ` 及半形冒號不可更改。
4. 優先使用本機圖片：將 `.png`、`.jpg`、`.jpeg`、`.webp` 或 `.svg` 圖片放入 `src/assets/plants/`，並在 `imageFile` 填完整檔名（包含副檔名）。檔名大小寫必須完全相同，建議只使用小寫英文字母、數字及連字號。
5. `image` 是備用的網路圖片完整網址；找不到 `imageFile` 時才會顯示。若沒有備用圖片仍需保留 `- image:`，冒號右側可留白。
6. 多個 `tags` 必須使用中文頓號「、」分隔。`altitude`、`sunlight`、`soil`、`type` 與 `tags` 的用字應沿用既有資料，避免同一條件因不同寫法變成兩個篩選選項。
7. `##`、`###` 和其後空格不可刪除。新增資料時，請複製一個格式完整的既有分組或植栽區塊再修改；刪除時也應刪除完整區塊。
8. 若圖片未顯示，依序檢查圖片是否位於 `src/assets/plants/`、檔名及副檔名是否一致；若頁面顯示異常，先還原備份，再逐項重做修改。

> 正式資料從下方第一個 `##` 環境分組開始；本段「維護時務必遵守」不會顯示成植栽資料。

## 低海拔河岸綠帶
id: lowland-riparian
altitude: 低海拔 (0-500m)
sunlight: 全日照
soil: 砂質壤土 (排水佳)
### 九芎
- imageFile: lagerstroemia-subcostata.jpg
- image: https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=600&q=80
- type: 落葉喬木
- tags: 原生種、耐旱、誘鳥
- summary: 適合低海拔河岸與道路邊坡，樹形明顯，可作為綠帶骨架樹種。
- maintenance: 初期需澆灌與除草，成株後維護量低。

### 水柳
- imageFile: salix-warburgii.jpg
- image: https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80
- type: 小喬木
- tags: 親水、護岸、蜜源
- summary: 適合溪流、滯洪池與排水周邊，可協助營造水岸過渡帶。
- maintenance: 建議栽植於水分較穩定區域，避免長期乾旱。

## 都市公園半日照
id: urban-park
altitude: 低海拔 (0-500m)
sunlight: 半日照
soil: 一般壤土
### 樟樹
- imageFile: cinnamomum-camphora.jpg
- image: https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80
- type: 常綠喬木
- tags: 原生種、遮蔭、耐修剪
- summary: 適合作為公園及校園遮蔭喬木，冠幅大，景觀辨識度高。
- maintenance: 須預留根系與冠幅空間，避免過度密植。

### 月橘
- imageFile: murraya-paniculata.jpg
- image: https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=600&q=80
- type: 灌木
- tags: 常綠、誘蝶、綠籬
- summary: 可配置於步道邊界或複層植栽下層，提供香花及昆蟲資源。
- maintenance: 可定期修剪成綠籬，但建議保留部分開花枝條。

## 邊坡復育耐旱組合
id: slope-restoration
altitude: 中海拔 (500-1500m)
sunlight: 全日照
soil: 砂質壤土 (排水佳)
### 臺灣欒樹
- imageFile: koelreuteria-henryi.jpg
- image: https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80
- type: 落葉喬木
- tags: 原生種、景觀、耐旱
- summary: 適合開闊地與邊坡平台，花果季節變化明顯，可增加景觀層次。
- maintenance: 幼苗期需支架固定，颱風季前檢查樹勢。

### 山黃梔
- imageFile: gardenia-jasminoides.jpg
- image: https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80
- type: 灌木
- tags: 原生種、誘鳥、坡地
- summary: 可作為坡地灌木層，提供果實與棲地遮蔽。
- maintenance: 初期注意雜草競爭，成株後可粗放管理。

### ABCABC
- imageFile: gardenia-jasminoides.jpg
- image: https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80
- type: 灌木
- tags: 原生種、誘鳥、坡地
- summary: 可作為坡地灌木層，提供果實與棲地遮蔽。
- maintenance: 初期注意雜草競爭，成株後可粗放管理。
