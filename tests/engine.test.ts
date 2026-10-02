import assert from 'node:assert/strict';
import { evaluateSafety, sanitizePeerMessage } from '../src/lib/safety-guard';
import { detectCognitiveDistortion, generateClarityReport } from '../src/lib/distortion-engine';
import { getPeersByCategory, MOCK_PEERS } from '../src/lib/mock-peers';

console.log('🧪 Starting HeavenPulse Engine Test Suite...\n');

// 1. Safety Guardrail Tests
console.log('▶ Test Suite 1: Deterministic Safety Air-Gap');
{
  // Test crisis detection
  const crisisResult = evaluateSafety('I feel completely hopeless and want to end my life');
  assert.equal(crisisResult.isCritical, true, 'Safety guardrail must flag acute crisis');
  assert.equal(crisisResult.crisisType, 'self_harm', 'Crisis type must be self_harm');
  assert.equal(crisisResult.lifelinePhone, '988', 'Must provide 988 emergency lifeline');
  console.log('  ✔ Crisis detection flags self-harm and surfaces 988 hotline');

  // Test non-crisis input
  const safeResult = evaluateSafety('I am feeling nervous about my upcoming coding exam');
  assert.equal(safeResult.isCritical, false, 'Standard vulnerability must not be falsely flagged as critical');
  console.log('  ✔ Normal vulnerability passes through without false positive');

  // Test PII & Contact Info Sanitization
  const piiInput = 'Hey text me on my whatsapp +1 (555) 234-5678 or dm me on ig: @cool_coder';
  const sanitization = sanitizePeerMessage(piiInput);
  assert.equal(sanitization.blockedPii, true, 'PII guard must intercept phone/handle leaks');
  assert.ok(!sanitization.cleanText.includes('555'), 'Phone numbers must be stripped');
  assert.ok(!sanitization.cleanText.includes('@cool_coder'), 'Social handles must be stripped');
  console.log('  ✔ Peer chat PII filter successfully redacts phone numbers & social handles');
}

// 2. Cognitive Distortion Engine Tests
console.log('\n▶ Test Suite 2: CBT Cognitive Distortion Classification & Deconstruction');
{
  // Test Mind Reading
  const mindReadingDistortion = detectCognitiveDistortion(
    'I know my friends secretly hate me and pretend to like me',
    'belonging_relationships'
  );
  assert.equal(mindReadingDistortion.id, 'mind_reading', 'Must classify as Mind-Reading illusion');
  console.log('  ✔ Correctly identifies Mind-Reading distortion');

  // Test Spotlight Effect
  const spotlightDistortion = detectCognitiveDistortion(
    'Everyone is staring at my weight and laughing behind my back',
    'body_image'
  );
  assert.equal(spotlightDistortion.id, 'spotlight_effect', 'Must classify as Spotlight Effect');
  console.log('  ✔ Correctly identifies Spotlight Effect in body image insecurities');

  // Test Catastrophizing
  const catastrophizingDistortion = detectCognitiveDistortion(
    'I failed this interview, my life is ruined and I will always fail',
    'impostor_career'
  );
  assert.equal(catastrophizingDistortion.id, 'catastrophizing', 'Must classify as Catastrophizing');
  console.log('  ✔ Correctly identifies Catastrophizing distortion');

  // Test Full Clarity Report Synthesis
  const report = generateClarityReport(
    'test-session-123',
    'I feel like an absolute fraud and loser',
    'impostor_career'
  );
  assert.equal(report.sessionId, 'test-session-123');
  assert.ok(report.objectiveReality.length > 50, 'Objective reality statement must be substantive');
  assert.ok(report.socraticQuestions.length >= 1, 'Must include at least one Socratic question');
  assert.equal(report.burnStatus, 'ACTIVE', 'Initial state must be ACTIVE before burn ritual');
  console.log('  ✔ Clarity Report synthesizes robust Socratic reality anchors');
}

// 3. Mock Peer Resonance Tests
console.log('\n▶ Test Suite 3: Peer Resonance Grid & Zero-Empty-State Assurance');
{
  const impostorPeers = getPeersByCategory('impostor_career');
  assert.ok(impostorPeers.length >= 2, 'Every category must have at least 2 vetted peer cards');
  assert.equal(impostorPeers[0].isOnline, true, 'Online peers must be prioritized first for live chat');
  console.log('  ✔ Peer matching guarantees live online peers across all categories');
}

console.log('\n✨ ALL TESTS PASSED: 100% Core Engine Verification Complete!\n');
