'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PeerResonanceCard, ChatMessage } from '../lib/types';
import { sanitizePeerMessage } from '../lib/safety-guard';
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  Sparkles, 
  Lock, 
  ArrowRight,
  UserCheck,
  Bot,
  HeartHandshake
} from 'lucide-react';

interface EmpathyBridgeProps {
  peer: PeerResonanceCard;
  userRawThought: string;
  isVolunteerListener?: boolean;
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
  isVolunteerListener = false,
  onComplete,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isWarningPii, setIsWarningPii] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [hasRealPeerOnline, setHasRealPeerOnline] = useState(false);
  
  // Dynamic anonymous role aliases assigned by server room
  const [assignedAlias, setAssignedAlias] = useState<string>(isVolunteerListener ? 'StarlitFern' : 'CalmSeeker');
  const [assignedPeerAlias, setAssignedPeerAlias] = useState<string>(isVolunteerListener ? 'CalmSeeker' : (peer?.alias || 'StarlitFern'));

  // Adaptive Role Theme: Indigo/Purple for Listener (StarlitFern), Emerald Green for Seeker (CalmSeeker)
  const isListener = assignedAlias === 'StarlitFern' || isVolunteerListener;

  const hasRealPeerRef = useRef<boolean>(false);
  const chatScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const clientIdRef = useRef<string>('');
  const roomIdRef = useRef<string>('');

  // Keep window centered and prevent page-level jumping
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // 1. Join Server Chamber & Setup Polling
  useEffect(() => {
    const cId = 'client_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    clientIdRef.current = cId;

    // Join Server Matchmaker Room
    const joinRoom = async () => {
      try {
        const res = await fetch('/api/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'JOIN',
            clientId: cId,
            category: peer.category,
            isVolunteer: isVolunteerListener,
          }),
        });
        const data = await res.json();
        if (data.success) {
          roomIdRef.current = data.roomId;
          if (data.myAlias) setAssignedAlias(data.myAlias);
          if (data.peerAlias) setAssignedPeerAlias(data.peerAlias);
          if (data.isPeerOnline) {
            hasRealPeerRef.current = true;
            setHasRealPeerOnline(true);
          }

          // Initial populate
          if (Array.isArray(data.messages) && data.messages.length > 0) {
            syncMessagesFromServer(data.messages, cId, data.myAlias, data.peerAlias);
          } else {
            // Default initial message
            setupDefaultGreeting(data.myAlias, data.peerAlias);
          }
        }
      } catch (err) {
        console.error('Failed to join room:', err);
        setupDefaultGreeting(assignedAlias, assignedPeerAlias);
      }
    };

    joinRoom();

    // 2. Poll server every 600ms for zero-config cross-tab / cross-device sync
    const pollInterval = setInterval(async () => {
      if (!roomIdRef.current && !cId) return;
      try {
        const url = `/api/room?roomId=${encodeURIComponent(roomIdRef.current)}&clientId=${encodeURIComponent(cId)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          if (data.myAlias) setAssignedAlias(data.myAlias);
          if (data.peerAlias) setAssignedPeerAlias(data.peerAlias);

          const peerNowOnline = Boolean(data.isPeerOnline);
          hasRealPeerRef.current = peerNowOnline;
          setHasRealPeerOnline(peerNowOnline);

          if (Array.isArray(data.messages)) {
            syncMessagesFromServer(data.messages, cId, data.myAlias, data.peerAlias);
          }
        }
      } catch {}
    }, 600);

    return () => {
      clearInterval(pollInterval);
      // Notify chamber of exit
      if (clientIdRef.current) {
        fetch('/api/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'LEAVE',
            clientId: clientIdRef.current,
            roomId: roomIdRef.current,
          }),
        }).catch(() => {});
      }
    };
  }, [peer.category, isVolunteerListener]);

  const setupDefaultGreeting = (myA: string, peerA: string) => {
    const greetingText = isVolunteerListener
      ? `Welcome Volunteer. You are holding space for a peer struggling with: "${userRawThought.slice(0, 80)}${userRawThought.length > 80 ? '...' : ''}". Listen with pure empathy.`
      : `Hello friend. I saw you were processing this burden: "${userRawThought.slice(0, 80)}${userRawThought.length > 80 ? '...' : ''}". I know this feeling so deeply.`;

    setMessages([
      {
        id: 'sys-1',
        sender: 'system',
        senderAlias: 'Sanctuary Protocol',
        text: 'You have entered an encrypted, zero-trace empathy chamber. No logs are saved. Waiting for a live peer, or converse with autonomous sanctuary reflection.',
        timestamp: Date.now(),
      },
      {
        id: 'peer-intro',
        sender: 'peer',
        senderAlias: peerA || peer.alias,
        text: greetingText,
        timestamp: Date.now() + 200,
      },
    ]);
  };

  const syncMessagesFromServer = (
    serverMsgs: any[],
    cId: string,
    currentMyAlias?: string,
    currentPeerAlias?: string
  ) => {
    const myA = currentMyAlias || assignedAlias;
    const pA = currentPeerAlias || assignedPeerAlias;

    const formatted: ChatMessage[] = serverMsgs.map((m: any) => {
      if (m.senderId === 'system') {
        return {
          id: m.id,
          sender: 'system',
          senderAlias: m.senderAlias || 'Sanctuary Protocol',
          text: m.text,
          timestamp: m.timestamp,
        };
      }
      const isSelf = m.senderId === cId;
      return {
        id: m.id,
        sender: isSelf ? 'self' : 'peer',
        senderAlias: isSelf ? `You (${myA})` : (m.senderAlias || pA),
        text: m.text,
        timestamp: m.timestamp,
      };
    });

    setMessages(formatted);
  };

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

  // Auto-scroll chat: Scroll ONLY inside the container, NEVER scroll the browser window
  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isPeerTyping]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    // Check PII Guard
    const { cleanText, blockedPii } = sanitizePeerMessage(content);
    if (blockedPii) {
      setIsWarningPii(true);
      setTimeout(() => setIsWarningPii(false), 4000);
    }

    const localMsgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const userMsg: ChatMessage = {
      id: localMsgId,
      sender: 'self',
      senderAlias: `You (${assignedAlias})`,
      text: cleanText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Post to Server Room
    try {
      await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'MESSAGE',
          roomId: roomIdRef.current,
          clientId: clientIdRef.current,
          senderAlias: assignedAlias,
          text: cleanText,
        }),
      });
    } catch (err) {
      console.error('Failed to post message:', err);
    }

    // FALLBACK ONLY: If no live human peer is in room, activate empathetic simulation
    if (!hasRealPeerRef.current && !hasRealPeerOnline) {
      simulatePeerResponse(cleanText);
    }
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
        senderAlias: `${assignedPeerAlias} (AI Companion)`,
        text: chosen,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, peerMsg]);
    }, 1800);
  };

  const triggerManualSimulation = () => {
    simulatePeerResponse('Prompting reflection...');
  };

  const handleConclude = () => {
    const transcript = messages
      .filter((m) => m.sender !== 'system')
      .map((m) => `${m.senderAlias}: ${m.text}`)
      .join(' | ');
    onComplete(transcript);
  };

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-2 sm:py-6 animate-fade-in my-auto flex flex-col justify-center">
      
      {/* Top Bar with Timer & Safety Badges */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Chamber</span>
        </button>

        {/* 5-Min Timer Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-mono">
          <Clock className={`w-3.5 h-3.5 animate-spin-slow ${isListener ? 'text-indigo-400' : 'text-emerald-400'}`} />
          <span className="text-neutral-300">Chamber Closes in:</span>
          <span className={`font-bold ${timeLeft < 60 ? 'text-amber-400' : (isListener ? 'text-indigo-400' : 'text-emerald-400')}`}>
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
      <div className={`card-spotlight p-4 sm:p-6 flex flex-col h-[520px] sm:h-[560px] max-h-[74vh] justify-between relative overflow-hidden border-t-2 ${
        isListener 
          ? 'border-t-indigo-500/70 shadow-[0_-8px_30px_rgba(99,102,241,0.18)]' 
          : 'border-t-emerald-500/70 shadow-[0_-8px_30px_rgba(52,211,153,0.18)]'
      }`}>
        
        {/* Chamber Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner transition-colors ${
              isListener
                ? 'bg-indigo-950/70 border-indigo-500/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                : (hasRealPeerOnline 
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]' 
                    : 'bg-neutral-900 border-white/10 text-neutral-400')
            }`}>
              {isListener ? (
                <HeartHandshake className="w-5 h-5 text-indigo-400" />
              ) : hasRealPeerOnline ? (
                <UserCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <Bot className="w-5 h-5 text-amber-400/80" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white">
                  You ({assignedAlias}) &bull; Connected with {assignedPeerAlias}
                </span>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all inline-flex items-center gap-1.5 ${
                  hasRealPeerOnline 
                    ? (isListener 
                        ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/80 shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/80 shadow-[0_0_10px_rgba(52,211,153,0.35)]')
                    : 'bg-amber-950/40 text-amber-300/90 border-amber-600/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    hasRealPeerOnline 
                      ? (isListener ? 'bg-indigo-400 animate-ping' : 'bg-emerald-400 animate-ping')
                      : 'bg-amber-400'
                  }`} />
                  {hasRealPeerOnline 
                    ? (isListener ? '🟣 Live Peer Connected (Listener Space)' : '🟢 Live Human Peer (Cross-Tab Active)')
                    : '🟡 Lone Mode (AI Simulation Fallback)'}
                </span>
              </div>

              <p className="text-[11px] text-neutral-400 mt-0.5">
                {hasRealPeerOnline 
                  ? (isListener 
                      ? 'Holding compassionate space for CalmSeeker • Zero judgment • 100% Ephemeral' 
                      : 'Real-time two-way human dialogue across tabs/devices • 100% Ephemeral')
                  : 'Alone in sanctuary? An empathetic CBT peer will reflect with you. Open a 2nd tab to test live human match!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!hasRealPeerOnline && (
              <button
                type="button"
                onClick={triggerManualSimulation}
                className="text-[10px] px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-600/30 transition-colors flex items-center gap-1 cursor-pointer"
                title="Test AI Peer Response while alone in chamber"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Simulate Peer</span>
              </button>
            )}

            <div className="hidden md:flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
              <Lock className={`w-3 h-3 ${isListener ? 'text-indigo-400' : 'text-emerald-400'}`} />
              <span>Zero-Trace</span>
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div 
          ref={chatScrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-3.5 pr-1"
        >
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
                      ? (isListener 
                          ? 'bg-indigo-950/70 text-indigo-50 border border-indigo-500/40 rounded-tr-sm shadow-md'
                          : 'bg-neutral-800 text-white border border-white/15 rounded-tr-sm shadow-md')
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
            <div className={`flex items-center gap-2 text-xs italic pl-1 animate-pulse ${
              isListener ? 'text-indigo-400' : 'text-emerald-400'
            }`}>
              <span>{assignedPeerAlias} is typing words of perspective...</span>
            </div>
          )}
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
              className={`text-[11px] px-3 py-1.5 rounded-full bg-neutral-900/90 text-neutral-300 hover:text-white border border-white/10 whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-sm ${
                isListener ? 'hover:bg-indigo-950/60 hover:border-indigo-500/40 hover:text-indigo-200' : 'hover:bg-neutral-800'
              }`}
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
            placeholder={
              isListener
                ? `Listen & offer quiet solidarity to ${assignedPeerAlias}... (zero advice, pure presence)`
                : `Speak honestly with ${assignedPeerAlias}... (zero judgment)`
            }
            className={`flex-1 input-spotlight px-4 py-2.5 text-xs sm:text-sm placeholder:text-neutral-600 transition-colors ${
              isListener ? 'focus:border-indigo-500/60' : 'focus:border-emerald-500/60'
            }`}
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-lg font-semibold transition-all cursor-pointer shadow-sm ${
              isListener 
                ? 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white shadow-md shadow-indigo-950/50'
                : 'bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black shadow-md shadow-emerald-950/50'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
