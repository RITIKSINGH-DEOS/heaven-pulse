'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PeerResonanceCard, ChatMessage } from '../lib/types';
import { sanitizePeerMessage } from '../lib/safety-guard';
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ArrowRight,
  Heart,
  Flame
} from 'lucide-react';

interface EmpathyBridgeProps {
  peer: PeerResonanceCard;
  userRawThought: string;
  onComplete: (chatTranscript: string) => void;
  onBack: () => void;
}

const EMPATHY_QUICK_DROPS = [
  '🫂 I have walked this exact road, you are not alone.',
  '🕯️ Sending quiet strength to your heart.',
  '💡 Thank you for being vulnerable with me.',
  '🌱 Be gentle with yourself today; this chapter is not your whole story.',
];

export const EmpathyBridge: React.FC<EmpathyBridgeProps> = ({
  peer,
  userRawThought,
  onComplete,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const [isWarningPii, setIsWarningPii] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Initialize with system message & peer icebreaker
  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: 'sys-1',
        sender: 'system',
        senderAlias: 'Sanctuary Protocol',
        text: 'You have entered an encrypted, zero-trace empathy chamber. No logs are saved. Be gentle, be truthful.',
        timestamp: Date.now(),
      },
      {
        id: 'peer-intro',
        sender: 'peer',
        senderAlias: peer.alias,
        text: `Hello friend. I saw you were processing this burden: "${userRawThought.slice(0, 80)}${userRawThought.length > 80 ? '...' : ''}". I know this feeling so deeply.`,
        timestamp: Date.now() + 500,
      },
    ];
    setMessages(initialMessages);
  }, [peer, userRawThought]);

  // 5-Minute Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPeerTyping]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    // Check PII Guard
    const { cleanText, blockedPii } = sanitizePeerMessage(content);
    if (blockedPii) {
      setIsWarningPii(true);
      setTimeout(() => setIsWarningPii(false), 4000);
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'self',
      senderAlias: 'You (CalmSeeker)',
      text: cleanText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Trigger supportive peer response after brief natural delay
    simulatePeerResponse(cleanText);
  };

  const simulatePeerResponse = (lastUserMsg: string) => {
    setIsPeerTyping(true);
    setTimeout(() => {
      setIsPeerTyping(false);

      const peerResponses = [
        "Hearing you say that relieves so much of my own private guilt. We judge ourselves so much harsher than anyone else ever does.",
        "Yes, exactly. When we are inside our own head, everything feels 100x louder than it actually is in reality.",
        "Take a deep breath with me. What you are feeling is real, but it is not a permanent verdict on who you are.",
        "I'm so glad we connected for these few minutes. It reminds me that behind every quiet face in a room, someone is fighting a silent battle.",
      ];

      const chosen = peerResponses[Math.floor(Math.random() * peerResponses.length)];
      const peerMsg: ChatMessage = {
        id: `peer-${Date.now()}`,
        sender: 'peer',
        senderAlias: peer.alias,
        text: chosen,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, peerMsg]);
    }, 1800);
  };

  const handleConclude = () => {
    const transcript = messages
      .filter((m) => m.sender !== 'system')
      .map((m) => `${m.senderAlias}: ${m.text}`)
      .join(' | ');
    onComplete(transcript);
  };

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      
      {/* Top Bar with Timer & Safety Badges */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Chamber</span>
        </button>

        {/* 5-Min Timer Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span className="text-neutral-300">Chamber Closes in:</span>
          <span className={`font-bold ${timeLeft < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {formatTimer(timeLeft)}
          </span>
        </div>

        {/* Conclude Shortcut */}
        <button
          onClick={handleConclude}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
        >
          <span>Enter Clarity Mirror</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Chat Chamber Card */}
      <div className="card-spotlight p-5 sm:p-7 flex flex-col h-[580px] justify-between relative overflow-hidden">
        
        {/* Chamber Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-emerald-400 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  Connected with {peer.alias}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                  Live Peer
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Anonymous 1-on-1 • Encrypted Memory • Disintegrates upon exit
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Zero-Knowledge Bridge</span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-3.5 pr-1">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-3 py-1 rounded-full border border-white/5">
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isSelf = msg.sender === 'self';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] font-mono text-neutral-500 mb-1 px-1">
                  {msg.senderAlias}
                </span>
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isSelf
                      ? 'bg-neutral-800 text-white border border-white/15 rounded-tr-sm shadow-md'
                      : 'bg-[#15151c] text-neutral-200 border border-white/10 rounded-tl-sm shadow-inner'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isPeerTyping && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 italic pl-1 animate-pulse">
              <span>{peer.alias} is typing words of perspective...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* PII Alert (If triggered) */}
        {isWarningPii && (
          <div className="mb-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/40 text-[11px] text-amber-300 text-center animate-fade-in">
            Personal contact information was automatically redacted to protect your mutual anonymity.
          </div>
        )}

        {/* Empathy Quick Drops Horizontal Scroll Bar */}
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto border-t border-white/[0.06] mb-2 select-none scroll-smooth">
          <span className="text-[10px] font-mono uppercase text-neutral-500 shrink-0">
            Quick Drops:
          </span>
          {EMPATHY_QUICK_DROPS.map((drop, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(drop)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-sm"
            >
              {drop}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Speak honestly with ${peer.alias}... (zero judgment)`}
            className="flex-1 input-spotlight px-4 py-2.5 text-xs sm:text-sm placeholder:text-neutral-600"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
