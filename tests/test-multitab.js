async function run() {
  console.log('--- RESETTING STORE ---');
  await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'RESET' })
  });

  const c1 = 'seeker_tab1_' + Date.now();
  const c2 = 'peer_tab2_' + (Date.now() + 1);

  console.log('1. Tab 1 (Seeker) joins...');
  const res1 = await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'JOIN', clientId: c1, category: 'impostor_career' })
  });
  const d1 = await res1.json();
  console.log('Tab 1 in room:', d1.roomId, '| myAlias:', d1.myAlias, '| isPeerOnline:', d1.isPeerOnline);

  console.log('2. Tab 2 (Peer) joins...');
  const res2 = await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'JOIN', clientId: c2, category: 'impostor_career' })
  });
  const d2 = await res2.json();
  console.log('Tab 2 in room:', d2.roomId, '| myAlias:', d2.myAlias, '| peerAlias:', d2.peerAlias, '| isPeerOnline:', d2.isPeerOnline);

  console.log('3. Tab 1 polls chamber...');
  const poll1 = await (await fetch('http://localhost:3000/api/room?roomId=' + d1.roomId + '&clientId=' + c1)).json();
  console.log('Tab 1 after poll:', '| myAlias:', poll1.myAlias, '| peerAlias:', poll1.peerAlias, '| isPeerOnline:', poll1.isPeerOnline);

  console.log('4. Tab 1 sends message: "I am overwhelmed with exams."');
  await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'MESSAGE', roomId: d1.roomId, clientId: c1, senderAlias: poll1.myAlias, text: 'I am overwhelmed with exams.' })
  });

  console.log('5. Tab 2 polls for new messages...');
  const poll2 = await (await fetch('http://localhost:3000/api/room?roomId=' + d2.roomId + '&clientId=' + c2)).json();
  const msgForTab2 = poll2.messages.find(m => m.text === 'I am overwhelmed with exams.');
  console.log('Tab 2 saw message:', msgForTab2 ? msgForTab2.text : 'FAILED', '| From:', msgForTab2?.senderAlias);

  console.log('6. Tab 2 sends reply: "I hear you. Take one day at a time."');
  await fetch('http://localhost:3000/api/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'MESSAGE', roomId: d2.roomId, clientId: c2, senderAlias: poll2.myAlias, text: 'I hear you. Take one day at a time.' })
  });

  console.log('7. Tab 1 polls for reply...');
  const poll1b = await (await fetch('http://localhost:3000/api/room?roomId=' + d1.roomId + '&clientId=' + c1)).json();
  const replyForTab1 = poll1b.messages.find(m => m.text === 'I hear you. Take one day at a time.');
  console.log('Tab 1 saw reply:', replyForTab1 ? replyForTab1.text : 'FAILED', '| From:', replyForTab1?.senderAlias);

  const isMatchedRoom = d1.roomId === d2.roomId;
  const bothOnline = poll1.isPeerOnline && poll2.isPeerOnline;
  const bothDelivered = Boolean(msgForTab2) && Boolean(replyForTab1);
  const distinctAliases = d1.myAlias !== d2.myAlias;

  console.log('\n================ VERIFICATION RESULTS ================');
  console.log('Same Room Paired:', isMatchedRoom ? '✅ PASSED' : '❌ FAILED');
  console.log('Distinct Aliases (CalmSeeker vs StarlitFern):', distinctAliases ? '✅ PASSED' : '❌ FAILED');
  console.log('Both Marked Live Human Peer Online:', bothOnline ? '✅ PASSED' : '❌ FAILED');
  console.log('Two-Way Live Message Exchange:', bothDelivered ? '✅ PASSED' : '❌ FAILED');
  console.log('OVERALL STATUS:', (isMatchedRoom && bothOnline && bothDelivered && distinctAliases) ? '🎉 100% OPERATIONAL' : '⚠️ ISSUES DETECTED');
}

run();
