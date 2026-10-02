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
      
      {/* Hero Title Section */}
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

      {/* Main Centerpiece Card */}
      <div className="card-spotlight p-6 sm:p-9 mb-16 relative overflow-hidden">
        
        {/* Subtle Card Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-neutral-300">
              Anonymous Session
            </span>
          </div>

          <span className="text-[11px] text-neutral-500 font-mono">
            Zero logs • Disappears on exit
          </span>
        </div>

        {/* Domain Selection Grid */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-neutral-400 mb-2.5">
            What is weighing on your mind?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INSECURITY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-3 rounded-xl text-center sm:text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-800/90 border-emerald-500/60 text-white shadow-md'
                      : 'bg-neutral-900/60 border-white/[0.08] text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  } border`}
                >
                  <div className="text-xs font-medium leading-snug">
                    {cat.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Input Field */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-neutral-400">
              Share your thought honestly
            </label>
            <button
              type="button"
              onClick={() => handleUseSample(selectedCategory)}
              className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Fill sample</span>
            </button>
          </div>

          <textarea
            value={rawThought}
            onChange={handleTextChange}
            rows={4}
            placeholder="What's bothering you? (e.g. 'I feel like I'm falling behind and everyone else has it together...')"
            className="w-full input-spotlight p-4 text-sm leading-relaxed placeholder:text-neutral-600 rounded-xl"
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
          <span className="text-xs text-neutral-500 hidden sm:inline">
            100% Client-side • Never saved anywhere
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Solo Direct Mode Button */}
            <button
              type="button"
              disabled={!rawThought.trim()}
              onClick={() => handleProceed(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
            >
              Reflect Solo
            </button>

            {/* Peer Connection CTA */}
            <button
              type="button"
              disabled={!rawThought.trim()}
              onClick={() => handleProceed(false)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-medium text-xs transition-all shadow-sm cursor-pointer"
            >
              <span>Connect with Peers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Feature Grid */}
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
            <h3 className="text-sm font-semibold text-white mb-1.5">100% Private & Anonymous</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No signups, no cookies, no tracking. Your thoughts disappear the moment you close the tab.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <BrainCircuit className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">CBT Thought Reframing</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Detects overthinking patterns like catastrophizing and turns negative thoughts into balanced reality.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <HeartHandshake className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">5-Min Peer Empathy Chat</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Connect anonymously with a student facing the same struggle. Quick, safe, and judgment-free.
            </p>
          </div>

          {/* Card 4 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <ShieldCheck className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">Built-in Safety Shield</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Blocks personal info (phone, handles) and automatically connects severe distress to 988 lifeline.
            </p>
          </div>

          {/* Card 5 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <Compass className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">Solo Clarity Mode</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Prefer quiet reflection? Skip peer chat anytime and jump straight to personal thought deconstruction.
            </p>
          </div>

          {/* Card 6 */}
          <div className="card-spotlight p-6 text-center flex flex-col items-center">
            <div className="icon-badge-circle mb-4">
              <Heart className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5">Free & Non-Profit</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              An open digital sanctuary created for student wellness. No ads, no paywalls, forever free.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
