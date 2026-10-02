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
  Lock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface ClarityMirrorProps {
  report: ClarityReport;
  onReset: () => void;
}

export const ClarityMirror: React.FC<ClarityMirrorProps> = ({ report, onReset }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isBurned, setIsBurned] = useState(false);
  const [isBurningAnimation, setIsBurningAnimation] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // 4-4-6 Breathing Cycle
  useEffect(() => {
    const timer = setInterval(() => {
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
    }, 1200);
  };

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      
      {!isBurned ? (
        <div className={`transition-all duration-700 ${isBurningAnimation ? 'opacity-0 scale-95 filter blur-lg' : 'opacity-100 scale-100'}`}>
          
          {/* Top Progress Indicator */}
          <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
            {[
              { num: 1, label: 'The Trap' },
              { num: 2, label: 'The Truth' },
              { num: 3, label: 'Let It Go' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    currentStep === s.num
                      ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : currentStep > s.num
                      ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-neutral-900 text-neutral-500 border border-white/10'
                  }`}
                >
                  {s.num}
                </div>
                <span className={`text-xs font-medium ${currentStep === s.num ? 'text-white' : 'text-neutral-500'}`}>
                  {s.label}
                </span>
                {s.num < 3 && <div className="w-8 sm:w-12 h-px bg-white/10 mx-1" />}
              </div>
            ))}
          </div>

          {/* Step 1: Mind Trap & Reality Check */}
          {currentStep === 1 && (
            <div className="card-spotlight p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-3">
                <BrainCircuit className="w-4 h-4" />
                <span>Step 1: Unmasking the Mind Trap</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {report.primaryDistortion.name}
                </h2>
                {report.primaryDistortion.simpleName && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                    {report.primaryDistortion.simpleName}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
                {report.primaryDistortion.description}
              </p>

              <div className="space-y-4 mb-8">
                {/* What your brain told you */}
                <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide block mb-1">
                    💭 What your mind is whispering:
                  </span>
                  <p className="text-sm text-neutral-300 italic">
                    &ldquo;{report.rawThought}&rdquo;
                  </p>
                </div>

                {/* Reality Anchor */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide block mb-1">
                    💡 The factual reality check:
                  </span>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {report.objectiveReality}
                  </p>
                </div>

                {/* Relatable Real-Life Example */}
                {report.realLifeExample && (
                  <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                    <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wide block mb-1">
                      🔍 Real-life example:
                    </span>
                    <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
                      {report.realLifeExample}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all cursor-pointer shadow-sm"
                >
                  <span>Next: Question this thought</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Socratic Questions / Self-Reflection */}
          {currentStep === 2 && (
            <div className="card-spotlight p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium mb-3">
                <HelpCircle className="w-4 h-4" />
                <span>Step 2: Looking Closer</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Ask yourself these honest questions
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
                Notice how your fear sounds like fact, until you gently challenge it.
              </p>

              <div className="space-y-3.5 mb-8">
                {report.socraticQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-900/80 border border-white/10 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                      {q}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all cursor-pointer shadow-sm"
                >
                  <span>Next: Calm & Release</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Breathing & Release / Burn */}
          {currentStep === 3 && (
            <div className="card-spotlight p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-3">
                <Wind className="w-4 h-4" />
                <span>Step 3: Reset Your Body & Let Go</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Take one deep breath
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
                Follow the 4-4-6 rhythm to calm your nervous system, then burn this thought forever.
              </p>

              {/* Breathing Circle Widget */}
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 flex flex-col items-center justify-center text-center mb-8">
                <div className="w-24 h-24 rounded-full border-2 border-emerald-500/40 bg-emerald-500/10 flex flex-col items-center justify-center mb-4 transition-all duration-1000 scale-105">
                  <span className="text-sm font-semibold text-emerald-400">{breathPhase}</span>
                  <span className="text-2xl font-mono font-bold text-white">{breathTimer}s</span>
                </div>
                <span className="text-xs text-neutral-400">
                  {breathPhase === 'Inhale' && 'Breathe in slowly through your nose...'}
                  {breathPhase === 'Hold' && 'Gently hold that calm breath...'}
                  {breathPhase === 'Exhale' && 'Slowly release all tension through your mouth...'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleBurn}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs transition-all cursor-pointer shadow-md shadow-red-950/50"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>Burn & Release Burden</span>
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* State B: Post-Release Zen Confirmation */
        <div className="card-spotlight p-8 sm:p-12 text-center max-w-lg mx-auto animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-5 shadow-[0_0_24px_rgba(52,211,153,0.3)]">
            <Sparkles className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Your burden has been released.
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
            This thought has been purged from your device&apos;s memory. No traces exist anywhere. Walk forward with clarity.
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono text-emerald-400 mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Memory Purged • 100% Private</span>
          </div>

          <div>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Fresh Session</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

