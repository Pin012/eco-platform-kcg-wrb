import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Leaf, Search, Trees, Filter, RotateCcw } from 'lucide-react';
import { plantMeta, plantRecommendationGroups } from '../data/plantData';

export default function PlantingSuggestion() {
  const [selectedAltitude, setSelectedAltitude] = useState('');
  const [selectedSunlight, setSelectedSunlight] = useState('');
  const [selectedSoil, setSelectedSoil] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const altitudeOptions = useMemo(() => Array.from(new Set(plantRecommendationGroups.map((group) => group.altitude))), []);
  const sunlightOptions = useMemo(() => Array.from(new Set(plantRecommendationGroups.map((group) => group.sunlight))), []);
  const soilOptions = useMemo(() => Array.from(new Set(plantRecommendationGroups.map((group) => group.soil))), []);

  const filteredGroups = useMemo(() => {
    if (!hasSearched) return plantRecommendationGroups;
    return plantRecommendationGroups.filter((group) => (
      (!selectedAltitude || group.altitude === selectedAltitude) &&
      (!selectedSunlight || group.sunlight === selectedSunlight) &&
      (!selectedSoil || group.soil === selectedSoil)
    ));
  }, [hasSearched, selectedAltitude, selectedSoil, selectedSunlight]);

  const handleReset = () => {
    setSelectedAltitude('');
    setSelectedSunlight('');
    setSelectedSoil('');
    setHasSearched(false);
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-none h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pl-2"
      >
        <h2 className="text-lg sm:text-2xl font-bold text-[#1B3022] tracking-tight flex items-center gap-2 sm:gap-3">
          <Leaf className="w-5 h-5 sm:w-7 sm:h-7 text-[#588157]" />
          {plantMeta.title || '植栽建議工具'}
        </h2>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          依據工區環境特性，提供原生樹種與綠覆率改善計畫建議。最後更新：{plantMeta.lastUpdated}
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 lg:col-span-3 bg-white rounded-2xl border border-[#D8E2DC] shadow-sm p-5 flex flex-col h-fit"
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <h3 className="font-bold text-[#1B3022] text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#588157]" /> 環境條件篩選
            </h3>
            <button onClick={handleReset} className="text-[10px] text-gray-400 hover:text-[#588157] flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> 清除
            </button>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">海拔高度</label>
              <select value={selectedAltitude} onChange={(event) => setSelectedAltitude(event.target.value)} className="w-full p-2 text-sm bg-[#FBFBFB] border border-gray-200 rounded-lg text-gray-600 focus:outline-none">
                <option value="">全部海拔</option>
                {altitudeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">日照條件</label>
              <select value={selectedSunlight} onChange={(event) => setSelectedSunlight(event.target.value)} className="w-full p-2 text-sm bg-[#FBFBFB] border border-gray-200 rounded-lg text-gray-600 focus:outline-none">
                <option value="">全部日照</option>
                {sunlightOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">土壤特性</label>
              <select value={selectedSoil} onChange={(event) => setSelectedSoil(event.target.value)} className="w-full p-2 text-sm bg-[#FBFBFB] border border-gray-200 rounded-lg text-gray-600 focus:outline-none">
                <option value="">全部土壤</option>
                {soilOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            
            <button onClick={() => setHasSearched(true)} className="w-full mt-4 py-2 bg-[#3A5A40] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#2D4A32] transition-colors flex items-center justify-center gap-2">
              <Search className="w-3 h-3" /> 搜尋適合樹種
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-8 lg:col-span-9 bg-[#FBFBFB] rounded-2xl border border-[#D8E2DC] shadow-inner p-5 min-h-[400px]"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#1B3022] flex items-center gap-2"><Trees className="w-5 h-5 text-[#588157]" /> 原生植栽推薦</h3>
              <p className="text-xs text-gray-500 mt-1">{plantMeta.note}</p>
            </div>
            <span className="text-[11px] bg-white border border-[#D8E2DC] text-[#3A5A40] px-3 py-1 rounded-full shrink-0">{filteredGroups.length} 組建議</span>
          </div>

          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filteredGroups.map((group) => (
                <article key={group.id} className="bg-white rounded-2xl border border-[#D8E2DC] shadow-sm overflow-hidden">
                  <img src={group.image} alt={`${group.title}示意圖`} className="w-full h-44 object-cover" loading="lazy" />
                  <div className="p-5">
                    <h4 className="font-bold text-[#1B3022] mb-2">{group.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[group.altitude, group.sunlight, group.soil].map((tag) => <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-[#F2F5F0] text-[#3A5A40] border border-[#D8E2DC]">{tag}</span>)}
                    </div>
                    <div className="space-y-3">
                      {group.plants.map((plant) => (
                        <section key={plant.name} className="rounded-xl bg-[#FBFBFB] border border-gray-100 p-4">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <h5 className="font-bold text-sm text-[#2D3436]">{plant.name}</h5>
                            <span className="text-[11px] text-gray-500">{plant.type}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">{plant.summary}</p>
                          <p className="text-[11px] text-gray-500 leading-relaxed">維護：{plant.maintenance}</p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {plant.tags.map((tag) => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">{tag}</span>)}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
              <Trees className="w-20 h-20 text-[#A3B18A] mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-[#1B3022] mb-2">查無符合條件的假資料</h3>
              <p className="text-sm text-gray-500">請清除篩選條件，或到 src/content/plants.md 新增對應條件的植栽建議。</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
