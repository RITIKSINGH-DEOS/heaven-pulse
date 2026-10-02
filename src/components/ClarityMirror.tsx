'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ClarityReport } from '../lib/types';
import { 
  Sparkles, 
  BrainCircuit, 
  Flame, 
  RotateCcw, 
  Wind, 
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface ClarityMirrorProps {
  report: ClarityReport;
  onReset: () => void;
}

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  hue: number;
}

// Soothing, Meditative Release Particle Transition
const SoothingReleaseAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [phaseText, setPhaseText] = useState('Igniting & dissolving the mind trap...');
  const [phaseSubText, setPhaseSubText] = useState('Watching cognitive loops turn into quiet ash...');
  const [phaseIcon, setPhaseIcon] = useState<'flame' | 'stars' | 'peace'>('flame');

  useEffect(() => {
    // Sequential meditative phase text spread over 5 seconds
    const t1 = setTimeout(() => {
      setPhaseText('Dissolving thought into weightless stardust...');
      setPhaseSubText('Releasing physical and emotional tension from your body...');
      setPhaseIcon('stars');
    }, 1600);

    const t2 = setTimeout(() => {
      setPhaseText('Purged from memory. Breathe in stillness...');
      setPhaseSubText('Zero logs remain anywhere. Walk forward into clarity...');
      setPhaseIcon('peace');
    }, 3400);

    const t3 = setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 5000);

    // Canvas particle engine
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const particles: EmberParticle[] = [];
    const particleCount = 85;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * (width * 0.8),
        y: height * 0.7 + Math.random() * (height * 0.28),
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1.0 - Math.random() * 2.0,
        size: Math.random() * 3.5 + 1.5,
        alpha: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.005 + 0.003,
        hue: Math.random() > 0.4 ? 40 : 155,
      });
    }

    const startTime = Date.now();

    const render = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.y * 0.03) * 0.45;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Shift color gradually from warm amber to tranquil emerald
        if (elapsed > 1600 && p.hue === 40 && Math.random() < 0.1) {
          p.hue = 155;
        }

        // Respawn particles from bottom during the first 4.2 seconds
        if (p.alpha <= 0 && elapsed < 4200) {
          p.x = width / 2 + (Math.random() - 0.5) * (width * 0.75);
          p.y = height * 0.75 + Math.random() * (height * 0.2);
          p.alpha = Math.random() * 0.7 + 0.3;
          p.hue = elapsed > 2400 ? 155 : (Math.random() > 0.5 ? 40 : 155);
        }

        if (p.alpha > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.hue === 40 
            ? `rgba(251, 191, 36, ${p.alpha})` 
            : `rgba(52, 211, 153, ${p.alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.hue === 40 ? '#f59e0b' : '#34d399';
          ctx.fill();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cancelAnimationFrame(animId);
    };
  }, []); // Run ONCE on mount to prevent timer resets

  return (
    <div 
      onClick={() => onCompleteRef.current?.()}
      title="Click to proceed immediately"
      className="card-spotlight p-8 sm:p-14 text-center max-w-lg mx-auto min-h-[440px] flex flex-col items-center justify-center relative overflow-hidden animate-fade-in border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] cursor-pointer"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Central Pulsing Halo of Release */}
      <div className="relative z-20 flex flex-col items-center max-w-sm">
        <div className="relative mb-6">
          {/* Outer Breathing Aura */}
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-400/30 animate-pulse-halo flex items-center justify-center">
            {/* Inner Glow Core */}
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.35)]">
              {phaseIcon === 'flame' && <Flame className="w-8 h-8 text-amber-400 animate-pulse" />}
              {phaseIcon === 'stars' && <Sparkles className="w-8 h-8 text-emerald-400 animate-spin-slow" />}
              {phaseIcon === 'peace' && <Wind className="w-8 h-8 text-cyan-400 animate-pulse" />}
            </div>
          </div>
        </div>

        {/* Meditative Reassuring Phase Text */}
        <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide mb-1.5 transition-all duration-700">
          {phaseText}
        </h3>

        <p className="text-xs text-neutral-400 leading-relaxed mb-4 transition-all duration-700">
          {phaseSubText}
        </p>

        {/* 5-Second Meditative Release Progress Line */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 rounded-full animate-release-progress" />
        </div>

        <span className="text-[10px] font-mono text-neutral-500 hover:text-neutral-400 transition-colors">
          Click anywhere to skip
        </span>
      </div>
    </div>
  );
};

export const ClarityMirror: React.FC<ClarityMirrorProps> = ({ report, onReset }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [burnState, setBurnState] = useState<'idle' | 'releasing' | 'purged'>('idle');
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
    setBurnState('releasing');
  };

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      
      {burnState === 'idle' && (
        <div>
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
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs transition-all cursor-pointer shadow-md shadow-red-950/50 hover:scale-[1.02]"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>Burn & Release Burden</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Releasing Animation Phase */}
      {burnState === 'releasing' && (
        <SoothingReleaseAnimation onComplete={() => setBurnState('purged')} />
      )}

      {/* State B: Post-Release Zen Confirmation (Exact match with user requested design) */}
      {burnState === 'purged' && (
        <div className="card-spotlight p-8 sm:p-12 text-center max-w-lg mx-auto animate-zen-reveal relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          
          {/* Ambient soft glow at top */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-emerald-500/15 blur-3xl pointer-events-none rounded-full" />

          {/* Glowing Celestial Sparkle Emblem */}
          <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-[0_0_28px_rgba(52,211,153,0.35)] relative">
            <span className="absolute inset-0 rounded-full border border-emerald-400/25 animate-ping opacity-25" />
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            Your burden has been released.
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md mx-auto mb-7">
            This thought has been purged from your device&apos;s memory. No traces exist anywhere. Walk forward with clarity.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-emerald-500/25 text-xs font-mono text-emerald-400 mb-7 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Memory Purged • 100% Private</span>
          </div>

          <div>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-md hover:scale-[1.02]"
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
