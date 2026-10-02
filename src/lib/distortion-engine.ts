import { ClarityReport, CognitiveDistortion, InsecurityCategory } from './types';

export const COGNITIVE_DISTORTIONS: Record<string, CognitiveDistortion> = {
  mind_reading: {
    id: 'mind_reading',
    name: 'Mind-Reading Trap',
    simpleName: 'Assuming Others Are Judging You',
    description: 'You believe you know what people think about you, even when nobody said a word.',
    indicator: 'Assuming you know what people think about your worth.',
    realLifeExample: 'Ever see a friend walk past without smiling? You might think "They hate me!", but in reality, they were just running late or stressed about an exam.',
  },
  catastrophizing: {
    id: 'catastrophizing',
    name: 'The Disaster Movie Trap',
    simpleName: 'Expecting the Worst to Happen',
    description: 'One small mistake makes you feel like your entire future is completely ruined.',
    indicator: 'Magnifying a moment of struggle into total life failure.',
    realLifeExample: 'Failing one test or messing up one job interview makes you feel "I will never succeed in life", forgetting all the times you bounced back before.',
  },
  spotlight_effect: {
    id: 'spotlight_effect',
    name: 'The Spotlight Trap',
    simpleName: 'Feeling Everyone is Staring at You',
    description: 'Believing that other people notice and judge your looks or flaws as intensely as you do.',
    indicator: 'Believing all eyes are hyper-focused on your imperfections.',
    realLifeExample: 'You feel self-conscious about a bad haircut or your skin tone, thinking everyone is staring. But think about it: can you even remember what clothes or flaws the last 5 people you saw had? Everyone is busy thinking about themselves!',
  },
  all_or_nothing: {
    id: 'all_or_nothing',
    name: 'All-or-Nothing Trap',
    simpleName: 'Thinking You Must Be Perfect or You Are a Failure',
    description: 'Believing that anything less than 100% perfection means you are a fraud or a loser.',
    indicator: 'Refusing to accept anything between pure victory and total worthlessness.',
    realLifeExample: 'You score 85% instead of 95% and think "I know nothing". But even top doctors and senior software engineers google things every single day.',
  },
  emotional_reasoning: {
    id: 'emotional_reasoning',
    name: 'Feeling vs Fact Trap',
    simpleName: 'Treating a Bad Mood Like a Fact',
    description: 'Believing that because you feel insecure or not good enough right now, it must actually be true.',
    indicator: 'Mistaking a temporary emotional wave for a permanent factual reality.',
    realLifeExample: "When you are tired or hungry, you suddenly feel down or self-critical. But once you rest and eat, that feeling fades. The emotion was real, but it wasn't the factual truth.",
  },
};

/**
 * Analyzes raw text and returns the most clinically relevant cognitive distortion.
 */
export function detectCognitiveDistortion(rawThought: string, category: InsecurityCategory): CognitiveDistortion {
  const lower = rawThought.toLowerCase();

  // Pattern detection
  if (lower.includes('everyone') && (lower.includes('look') || lower.includes('staring') || lower.includes('notice') || lower.includes('ugly') || category === 'body_image')) {
    return COGNITIVE_DISTORTIONS.spotlight_effect;
  }
  if (lower.includes('they think') || lower.includes('people think') || lower.includes('secretly hate') || lower.includes('judge me') || lower.includes('hate me') || lower.includes('pretend')) {
    return COGNITIVE_DISTORTIONS.mind_reading;
  }
  if (lower.includes('ruined') || lower.includes('never') || lower.includes('always fail') || lower.includes('no future') || lower.includes('hopeless')) {
    return COGNITIVE_DISTORTIONS.catastrophizing;
  }
  if (lower.includes('either') || lower.includes('perfect') || lower.includes('loser') || lower.includes('fraud') || category === 'impostor_career') {
    return COGNITIVE_DISTORTIONS.all_or_nothing;
  }

  return COGNITIVE_DISTORTIONS.emotional_reasoning;
}

/**
 * Generates an evidence-based Clarity Report deconstructing the internal critic.
 */
export function generateClarityReport(
  sessionId: string,
  rawThought: string,
  category: InsecurityCategory,
  chatContextSummary?: string
): ClarityReport {
  const distortion = detectCognitiveDistortion(rawThought, category);

  let criticPerception = `Your mind is currently telling you: "${rawThought}".`;
  let objectiveReality = '';
  let realLifeExample = distortion.realLifeExample;
  const socraticQuestions: string[] = [];

  switch (distortion.id) {
    case 'mind_reading':
      objectiveReality = 
        'Most people are so wrapped up in their own worries, deadlines, and insecurities that they rarely judge others the way we think. If someone looked distant or quiet, it is almost always about their day, not about you.';
      socraticQuestions.push(
        'Did anyone actually tell you this to your face, or is your anxious mind filling the quietness with self-doubt?',
        'If your best friend felt this exact same way, would you agree with their fear, or remind them how wonderful they are?'
      );
      break;

    case 'spotlight_effect':
      objectiveReality = 
        'Scientific studies show that people notice less than 20% of what we think they notice. What feels 100x bigger inside your head is practically invisible to the people around you.';
      socraticQuestions.push(
        'Think about today: can you recall even one flaw or awkward thing from the last 3 people you met?',
        'Are you being 10 times harsher on yourself than you would ever be on anyone else?'
      );
      break;

    case 'catastrophizing':
      objectiveReality = 
        'A bad day, a failed attempt, or an uncomfortable moment does not decide your entire life. Everyone you admire has failed repeatedly before finding their way.';
      socraticQuestions.push(
        'Is your brain playing out the absolute worst-case scenario, or is this something you can actually recover from?',
        'Think back 2 years ago: how many things you worried were the "end of the world" are completely irrelevant today?'
      );
      break;

    case 'all_or_nothing':
      objectiveReality = 
        'You do not have to be the best in the room to belong there. Feeling like an impostor usually just means you are challenging yourself and learning something new.';
      socraticQuestions.push(
        'Can you make mistakes and still be smart, capable, and worthy of respect?',
        'If a classmate asked you for help right now, would you realize you actually know more than you give yourself credit for?'
      );
      break;

    default:
      objectiveReality = 
        'A feeling is just a wave of emotion in your body, not a factual truth. Just because your brain feels overwhelmed right now does not mean you are less worthy or incapable.';
      socraticQuestions.push(
        'Can you let this uncomfortable feeling pass like a passing cloud, without believing it is a fact about who you are?'
      );
      break;
  }

  if (chatContextSummary) {
    objectiveReality += ` Talking with an anonymous peer showed: other students carry the exact same doubts. You are never alone in this.`;
  }

  return {
    sessionId,
    category,
    rawThought,
    primaryDistortion: distortion,
    criticPerception,
    objectiveReality,
    realLifeExample,
    socraticQuestions,
    groundingBreathingAnchor: 'Inhale calm for 4s • Hold stillness for 4s • Exhale tension for 6s',
    generatedAt: Date.now(),
    burnStatus: 'ACTIVE',
  };
}
