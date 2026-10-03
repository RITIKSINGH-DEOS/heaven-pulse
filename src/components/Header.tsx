'use client';

import React, { useState } from 'react';
import { ShieldCheck, HeartHandshake, PhoneCall, X, Info, Sparkles, Star } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full border-b border-white/[0.08] bg-black/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={onReset}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-7 h-7 rounded-md bg-[#16161c] border border-white/10 flex items-center justify-center text-white shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white group-hover:text-neutral-300 transition-colors">
                HeavenPulse
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                Non-Profit
              </span>
            </div>
          </div>


          {/* Action Controls */}
          <div className="flex items-center gap-4 text-xs">
            
            {/* GitHub Star Us link */}
            <a 
              href="https://github.com/RITIKSINGH-DEOS/heaven-pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer shadow-sm group"
              title="Star HeavenPulse on GitHub"
            >
              <svg className="w-3.5 h-3.5 fill-current text-neutral-400 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-medium text-[11px] sm:text-xs">Star Us</span>
            </a>

            {/* Crisis Help */}
            <button
              onClick={() => setShowCrisisModal(true)}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>988 Help</span>
            </button>

            {/* Start Session CTA */}
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 rounded-md bg-[#1e4b38] hover:bg-[#059669] text-[#34d399] hover:text-white border border-[#059669] font-medium text-xs transition-all shadow-sm cursor-pointer"
            >
              Start Session
            </button>
          </div>

        </div>
      </header>

      {/* Structural Spacer for Fixed Navbar */}
      <div className="h-16 w-full shrink-0 pointer-events-none" aria-hidden="true" />

      {/* Crisis Modal */}
      {showCrisisModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg p-6 rounded-2xl card-spotlight text-white shadow-2xl">
            <button 
              onClick={() => setShowCrisisModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="icon-badge-circle text-amber-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">We are standing with you</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  If you are carrying unbearable weight or contemplating ending your life, connect with a compassionate human right now.
                </p>
              </div>
            </div>

            <div className="space-y-3 my-5">
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Suicide & Crisis Lifeline</div>
                  <div className="text-xs text-neutral-400">Free, 24/7, completely confidential</div>
                </div>
                <a 
                  href="tel:988"
                  className="px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#10b981] text-white font-semibold text-xs transition-colors"
                >
                  Dial 988
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Crisis Text Line</div>
                  <div className="text-xs text-neutral-400">Quiet SMS text support</div>
                </div>
                <span className="text-xs font-mono font-medium text-amber-300 bg-neutral-900 px-2.5 py-1.5 rounded-md border border-neutral-800">
                  Text HOME to 741741
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-2 border-t border-white/10">
              <Info className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>HeavenPulse is an educational public-good sanctuary and not a replacement for clinical psychiatric emergency services.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
