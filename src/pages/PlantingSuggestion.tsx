import { useState } from 'react';
import { Camera, ImageOff, Leaf, Lightbulb, ListChecks } from 'lucide-react';
import { ECO_PLAN_IMAGE_DIRECTORY, ecoPlanData } from '../data/ecoPlanData';
import type { EcoPlanSection } from '../data/contentParsers';

const splitLabel = (item: string) => {
  const match = item.match(/^([^：:]+)[：:]\s*(.+)$/);
  return match ? { label: match[1].trim(), content: match[2].trim() } : { content: item };
};

const AdviceList = ({ section }: { section: EcoPlanSection }) => (
  <section className="rounded-2xl border border-[#D8E2DC] bg-white p-5 shadow-sm sm:p-6">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#3A5A40]">
      {section.title.includes('執行') ? <ListChecks className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
      {section.title}
    </h3>
    <ul className="space-y-3 text-gray-700">
      {section.items.map((item, index) => {
        const value = splitLabel(item);
        return (
          <li key={`${item}-${index}`} className="flex items-start gap-2.5 leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A3B18A]" />
            <span>
              {value.label && <strong className="mr-2 inline-flex rounded-full bg-[#E7EFE7] px-3 py-0.5 text-sm font-bold text-[#3A5A40]">{value.label}</strong>}
              {value.content}
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);

const PhotoGallery = ({ section }: { section: EcoPlanSection }) => (
  <section className="rounded-2xl border border-[#D8E2DC] bg-white p-5 shadow-sm sm:p-6">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#3A5A40]"><Camera className="h-5 w-5" />{section.title}</h3>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {section.items.map((item, index) => {
        const { label, content: fileName } = splitLabel(item);
        return (
          <figure key={`${fileName}-${index}`} className="overflow-hidden rounded-xl border border-[#D8E2DC] bg-[#F2F5F0]">
            <div className="relative aspect-[4/3]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-gray-400"><ImageOff /><span className="text-sm">尚未放置：{fileName}</span></div>
              <img src={`${ECO_PLAN_IMAGE_DIRECTORY}${fileName}`} alt={label || section.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
            </div>
            {label && <figcaption className="border-t border-[#D8E2DC] bg-white px-4 py-3 text-sm font-medium text-gray-700">{label}</figcaption>}
          </figure>
        );
      })}
    </div>
  </section>
);

export default function PlantingSuggestion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMeasure = ecoPlanData.measures[activeIndex];

  return (
    <div className="w-full p-4 lg:p-8">
      <header className="mb-6">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1B3022]"><Leaf className="text-[#588157]" />{ecoPlanData.pageTitle}</h2>
        <p className="mt-2 text-gray-500">選擇主要措施，查看執行重點、設計建議與參考照片。</p>
      </header>

      <nav className="mb-6 flex gap-2 overflow-x-auto border-b border-[#C9D5CC] pb-2" aria-label="生態保育主要措施">
        {ecoPlanData.measures.map((measure, index) => (
          <button key={measure.title} type="button" onClick={() => setActiveIndex(index)} aria-pressed={activeIndex === index} className={`shrink-0 rounded-t-xl px-4 py-3 text-sm font-bold transition-colors ${activeIndex === index ? 'bg-[#3A5A40] text-white shadow-sm' : 'bg-white text-[#52665A] hover:bg-[#E7EFE7]'}`}>
            {measure.title}
          </button>
        ))}
      </nav>

      {activeMeasure && (
        <article>
          <h2 className="mb-5 text-2xl font-bold text-[#344E41]">{activeMeasure.title}</h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {activeMeasure.sections.map((section, index) => section.title.includes('照片')
              ? <div key={`${section.title}-${index}`} className="lg:col-span-2"><PhotoGallery section={section} /></div>
              : <div key={`${section.title}-${index}`}><AdviceList section={section} /></div>)}
          </div>
        </article>
      )}
    </div>
  );
}
