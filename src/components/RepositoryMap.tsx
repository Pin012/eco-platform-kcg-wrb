import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { FeatureCollection } from 'geojson';
import shp from 'shpjs';
import 'leaflet/dist/leaflet.css';
import { parseLayerManifest, type MapLayerConfig } from '../data/mapLayers';
import { mapSettings } from '../data/mapData';

type LayerState = MapLayerConfig & { status: 'loading' | 'ready' | 'error'; visible: boolean; error?: string };

function validateFeatures(value: unknown): FeatureCollection {
  const data = value as FeatureCollection;
  if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) throw new Error('圖資必須是 GeoJSON FeatureCollection。');
  for (const feature of data.features) {
    if (!feature || feature.type !== 'Feature') throw new Error('圖資包含無效的 Feature。');
    const checkGeometry = (geometry: any) => {
      if (!geometry) return;
      if (geometry.type === 'GeometryCollection') { geometry.geometries.forEach(checkGeometry); return; }
      const check = (coordinates: any) => {
        if (!Array.isArray(coordinates)) throw new Error('圖資座標格式錯誤。');
        if (typeof coordinates[0] === 'number') {
          if (!Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1]) || Math.abs(coordinates[0]) > 180 || Math.abs(coordinates[1]) > 90) {
            throw new Error('圖資座標超出經緯度範圍，請確認 SHP 的 .prj 或將 GeoJSON 轉為 WGS84。');
          }
        } else coordinates.forEach(check);
      };
      check(geometry.coordinates);
    };
    checkGeometry(feature.geometry);
  }
  return data;
}

