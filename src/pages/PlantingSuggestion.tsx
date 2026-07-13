import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Search, Trees, Filter, MapPin } from 'lucide-react';

export default function PlantingSuggestion() {
  return (
    <div className="p-4 lg:p-8 w-full max-w-none h-full flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pl-2"
      >
        <h2 className="text-lg sm:text-2xl font-bold text-[#1B3022] tracking-tight flex items-center gap-2 sm:gap-3">
          <Leaf className="w-5 h-5 sm:w-7 sm:h-7 text-[#588157]" />
          植栽建議工具
        </h2>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          依據工區環境特性，提供原生樹種與綠覆率改善計畫建議。
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        
        {/* Sidebar Filters */}
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
            <button className="text-[10px] text-gray-400 hover:text-[#588157]">清除</button>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">海拔高度</label>
              <select className="w-full p-2 text-sm bg-[#FBFBFB] border border-gray-200 rounded-lg text-gray-600 focus:outline-none">
                <option>低海拔 (0-500m)</option>
                <option>中海拔 (500-1500m)</option>
                <option>高海拔 (&gt;1500m)</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">日照條件</label>
              <select className="w-full p-2 text-sm bg-[#FBFBFB] border border-gray-200 rounded-lg text-gray-600 focus:outline-none">
                <option>全日照</option>
                <option>半日照</option>
                <option>耐陰環境</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">土壤特性</label>
              <select className="w-full p-2 text-sm bg-[#FBFBFB] border border-gray-200 rounded-lg text-gray-600 focus:outline-none">
                <option>一般壤土</option>
                <option>砂質壤土 (排水佳)</option>
                <option>黏土質 (保水力強)</option>
              </select>
            </div>
            
            <button className="w-full mt-4 py-2 bg-[#3A5A40] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#2D4A32] transition-colors flex items-center justify-center gap-2">
              <Search className="w-3 h-3" /> 搜尋適合樹種
            </button>
          </div>
        </motion.div>
        
        {/* Results Area */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-8 lg:col-span-9 bg-[#FBFBFB] rounded-2xl border border-[#D8E2DC] shadow-inner p-6 flex flex-col items-center justify-center min-h-[400px] text-center"
        >
          <Trees className="w-20 h-20 text-[#A3B18A] mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-[#1B3022] mb-2">原生植栽推薦模組</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            請從左側面板設定工區環境條件，系統將自動比對資料庫，為您推薦適應當地氣候與地質的臺灣原生種與綠覆率改善計畫。\n\n(此模組已準備好與真實植栽資料庫進行 API 對接)
          </p>
        </motion.div>
        
      </div>
    </div>
  );
}
