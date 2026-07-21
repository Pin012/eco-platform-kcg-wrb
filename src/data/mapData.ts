import mapSettingsMarkdown from '../content/00-地圖設定-請改這裡.md?raw';

const readSetting = (label: string) => {
  const prefix = `- ${label}:`;
  const line = mapSettingsMarkdown.split('\n').find((item) => item.startsWith(prefix));
  const value = line?.slice(prefix.length).trim();

  if (!value) {
    throw new Error(`地圖設定缺少「${label}」，請檢查 src/content/00-地圖設定-請改這裡.md`);
  }

  return value;
};

const readNumberSetting = (label: string, min?: number, max?: number) => {
  const value = Number(readSetting(label));

  if (!Number.isFinite(value)) {
    throw new Error(`地圖設定「${label}」必須是數字`);
  }

  if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
    throw new Error(`地圖設定「${label}」必須是 ${min} 到 ${max} 之間的數字`);
  }

  return value;
};

export const mapSettings = {
  firstMapUrl: readSetting('第一張地圖網址'),
  secondMapUrl: readSetting('第二張地圖網址'),
  defaultLatitude: readNumberSetting('預設緯度', -90, 90),
  defaultLongitude: readNumberSetting('預設經度', -180, 180),
  defaultZoom: readNumberSetting('預設縮放層級'),
};
