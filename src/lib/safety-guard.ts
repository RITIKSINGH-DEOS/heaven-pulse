import { SafetyCheckResult } from './types';

/**
 * Deterministic crisis keywords and severe distress phrases.
 * Safety air-gap executes with zero latency before any AI processing.
 */
const CRISIS_PATTERNS = [
  /\b(kill myself|want to die|commit suicide|end my life|take my life|suicidal)\b/i,
  /\b(hang myself|cut my wrists|slit my wrists|overdose|jump off a bridge)\b/i,
  /\b(better off dead|no reason to live|don't want to wake up|can't go on anymore)\b/i,
  /\b(self[-\s]?harm|hurting myself|bleed to death)\b/i,
];

/**
 * PII and contact info filters to protect user anonymity during peer chats.
 */
const PII_PATTERNS = [
  // Phone numbers (various formats)
  /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  // Email addresses
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  // Social handles (@username, instagram/snapchat/telegram handles)
  /(?:^|\s)(?:ig|insta|snap|telegram|discord|wa|whatsapp)[:\s]*@?([a-zA-Z0-9._]{3,})/i,
  /(?:^|\s)@[a-zA-Z0-9_]{3,}/,
];

/**
 * Scans text for red-line emergency crisis indicators.
 */
export function evaluateSafety(text: string): SafetyCheckResult {
  if (!text || text.trim().length === 0) {
    return { isCritical: false, crisisType: 'none' };
  }

  const normalized = text.toLowerCase();

  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isCritical: true,
        crisisType: 'self_harm',
        helplineMessage: 
          'You are not alone, and your life has deep, irreplaceable worth. Immediate, free, and confidential human support is available right now.',
        lifelinePhone: '988',
        lifelineText: 'Text HOME to 741741 (Crisis Text Line)',
      };
    }
  }

  return {
    isCritical: false,
    crisisType: 'none',
  };
}

/**
 * Filters out personal contact information to keep peer chat 100% safe and anonymous.
 */
export function sanitizePeerMessage(text: string): { cleanText: string; blockedPii: boolean } {
  let cleanText = text;
  let blockedPii = false;

  for (const pattern of PII_PATTERNS) {
    if (pattern.test(cleanText)) {
      blockedPii = true;
      cleanText = cleanText.replace(pattern, '[Contact info hidden for your privacy & safety]');
    }
  }

  return { cleanText, blockedPii };
}
