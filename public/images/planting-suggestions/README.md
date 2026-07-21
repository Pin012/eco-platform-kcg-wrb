# 植栽建議卡片圖片放置說明

請將圖片直接放在本資料夾：

`public/images/planting-suggestions/`

不需要修改程式。請使用下列固定檔名，格式統一為 WebP：

| 河川／河段／目的 | 圖片檔名 |
|---|---|
| 淡水河／二重疏洪道出口至海口／固碳（藍碳） | `tamsui-estuary-blue-carbon.webp` |
| 淡水河／二重疏洪道出口至海口／河岸防風 | `tamsui-estuary-windbreak.webp` |
| 淡水河／二重疏洪道入口／生態保育 | `tamsui-erchong-conservation.webp` |
| 大漢溪／三峽河匯流口至新店溪匯流口／生態保育 | `dahan-conservation.webp` |
| 新店溪／福和橋至匯流口／生態保育 | `xindian-fuhe-conservation.webp` |
| 新店溪／秀朗橋至福和橋／生態保育 | `xindian-xiulang-conservation.webp` |
| 新店溪／直潭至碧潭／生物多樣性及景觀遊憩價值 | `xindian-bitan-biodiversity.webp` |
| 新店溪／屈尺至直潭／固碳（綠碳） | `xindian-quchi-green-carbon.webp` |
| 新店溪／屈尺至直潭／景觀遊憩價值 | `xindian-quchi-recreation.webp` |
| 新店溪／下龜山橋以上上游／固碳（綠碳） | `xindian-guishan-green-carbon.webp` |
| 新店溪／下龜山橋以上上游／生物多樣性價值 | `xindian-guishan-biodiversity.webp` |
| 基隆河／過港至四腳亭／景觀遊憩價值 | `keelung-sijiaoting-recreation.webp` |
| 基隆河／四腳亭至侯硐／生態保育 | `keelung-houtong-conservation.webp` |
| 橫溪／海山橋至橫溪橋／固碳（綠碳） | `hengxi-green-carbon.webp` |

## 操作步驟

1. 將原始圖片轉存成 `.webp`。
2. 按上表重新命名圖片；英文字母大小寫及副檔名必須完全一致。
3. 將圖片複製到 `public/images/planting-suggestions/`。
4. 在專案根目錄執行 `npm run dev`。
5. 開啟終端機顯示的網址，進入「植栽建議工具」並搜尋對應條件確認圖片。

建議使用橫式圖片，比例約 `16:7`，寬度至少 1200 像素。若檔案不存在或檔名錯誤，卡片會繼續顯示「圖片預留位置」，不會出現破圖圖示。
