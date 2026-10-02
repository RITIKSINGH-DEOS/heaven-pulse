'use client';

import React, { useState } from 'react';
import { ShieldCheck, HeartHandshake, PhoneCall, X, Info, Sparkles } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  return (
    <>
      <header className="relative z-20 w-full border-b border-white/[0.08] bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={onReset}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-emerald-400 shadow-sm group-hover:border-emerald-500/50 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                HeavenPulse
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400">
                Non-Profit
              </span>
            </div>
          </div>

          {/* Navigation Pill Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Trace Client Memory</span>
            </span>
            <span className="hover:text-white transition-colors cursor-default">
              CBT Cognitive Science
            </span>
            <span className="hover:text-white transition-colors cursor-default">
              Community Pulse
            </span>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCrisisModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>988 Lifeline</span>
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>New Session</span>
            </button>
          </div>

        </div>
      </header>

      {/* Crisis Modal */}
      {showCrisisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg p-6 rounded-2xl card-linear border border-neutral-800 text-white shadow-2xl">
            <button 
              onClick={() => setShowCrisisModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">We are here with you</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  If you are in deep crisis, you do not have to carry it alone. Immediate, free, and confidential human support is available 24/7.
                </p>
              </div>
            </div>

            <div className="space-y-3 my-5">
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Suicide & Crisis Lifeline</div>
                  <div className="text-xs text-neutral-400">Call or Text 24/7 • Free & Confidential</div>
                </div>
                <a 
                  href="tel:988"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors"
                >
                  Dial 988
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Crisis Text Line</div>
                  <div className="text-xs text-neutral-400">Free, 24/7 text support</div>
                </div>
                <span className="text-xs font-mono font-medium text-amber-300 bg-neutral-800 px-2.5 py-1.5 rounded-md border border-neutral-700">
                  Text HOME to 741741
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-2 border-t border-neutral-800">
              <Info className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>HeavenPulse is an educational, anonymous self-help tool and not a substitute for clinical psychiatric care.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
