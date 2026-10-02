/**
 * HeavenPulse Core Type Definitions
 * Strict TypeScript contracts for zero-knowledge mental wellness architecture.
 */

export type InsecurityCategory = 
  | 'impostor_career'
  | 'body_image'
  | 'social_anxiety'
  | 'belonging_relationships';

export interface CategoryMetadata {
  id: InsecurityCategory;
  label: string;
  shortDesc: string;
  icon: string;
  accentColor: string;
}

export interface InsecurityIntake {
  sessionId: string;
  category: InsecurityCategory;
  rawThought: string;
  intensityLevel: number; // 1 to 10
  timestamp: number;
}

export interface PeerResonanceCard {
  id: string;
  alias: string;
  category: InsecurityCategory;
  distilledStruggle: string;
  perspectiveGift: string;
  isOnline: boolean;
  activeMinutesAgo: number;
  resonanceCount: number;
}

export interface SafetyCheckResult {
  isCritical: boolean;
  crisisType?: 'self_harm' | 'severe_distress' | 'none';
  helplineMessage?: string;
  lifelinePhone?: string;
  lifelineText?: string;
}

export interface CognitiveDistortion {
  id: string;
  name: string;
  description: string;
  indicator: string;
  simpleName: string;
  realLifeExample: string;
}

export interface ClarityReport {
  sessionId: string;
  category: InsecurityCategory;
  rawThought: string;
  primaryDistortion: CognitiveDistortion;
  criticPerception: string;
  objectiveReality: string;
  realLifeExample: string;
  socraticQuestions: string[];
  groundingBreathingAnchor: string;
  generatedAt: number;
  burnStatus: 'ACTIVE' | 'PURGED';
}

export interface ChatMessage {
  id: string;
  sender: 'self' | 'peer' | 'system';
  senderAlias: string;
  text: string;
  timestamp: number;
}

export interface SessionState {
  sessionId: string;
  alias: string;
  intake?: InsecurityIntake;
  matchedPeer?: PeerResonanceCard;
  chatHistory: ChatMessage[];
  clarityReport?: ClarityReport;
  isPurged: boolean;
}
