import { ClarityReport, CognitiveDistortion, InsecurityCategory } from './types';

export const COGNITIVE_DISTORTIONS: Record<string, CognitiveDistortion> = {
  mind_reading: {
    id: 'mind_reading',
    name: 'Mind-Reading Illusion',
    description: 'Assuming others are judging or looking down on you without verifiable evidence.',
    indicator: 'Assuming you know what people think about your worth.',
  },
  catastrophizing: {
    id: 'catastrophizing',
    name: 'Catastrophizing Lens',
    description: 'Projecting that a single flaw, mistake, or setback will inevitably ruin your entire future.',
    indicator: 'Magnifying a moment of struggle into total life failure.',
  },
  spotlight_effect: {
    id: 'spotlight_effect',
    name: 'The Spotlight Trap',
    description: 'Overestimating how much other people notice or care about your physical appearance or minor flaws.',
    indicator: 'Believing all eyes are hyper-focused on your imperfections.',
  },
  all_or_nothing: {
    id: 'all_or_nothing',
    name: 'Binary / All-or-Nothing Trap',
    description: 'Viewing yourself as an absolute failure unless you perform with 100% perfection.',
    indicator: 'Refusing to accept anything between pure victory and total worthlessness.',
  },
  emotional_reasoning: {
    id: 'emotional_reasoning',
    name: 'Emotional Reasoning Fallacy',
    description: 'Believing that because you feel inadequate, you must objectively be inadequate.',
    indicator: 'Mistaking a temporary emotional wave for a permanent factual reality.',
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
  const socraticQuestions: string[] = [];

  switch (distortion.id) {
    case 'mind_reading':
      objectiveReality = 
        'Human psychology consistently shows that other people are deeply absorbed in their own insecurities and daily chaos. Distance, quietness, or distraction from peers almost always reflects their personal struggles, not a secret verdict on your worth.';
      socraticQuestions.push(
        'Has anyone explicitly stated this negative judgment to you, or is your anxious mind filling in the silence with fear?',
        'If a close friend confided this exact same suspicion to you, would you tell them it is a guaranteed fact?'
      );
      break;

    case 'spotlight_effect':
      objectiveReality = 
        'Cornell psychology research on the "Spotlight Effect" proves people notice less than 20% of what we assume they notice. What feels magnified to 1000% inside your consciousness is virtually invisible to the outside world.';
      socraticQuestions.push(
        'Think of the people you saw today: how many of their minor flaws or outfits can you vividly recall?',
        'Are you holding yourself to an impossible visual standard that you never impose on anyone else?'
      );
      break;

    case 'catastrophizing':
      objectiveReality = 
        'A setback or feeling of inadequacy today is a transient data point, not an immutable life trajectory. The most resilient individuals experience recurring episodes of self-doubt; surviving the feeling builds genuine mastery.';
      socraticQuestions.push(
        'What is the realistic, probable outcome here versus the absolute worst-case movie your mind is playing?',
        'What is one small, gentle action you can take right now that does not require being perfect?'
      );
      break;

    case 'all_or_nothing':
      objectiveReality = 
        'Competence and self-worth exist on a wide spectrum, not a binary toggle. Experiencing impostor syndrome is often the clearest evidence that you are challenging yourself at the frontiers of your growth.';
      socraticQuestions.push(
        'Can someone make mistakes, feel imperfect, and still be deeply valuable and capable?',
        'What hard evidence exists of obstacles you have already navigated to get to this point?'
      );
      break;

    default:
      objectiveReality = 
        'A feeling is a physiological brain event, not a factual truth. Just because your nervous system is sounding an alarm bell of unworthiness does not mean there is actual danger or truth to the thought.';
      socraticQuestions.push(
        'Can you observe this heavy feeling as an emotional wave passing through you, without signing your name to it as the absolute truth?'
      );
      break;
  }

  if (chatContextSummary) {
    objectiveReality += ` Connecting with an anonymous peer verified this universal human vulnerability: you are fighting a battle shared by countless others.`;
  }

  return {
    sessionId,
    category,
    rawThought,
    primaryDistortion: distortion,
    criticPerception,
    objectiveReality,
    socraticQuestions,
    groundingBreathingAnchor: 'Inhale calm for 4s • Hold stillness for 4s • Exhale tension for 6s',
    generatedAt: Date.now(),
    burnStatus: 'ACTIVE',
  };
}
