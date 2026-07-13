import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MapPinned, Search, RotateCcw } from 'lucide-react';
import { issuesData } from '../data/issuesData';

export default function FocusedIssues() {
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchParams, setSearchParams] = useState({ facility: '', type: '' });
  const [hasSearched, setHasSearched] = useState(false);

  // Available options based on selection
  const facilityOptions = useMemo(() => {
    return Array.from(new Set(issuesData.map(d => d.facilities).filter(Boolean)));
  }, []);

  const typeOptions = useMemo(() => {
    return Array.from(new Set(
      issuesData
        .filter(d => !selectedFacility || d.facilities === selectedFacility)
        .map(d => d.type)
        .filter(Boolean)
    ));
  }, [selectedFacility]);

  // Executed search results
  const filteredData = useMemo(() => {
    if (!hasSearched) return [];
    return issuesData.filter(item =>
      (!searchParams.facility || item.facilities === searchParams.facility) &&
      (!searchParams.type || item.type === searchParams.type)
    );
  }, [searchParams, hasSearched]);

  const handleSearch = () => {
    setSearchParams({ facility: selectedFacility, type: selectedType });
    setHasSearched(true);
  };

  const handleReset = () => {
    setSelectedFacility('');
    setSelectedType('');
    setSearchParams({ facility: '', type: '' });
    setHasSearched(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Derive aggregated info from search results
  const firstResult = filteredData[0];
  
  const aggregatedIssues = useMemo(() => {
    if (!filteredData.length) return [];
    const allIssues: any[] = [];
    filteredData.forEach(item => {
      if (Array.isArray(item.issues)) {
        item.issues.forEach(iss => allIssues.push(iss));
      }
    });

    // Deduplicate
    const seen = new Set();
    const deduped: any[] = [];
    allIssues.forEach(iss => {
      const t = (iss.title || '').trim();
      const d = (iss.description || '').trim();
      const p = Array.isArray(iss.principle) ? iss.principle.join('|') : (iss.principle || '');
      const key = `${t}__${d}__${p}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(iss);
      }
    });
    return deduped;
  }, [filteredData]);

  // Styling helpers
  const getSensitivityClass = (s: string) => {
    const t = String(s || '').trim();
    if (t.includes('高')) return 'bg-red-100 text-red-800 border cursor-default border-red-200';
    if (t.includes('中')) return 'bg-amber-100 text-amber-800 border cursor-default border-amber-200';
    if (t.includes('低')) return 'bg-emerald-100 text-emerald-800 border cursor-default border-emerald-200';
    return 'bg-amber-100 text-amber-800 border cursor-default border-amber-200';
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-none h-full flex flex-col" onKeyDown={handleKeyDown}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 pl-2 flex items-center justify-between"
      >
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-[#1B3022] tracking-tight flex items-center gap-2 sm:gap-3">
             <MapPinned className="w-5 h-5 sm:w-7 sm:h-7 text-[#588157]" />
             生態檢核作業工程關注議題工具
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Ver 1.0 (最後更新時間: 2026-04-20)
          </p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-[#D8E2DC] shadow-sm p-5 mb-6 flex flex-wrap gap-4 items-end"
      >
        <div className="flex-1 min-w-[240px] flex flex-col gap-2">
          <label htmlFor="facilities" className="text-xs font-bold text-gray-500 ml-1">設施</label>
          <select 
            id="facilities" 
            className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#FBFBFB] text-[#2D3436] text-sm focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
          >
            <option value="">選擇設施</option>
            {facilityOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[240px] flex flex-col gap-2">
          <label htmlFor="type" className="text-xs font-bold text-gray-500 ml-1">工程類型</label>
          <select 
            id="type" 
            className="w-full p-2.5 rounded-xl border border-gray-200 bg-[#FBFBFB] text-[#2D3436] text-sm focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">選擇工程類型</option>
            {typeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mt-4 w-full md:w-auto">
          <button 
            onClick={handleSearch}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3A5A40] hover:bg-[#2D4A32] text-white text-sm font-bold rounded-xl transition-colors shadow-sm active:scale-95"
          >
            <Search className="w-4 h-4" /> 搜尋
          </button>
          <button 
            onClick={handleReset}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-bold rounded-xl transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> 重設
          </button>
        </div>
      </motion.div>

      {/* Results Area */}
      {hasSearched && filteredData.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex-1 flex flex-col gap-6 w-full"
        >
          {/* Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {firstResult?.introduction && (
                <div className="bg-white rounded-2xl border border-[#D8E2DC] shadow-sm p-6 line-height-relaxed h-full">
                  <h3 className="text-sm font-bold text-[#3A5A40] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-[#588157] rounded-sm"></span> 重要設施簡介
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {firstResult.introduction}
                  </p>
                  
                  {firstResult?.group && (
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-500 mb-2">關注保育團體</h4>
                      <p className="text-sm text-gray-700">{firstResult.group}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4 lg:col-span-1">
               {firstResult?.sensitivity && (
                 <div className={`rounded-2xl p-6 shadow-sm flex items-center justify-between ${getSensitivityClass(firstResult.sensitivity)}`}>
                   <span className="font-bold text-sm">生態敏感程度</span>
                   <span className="text-xl font-black">{firstResult.sensitivity}</span>
                 </div>
               )}

              {firstResult?.habitat && firstResult.habitat.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#D8E2DC] shadow-sm p-5">
                  <h4 className="text-xs font-bold text-gray-500 mb-3">涉及棲地類型</h4>
                  <div className="flex flex-wrap gap-2">
                    {firstResult.habitat.map((h, i) => (
                      <span key={i} className="px-3 py-1 bg-[#EEF2F5] text-[#344E41] text-xs font-medium rounded-full border border-gray-200/50">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {firstResult?.species && firstResult.species.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#D8E2DC] shadow-sm p-5">
                  <h4 className="text-xs font-bold text-gray-500 mb-3">關注物種類群</h4>
                  <div className="flex flex-wrap gap-2">
                    {firstResult.species.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-[#F5F1EE] text-[#5A4A3A] text-xs font-medium rounded-full border border-orange-900/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Issues Cards */}
          {aggregatedIssues.length > 0 && (
            <div className="mt-2">
              <h3 className="text-lg font-bold text-[#1B3022] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#A3B18A] rounded-sm"></span> 工程關注議題 ({aggregatedIssues.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {aggregatedIssues.map((issue, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="bg-white rounded-2xl border border-[#D8E2DC] shadow-sm p-6 flex flex-col"
                  >
                    <h4 className="text-[15px] font-bold text-[#1B3022] mb-3 pb-3 border-b border-gray-100 leading-snug">
                      {issue.title || '未命名議題'}
                    </h4>
                    
                    <div className="mb-5 flex-1">
                      <div className="text-xs font-bold text-gray-400 mb-1.5">說明</div>
                      <p className="text-sm text-gray-600 leading-relaxed">{issue.description || '—'}</p>
                    </div>

                    <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#E8EEEA]">
                      <div className="text-xs font-bold text-[#3A5A40] mb-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#588157]"></div> 生態保育原則
                      </div>
                      <ul className="space-y-2">
                         {Array.isArray(issue.principle) ? (
                           issue.principle.map((p: string, i: number) => {
                             // Colorize principle tags like [迴避]
                             const parts = p.match(/^\[([^\]]+)\]\s*(.*)$/);
                             if (parts) {
                               const tag = parts[1];
                               const text = parts[2];
                               
                               let badgeColor = "bg-[#EEF2F5] text-[#344E41] border-[#D8E2DC]";
                               if (tag.includes("迴避")) badgeColor = "bg-rose-100 text-rose-700 border-rose-200";
                               else if (tag.includes("縮小")) badgeColor = "bg-amber-100 text-amber-700 border-amber-200";
                               else if (tag.includes("減輕")) badgeColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
                               else if (tag.includes("補償")) badgeColor = "bg-blue-100 text-blue-700 border-blue-200";

                               return (
                                 <li key={i} className="text-xs text-gray-600 leading-relaxed flex items-start gap-1.5 mt-1">
                                   <span className={`px-1.5 py-0.5 rounded flex-shrink-0 font-bold border text-[10px] tracking-widest ${badgeColor}`}>
                                     {tag}
                                   </span>
                                   <span className="pt-0.5">{text}</span>
                                 </li>
                               );
                             }
                             return <li key={i} className="text-xs text-gray-600 leading-relaxed pt-0.5">{p}</li>;
                           })
                         ) : (
                           <li className="text-xs text-gray-600">{issue.principle || '—'}</li>
                         )}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : hasSearched ? (
        <div className="flex-1 flex items-center justify-center">
           <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl">
             <MapPinned className="w-12 h-12 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500 font-medium">查無符合條件之關注議題</p>
             <p className="text-xs text-gray-400 mt-1">請嘗試調整過濾條件</p>
           </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50 select-none">
           <MapPinned className="w-16 h-16 text-[#A3B18A] mb-4" />
           <p className="text-[#3A5A40] font-bold">請先選擇設施與工程類型進行搜尋</p>
        </div>
      )}

      {/* Footer Status */}
      <footer className="mt-auto pt-6 flex items-center justify-between text-[10px] text-gray-400">
        <div>提示：按 <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-mono text-gray-500">Enter</span> 或點擊「搜尋」執行查詢；重設後不顯示結果。</div>
        {hasSearched && <div className="font-bold text-[#3A5A40]">{filteredData.length} 筆符合資料</div>}
      </footer>
    </div>
  );
}
