import { useMemo, useState } from 'react';
import { Image, Leaf, Search } from 'lucide-react';
import { plantingSuggestions } from '../data/plantData';

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="min-h-14 rounded-lg border border-gray-200 bg-white px-4 py-3 leading-relaxed">
    <strong className="mr-1 text-gray-600">{label}：</strong>{value || '—'}
  </div>
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

      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <select aria-label="河川名稱" value={river} onChange={(e) => changeRiver(e.target.value)} className="min-w-44 rounded-md border border-gray-300 bg-white px-3 py-2"><option value="">選擇河川名稱</option>{rivers.map((value) => <option key={value}>{value}</option>)}</select>
        <select aria-label="河段位置" value={section} onChange={(e) => changeSection(e.target.value)} className="min-w-60 rounded-md border border-gray-300 bg-white px-3 py-2"><option value="">選擇河段位置</option>{sections.map((value) => <option key={value}>{value}</option>)}</select>
        <select aria-label="栽植目的" value={purpose} onChange={(e) => { setPurpose(e.target.value); setResult(null); }} className="min-w-52 rounded-md border border-gray-300 bg-white px-3 py-2"><option value="">選擇栽植目的</option>{purposes.map((value) => <option key={value}>{value}</option>)}</select>
        <button onClick={search} className="flex items-center gap-2 rounded-md bg-[#fbc02d] px-5 py-2 font-bold text-gray-800 transition-colors hover:bg-[#f9a825]"><Search size={18} />搜尋</button>
      </div>

      {!result ? <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">請選擇條件後按下「搜尋」查看植栽建議。</div> : <>
        <div className="mb-6 space-y-3">
          <InfoBlock label="棲地類型" value={result.habitat.join('、')} />
          <InfoBlock label="溪濱原生植物舉例" value={result.native.join('、')} />
          <InfoBlock label="生態系統服務" value={result.ecosystem.join('、')} />
          <InfoBlock label="適合環境條件" value={result.condition} />
          <InfoBlock label="未來潛在風險" value={result.risk.join('、')} />
        </div>
        <div className="flex flex-wrap gap-6">
          {result.cards.map((card) => <article key={card.title} className="w-full max-w-[520px] overflow-hidden rounded-xl border-2 border-[#fbc02d] bg-[#fffde7] shadow-sm">
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
