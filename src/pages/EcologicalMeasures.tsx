import { useState } from 'react';
import { Camera, CheckCircle2, ChevronDown, ImageOff, Leaf, Lightbulb } from 'lucide-react';
import { ecologicalMeasures } from '../data/ecoplanData';

const splitAnnotation = (text: string) => {
  const match = text.match(/^([^：:]+)[：:]\s*(.+)$/);
  return match ? { label: match[1].trim(), detail: match[2].trim() } : null;
};

const AdviceList = ({ items }: { items: string[] }) => {
  const annotations = items.map(splitAnnotation);
  const useCapsules = items.length > 0 && annotations.every(Boolean);
  return <ul className="space-y-3">{items.map((item, index) => {
    const annotation = annotations[index];
    return <li key={`${item}-${index}`} className="flex items-start gap-3 leading-relaxed text-slate-700">
      {useCapsules && annotation ? <><span className="mt-0.5 shrink-0 rounded-full bg-[#E5EFE2] px-3 py-1 text-sm font-bold text-[#31533A]">{annotation.label}</span><span className="pt-1">{annotation.detail}</span></>
        : <><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6B8E63]" /><span>{item}</span></>}
    </li>;
  })}</ul>;
};

export default function EcologicalMeasures() {
  const [activeId, setActiveId] = useState(ecologicalMeasures[0]?.id ?? '');
  const activeMeasure = ecologicalMeasures.find((measure) => measure.id === activeId) ?? ecologicalMeasures[0];
  if (!activeMeasure) return <div className="p-8 text-slate-500">尚未建立生態保育措施。</div>;

  return <div className="h-full overflow-x-hidden overflow-y-auto p-4 min-[900px]:p-8">
    <header className="mx-auto mb-6 max-w-7xl">
      <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1B3022]"><Leaf className="text-[#588157]" />生態保育措施</h2>
      <p className="mt-2 text-slate-600">請選擇措施項目查閱執行重點與設計建議。</p>
    </header>
    <div className="mx-auto grid max-w-7xl gap-5 min-[900px]:grid-cols-[260px_minmax(0,1fr)]">
      <div className="relative min-[900px]:hidden">
        <label htmlFor="ecological-measure-select" className="sr-only">選擇生態保育措施</label>
        <select id="ecological-measure-select" value={activeMeasure.id} onChange={(event) => setActiveId(event.target.value)}
          className="w-full appearance-none rounded-xl border border-[#D8E2DC] bg-white py-3 pl-4 pr-11 font-medium text-slate-700 shadow-sm focus:border-[#588157] focus:outline-none focus:ring-2 focus:ring-[#588157]/20">
          {ecologicalMeasures.map((measure) => <option key={measure.id} value={measure.id}>{measure.title}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3A5A40]" aria-hidden="true" />
      </div>
      <aside className="hidden self-start overflow-hidden rounded-2xl border border-[#D8E2DC] bg-white shadow-sm min-[900px]:sticky min-[900px]:top-0 min-[900px]:block">
        <nav className="flex flex-col gap-2 p-3" aria-label="生態保育主要措施">
          {ecologicalMeasures.map((measure) => <button key={measure.id} type="button" onClick={() => setActiveId(measure.id)}
            className={`w-full rounded-xl px-4 py-3 text-left font-medium transition-colors ${measure.id === activeMeasure.id ? 'bg-[#3A5A40] text-white shadow-sm' : 'text-slate-700 hover:bg-[#EDF3EA]'}`}
            aria-current={measure.id === activeMeasure.id ? 'page' : undefined}>{measure.title}</button>)}
        </nav>
      </aside>
      <main className="min-w-0 space-y-5">
        <h3 className="rounded-2xl bg-[#E5EFE2] px-6 py-4 text-2xl font-bold text-[#31533A]">{activeMeasure.title}</h3>
        <section className="rounded-2xl border border-[#D8E2DC] bg-white p-5 shadow-sm sm:p-6">
          <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#31533A]"><CheckCircle2 className="h-5 w-5" />執行重點</h4><AdviceList items={activeMeasure.execution} />
        </section>
        <section className="rounded-2xl border border-[#D8E2DC] bg-white p-5 shadow-sm sm:p-6">
          <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#31533A]"><Lightbulb className="h-5 w-5" />設計建議</h4><AdviceList items={activeMeasure.design} />
        </section>
        <section className="rounded-2xl border border-[#D8E2DC] bg-white p-5 shadow-sm sm:p-6">
          <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#31533A]"><Camera className="h-5 w-5" />參考照片</h4>
          {activeMeasure.photos.length ? <div className="grid gap-4 sm:grid-cols-2">{activeMeasure.photos.map((photo) => <figure key={photo.fileName} className="overflow-hidden rounded-xl border border-[#D8E2DC] bg-[#F7F9F6]">
            <div className="relative flex aspect-[4/3] items-center justify-center text-slate-400"><ImageOff className="h-9 w-9" /><img src={photo.src} alt={photo.caption || activeMeasure.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></div>
            {photo.caption && <figcaption className="border-t border-[#D8E2DC] px-4 py-3 text-slate-600">{photo.caption}</figcaption>}
          </figure>)}</div> : <div className="rounded-xl border border-dashed border-slate-300 bg-[#F7F9F6] px-5 py-10 text-center text-slate-500">目前尚無參考照片</div>}
        </section>
      </main>
    </div>
  </div>;
}
