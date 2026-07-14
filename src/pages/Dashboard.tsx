import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ContourOverlay } from '../components/ContourOverlay';
import { 
  MapPinned, 
  Map, 
  HelpCircle, 
  Leaf, 
  Bot, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import type { ToolModule } from '../types';

const modules: ToolModule[] = [
  {
    id: 'issues',
    title: '關注議題工具板',
    description: '整合檢核區域內的生態敏感點、關注物種與工程干擾熱區分析。',
    icon: MapPinned,
    path: '/issues',
    status: 'active'
  },
  {
    id: 'map',
    title: '數位地圖工具',
    description: '視覺化空間資訊，疊圖分析環境資源與工程圖資，輔助迴避設計。',
    icon: Map,
    path: '/map',
    status: 'active'
  },
  {
    id: 'faq',
    title: 'FAQ 知識庫',
    description: '生態檢核作業常見問題集與相關法令規範快速查詢索引。',
    icon: HelpCircle,
    path: '/faq',
    status: 'active'
  },
  {
    id: 'plants',
    title: '植栽建議工具',
    description: '依據工區環境特性，提供原生樹種與綠覆率改善計畫建議。',
    icon: Leaf,
    path: '/plants',
    status: 'active'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const modIssues = modules.find(m => m.id === 'issues')!;
  const modMap = modules.find(m => m.id === 'map')!;
  const modFaq = modules.find(m => m.id === 'faq')!;
  const modPlants = modules.find(m => m.id === 'plants')!;

  return (
    <div className="p-4 lg:p-6 lg:px-8 w-full max-w-[1360px] mx-auto min-h-full flex flex-col">
      {/* High Density Content Grid */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-[repeat(13,minmax(0,1fr))] gap-2.5 sm:gap-3 pb-2">
        
        {/* Tool 2: Issue Tracker Board (Now on the left) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
          onClick={() => navigate(modIssues.path)}
          className="col-span-1 lg:col-span-6 bg-white rounded-2xl border border-[#D8E2DC] shadow-sm flex flex-col items-center sm:items-start justify-center sm:justify-between cursor-pointer hover:border-[#A3B18A] hover:shadow-md transition-all group p-2 sm:p-4 relative overflow-hidden"
        >
          <MapPinned className="absolute hidden sm:block -right-4 top-1/2 -translate-y-1/2 w-56 h-56 lg:w-64 lg:h-64 text-[#588157] opacity-[0.04] pointer-events-none transform rotate-12 group-hover:scale-110 group-hover:rotate-[20deg] transition-all duration-500" />
          <div className="flex flex-col items-center sm:items-start gap-1 sm:gap-0 w-full">
            <div className="w-auto h-auto sm:w-8 sm:h-8 shrink-0 sm:bg-[#F2F5F0] sm:rounded-lg flex items-center justify-center mb-3 sm:mb-2.5 text-[#588157] sm:group-hover:bg-[#E0E7E1] transition-colors group-hover:scale-105 transform">
              <modIssues.icon className="w-16 h-16 sm:w-4 sm:h-4" />
            </div>
            <div className="flex-1 flex flex-col items-center sm:items-start justify-center sm:justify-between w-full text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start w-full">
                <h3 className="font-bold text-[13px] sm:text-sm lg:text-2xl text-[#1B3022] sm:mb-1 lg:mb-2 tracking-tight leading-tight">{modIssues.title}</h3>
                <p className="hidden sm:block text-xs lg:text-base text-gray-500 leading-snug lg:leading-relaxed mb-3 lg:mb-4 hover:text-gray-700">
                  {modIssues.description}
                </p>
                <div className="hidden sm:flex flex-wrap gap-1.5 lg:gap-2 text-[10px] lg:text-sm font-bold text-gray-600">
                   <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">📋 檢核表單彙整</span>
                   <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">⚠️ 干擾熱區評估</span>
                   <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">🦉 關注物種盤點</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex mt-3 justify-end w-full">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FBFBFB] border border-[#D8E2DC] text-[#344E41] text-[10px] lg:text-sm font-bold rounded-lg group-hover:bg-[#F2F5F0] transition-colors ml-auto">
              開啟工具板 <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </motion.div>

        {/* Tool 1: Digital Map (Now on the right) */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
           onClick={() => navigate(modMap.path)}
           className="col-span-1 lg:col-span-7 bg-[#5A7A62] text-white rounded-2xl border border-[#7E8F5F] shadow-sm relative flex flex-col items-center sm:items-start justify-center sm:justify-between cursor-pointer hover:border-[#A3B18A] hover:shadow-lg transition-all group overflow-hidden p-2 sm:p-4"
        >
           {/* Real Map Image Background Layer */}
           <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1588252090896-fc811303a232?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
           </div>
           
           {/* Color Tint Overlay for Dark Greenish tint */}
           <div className="absolute inset-0 z-0 bg-[#0F2016] opacity-60 pointer-events-none group-hover:opacity-50 transition-opacity"></div>
           
           {/* Faint Grid Overlay */}
           <div className="absolute inset-0 z-0 opacity-50 pointer-events-none" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0L0 0 0 120' fill='none' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.8'/%3E%3C/svg%3E")`,
                  backgroundSize: '120px 120px',
                  backgroundPosition: 'center center'
                }}>
           </div>

           {/* Topographic Lines Overlay (Canvas) */}
           <ContourOverlay
             className="z-0 opacity-60 group-hover:opacity-80 transition-opacity duration-700"
             strokeColor="#ffffff"
             opacity={0.15}
             lineCount={12}
             step={12}
           />

           <div className="relative z-10 flex flex-col items-center sm:items-start gap-1 sm:gap-0 w-full">
             <div className="w-auto h-auto sm:w-10 sm:h-10 shrink-0 sm:bg-white/20 sm:backdrop-blur-md sm:border sm:border-white/30 sm:rounded-lg shadow-sm flex items-center justify-center mb-3 sm:mb-3 text-white group-hover:scale-105 transition-transform group-hover:bg-white/30">
               <modMap.icon className="w-16 h-16 sm:w-5 sm:h-5" />
             </div>
             <div className="flex-1 flex flex-col items-center sm:items-start justify-center sm:justify-start w-full text-center sm:text-left">
               <div className="flex flex-col items-center sm:items-start w-full">
                 <h3 className="font-bold text-[13px] sm:text-sm lg:text-2xl text-white sm:mb-1.5 lg:mb-2 tracking-tight drop-shadow-md leading-tight">{modMap.title}</h3>
                 <p className="hidden sm:block text-xs lg:text-base text-white/90 leading-snug lg:leading-relaxed max-w-sm lg:max-w-lg mb-3 lg:mb-4 drop-shadow-md font-medium">
                   {modMap.description}
                 </p>
                 <div className="hidden sm:flex flex-wrap gap-1.5 lg:gap-2 text-[10px] lg:text-sm font-bold text-white/90">
                   <span className="bg-[#1B3022]/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 shadow-sm">📍 座標精準定位</span>
                   <span className="bg-[#1B3022]/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 shadow-sm">🗺️ 雙圖資同步比對</span>
                   <span className="bg-[#1B3022]/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 shadow-sm">🔍 生態敏感區套疊</span>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="hidden sm:flex mt-3 justify-end relative z-10 w-full">
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#588157]/60 backdrop-blur-md border border-white/20 text-white text-[10px] lg:text-sm font-bold rounded-lg shadow-sm group-hover:bg-[#588157]/80 transition-colors ml-auto">
               進入地圖系統 <ArrowRight className="w-3 h-3" />
             </span>
           </div>
        </motion.div>

        {/* Tool 3: AI Assistant */}
        <motion.div
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
           onClick={() => window.location.href = 'https://ecocheck-faq-bot.onrender.com/'}
           className="col-span-1 lg:col-span-5 bg-gradient-to-br from-[#1B3022] to-[#2D4A32] rounded-2xl border border-[#3A5A40] shadow-lg flex flex-col items-center sm:items-start justify-center sm:justify-between p-2 sm:p-4 cursor-pointer hover:shadow-2xl hover:shadow-[#FFD700]/10 hover:border-[#FFD700]/40 transition-all duration-500 group relative overflow-hidden"
        >
          <Bot className="absolute hidden sm:block -right-4 top-1/2 -translate-y-1/2 w-56 h-56 lg:w-64 lg:h-64 text-[#FFD700] opacity-[0.07] pointer-events-none transform -rotate-12 group-hover:scale-110 group-hover:-rotate-[20deg] transition-all duration-500" />
          {/* Animated Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tl from-[#FFD700]/0 via-[#FFD700]/10 to-[#FFD700]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          {/* Light sweep effect */}
          <div className="absolute -inset-[100%] top-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] h-full -rotate-45 -translate-x-[150%] group-hover:translate-x-[50%] transition-transform duration-1000 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center sm:items-start gap-1 sm:gap-0 w-full">
            <div className="w-auto h-auto sm:w-10 sm:h-10 shrink-0 sm:bg-[#3A5A40] sm:border sm:border-[#588157] sm:rounded-lg flex items-center justify-center mb-3 sm:mb-2.5 shadow-inner group-hover:bg-[#588157] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] group-hover:scale-110 sm:group-hover:-rotate-3 transition-all duration-300 relative">
               <Bot className="w-16 h-16 sm:w-5 sm:h-5 text-[#FFD700] relative z-10 transition-transform group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
               <div className="hidden sm:block absolute inset-0 bg-[#FFD700] opacity-0 group-hover:opacity-20 transition-opacity blur-xl rounded-full"></div>
            </div>
            <div className="flex-1 flex flex-col items-center sm:items-start justify-center sm:justify-between w-full text-center sm:text-left">
               <div className="flex flex-col items-center sm:items-start w-full">
                 <h3 className="text-white font-bold text-[13px] lg:text-2xl sm:mb-1 lg:mb-2 flex items-center justify-center sm:justify-start flex-wrap gap-1.5 transition-transform group-hover:translate-x-1 duration-300 leading-tight">
                   <span className="truncate group-hover:text-[#FFD700] transition-colors">Ecocheck AI 智慧助手</span>
                   <span className="text-[8px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded shadow-sm animate-pulse tracking-wider uppercase shrink-0 min-w-max hidden sm:block">
                     Live API
                   </span>
                 </h3>
                 <p className="hidden sm:block text-[#A3B18A] text-[10px] lg:text-base leading-snug lg:leading-relaxed line-clamp-2 transition-transform group-hover:translate-x-1 duration-300 delay-50">
                   隨時為您解答生態檢核流程與法規疑問，支援自然語言快速檢索。
                 </p>
               </div>
            </div>
          </div>
          
          <div className="hidden sm:flex mt-3 justify-end relative z-10 w-full">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A3B18A] group-hover:bg-[#FFD700] text-[#1B3022] font-bold text-[10px] lg:text-sm rounded-lg transition-all shadow-sm ml-auto mt-1 sm:mt-0 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(255,215,0,0.3)]">
               前往對話 <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </motion.div>

        {/* Tool 4: FAQ List */}
        <motion.div
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
           onClick={() => navigate(modFaq.path)}
           className="col-span-1 lg:col-span-4 bg-white rounded-2xl border border-[#D8E2DC] p-2 sm:p-4 flex flex-col items-center sm:items-start justify-center sm:justify-between cursor-pointer hover:border-[#A3B18A] hover:shadow-md transition-all group relative overflow-hidden"
        >
          <HelpCircle className="absolute hidden sm:block -right-4 top-1/2 -translate-y-1/2 w-56 h-56 lg:w-64 lg:h-64 text-[#588157] opacity-[0.04] pointer-events-none transform rotate-12 group-hover:scale-110 group-hover:rotate-[20deg] transition-all duration-500" />
           <div className="flex flex-col items-center sm:items-start gap-1 sm:gap-0 w-full">
             <div className="w-auto h-auto sm:w-7 sm:h-7 shrink-0 sm:bg-[#F2F5F0] sm:rounded-lg flex items-center justify-center mb-3 sm:mb-2.5 text-[#588157] sm:group-hover:bg-[#E0E7E1] transition-colors group-hover:scale-105 transform">
               <modFaq.icon className="w-16 h-16 sm:w-3.5 sm:h-3.5" />
             </div>
             <div className="flex-1 flex flex-col items-center sm:items-start justify-center sm:justify-between w-full text-center sm:text-left">
               <div className="flex flex-col items-center sm:items-start w-full">
                 <h3 className="text-[#1B3022] font-bold text-[13px] lg:text-xl sm:mb-1 lg:mb-2 leading-tight">{modFaq.title}</h3>
                 <p className="hidden sm:block text-gray-500 text-[10px] lg:text-sm leading-snug lg:leading-relaxed mb-2.5 lg:mb-3 line-clamp-2">
                   {modFaq.description}
                 </p>
                 <div className="hidden sm:flex flex-wrap gap-1 lg:gap-1.5 text-[8px] lg:text-xs font-bold text-gray-500">
                   <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">📚 法規流程</span>
                   <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">❓ 適用判斷</span>
                   <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">💡 專家見解</span>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="hidden sm:flex mt-3 items-center justify-end w-full">
             <div className="text-[10px] lg:text-sm font-bold text-[#588157] flex items-center group-hover:translate-x-1 transition-transform ml-auto">
               檢視清單 <ArrowRight className="w-2.5 h-2.5 ml-1" />
             </div>
           </div>
        </motion.div>

        {/* Tool 5: Planting Advice */}
        <motion.div
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
           onClick={() => navigate(modPlants.path)}
           className="col-span-1 lg:col-span-4 bg-[#C8DBC7] rounded-2xl p-2 sm:p-4 text-[#1B3022] flex flex-col items-center sm:items-start justify-center sm:justify-between cursor-pointer hover:bg-[#B3CDB2] shadow-md transition-all group relative overflow-hidden border border-[#C8DBC7] hover:border-[#A3B18A]"
        >
           <div className="relative z-10 flex flex-col items-center sm:items-start gap-1 sm:gap-0 w-full">
             <div className="w-auto h-auto sm:w-7 sm:h-7 shrink-0 sm:bg-white/40 sm:rounded-lg flex items-center justify-center mb-3 sm:mb-2.5 text-[#2D4A32] sm:group-hover:bg-white/60 transition-colors group-hover:scale-105 transform">
               <modPlants.icon className="w-16 h-16 sm:w-3.5 sm:h-3.5" />
             </div>
             <div className="flex-1 flex flex-col items-center sm:items-start justify-center sm:justify-between w-full text-center sm:text-left">
               <div className="flex flex-col items-center sm:items-start w-full">
                 <h3 className="font-bold text-[13px] lg:text-xl sm:mb-1 lg:mb-2 text-[#1B3022] leading-tight">{modPlants.title}</h3>
                 <p className="hidden sm:block text-[#3A5A40] text-[10px] lg:text-sm leading-snug lg:leading-relaxed mb-2.5 lg:mb-3 line-clamp-2 font-medium">
                   {modPlants.description}
                 </p>
                 <div className="hidden sm:flex flex-wrap gap-1 lg:gap-1.5 text-[8px] lg:text-xs font-bold text-[#2D4A32]">
                     <span className="bg-white/40 px-1.5 py-0.5 rounded border border-white/20">🏔️ 海拔適應性</span>
                     <span className="bg-white/40 px-1.5 py-0.5 rounded border border-white/20">☀️ 日照條件</span>
                     <span className="bg-white/40 px-1.5 py-0.5 rounded border border-white/20">🌱 在地原生種</span>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="hidden sm:flex mt-3 items-center justify-end relative z-10 w-full">
             <div className="text-[10px] lg:text-sm font-bold text-[#1B3022] flex items-center group-hover:translate-x-1 transition-transform ml-auto">
               開始分析 <ArrowRight className="w-2.5 h-2.5 ml-1 text-[#3A5A40]" />
             </div>
           </div>
           
           <Leaf className="absolute hidden sm:block -right-4 top-1/2 -translate-y-1/2 w-56 h-56 lg:w-64 lg:h-64 text-[#2D4A32] opacity-[0.05] pointer-events-none transform -rotate-12 group-hover:scale-110 group-hover:-rotate-[20deg] transition-all duration-500" />
        </motion.div>

      </div>
    </div>
  );
}
