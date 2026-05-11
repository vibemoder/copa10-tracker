import React, { useState, useEffect } from 'react';
import { ui, defaultLang } from '../i18n/ui';
import { getFlagUrl } from '../utils/flags';

interface Sticker {
  id: number;
  code: string;
  name: string;
  height?: string | null;
  club?: string | null;
  socialInstagram?: string | null;
  socialTwitter?: string | null;
  nation?: string | null;
  marketValue?: string | null;
}

interface Props {
  sticker: Sticker;
  initialQty: number;
  isLoggedIn: boolean;
  lang?: string;
}

export default function StickerCard({ sticker, initialQty, isLoggedIn, lang = defaultLang }: Props) {
  const [qty, setQty] = useState(initialQty);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wikiBio, setWikiBio] = useState<string | null>(null);

  // Simple t function for React component
  const t = (key: keyof typeof ui['pt']) => {
    const l = (lang in ui ? lang : defaultLang) as keyof typeof ui;
    return ui[l][key] || ui[defaultLang][key];
  };

  const updateCollection = async (e: React.MouseEvent, action: 'inc' | 'dec' | 'toggle') => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stickerId: sticker.id, action }),
      });

      if (response.ok) {
        if (action === 'inc') setQty(q => q + 1);
        else if (action === 'dec') setQty(q => Math.max(0, q - 1));
        else if (action === 'toggle') setQty(q => (q > 0 ? 0 : 1));
      }
    } catch (error) {
      console.error('Failed to update collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWikiBio = async () => {
    if (wikiBio) return;
    try {
      const cleanName = sticker.name.split(' (')[0];
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`);
      const data = await res.json();
      if (data.extract) {
        setWikiBio(data.extract);
      } else {
        setWikiBio('No detailed biography found in the football archives.');
      }
    } catch (e) {
      setWikiBio('Connection to football archives lost.');
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchWikiBio();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  const isOwned = qty > 0;
  const isDuplicate = qty > 1;
  const flagUrl = getFlagUrl(sticker.nation);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className={`bg-zinc-900 border ${isOwned ? 'border-[#e3b341]/50 shadow-[0_0_10px_rgba(227,179,65,0.1)]' : 'border-zinc-800'} p-1.5 md:p-2 rounded flex flex-col items-center hover:border-zinc-600 transition-all group relative overflow-hidden h-full cursor-pointer select-none`}
      >
        {isDuplicate && (
          <div className="absolute top-0 right-0 bg-blue-600 text-[7px] md:text-[8px] font-bold px-1 md:px-1.5 py-0.5 rounded-bl z-10">
            x{qty}
          </div>
        )}
        
        <span className={`text-[8px] md:text-[10px] ${isOwned ? 'text-[#e3b341]' : 'text-zinc-500'} font-mono mb-0.5 md:mb-1`}>{sticker.code}</span>
        
        <div 
          onClick={(e) => isLoggedIn && updateCollection(e, 'toggle')}
          className={`w-full aspect-[3/4] ${isOwned ? 'bg-[#e3b341]/10 text-[#e3b341]' : 'bg-zinc-800 text-zinc-700'} rounded flex items-center justify-center font-bold text-base md:text-lg mb-1 group-hover:bg-zinc-700 group-hover:text-zinc-400 transition-colors relative`}
        >
          {loading && <div className="absolute inset-0 bg-black/20 animate-pulse rounded" />}
          {sticker.id}
        </div>
        
        <span className={`text-[8px] md:text-[10px] ${isOwned ? 'text-zinc-200' : 'text-zinc-400'} text-center line-clamp-1 w-full mb-1.5 md:mb-2`}>
          {sticker.name.split(' (')[0]}
        </span>
        
        {isLoggedIn && (
          <div className="flex gap-1 w-full mt-auto">
            <button 
              onClick={(e) => updateCollection(e, 'dec')}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-[8px] md:text-[10px] py-0.5 md:py-1 rounded transition-colors"
            >
              -
            </button>
            <button 
              onClick={(e) => updateCollection(e, 'inc')}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-[8px] md:text-[10px] py-0.5 md:py-1 rounded transition-colors"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Player Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
          >
            {/* Header with Flag Background */}
            <div className="relative h-56 md:h-72 overflow-hidden">
                {flagUrl && (
                    <img src={flagUrl} className="absolute inset-0 w-full h-full object-cover opacity-10 blur-2xl scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-8 right-8 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all z-20 border border-white/10"
                >
                    ✕
                </button>

                <div className="absolute bottom-8 left-10 flex items-end gap-8">
                    {flagUrl && (
                        <img src={flagUrl} className="w-20 md:w-28 rounded-2xl shadow-2xl border border-white/10" alt={sticker.nation || ''} />
                    )}
                    <div>
                        <span className="text-[10px] md:text-xs font-black text-[#e3b341] uppercase tracking-[0.4em] italic mb-2 block drop-shadow-md">
                            {sticker.code}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-[0.8] mb-2 drop-shadow-lg">
                            {sticker.name.split(' (')[0]}
                        </h2>
                        <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px] md:text-xs italic flex items-center gap-2">
                            {sticker.nation}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-10 md:p-12">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                    <div>
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2 opacity-60">{t('card.club')}</div>
                        <div className="text-zinc-100 font-black text-lg md:text-xl leading-tight italic">{sticker.club || '—'}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2 opacity-60">{t('card.height')}</div>
                        <div className="text-zinc-100 font-black text-lg md:text-xl leading-tight italic">{sticker.height || '—'}</div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2 opacity-60">Market Value</div>
                        <div className="text-[#e3b341] font-black text-xl md:text-2xl leading-tight italic drop-shadow-[0_0_10px_rgba(227,179,65,0.3)]">
                            {sticker.marketValue || 'Priceless'}
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4 flex items-center gap-3">
                        <div className="w-5 h-[1px] bg-zinc-800" />
                        Football Encyclopedia (Wikipedia)
                        <div className="flex-grow h-[1px] bg-zinc-800" />
                    </div>
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-5 font-medium italic">
                        {wikiBio || 'Scanning global football archives...'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {sticker.socialInstagram && (
                        <a 
                            href={`https://instagram.com/${sticker.socialInstagram}`}
                            target="_blank"
                            className="flex-1 bg-white text-zinc-950 py-5 rounded-2xl font-black text-center text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl transform active:scale-95"
                        >
                            Follow Profile
                        </a>
                    )}
                    <button 
                        onClick={(e) => isLoggedIn && updateCollection(e as any, 'toggle')}
                        className={`flex-1 ${isOwned ? 'bg-zinc-900 text-red-500 border-red-500/20' : 'bg-[#e3b341] text-zinc-950 border-transparent'} border py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl transform active:scale-95`}
                    >
                        {isOwned ? 'Remove from Album' : 'Mark as Owned'}
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