export default function RepositoryMap({ latitude, longitude, revision }: { latitude: number; longitude: number; revision: number }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.CircleMarker | null>(null);
  const overlays = useRef(new Map<string, L.GeoJSON>());
  const [layers, setLayers] = useState<LayerState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tileError, setTileError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const instance = L.map(container.current!).setView([mapSettings.defaultLatitude, mapSettings.defaultLongitude], mapSettings.defaultZoom);
    map.current = instance;
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19,
    }).addTo(instance);
    tiles.on('tileerror', () => setTileError(true));
    marker.current = L.circleMarker([mapSettings.defaultLatitude, mapSettings.defaultLongitude], {
      radius: 8, color: '#ffffff', weight: 3, fillColor: '#d97706', fillOpacity: 1,
    }).addTo(instance).bindTooltip('輸入座標位置');
    const resize = new ResizeObserver(() => instance.invalidateSize());
    resize.observe(container.current!);
    return () => { resize.disconnect(); instance.remove(); map.current = null; marker.current = null; overlays.current.clear(); };
  }, []);

  useEffect(() => {
    map.current?.setView([latitude, longitude], mapSettings.defaultZoom);
    marker.current?.setLatLng([latitude, longitude]);
  }, [latitude, longitude, revision]);

  useEffect(() => {
    const controller = new AbortController();
    const instance = map.current!;
    overlays.current.forEach(layer => instance.removeLayer(layer));
    overlays.current.clear();
    setLoading(true); setError(''); setLayers([]);
    async function load() {
      try {
        const base = `${import.meta.env.BASE_URL}maps/`;
        const response = await fetch(`${base}layers.md`, { signal: controller.signal, cache: 'no-cache' });
        if (!response.ok) throw new Error(`無法讀取圖層清單（HTTP ${response.status}）。`);
        const configs = parseLayerManifest(await response.text());
        if (controller.signal.aborted) return;
        setLayers(configs.map(config => ({ ...config, status: 'loading', visible: true })));
        await Promise.all(configs.map(async config => {
          try {
            const response = await fetch(`${base}${encodeURIComponent(config.file)}`, { signal: controller.signal, cache: 'no-cache' });
            if (!response.ok) throw new Error(`下載失敗（HTTP ${response.status}）。`);
            const parsed = /\.zip$/i.test(config.file) ? await shp(await response.arrayBuffer()) : await response.json();
            const collections = (Array.isArray(parsed) ? parsed : [parsed]).map(validateFeatures);
            const collection: FeatureCollection = { type: 'FeatureCollection', features: collections.flatMap(data => data.features) };
            if (controller.signal.aborted) return;
            const overlay = L.geoJSON(collection, {
              style: { color: config.color, weight: 2, fillOpacity: 0.2 },
              pointToLayer: (_feature, latlng) => L.circleMarker(latlng, { radius: 6, color: config.color, fillOpacity: 0.75 }),
              onEachFeature(feature, layer) {
                const content = document.createElement('div');
                const title = document.createElement('strong'); title.textContent = config.name; content.append(title);
                const entries = Object.entries(feature.properties ?? {});
                for (const [key, value] of entries) {
                  const row = document.createElement('div');
                  row.textContent = `${key}：${typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')}`;
                  content.append(row);
                }
                if (!entries.length) content.append(document.createTextNode('（無屬性資料）'));
                content.style.maxHeight = '240px'; content.style.overflow = 'auto';
                layer.bindPopup(content);
              },
            }).addTo(instance);
            overlays.current.set(config.id, overlay);
            setLayers(previous => previous.map(item => item.id === config.id ? { ...item, status: 'ready' } : item));
          } catch (error) {
            if (!controller.signal.aborted) setLayers(previous => previous.map(item => item.id === config.id ? { ...item, status: 'error', error: error instanceof Error ? error.message : '讀取失敗。' } : item));
          }
        }));
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : '無法載入圖層清單。');
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);

  const toggle = (id: string) => {
    setLayers(previous => previous.map(item => {
      if (item.id !== id) return item;
      const layer = overlays.current.get(id);
      if (layer && map.current) { if (item.visible) map.current.removeLayer(layer); else layer.addTo(map.current); }
      return { ...item, visible: !item.visible };
    }));
  };
  return <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] pb-8">
    <aside className="rounded-2xl border border-[#D8E2DC] bg-white p-5 space-y-4">
      <h3 className="font-bold text-[#1B3022]">共用圖層</h3>
      <p className="text-xs text-gray-500">點選圖層標籤切換顯示範圍，點選圖徵查看屬性。橘色圓點為輸入座標。</p>
      {loading && <p role="status" className="text-sm text-gray-600">正在載入圖資…</p>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {!loading && !error && layers.length === 0 && <p className="text-sm text-gray-600">尚未加入共用圖資，請由維護者更新圖層清單。</p>}
      {layers.map(layer => <div key={layer.id} className="space-y-1">
        <button
          type="button"
          aria-pressed={layer.visible}
          disabled={layer.status !== 'ready'}
          onClick={() => toggle(layer.id)}
          className="w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait"
          style={{
            backgroundColor: layer.visible ? layer.color : '#ffffff',
            borderColor: layer.visible ? layer.color : '#e5e7eb',
            color: layer.visible ? '#ffffff' : '#1B3022',
            fontWeight: layer.visible ? 700 : 400,
          }}
        >{layer.name}</button>
        {layer.status === 'error' && <p role="alert" className="text-xs text-red-700">{layer.error}</p>}
      </div>)}
      {(error || layers.some(layer => layer.status === 'error')) && <button type="button" onClick={() => setAttempt(value => value + 1)} className="text-sm underline">重新載入圖資</button>}
    </aside>
    <div className="min-w-0 space-y-2">
      {tileError && <p role="status" className="text-sm text-amber-800">部分底圖無法載入，請確認網路連線；共用圖層與座標定位仍可使用。</p>}
      <div ref={container} role="region" aria-label="共用生態圖資地圖" className="relative z-0 h-[540px] min-h-[360px] w-full rounded-2xl border border-[#D8E2DC] bg-[#edf1ec]" />
      <p className="text-xs text-gray-500">圖資供生態資訊查閱參考，實際判定仍應依主管機關最新公告。</p>
    </div>
  </div>;
}
