'use client';

import React, { useState, useEffect } from 'react';
import { InsecurityCategory, PeerResonanceCard, ClarityReport } from '../lib/types';
import { generateClarityReport } from '../lib/distortion-engine';
import { Header } from '../components/Header';
import { SanctuaryIntake } from '../components/SanctuaryIntake';
import { ResonanceHub } from '../components/ResonanceHub';
import { ParticleWaveBackground } from '../components/ParticleWaveBackground';

type ScreenStep = 'intake' | 'resonance_hub' | 'empathy_bridge' | 'clarity_mirror';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('intake');
  const [selectedCategory, setSelectedCategory] = useState<InsecurityCategory>('impostor_career');
  const [rawThought, setRawThought] = useState<string>('');
  const [selectedPeer, setSelectedPeer] = useState<PeerResonanceCard | null>(null);
  const [clarityReport, setClarityReport] = useState<ClarityReport | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  // Generate ephemeral session ID in memory
  useEffect(() => {
    setSessionId('sess_' + Math.random().toString(36).substring(2, 10));
  }, []);

  // Handle Intake Submission
  const handleIntakeSubmit = (category: InsecurityCategory, thought: string, directToClarity: boolean) => {
    setSelectedCategory(category);
    setRawThought(thought);

    if (directToClarity) {
      // Direct Solo Pathway: Generate Clarity Report immediately
      const report = generateClarityReport(sessionId, thought, category);
      setClarityReport(report);
      setCurrentStep('clarity_mirror');
    } else {
      // Peer Pathway: Proceed to Live Resonance Hub
      setCurrentStep('resonance_hub');
    }
  };

  // Handle Peer Selection from Hub
  const handleSelectPeer = (peer: PeerResonanceCard) => {
    setSelectedPeer(peer);
    setCurrentStep('empathy_bridge');
  };

  // Handle Direct Solo from Hub
  const handleDirectSoloFromHub = () => {
    const report = generateClarityReport(sessionId, rawThought, selectedCategory);
    setClarityReport(report);
    setCurrentStep('clarity_mirror');
  };

  // Reset / Return to Sanctuary
  const handleReset = () => {
    setRawThought('');
    setSelectedPeer(null);
    setClarityReport(null);
    setCurrentStep('intake');
  };

  return (
    <div className="relative min-h-screen bg-black bg-matrix-dots text-neutral-100 flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      
      {/* Top Center Spotlight Cone (from Reference Images) */}
      <div className="spotlight-top" />

      {/* 3D Flowing Particle Mesh & Embers (from Reference Image 2) */}
      <ParticleWaveBackground />

      {/* Persistent Global Header */}
      <Header onReset={handleReset} />

      {/* Main Dynamic Viewport */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-6 sm:py-10">
        
        {currentStep === 'intake' && (
          <SanctuaryIntake onSubmit={handleIntakeSubmit} />
        )}

        {currentStep === 'resonance_hub' && (
          <ResonanceHub
            category={selectedCategory}
            rawThought={rawThought}
            onSelectPeer={handleSelectPeer}
            onDirectToClarity={handleDirectSoloFromHub}
            onBack={() => setCurrentStep('intake')}
          />
        )}

        {/* Phase 3 Placeholders (Seamless transition readiness) */}
        {currentStep === 'empathy_bridge' && (
          <div className="max-w-2xl mx-auto px-4 text-center py-16 glass-panel rounded-3xl animate-fade-in">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
              Ready for Phase 3
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">
              Empathy Bridge with {selectedPeer?.alias}
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Safe 5-minute ephemeral chamber is being linked in Phase 3.
            </p>
            <button
              onClick={handleDirectSoloFromHub}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-colors"
            >
              Continue to The Clarity Mirror &rarr;
            </button>
          </div>
        )}

        {currentStep === 'clarity_mirror' && (
          <div className="max-w-2xl mx-auto px-4 text-center py-16 glass-panel rounded-3xl animate-fade-in">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 block mb-2">
              The Clarity Mirror
            </span>
            <h2 className="text-2xl font-bold text-white mb-3">
              {clarityReport?.primaryDistortion.name}
            </h2>
            <p className="text-sm text-slate-300 italic mb-4 max-w-lg mx-auto">
              &quot;{clarityReport?.objectiveReality}&quot;
            </p>
            <div className="text-xs text-slate-400 mb-6">
              Full deconstruction & Release Ritual will be expanded in Phase 3.
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
            >
              &larr; Release & Return to Sanctuary
            </button>
          </div>
        )}

      </main>

      {/* Atmospheric Minimalist Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            HeavenPulse • 100% Free Non-Profit Public Good for Student & Youth Wellness
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-Side Ephemeral Memory</span>
            <span>•</span>
            <span>Zero Tracking</span>
            <span>•</span>
            <span>WarriorHacks 2.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
