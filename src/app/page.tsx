'use client';

import React, { useState, useEffect } from 'react';
import { InsecurityCategory, PeerResonanceCard, ClarityReport } from '../lib/types';
import { generateClarityReport } from '../lib/distortion-engine';
import { getPeersByCategory } from '../lib/mock-peers';
import { Header } from '../components/Header';
import { SanctuaryIntake } from '../components/SanctuaryIntake';
import { ResonanceHub } from '../components/ResonanceHub';
import { EmpathyBridge } from '../components/EmpathyBridge';
import { ClarityMirror } from '../components/ClarityMirror';
import { ParticleWaveBackground } from '../components/ParticleWaveBackground';

type ScreenStep = 'intake' | 'resonance_hub' | 'empathy_bridge' | 'clarity_mirror';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('intake');
  const [selectedCategory, setSelectedCategory] = useState<InsecurityCategory>('impostor_career');
  const [rawThought, setRawThought] = useState<string>('');
  const [selectedPeer, setSelectedPeer] = useState<PeerResonanceCard | null>(null);
  const [clarityReport, setClarityReport] = useState<ClarityReport | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isVolunteerListener, setIsVolunteerListener] = useState<boolean>(false);

  // Generate ephemeral session ID in memory
  useEffect(() => {
    setSessionId('sess_' + Math.random().toString(36).substring(2, 10));
  }, []);

  // Handle Intake Submission
  const handleIntakeSubmit = (category: InsecurityCategory, thought: string, directToClarity: boolean) => {
    setSelectedCategory(category);
    setRawThought(thought);
    setIsVolunteerListener(false);

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
    setIsVolunteerListener(false);
    setCurrentStep('empathy_bridge');
  };

  // Handle Direct Solo from Hub
  const handleDirectSoloFromHub = () => {
    const report = generateClarityReport(sessionId, rawThought, selectedCategory);
    setClarityReport(report);
    setCurrentStep('clarity_mirror');
  };

  // Handle Empathy Bridge Completion (Bridge -> Clarity Mirror)
  const handleEmpathyComplete = (transcript: string) => {
    const report = generateClarityReport(sessionId, rawThought, selectedCategory, transcript);
    setClarityReport(report);
    setCurrentStep('clarity_mirror');
  };

  // Handle Listener Volunteer Mode (Enter directly to hold space for others)
  const handleBeListener = (category: InsecurityCategory) => {
    setSelectedCategory(category);
    setRawThought('Holding space for a peer in this vulnerability domain.');
    const peers = getPeersByCategory(category);
    const chosenPeer = peers[0] || {
      id: `peer-${category}-1`,
      alias: 'StarlitFern',
      category: category,
      distilledStruggle: 'Holding space for live students.',
      perspectiveGift: 'Listening with quiet presence.',
      isOnline: true,
      activeMinutesAgo: 1,
      resonanceCount: 100,
    };
    setSelectedPeer(chosenPeer);
    setIsVolunteerListener(true);
    setCurrentStep('empathy_bridge');
  };

  // Reset / Return to Sanctuary
  const handleReset = () => {
    setRawThought('');
    setSelectedPeer(null);
    setClarityReport(null);
    setIsVolunteerListener(false);
    setCurrentStep('intake');
  };

  return (
    <div className="relative min-h-screen bg-black bg-matrix-dots text-neutral-100 flex flex-col justify-between selection:bg-neutral-800 selection:text-white">
      
      {/* Top Ambient Spotlight Lighting */}
      <div className="spotlight-top" />

      {/* 3D Flowing Particle Wave Canvas */}
      <ParticleWaveBackground />

      {/* Persistent Global Header */}
      <Header onReset={handleReset} />

      {/* Main Dynamic Viewport */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-6 sm:py-10">
        
        {currentStep === 'intake' && (
          <SanctuaryIntake 
            onSubmit={handleIntakeSubmit} 
            onBeListener={handleBeListener}
          />
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

        {currentStep === 'empathy_bridge' && selectedPeer && (
          <EmpathyBridge
            peer={selectedPeer}
            userRawThought={rawThought}
            isVolunteerListener={isVolunteerListener}
            onComplete={handleEmpathyComplete}
            onBack={() => setCurrentStep('intake')}
          />
        )}

        {currentStep === 'clarity_mirror' && clarityReport && (
          <ClarityMirror
            report={clarityReport}
            onReset={handleReset}
          />
        )}

      </main>

      {/* Atmospheric Minimalist Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] py-6 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            HeavenPulse • 100% Free Non-Profit Public Good for Student & Youth Mental Wellness
          </div>
          <div className="flex items-center gap-4 text-neutral-500 font-mono text-[11px]">
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
