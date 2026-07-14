import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronRight, Hash } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { faqData, faqMeta } from '../data/faqData';

interface SiteSearchState {
  siteSearch?: {
    query?: string;
    targetId?: string;
  };
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightText = (text: string, query: string) => {
  const keyword = query.trim();
  if (!keyword) return text;
  const pattern = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  const normalizedKeyword = keyword.toLowerCase();
  return text.split(pattern).map((part, index) => (
    part.toLowerCase() === normalizedKeyword ? <mark key={`${part}-${index}`} className="site-search-highlight">{part}</mark> : part
  ));
};

const highlightHtml = (html: string, query: string) => {
  const keyword = query.trim();
  if (!keyword) return html;
  const pattern = new RegExp(escapeRegExp(keyword), 'gi');
  return html.replace(pattern, (match) => `<mark class="site-search-highlight">${match}</mark>`);
};

export default function FAQList() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const siteSearch = (location.state as SiteSearchState | null)?.siteSearch;
  const searchQuery = siteSearch?.query?.trim() ?? '';
  const searchTargetId = siteSearch?.targetId ?? '';

  const targetItemKey = useMemo(() => {
    const match = searchTargetId.match(/^faq-item-(.+)-(\d+)$/);
    return match ? `${match[1]}-${match[2]}` : '';
  }, [searchTargetId]);

  useEffect(() => {
    if (targetItemKey) {
      setOpenItems((prev) => ({ ...prev, [targetItemKey]: true }));
    }

    if (searchTargetId) {
      window.requestAnimationFrame(() => {
        document.getElementById(searchTargetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [searchTargetId, targetItemKey]);

  const toggleItem = (categoryId: string, itemIdx: number) => {
    const key = `${categoryId}-${itemIdx}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(`faq-section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="p-4 lg:p-8 w-full max-w-none h-full flex flex-col relative">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pl-2 flex items-center justify-between"
      >
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-[#1B3022] tracking-tight flex items-center gap-2 sm:gap-3">
             <HelpCircle className="w-5 h-5 sm:w-7 sm:h-7 text-[#588157]" />
             生態檢核作業 FAQ 工具
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            總題數：{faqData.reduce((total, category) => total + category.items.length, 0)}｜最後更新時間：{faqMeta.lastUpdated}
          </p>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 items-start relative pb-10">
        
        {/* Table of Contents - Sticky Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-[#D8E2DC] shadow-sm p-5 lg:sticky lg:top-4 z-10"
        >
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Hash className="w-3.5 h-3.5" /> 快速導覽
          </div>
          <nav className="space-y-4">
            {faqData.map((category) => (
              <a 
                key={category.id} 
                href={`#faq-section-${category.id}`} 
                onClick={(e) => scrollToSection(category.id, e)}
                className="block group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-[#1B3022] group-hover:text-[#588157] transition-colors">
                    {category.title}
                  </h4>
                  <span className="text-[10px] bg-[#EEF2F5] text-[#344E41] px-2 py-0.5 rounded-full font-medium border border-gray-200">
                    {category.count} 題
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                  {highlightText(category.description, searchQuery)}
                </p>
              </a>
            ))}
          </nav>
        </motion.div>

        {/* FAQ Content Areas */}
        <div className="flex-1 space-y-8 w-full max-w-4xl">
          {faqData.map((category, catIdx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (catIdx * 0.1) }}
              key={category.id} 
              id={`faq-section-${category.id}`}
              className="scroll-mt-6"
            >
              <div className={`mb-4 ${searchTargetId === `faq-section-${category.id}` ? 'site-search-target' : ''}`}>
                <h3 className="text-xl font-bold text-[#1B3022] flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-5 bg-[#588157] rounded-sm"></span> {highlightText(category.title, searchQuery)}
                  <span className="ml-2 text-[11px] bg-[#F2F5F0] text-[#3A5A40] px-2.5 py-0.5 rounded-full border border-[#D8E2DC]">
                    {category.count} 題
                  </span>
                </h3>
                <p className="text-xs text-gray-500 ml-4 pl-3.5 border-l-2 border-[#D8E2DC]">
                  {highlightText(category.description, searchQuery)}
                </p>
              </div>

              <div className="space-y-3">
                {category.items.map((item, itemIdx) => {
                  const key = `${category.id}-${itemIdx}`;
                  const targetId = `faq-item-${category.id}-${itemIdx}`;
                  const isSearchTarget = searchTargetId === targetId;
                  const isOpen = openItems[key] || isSearchTarget;

                  return (
                    <div 
                      key={itemIdx}
                      id={targetId}
                      className={`bg-white rounded-xl border transition-all duration-200 scroll-mt-24 ${isSearchTarget ? 'site-search-target border-[#D6A400] shadow-lg' : isOpen ? 'border-[#A3B18A] shadow-md' : 'border-[#D8E2DC] shadow-sm hover:border-[#A3B18A]'}`}
                    >
                      <button 
                        onClick={() => toggleItem(category.id, itemIdx)}
                        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 focus:outline-none"
                      >
                        <span className={`font-bold text-[14px] leading-snug transition-colors ${isOpen ? 'text-[#3A5A40]' : 'text-[#2D3436]'}`}>
                          {highlightText(item.question, searchQuery)}
                        </span>
                        <div className={`shrink-0 text-gray-400 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#588157]' : ''}`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                              <div 
                                className="text-sm text-gray-600 leading-relaxed max-w-none 
                                  prose prose-sm prose-ul:my-2 prose-li:my-0.5 prose-strong:text-[#1B3022] prose-a:text-[#588157] hover:prose-a:text-[#3A5A40] prose-a:no-underline hover:prose-a:underline"
                                dangerouslySetInnerHTML={{ __html: highlightHtml(item.answer as string, searchQuery) }} 
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#A3B18A] opacity-5 overflow-hidden rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none blur-3xl z-0"></div>
    </div>
  );
}
