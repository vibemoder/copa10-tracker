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
  imageUrl?: string | null;
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
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(sticker.imageUrl || null);

  // Simple t function for React component
  const t = (key: keyof typeof ui['pt']) => {
    const l = (lang in ui ? lang : defaultLang) as keyof typeof ui;
    return ui[l][key] || ui[defaultLang][key];
  };

  const updateCollection = async (e: React.MouseEvent, action: 'inc' | 'dec' | 'toggle') => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    setLoading(true);
    
    // Optimistic UI update
    const prevQty = qty;
    if (action === 'inc') setQty(q => q + 1);
    else if (action === 'dec') setQty(q => Math.max(0, q - 1));
    else if (action === 'toggle') setQty(q => (q > 0 ? 0 : 1));

    try {
      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stickerId: sticker.id, action }),
      });

      if (!response.ok) {
        setQty(prevQty); // Rollback on error
      }
    } catch (error) {
      setQty(prevQty); // Rollback on error
    } finally {
      setLoading(false);
    }
  };

  const enrichPlayerData = async () => {
    if (wikiBio && currentImageUrl) return;
    
    try {
      const cleanName = sticker.name.split(' (')[0];
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`);
      const data = await res.json();
      
      if (data.extract) {
        setWikiBio(data.extract);
      }

      // If we don't have an image in the DB, but Wikipedia has one, use it and save it.
      if (!currentImageUrl && data.originalimage?.source) {
        const newImg = data.originalimage.source;
        setCurrentImageUrl(newImg);
        
        // Save to our DB in background (ignore failure)
        fetch('/api/stickers/update-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stickerId: sticker.id, imageUrl: newImg }),
        }).catch(() => {});
      }
    } catch (e) {
      if (!wikiBio) setWikiBio('Historical data currently unavailable.');
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      enrichPlayerData();
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
        className={`bg-zinc-900 border ${
          isDuplicate 
            ? 'border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20' 
            : isOwned 
              ? 'border-[#e3b341]/60 shadow-[0_0_15px_rgba(227,179,65,0.15)]' 
              : 'border-zinc-800 opacity-60 grayscale-[0.5]'
        } p-1.5 md:p-2 rounded flex flex-col items-center hover:border-zinc-600 hover:opacity-100 hover:grayscale-0 transition-all group relative overflow-hidden h-full cursor-pointer select-none`}
      >
        {isDuplicate && (
          <div className="absolute top-0 right-0 bg-blue-600 text-[7px] md:text-[9px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-bl-lg z-10 shadow-lg animate-in zoom-in duration-300">
            x{qty}
          </div>
        )}
        
        <span className={`text-[8px] md:text-[10px] ${isOwned ? 'text-[#e3b341]' : 'text-zinc-500'} font-mono mb-0.5 md:mb-1 tracking-widest`}>{sticker.code}</span>
        
        <div 
          onClick={(e) => isLoggedIn && updateCollection(e, 'toggle')}
          className={`w-full aspect-[3/4] ${
            isDuplicate 
              ? 'bg-blue-900/10 text-blue-400' 
              : isOwned 
                ? 'bg-[#e3b341]/10 text-[#e3b341]' 
                : 'bg-zinc-800 text-zinc-700'
          } rounded-lg flex items-center justify-center font-black text-base md:text-xl mb-1 group-hover:bg-zinc-700 group-hover:text-zinc-300 transition-all relative border border-white/5 overflow-hidden shadow-inner`}
        >
          {currentImageUrl ? (
            <img 
              src={currentImageUrl} 
              className={`absolute inset-0 w-full h-full object-cover ${isOwned ? 'opacity-90' : 'opacity-20 grayscale'}`} 
              alt={sticker.name}
              loading="lazy"
            />
          ) : (
            <span className="relative z-10">{sticker.id}</span>
          )}
          
          {loading && <div className="absolute inset-0 bg-black/40 animate-pulse rounded-lg flex items-center justify-center z-20">
             <div className="w-4 h-4 border-2 border-[#e3b341] border-t-transparent rounded-full animate-spin" />
          </div>}
        </div>
        
        <span className={`text-[8px] md:text-[10px] ${isOwned ? 'text-zinc-100 font-bold' : 'text-zinc-500'} text-center line-clamp-1 w-full mb-1.5 md:mb-2 italic uppercase`}>
          {sticker.name.split(' (')[0]}
        </span>
        
        {isLoggedIn && (
          <div className="flex gap-1 w-full mt-auto">
            <button 
              onClick={(e) => updateCollection(e, 'dec')}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[8px] md:text-[10px] py-1 rounded transition-colors font-bold"
            >
              -
            </button>
            <button 
              onClick={(e) => updateCollection(e, 'inc')}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[8px] md:text-[10px] py-1 rounded transition-colors font-bold"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Player Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative"
          >
            {/* Header with Player Background */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                {currentImageUrl ? (
                   <img src={currentImageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-lg scale-110" />
                ) : flagUrl && (
                    <img src={flagUrl} className="absolute inset-0 w-full h-full object-cover opacity-10 blur-3xl scale-125" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-8 right-8 w-14 h-14 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all z-20 border border-white/10 backdrop-blur-md"
                >
                    <span className="text-2xl">✕</span>
                </button>

                <div className="absolute bottom-10 left-12 right-12 flex items-end justify-between">
                    <div className="flex items-end gap-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-white/20 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            {currentImageUrl ? (
                                <img src={currentImageUrl} className="relative w-32 md:w-44 rounded-3xl shadow-2xl border border-white/10 transform -rotate-2" alt={sticker.name} />
                            ) : flagUrl && (
                                <img src={flagUrl} className="relative w-24 md:w-32 rounded-2xl shadow-2xl border border-white/10 transform -rotate-3" alt={sticker.nation || ''} />
                            )}
                        </div>
                        <div>
                            <span className="text-[10px] md:text-xs font-black text-[#e3b341] uppercase tracking-[0.5em] italic mb-3 block drop-shadow-lg">
                                {sticker.code} • NO. {sticker.id}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.75] mb-3 drop-shadow-2xl">
                                {sticker.name.split(' (')[0]}
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${isOwned ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`}></div>
                                <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px] md:text-xs italic">
                                    {sticker.nation} {isDuplicate ? `• ${qty} COPIES` : isOwned ? '• OWNED' : '• MISSING'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-12 md:p-14">
                <div className="grid grid-cols-3 gap-8 mb-12">
                    <div>
                        <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">{t('card.club')}</div>
                        <div className="text-zinc-100 font-black text-lg md:text-2xl leading-tight italic truncate">{sticker.club || '—'}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">{t('card.height')}</div>
                        <div className="text-zinc-100 font-black text-lg md:text-2xl leading-tight italic">{sticker.height || '—'}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">Market</div>
                        <div className="text-[#e3b341] font-black text-lg md:text-2xl leading-tight italic drop-shadow-[0_0_10px_rgba(227,179,65,0.3)] truncate">
                            {sticker.marketValue || '—'}
                        </div>
                    </div>
                </div>

                <div className="mb-14">
                    <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-5 flex items-center gap-4">
                        <div className="w-8 h-[1px] bg-zinc-800" />
                        Historical Archive
                        <div className="flex-grow h-[1px] bg-zinc-800" />
                    </div>
                    <p className="text-zinc-400 text-sm md:text-lg leading-relaxed line-clamp-4 font-medium italic">
                        {wikiBio || 'Scanning global football archives...'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                    {sticker.socialInstagram && (
                        <a 
                            href={`https://instagram.com/${sticker.socialInstagram}`}
                            target="_blank"
                            className="flex-[1.5] bg-white text-zinc-950 py-6 rounded-2xl font-black text-center text-xs md:text-sm uppercase tracking-[0.25em] hover:bg-[#e3b341] transition-all shadow-2xl transform hover:-translate-y-1 active:translate-y-0"
                        >
                            Follow on Instagram
                        </a>
                    )}
                    <div className="flex-1 flex gap-2">
                        <button 
                            onClick={(e) => isLoggedIn && updateCollection(e as any, 'dec')}
                            className="flex-1 bg-zinc-900 text-white border border-zinc-800 py-6 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all transform active:scale-90 shadow-xl"
                        >
                            -
                        </button>
                        <div className="flex-1 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-2xl font-black text-xl text-[#e3b341] shadow-inner">
                            {qty}
                        </div>
                        <button 
                            onClick={(e) => isLoggedIn && updateCollection(e as any, 'inc')}
                            className="flex-1 bg-zinc-900 text-white border border-zinc-800 py-6 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all transform active:scale-90 shadow-xl"
                        >
                            +
                        </button>
                    </div>
                </div>
                
                <button 
                    onClick={(e) => isLoggedIn && updateCollection(e as any, 'toggle')}
                    className={`w-full mt-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all border ${
                        isOwned 
                            ? 'bg-red-950/20 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white' 
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-[#e3b341] hover:border-[#e3b341]/50'
                    }`}
                >
                    {isOwned ? 'Clear Collection Entry' : 'Quick Mark as Found'}
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
