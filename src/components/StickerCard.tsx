import React, { useState } from 'react';

interface Sticker {
  id: number;
  code: string;
  name: string;
  height?: string | null;
  club?: string | null;
  socialInstagram?: string | null;
  socialTwitter?: string | null;
}

interface Props {
  sticker: Sticker;
  initialQty: number;
  isLoggedIn: boolean;
}

export default function StickerCard({ sticker, initialQty, isLoggedIn }: Props) {
  const [qty, setQty] = useState(initialQty);
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

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

  const isOwned = qty > 0;
  const isDuplicate = qty > 1;

  return (
    <div 
      onClick={() => setShowStats(!showStats)}
      className={`bg-zinc-900 border ${isOwned ? 'border-[#e3b341]/50 shadow-[0_0_10px_rgba(227,179,65,0.1)]' : 'border-zinc-800'} p-2 rounded flex flex-col items-center hover:border-zinc-600 transition-all group relative overflow-hidden h-full cursor-pointer`}
    >
      {isDuplicate && (
        <div className="absolute top-0 right-0 bg-blue-600 text-[8px] font-bold px-1.5 py-0.5 rounded-bl z-10">
          x{qty}
        </div>
      )}
      
      <span className={`text-[10px] ${isOwned ? 'text-[#e3b341]' : 'text-zinc-500'} font-mono mb-1`}>{sticker.code}</span>
      
      <div 
        onClick={(e) => isLoggedIn && updateCollection(e, 'toggle')}
        className={`w-full aspect-[3/4] ${isOwned ? 'bg-[#e3b341]/10 text-[#e3b341]' : 'bg-zinc-800 text-zinc-700'} rounded flex items-center justify-center font-bold text-lg mb-1 group-hover:bg-zinc-700 group-hover:text-zinc-400 transition-colors relative`}
      >
        {loading && <div className="absolute inset-0 bg-black/20 animate-pulse rounded" />}
        {sticker.id}

        {showStats && sticker.club && (
           <div className="absolute inset-0 bg-zinc-900/95 p-2 flex flex-col justify-center items-start gap-1 z-20 animate-in fade-in duration-200">
              <div className="text-[8px] uppercase text-zinc-500 font-bold">Club</div>
              <div className="text-[10px] text-zinc-100 truncate w-full">{sticker.club}</div>
              {sticker.height && (
                <>
                  <div className="text-[8px] uppercase text-zinc-500 font-bold mt-1">Height</div>
                  <div className="text-[10px] text-zinc-100">{sticker.height}</div>
                </>
              )}
           </div>
        )}
      </div>
      
      <span className={`text-[10px] ${isOwned ? 'text-zinc-200' : 'text-zinc-400'} text-center line-clamp-1 w-full mb-2`}>{sticker.name}</span>
      
      {isLoggedIn && (
        <div className="flex gap-1 w-full mt-auto">
          <button 
            onClick={(e) => updateCollection(e, 'dec')}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] py-1 rounded transition-colors"
          >
            -
          </button>
          <button 
            onClick={(e) => updateCollection(e, 'inc')}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] py-1 rounded transition-colors"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
