import { useMemo, useState, type ReactNode } from 'react';
import { CircleAlert, Image, Leaf, Search, Sprout } from 'lucide-react';
import { plantingSuggestions } from '../data/plantData';

const TagBlock = ({ label, values, tone = 'green' }: { label: string; values: string[]; tone?: 'green' | 'warm' }) => (
  <section className="rounded-2xl border border-[#D8E2DC] bg-white p-5 shadow-sm">
    <h3 className="mb-4 text-base font-bold text-[#667085]">{label}</h3>
    <div className="flex flex-wrap gap-2.5">
      {values.length > 0 ? values.map((value) => (
        <span
          key={value}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${tone === 'warm' ? 'border-[#E8D8CF] bg-[#F8F3F0] text-[#6B5144]' : 'border-[#DFE6E9] bg-[#EEF2F5] text-[#344E41]'}`}
        >
          {value}
        </span>
      )) : <span className="text-gray-400">—</span>}
    </div>
  </section>
);

const DetailBlock = ({ label, children, warning = false }: { label: string; children: ReactNode; warning?: boolean }) => (
  <section className="rounded-2xl border border-[#D8E2DC] bg-white p-5 shadow-sm sm:p-6">
    <h3 className="mb-3 flex items-center gap-2 font-bold text-[#3A5A40]">
      {warning ? <CircleAlert className="h-5 w-5 text-[#B7791F]" /> : <Sprout className="h-5 w-5 text-[#588157]" />}
      {label}
    </h3>
    <div className="leading-relaxed text-gray-600">{children}</div>
  </section>
);

export default function PlantingSuggestion() {
  const [river, setRiver] = useState('');
  const [section, setSection] = useState('');
  const [purpose, setPurpose] = useState('');
  const [result, setResult] = useState<(typeof plantingSuggestions)[number] | null>(null);

  const rivers = useMemo(() => [...new Set(plantingSuggestions.map((item) => item.river))], []);
  const sections = useMemo(() => [...new Set(plantingSuggestions.filter((item) => !river || item.river === river).map((item) => item.section))], [river]);
  const purposes = useMemo(() => [...new Set(plantingSuggestions.filter((item) => (!river || item.river === river) && (!section || item.section === section)).map((item) => item.purpose))], [river, section]);

  const changeRiver = (value: string) => { setRiver(value); setSection(''); setPurpose(''); setResult(null); };
  const changeSection = (value: string) => { setSection(value); setPurpose(''); setResult(null); };
  const search = () => setResult(plantingSuggestions.find((item) => (!river || item.river === river) && (!section || item.section === section) && (!purpose || item.purpose === purpose)) ?? null);

  return (
    <div className="w-full p-4 lg:p-8">
      <header className="mb-6">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-[#1B3022]"><Leaf className="text-[#b8860b]" />工區植栽建議工具</h2>
        <p className="mt-2 text-gray-500">請依序選擇河川、河段位置與栽植目的，取得工區植栽及管理建議。</p>
      </header>

      <div className="mb-6 grid grid-cols-1 items-end gap-4 rounded-2xl border border-[#D8E2DC] bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-[1fr_1.35fr_1.15fr_auto]">
        <label className="flex flex-col gap-2 text-sm font-bold text-gray-500">河川名稱<select value={river} onChange={(e) => changeRiver(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-[#FBFBFB] px-3 py-2.5 font-normal text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"><option value="">選擇河川名稱</option>{rivers.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="flex flex-col gap-2 text-sm font-bold text-gray-500">河段位置<select value={section} onChange={(e) => changeSection(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-[#FBFBFB] px-3 py-2.5 font-normal text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"><option value="">選擇河段位置</option>{sections.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="flex flex-col gap-2 text-sm font-bold text-gray-500">栽植目的<select value={purpose} onChange={(e) => { setPurpose(e.target.value); setResult(null); }} className="w-full rounded-xl border border-gray-200 bg-[#FBFBFB] px-3 py-2.5 font-normal text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"><option value="">選擇栽植目的</option>{purposes.map((value) => <option key={value}>{value}</option>)}</select></label>
        <button onClick={search} className="flex items-center justify-center gap-2 rounded-xl bg-[#3A5A40] px-6 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-[#2D4A32]"><Search size={18} />搜尋</button>
      </div>

      {!result ? <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">請選擇條件後按下「搜尋」查看植栽建議。</div> : <>
        <div className="mb-8 space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <TagBlock label="棲地類型" values={result.habitat} />
            <TagBlock label="溪濱原生植物舉例" values={result.native} tone="warm" />
            <TagBlock label="生態系統服務" values={result.ecosystem} />
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DetailBlock label="適合環境條件">{result.condition || '—'}</DetailBlock>
            <DetailBlock label="未來潛在風險" warning>
              {result.risk.length > 0 ? <ul className="space-y-2">{result.risk.map((risk) => <li key={risk} className="flex gap-2"><span className="text-[#B7791F]">•</span><span>{risk}</span></li>)}</ul> : '—'}
            </DetailBlock>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {result.cards.map((card) => <article key={card.title} className="w-full overflow-hidden rounded-2xl border border-[#E5D49D] bg-[#fffdf4] shadow-sm">
            <div className="relative flex aspect-[16/7] items-center justify-center border-b border-[#fbc02d]/50 bg-white/70 text-[#b8860b]">
              <div className="text-center"><Image className="mx-auto mb-2" size={36} /><span className="font-bold">圖片預留位置</span></div>
              <img src={card.image} alt={`${card.title}植栽建議圖片`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="p-5"><h3 className="mb-4 text-xl font-bold tracking-wide text-[#b8860b]">{card.title}</h3>
              {[['綠美化建議植栽類型', card.type], ['栽植間距', card.spacing], ['其他管理措施', card.manage], ['備註', card.note]].map(([label, value]) => <p key={label} className="mb-3 leading-relaxed"><strong className="mr-1 rounded bg-[#ffe082] px-1 py-0.5 text-[#8a6508]">{label}：</strong>{value}</p>)}
            </div>
          </article>)}
        </div>
      </>}
    </div>
  );
}
