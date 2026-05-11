import React from 'react';

interface Props {
  userId: string;
  lang: string;
  shareTitle: string;
  shareText: string;
}

export default function ShareButton({ userId, lang, shareTitle, shareText }: Props) {
  const shareUrl = `${window.location.origin}/${lang}?utm_source=${userId}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Copa10 Tracker',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Error copying:', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full md:w-auto bg-gradient-to-r from-[#e3b341] to-yellow-600 text-zinc-950 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(227,179,65,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {shareTitle}
    </button>
  );
}
