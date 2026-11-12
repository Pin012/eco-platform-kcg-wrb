import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Map, Search, Target, AlertCircle } from 'lucide-react';
import RepositoryMap from '../components/RepositoryMap';
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
    // Recenter even when the same coordinates are submitted again.
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

      <RepositoryMap latitude={lat} longitude={lng} revision={mapKeys} />
    </div>
  );
}
