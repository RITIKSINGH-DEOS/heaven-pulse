'use client';

import React, { useState } from 'react';
import { InsecurityCategory } from '../lib/types';
import { INSECURITY_CATEGORIES } from '../lib/mock-peers';
import { evaluateSafety } from '../lib/safety-guard';
import { ArrowRight, ShieldCheck, Heart, Sparkles, AlertTriangle, Lock, EyeOff } from 'lucide-react';

interface SanctuaryIntakeProps {
  onSubmit: (category: InsecurityCategory, rawThought: string, directToClarity: boolean) => void;
}

const SAMPLE_THOUGHTS: Record<InsecurityCategory, string> = {
  impostor_career: 'I feel like everyone in my cohort is leagues smarter than me and I am just pretending.',
  body_image: 'I feel deeply self-conscious about my appearance and constantly worry people judge how I look.',
  social_anxiety: 'Whenever I speak in groups, I replay every awkward phrase for hours and fear being disliked.',
  belonging_relationships: 'I feel completely disconnected from my friends, like I would not be missed if I faded away.',
};

export const SanctuaryIntake: React.FC<SanctuaryIntakeProps> = ({ onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState<InsecurityCategory>('impostor_career');
  const [rawThought, setRawThought] = useState('');
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawThought(val);

    const safetyCheck = evaluateSafety(val);
    if (safetyCheck.isCritical) {
      setSafetyAlert(safetyCheck.helplineMessage || 'Please reach out to 988 for immediate confidential support.');
    } else {
      setSafetyAlert(null);
    }
  };

  const handleUseSample = (category: InsecurityCategory) => {
    setSelectedCategory(category);
    setRawThought(SAMPLE_THOUGHTS[category]);
    setSafetyAlert(null);
  };

  const handleProceed = (directToClarity: boolean) => {
    if (!rawThought.trim()) return;
    onSubmit(selectedCategory, rawThought.trim(), directToClarity);
  };

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 sm:py-16">
      
      {/* Top Hero Section (Matching Reference Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Left Column: Bold Headline */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-medium mb-5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Zero-Knowledge • Anonymous Sanctuary</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6">
            Deconstruct Insecurity with Cognitive Justice.
          </h1>

          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Insecurity tricks the mind into believing we are isolated in our flaws. 
            HeavenPulse strips away ego and fear, pairing raw vulnerability with clinical CBT reality anchors and live peer resonance.
          </p>
        </div>

        {/* Right Column: Key Trust Signals */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 pt-2">
          <div className="card-linear rounded-2xl p-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 mb-2">
              <EyeOff className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-white">Zero Accounts</div>
            <div className="text-xs text-neutral-400 mt-1">No email, no phone, zero database storage.</div>
          </div>

          <div className="card-linear rounded-2xl p-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-sm font-semibold text-white">Safe Air-Gap</div>
            <div className="text-xs text-neutral-400 mt-1">Real-time crisis safety and PII redaction.</div>
          </div>
        </div>

      </div>

      {/* Main Interactive Card (Sleek Dark Obsidian Box) */}
      <div className="card-linear rounded-3xl p-6 sm:p-9 relative overflow-hidden">
        
        {/* Subtle Top Inner Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Category Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              1. Select Domain of Insecurity
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              Anonymous Session
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INSECURITY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-neutral-800 border-white/30 text-white shadow-lg shadow-black/80'
                      : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                  } border cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{cat.label}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />}
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 leading-normal">{cat.shortDesc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Area Card */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              2. Enter Your Raw, Unfiltered Thought
            </span>
            <button
              type="button"
              onClick={() => handleUseSample(selectedCategory)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Load sample thought</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              value={rawThought}
              onChange={handleTextChange}
              rows={4}
              placeholder="What is your inner critic whispering right now? Be completely honest..."
              className="w-full rounded-2xl input-linear p-4 text-sm sm:text-base leading-relaxed placeholder:text-neutral-600 font-sans"
            />
          </div>
        </div>

        {/* Safety Alert (If critical) */}
        {safetyAlert && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-600/30 flex items-start gap-3 text-amber-200 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold block text-amber-300 mb-0.5">Compassionate Support Available</span>
              {safetyAlert} 
              <span className="block mt-1 font-medium text-white">Call or Text 988 anytime.</span>
            </div>
          </div>
        )}

        {/* Dual Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-neutral-800/80">
          <div className="text-xs text-neutral-500 hidden sm:block">
            <span>Ephemeral payload purged upon tab closure</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Solo Direct Mode */}
            <button
              type="button"
              disabled={!rawThought.trim()}
              onClick={() => handleProceed(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 text-neutral-300 hover:text-white border border-neutral-700/80 text-xs font-semibold transition-colors cursor-pointer"
            >
              Solo Clarity Mirror
            </button>

            {/* Peer Resonance Mode (Main Green CTA like 'Get Started' in reference) */}
            <button
              type="button"
              disabled={!rawThought.trim()}
              onClick={() => handleProceed(false)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 text-black font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-black" />
              <span>Connect with Peers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
