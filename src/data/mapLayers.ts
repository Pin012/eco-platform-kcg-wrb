export interface MapLayerConfig {
  id: string;
  name: string;
  file: string;
  color: string;
}

// Restrict data to same-origin files shipped with the application.
export function parseLayerManifest(value: unknown): MapLayerConfig[] {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { layers?: unknown }).layers)) {
    throw new Error('圖層清單格式錯誤，請檢查 maps/layers.json。');
  }
  const ids = new Set<string>();
  return (value as { layers: unknown[] }).layers.map((entry) => {
    if (!entry || typeof entry !== 'object') throw new Error('圖層設定必須是物件。');
    const item = entry as Record<string, unknown>;
    if (typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id)) throw new Error('圖層 id 必須非空白且不重複。');
    ids.add(item.id);
    if (typeof item.name !== 'string' || !item.name.trim()) throw new Error('圖層名稱不可空白。');
    if (typeof item.file !== 'string' || !/^[^/\\?#]+\.(zip|geojson|json)$/i.test(item.file) || item.file.includes('..')) {
      throw new Error(`「${item.name}」請使用 maps 資料夾內的 ZIP 或 GeoJSON 檔名。`);
    }
    if (item.color !== undefined && (typeof item.color !== 'string' || !/^#[0-9a-f]{6}$/i.test(item.color))) {
      throw new Error(`「${item.name}」顏色必須使用 #RRGGBB。`);
    }
    return { id: item.id, name: item.name, file: item.file, color: (item.color as string | undefined) ?? '#588157' };
  });
}
