import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  MapPinned, 
  Map, 
  HelpCircle, 
  Bot,
  LayoutDashboard,
  Menu,
  X,
  User,
  ChevronDown,
  Shield,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { faqData } from '../data/faqData';
import { issuesData } from '../data/issuesData';
import { plantMeta, plantRecommendationGroups } from '../data/plantData';

const brandIconSrc = '/brand-icon.png';

const navItems = [
  { id: 'dashboard', path: '/', label: '首頁總覽', icon: LayoutDashboard },
  { id: 'issues', path: '/issues', label: '關注議題工具板', icon: MapPinned },
  { id: 'map', path: '/map', label: '數位地圖工具', icon: Map },
  { id: 'faq', path: '/faq', label: 'FAQ知識庫', icon: HelpCircle },
  { id: 'plants', path: '/plants', label: '植栽建議工具', icon: Leaf },
];

interface SearchResult {
  title: string;
  description: string;
  path: string;
  section: string;
}

const flattenText = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(flattenText).join(' ');
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>).map(flattenText).join(' ');
  return '';
};

const siteSearchEntries: SearchResult[] = [
  ...navItems.map((item) => ({
    title: item.label,
    description: item.id === 'dashboard' ? '平台首頁與各項工具入口。' : `前往${item.label}。`,
    path: item.path,
    section: '功能頁面',
  })),
  ...faqData.flatMap((category) => [
    {
      title: category.title,
      description: category.description,
      path: '/faq',
      section: 'FAQ 類別',
    },
    ...category.items.map((item) => ({
      title: item.question,
      description: item.answer.replace(/\s+/g, ' ').slice(0, 120),
      path: '/faq',
      section: `FAQ｜${category.title}`,
    })),
  ]),
  ...issuesData.map((issue) => ({
    title: `${issue.facilities}｜${issue.type}`,
    description: flattenText(issue),
    path: '/issues',
    section: '關注議題',
  })),
  ...plantRecommendationGroups.flatMap((group) => [
    {
      title: group.title,
      description: `${group.altitude} ${group.sunlight} ${group.soil} ${flattenText(group.plants)}`,
      path: '/plants',
      section: '植栽建議',
    },
    ...group.plants.map((plant) => ({
      title: plant.name,
      description: `${plant.type} ${plant.summary} ${plant.maintenance} ${plant.tags.join(' ')}`,
      path: '/plants',
      section: '植栽資料',
    })),
  ]),
  {
    title: plantMeta.title || '植栽建議工具',
    description: `${plantMeta.note || ''} ${plantMeta.lastUpdated || ''}`,
    path: '/plants',
    section: '植栽建議',
  },
];

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [activeBranch, setActiveBranch] = React.useState(() => localStorage.getItem('WSP_ECO_ACTIVE_BRANCH') || '十河分署');
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const shouldShowFooter = location.pathname !== '/plants';
  const shouldShowHomeSearch = location.pathname === '/';

  React.useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBranchChange = (branch: string) => {
    setActiveBranch(branch);
    localStorage.setItem('WSP_ECO_ACTIVE_BRANCH', branch);
    // Dispatch custom event for dynamic components to listen to
    window.dispatchEvent(new CustomEvent('WSP_ECO_BRANCH_CHANGED', { detail: { branch } }));
  };


  const searchResults = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return siteSearchEntries
      .filter((entry) => `${entry.title} ${entry.description} ${entry.section}`.toLowerCase().includes(query))
      .slice(0, 8);
  }, [searchQuery]);

  const handleResultClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`flex flex-col items-center py-6 gap-8 shadow-xl z-20 bg-[#1B3022] ${mobile ? 'w-64' : 'w-20 hidden lg:flex'} h-full transition-all duration-300`}>
      <nav className={`flex flex-col gap-6 w-full ${mobile ? 'px-6' : 'px-4'} flex-1`}>
        {mobile && <div className="text-[10px] font-semibold text-[#A3B18A] uppercase tracking-wider mb-2">功能模組</div>}
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            title={item.label}
            className={({ isActive }) =>
              `flex items-center ${mobile ? 'gap-4 px-4 py-3' : 'justify-center p-3'} rounded-lg transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#3A5A40] text-white shadow-lg' 
                  : 'text-[#A3B18A] hover:bg-[#3A5A40]/50'
              }`
            }
          >
            <item.icon className="w-6 h-6 shrink-0" />
            {mobile && <span className="font-medium text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      
      <div 
        className={`mt-auto mb-2 p-3 text-[#FFD700] rounded-full border border-[#FFD700]/30 animate-pulse cursor-pointer hover:bg-[#FFD700]/10 flex items-center justify-center transition-colors group`}
        onClick={() => window.open('https://ecocheck-faq-bot.onrender.com/', '_blank')}
        title="Ecocheck AI 智慧助手"
      >
        <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        {mobile && <span className="ml-3 font-medium text-sm text-[#FFD700] animate-none">Ecocheck AI 智慧助手</span>}
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-full bg-[#F2F5F0] font-sans text-[#2D3436] overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden flex flex-col"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="min-h-16 bg-white border-b border-[#D8E2DC] flex flex-col lg:flex-row items-stretch lg:items-center gap-3 px-4 lg:px-8 py-3 lg:py-0 justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-[#F2F5F0] rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center shrink-0" aria-hidden="true">
                <img
                  src={brandIconSrc}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h1 className="text-[14px] sm:text-xl font-bold text-[#1B3022] tracking-tight block truncate max-w-[180px] sm:max-w-none">生態檢核資訊系統整合平台</h1>
            </div>
            <span className="hidden md:inline-flex px-2 py-0.5 bg-[#E9EDC9] text-[#3A5A40] text-[10px] font-bold rounded uppercase tracking-widest leading-none items-center mt-1">v2.4.0 Production</span>
          </div>

          {shouldShowHomeSearch && (
            <div className="relative w-full lg:w-[420px] order-3 lg:order-none">
              <label htmlFor="siteSearch" className="sr-only">搜尋全站與 FAQ 內容</label>
              <div className="flex items-center gap-2 rounded-2xl border border-[#D8E2DC] bg-[#FBFBFB] px-4 py-2.5 shadow-sm focus-within:border-[#588157] focus-within:ring-2 focus-within:ring-[#A3B18A]/30 transition-all">
                <Search className="w-5 h-5 text-[#588157] shrink-0" />
                <input
                  id="siteSearch"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full bg-transparent text-base text-[#1B3022] placeholder:text-gray-500 outline-none"
                  placeholder="搜尋全站、FAQ、議題或植栽..."
                />
              </div>
              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute left-0 right-0 top-full mt-2 max-h-[360px] overflow-y-auto rounded-2xl border border-[#D8E2DC] bg-white shadow-xl z-30 p-2">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={`${result.section}-${result.title}`}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleResultClick(result.path)}
                        className="w-full text-left rounded-xl px-3 py-3 hover:bg-[#F2F5F0] transition-colors"
                      >
                        <div className="text-sm font-bold text-[#588157] mb-1">{result.section}</div>
                        <div className="text-base font-bold text-[#1B3022]">{result.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2 mt-1">{result.description}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-5 text-base text-gray-500 text-center">查無符合的全站或 FAQ 內容</div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Branch selector removed as requested */}
          </div>
        </header>
        
        {/* Workable Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <Outlet />
          {shouldShowFooter && (
            <footer className="mt-auto py-6 px-8 text-right text-[11px] text-gray-500 shrink-0 select-none">
              <span className="text-[#3A5A40]/80 font-bold tracking-wider">© 2026 WSP 生態檢核團隊</span>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
}
