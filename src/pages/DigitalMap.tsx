import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Map, Search, Target, AlertCircle } from 'lucide-react';
import { mapSettings } from '../data/mapData';

export default function DigitalMap() {
  const [lat, setLat] = useState<number>(mapSettings.defaultLatitude);
  const [lng, setLng] = useState<number>(mapSettings.defaultLongitude);
  
  const [inputLat, setInputLat] = useState<string>(String(mapSettings.defaultLatitude));
  const [inputLng, setInputLng] = useState<string>(String(mapSettings.defaultLongitude));
  
  const [error, setError] = useState<string>('');

  const [mapKeys, setMapKeys] = useState<number>(0);

  const handleSearch = () => {
    const x = Number(inputLng);
    const y = Number(inputLat);

    if (!inputLng.trim() || !inputLat.trim() || Number.isNaN(x) || Number.isNaN(y)) {
      setError('請輸入有效的數值座標（X=經度、Y=緯度；十進位度）。');
      return;
    }
    if (x < -180 || x > 180 || y < -90 || y > 90) {
      setError('座標超出範圍：X（經度）必須在 -180 至 180、Y（緯度）必須在 -90 至 90。');
      return;
    }

    setError('');
    setLat(y);
    setLng(x);
    // Force maps to re-render to apply the new center via URL
    setMapKeys(prev => prev + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-none h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 pl-2"
      >
        <h2 className="text-lg sm:text-2xl font-bold text-[#1B3022] tracking-tight flex items-center gap-2 sm:gap-3">
           <Map className="w-5 h-5 sm:w-7 sm:h-7 text-[#588157]" />
           生態檢核作業數位地圖工具
        </h2>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          Ver 1.0 (最後更新時間:2026-04-20)
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-[#D8E2DC] shadow-sm p-5 mb-6 flex flex-col md:flex-row gap-4 items-end"
      >
        <div className="flex-1 space-y-1.5">
          <label htmlFor="xCoord" className="text-[11px] font-bold text-gray-500 block">X 座標（經度，Longitude）</label>
          <input 
            id="xCoord" 
            type="number" 
            step="any"
            value={inputLng}
            onChange={(e) => setInputLng(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 bg-[#FBFBFB] border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#A3B18A] transition-colors"
            placeholder={`例如：${mapSettings.defaultLongitude}`}
          />
        </div>

        <div className="flex-1 space-y-1.5">
          <label htmlFor="yCoord" className="text-[11px] font-bold text-gray-500 block">Y 座標（緯度，Latitude）</label>
          <input 
            id="yCoord" 
            type="number" 
            step="any"
            value={inputLat}
            onChange={(e) => setInputLat(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 bg-[#FBFBFB] border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#A3B18A] transition-colors"
            placeholder={`例如：${mapSettings.defaultLatitude}`}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={handleSearch}
            className="flex-1 md:flex-none px-5 py-2.5 bg-[#3A5A40] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#2D4A32] transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> 搜尋
          </button>
          <button 
            onClick={handleSearch}
            className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" /> 回到座標中心
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 mb-10"
      >
        {/* Map 1 */}
        <div className="flex-1 flex flex-col space-y-3">
          <h2 className="text-center text-sm font-bold text-[#1B3022]">本地圖可初步用於快速判別工程是否需辦理生態檢核</h2>
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-[#D8E2DC] shadow-sm bg-gray-50 min-h-[300px] lg:min-h-[500px]">
            <iframe
              key={`map1-${mapKeys}`}
              src={`${mapSettings.firstMapUrl}&ll=${lat},${lng}&z=${mapSettings.defaultZoom}`}
              title="本地圖可初步用於快速判別工程是否需辦理生態檢核"
              className="absolute inset-0 w-full h-full border-none"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            {/* Center Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full text-3xl pointer-events-none drop-shadow-md select-none z-10" aria-label="輸入座標位置">
              📍
            </div>
          </div>
        </div>

        {/* Map 2 */}
        <div className="flex-1 flex flex-col space-y-3">
          <h2 className="text-center text-sm font-bold text-[#1B3022]">本地圖可用於進一步確認工程範圍內與其周遭的生態資訊</h2>
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-[#D8E2DC] shadow-sm bg-gray-50 min-h-[300px] lg:min-h-[500px]">
            <iframe
              key={`map2-${mapKeys}`}
              src={`${mapSettings.secondMapUrl}&ll=${lat},${lng}&z=${mapSettings.defaultZoom}`}
              title="本地圖可用於進一步確認工程範圍內與其周遭的生態資訊"
              className="absolute inset-0 w-full h-full border-none"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            {/* Center Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full text-3xl pointer-events-none drop-shadow-md select-none z-10" aria-label="輸入座標位置">
              📍
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
