import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseLayerManifest } from '../src/data/mapLayers';

test('reads Markdown layers, Chinese filenames, CRLF and default colors', () => {
  assert.deepEqual(parseLayerManifest('# 共用圖層\n'), []);
  const layers = parseLayerManifest('## 保育區\r\n- 檔案：保育區.zip\r\n\r\n## 溪流\n- 檔案：streams.geojson\n- 顏色：#123abc');
  assert.deepEqual(layers, [
    { id: '保育區.zip', name: '保育區', file: '保育區.zip', color: '#588157' },
    { id: 'streams.geojson', name: '溪流', file: 'streams.geojson', color: '#123abc' },
  ]);
});

test('rejects malformed Markdown, duplicate files and fields, unsafe paths and colors', () => {
  for (const invalid of [null, {}, '- 檔案：a.zip', '## 保育區', '## 保育區\n- 檔名：a.zip',
    '## 保育區\n- 檔案：a.zip\n- 檔案：b.zip',
    '## 保育區\n- 檔案：a.zip\n## 溪流\n- 檔案：a.zip',
    ...['../data.zip', 'https://example.com/data.zip', 'a/b.zip', 'a\\b.zip', 'a.zip?x', 'data.shp'].map(file => `## 保育區\n- 檔案：${file}`),
    '## 保育區\n- 檔案：a.zip\n- 顏色：red',
  ]) assert.throws(() => parseLayerManifest(invalid));
});

test('repository Markdown manifest references existing map files', () => {
  const layers = parseLayerManifest(readFileSync(new URL('../public/maps/layers.md', import.meta.url), 'utf8'));
  assert.equal(layers.length, 2);
  for (const layer of layers) assert.ok(readFileSync(new URL(`../public/maps/${layer.file}`, import.meta.url)).length > 0);
});
