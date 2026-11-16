import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLayerManifest } from '../src/data/mapLayers';

test('accepts empty and multiple same-origin map layers with defaults', () => {
  assert.deepEqual(parseLayerManifest({ layers: [] }), []);
  const layers = parseLayerManifest({ layers: [
    { id: 'areas', name: '保育區', file: '保育區.zip' },
    { id: 'streams', name: '溪流', file: 'streams.geojson', color: '#123abc' },
  ] });
  assert.equal(layers[0].color, '#588157');
  assert.equal(layers[1].color, '#123abc');
});

test('rejects malformed manifests, duplicate ids, unsafe paths, and invalid colors', () => {
  const item = { id: 'areas', name: '保育區', file: 'areas.zip' };
  for (const invalid of [null, {}, { layers: [null] }, { layers: [item, item] },
    { layers: [{ ...item, name: '' }] }, { layers: [{ ...item, id: '' }] },
    ...['../data.zip', 'https://example.com/data.zip', 'a/b.zip', 'a\\b.zip', 'a.zip?x', 'data.shp'].map(file => ({ layers: [{ ...item, file }] })),
    { layers: [{ ...item, color: 'red' }] },
  ]) assert.throws(() => parseLayerManifest(invalid));
});
