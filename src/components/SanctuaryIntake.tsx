'use client';

import React, { useState } from 'react';
import { InsecurityCategory } from '../lib/types';
import { INSECURITY_CATEGORIES } from '../lib/mock-peers';
import { evaluateSafety } from '../lib/safety-guard';
import { 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  HeartHandshake, 
  BrainCircuit, 
  EyeOff, 
  Compass, 
  Heart,
  Lock
} from 'lucide-react';

interface SanctuaryIntakeProps {
  onSubmit: (category: InsecurityCategory, rawThought: string, directToClarity: boolean) => void;
}

const SAMPLE_THOUGHTS: Record<InsecurityCategory, string> = {
  impostor_career: 'I feel like everyone in my program is leagues smarter than me and I am just an impostor.',
  body_image: 'I feel deeply self-conscious about my appearance and constantly fear that people are judging my looks.',
  social_anxiety: 'Whenever I speak in group settings, I replay every awkward phrase for hours and fear being disliked.',
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
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 sm:py-14 animate-fade-in">
      
      {/* 1. Hero Title Section (Exact match to Reference Image 1 & 3) */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-5 leading-[1.12]">
          Deconstructing Insecurity, <br />
          <span className="text-neutral-300">Empowering Minds</span>
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          HeavenPulse helps students and individuals dismantle paralyzing self-doubt through 
          clinical CBT deconstruction, zero-knowledge privacy, and real-time anonymous peer solidarity.
        </p>
      </div>

      {/* 2. Main Centerpiece Card (Exact match to Reference Image 1 & 3 UI Container) */}
      <div className="card-spotlight p-6 sm:p-9 mb-16 relative overflow-hidden">
        
        {/* Subtle Card Header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-neutral-900 border border-white/10 flex items-center justify-center text-emerald-400">
              <Lock className="w-3 h-3" />
            </div>
            <span className="text-xs font-semibold text-white tracking-wide">
              Anonymous Decompression Session
            </span>
          </div>

          <span className="text-[11px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            Session Memory: Client Only
          </span>
        </div>

        {/* Step 1: Category Selection Grid (Matching Image 1 Quick-Start Tiles) */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Select Domain of Vulnerability
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {INSECURITY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-[#15151c] border-white/30 text-white shadow-lg shadow-black/80'
                      : 'bg-[#0a0a0d] border-white/[0.07] text-neutral-400 hover:bg-[#121217] hover:text-neutral-200'
                  } border cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold">{cat.label}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 leading-normal">
                    {cat.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Unfiltered Input Field */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Your Raw, Unfiltered Inner Critic
            </label>
            <button
              type="button"
              onClick={() => handleUseSample(selectedCategory)}
              className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Use sample thought</span>
            </button>
          </div>

          <textarea
            value={rawThought}
            onChange={handleTextChange}
            rows={4}
            placeholder="Type your authentic struggle... (e.g. 'I freeze in group meetings and worry everyone thinks I do not belong')"
            className="w-full input-spotlight p-4 text-sm sm:text-base leading-relaxed placeholder:text-neutral-600 font-sans"
          />
        </div>

        {/* Safety Warning (If triggered) */}
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

        {/* Bottom Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
          <div className="text-xs text-neutral-500 hidden sm:block">
            <span>Zero database persistence • Instant client-side wipe</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Solo Direct Mode Button */}
            <button
              type="button"
              disabled={!rawThought.trim()}
              onClick={() => handleProceed(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              Solo Clarity Mirror
            </button>

            {/* Main Action (Matching Image 5 "Try For Free →" style) */}
            <button
              type="button"
              disabled={!rawThought.trim()}
              onClick={() => handleProceed(false)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#1e4b38] hover:bg-[#059669] disabled:opacity-30 text-[#34d399] hover:text-white border border-[#059669] font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              <span>Connect with Peers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. "Why Choose HeavenPulse" Feature Grid (Exact match to Reference Image 2: 6 Cards with Circle Badges) */}
      <div className="pt-6">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Why Choose HeavenPulse?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            A radical alternative to cold AI chatbots and toxic social forums.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <EyeOff className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">Zero-Knowledge Privacy</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No registration, no cookies, no tracking. Every session executes in client memory and vanishes upon close.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <BrainCircuit className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">CBT Socratic Deconstruction</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Scientific identification of cognitive distortions (Catastrophizing, Mind Reading, Spotlight Effect) with objective reality checks.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <HeartHandshake className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">Ephemeral 5-Min Empathy Bridge</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Real-time 1-on-1 human connection with online peers battling the exact same challenge. Zero profiles, zero toxicity.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <ShieldCheck className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">Deterministic Safety Air-Gap</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Automated red-line crisis filters for 988 emergency escalation and PII contact redaction to eliminate harassment.
            </p>
          </div>

          {/* Card 5 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <Compass className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">Solo Clarity Mirror</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Introvert-friendly instant resolution. Bypass peer interactions whenever you want pure, solitary cognitive clarity.
            </p>
          </div>

          {/* Card 6 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <Heart className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">100% Free Non-Profit</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Built as an open digital public good for high school and university mental health support with zero commercial interest.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
