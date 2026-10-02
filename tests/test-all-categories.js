const categories = [
  'impostor_career',
  'body_image',
  'social_anxiety',
  'belonging_relationships'
];

async function testCategory(cat) {
  console.log(`\n▶ Testing category: [${cat}]`);
  
  // Clean room reset
  await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'RESET' })
  });

  const c1 = `user1_${cat}_${Date.now()}`;
  const c2 = `user2_${cat}_${Date.now() + 1}`;

  // Tab 1 joins
  const res1 = await (await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'JOIN', clientId: c1, category: cat })
  })).json();

  // Tab 2 joins
  const res2 = await (await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'JOIN', clientId: c2, category: cat })
  })).json();

  // Tab 1 polls
  const poll1 = await (await fetch(`http://localhost:3000/api/room?roomId=${res1.roomId}&clientId=${c1}`)).json();

  // Tab 1 sends message
  await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'MESSAGE', roomId: res1.roomId, clientId: c1, senderAlias: poll1.myAlias, text: `Hello from ${cat} Tab 1` })
  });

  // Tab 2 polls and reads
  const poll2 = await (await fetch(`http://localhost:3000/api/room?roomId=${res2.roomId}&clientId=${c2}`)).json();
  const received = poll2.messages.find(m => m.text === `Hello from ${cat} Tab 1`);

  const success = res1.roomId === res2.roomId && poll1.isPeerOnline && poll2.isPeerOnline && Boolean(received);
  console.log(`  Room: ${res1.roomId}`);
  console.log(`  Tab 1 alias: ${poll1.myAlias} | Tab 2 alias: ${res2.myAlias}`);
  console.log(`  Cross-tab live delivery: ${received ? 'YES' : 'NO'}`);
  console.log(`  Result for ${cat}: ${success ? '✅ PASSED' : '❌ FAILED'}`);
  return success;
}

async function runAll() {
  let allPass = true;
  for (const cat of categories) {
    const ok = await testCategory(cat);
    if (!ok) allPass = false;
  }

  console.log('\n========================================');
  console.log(`ALL 4 CATEGORIES STATUS: ${allPass ? '🎉 100% VERIFIED ACROSS ALL CATEGORIES' : '❌ FAILED'}`);
  console.log('========================================\n');
}

runAll();
