export interface MapLayerConfig {
  id: string;
  name: string;
  file: string;
  color: string;
}

// Each level-two heading names a layer; fields stay easy to edit in Markdown.
export function parseLayerManifest(value: unknown): MapLayerConfig[] {
  if (typeof value !== 'string') throw new Error('圖層清單必須是 Markdown 文字。');
  const entries: Record<string, string>[] = [];
  let current: Record<string, string> | undefined;
  for (const raw of value.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || /^# (?!#)/.test(line)) continue;
    const heading = /^##\s+(.+)$/.exec(line);
    if (heading) { current = { name: heading[1].trim() }; entries.push(current); continue; }
    const field = /^-\s*(檔案|顏色)[：:]\s*(.*)$/.exec(line);
    if (!current || !field) throw new Error(`圖層清單格式錯誤：${line}。請檢查 maps/layers.md。`);
    const key = field[1] === '檔案' ? 'file' : 'color';
    if (key in current) throw new Error(`「${current.name}」的${field[1]}重複。`);
    current[key] = field[2].trim();
  }
  const ids = new Set<string>();
  return entries.map((entry) => {
    const item: Record<string, string> = { ...entry, id: entry.file };
    if (typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id)) throw new Error('圖層檔案必須填寫且不可重複。');
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
