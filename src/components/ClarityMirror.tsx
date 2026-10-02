'use client';

import React, { useState, useEffect } from 'react';
import { ClarityReport } from '../lib/types';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  Flame, 
  RotateCcw, 
  Wind, 
  HelpCircle,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface ClarityMirrorProps {
  report: ClarityReport;
  onReset: () => void;
}

export const ClarityMirror: React.FC<ClarityMirrorProps> = ({ report, onReset }) => {
  const [isBurned, setIsBurned] = useState(false);
  const [isBurningAnimation, setIsBurningAnimation] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // 4-4-6 Breathing Cycle
  useEffect(() => {
    let timer = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 4;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 6;
          } else {
            setBreathPhase('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathPhase]);

  const handleBurn = () => {
    setIsBurningAnimation(true);
    setTimeout(() => {
      setIsBurningAnimation(false);
      setIsBurned(true);
    }, 1500);
  };

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      
      {/* State A: Active Deconstruction Report */}
      {!isBurned ? (
        <div className={`transition-all duration-1000 ${isBurningAnimation ? 'opacity-0 scale-95 filter blur-lg' : 'opacity-100 scale-100'}`}>
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase mb-4">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              <span>CBT Perspective Shift Active</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
              The Clarity Mirror
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Your mind generated a powerful illusion. Here is the objective, evidence-based truth.
            </p>
          </div>

          {/* Main Card */}
          <div className="card-spotlight p-6 sm:p-9 mb-8 relative">
            
            {/* Distortion Identification Banner */}
            <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                  Primary Cognitive Distortion Identified
                </span>
                <h3 className="text-base font-bold text-white">
                  {report.primaryDistortion.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {report.primaryDistortion.description}
                </p>
              </div>

              <div className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-neutral-400 shrink-0 text-center">
                Bias Index: Catastrophic
              </div>
            </div>

            {/* Two-Column Comparison: Illusion vs Reality Anchor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              
              {/* Column 1: The Illusion */}
              <div className="p-5 rounded-2xl bg-[#09090c] border border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
                    The Inner Critic&apos;s Illusion
                  </span>
                  <p className="text-sm text-neutral-300 italic leading-relaxed">
                    &quot;{report.rawThought}&quot;
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-neutral-500">
                  Assumption formed through emotional vulnerability, not verified facts.
                </div>
              </div>

              {/* Column 2: Objective Reality Anchor */}
              <div className="p-5 rounded-2xl bg-[#11161d] border border-emerald-500/30 flex flex-col justify-between shadow-lg shadow-emerald-950/20">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Objective Reality Anchor
                  </span>
                  <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                    {report.objectiveReality}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-300/80 font-mono">
                  Grounding principle based on clinical cognitive psychology.
                </div>
              </div>

            </div>

            {/* Socratic Thought Experiments */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/10 mb-8">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-3 font-semibold">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                Socratic Reflection Prompts
              </span>
              <ul className="space-y-2.5">
                {report.socraticQuestions.map((q, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-neutral-300 flex items-start gap-2.5 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4-4-6 Grounding Breath Pacer */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="icon-badge-circle text-emerald-400">
                  <Wind className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                    4-4-6 Grounding Breathing Anchor
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Regulate your nervous system before releasing this weight.
                  </p>
                </div>
              </div>

              {/* Pulsing Breathing Orb */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-900 border border-white/10">
                <span className="text-xs font-semibold text-emerald-400">
                  {breathPhase}
                </span>
                <span className="text-sm font-mono font-bold text-white w-5 text-center">
                  {breathTimer}s
                </span>
              </div>
            </div>

            {/* Release & Burn Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
              <div className="text-xs text-neutral-500 font-mono flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Memory will be permanently purged on release</span>
              </div>

              <button
                onClick={handleBurn}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#b91c1c] hover:bg-[#dc2626] text-white font-semibold text-xs transition-all shadow-lg shadow-red-950/50 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>Release & Burn This Burden</span>
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* State B: Post-Release Zen Confirmation */
        <div className="card-spotlight p-8 sm:p-14 text-center max-w-xl mx-auto animate-fade-in relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Your burden has been released.
          </h2>

          <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-md mx-auto">
            The insecure thought has been burned from local memory. 
            No logs exist anywhere on this earth. Take a deep breath, return to your day, and walk lighter.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono text-emerald-400 mb-8">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Memory Purged • Zero Trace Retained</span>
          </div>

          <div>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return to Sanctuary</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
