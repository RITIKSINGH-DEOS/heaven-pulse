'use client';

import React from 'react';
import { InsecurityCategory, PeerResonanceCard } from '../lib/types';
import { getPeersByCategory, INSECURITY_CATEGORIES } from '../lib/mock-peers';
import { ArrowLeft, ArrowRight, MessageCircle, Sparkles, Compass } from 'lucide-react';

interface ResonanceHubProps {
  category: InsecurityCategory;
  rawThought: string;
  onSelectPeer: (peer: PeerResonanceCard) => void;
  onDirectToClarity: () => void;
  onBack: () => void;
}

export const ResonanceHub: React.FC<ResonanceHubProps> = ({
  category,
  rawThought,
  onSelectPeer,
  onDirectToClarity,
  onBack,
}) => {
  const peers = getPeersByCategory(category);
  const categoryMeta = INSECURITY_CATEGORIES.find((c) => c.id === category);

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Modify your thought</span>
      </button>

      {/* Top Banner (Linear/Novu Style) */}
      <div className="card-linear rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono uppercase text-emerald-400 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>Resonance Pulse Active • {categoryMeta?.label}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              You are not alone in this feeling.
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl leading-relaxed">
              Our community telemetry records <strong className="text-emerald-400">420+ anonymous members</strong> who processed this exact domain of vulnerability this week.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 shrink-0 sm:max-w-xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block mb-1">
              Your Unburdened Input
            </span>
            <p className="text-xs text-neutral-300 italic line-clamp-2 leading-relaxed">
              &quot;{rawThought}&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Solo Mode Shortcut Card */}
      <div 
        onClick={onDirectToClarity}
        className="card-linear rounded-2xl p-5 mb-8 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all border border-neutral-800 hover:border-neutral-700"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
              Prefer introspective solitude? Enter The Clarity Mirror
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Skip live peer conversation and immediately deconstruct this distortion through Socratic reality anchors.
            </p>
          </div>
        </div>

        <button 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-neutral-200 group-hover:bg-white group-hover:text-black font-semibold text-xs transition-colors shrink-0 border border-neutral-700"
        >
          <span>Solo Mode</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Peer Grid Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Anonymous Peer Resonance Grid
          </h3>
          <p className="text-xs text-neutral-400">
            Select a verified peer to initiate a 5-minute ephemeral safe chat.
          </p>
        </div>
      </div>

      {/* Peer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {peers.map((peer) => (
          <div
            key={peer.id}
            className="card-linear rounded-2xl p-5 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white tracking-wide">
                    {peer.alias}
                  </span>
                  {peer.isOnline ? (
                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online Now
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
                      Active {peer.activeMinutesAgo}m ago
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-neutral-500 font-mono">
                  {peer.resonanceCount} resonated
                </span>
              </div>

              {/* Distilled Struggle */}
              <div className="mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  Their Raw Struggle
                </span>
                <p className="text-xs text-neutral-300 italic leading-relaxed">
                  &quot;{peer.distilledStruggle}&quot;
                </p>
              </div>

              {/* Perspective Gift */}
              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3" />
                  Perspective Gift
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {peer.perspectiveGift}
                </p>
              </div>
            </div>

            {/* Connect Action Button */}
            <button
              onClick={() => onSelectPeer(peer)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-emerald-500 hover:text-black text-neutral-200 border border-neutral-800 font-semibold text-xs transition-all cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Connect with {peer.alias} (5m Safe Chat)</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
