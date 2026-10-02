import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface RoomParticipant {
  clientId: string;
  alias: string;
  role: 'seeker' | 'listener';
  lastSeen: number;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderAlias: string;
  text: string;
  timestamp: number;
}

export interface RoomState {
  id: string;
  category: string;
  createdAt: number;
  participants: Record<string, RoomParticipant>;
  messages: RoomMessage[];
}

// Persistent memory storage across server hot-reloads and requests
const globalState: {
  rooms: Record<string, RoomState>;
} = (globalThis as any).__heavenpulse_store || {
  rooms: {},
};
(globalThis as any).__heavenpulse_store = globalState;

// Periodic cleanup of stale participants (inactive > 10 seconds)
function cleanupStaleRooms() {
  const now = Date.now();
  for (const roomId of Object.keys(globalState.rooms)) {
    const room = globalState.rooms[roomId];
    for (const cId of Object.keys(room.participants)) {
      if (now - room.participants[cId].lastSeen > 10000) {
        delete room.participants[cId];
      }
    }
    // Delete rooms with 0 active participants
    const activeCount = Object.keys(room.participants).length;
    if (activeCount === 0) {
      delete globalState.rooms[roomId];
    }
  }
}

export async function GET(request: Request) {
  cleanupStaleRooms();
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId') || '';
  const clientId = searchParams.get('clientId') || '';

  // Look for specified room or any room containing this client
  let targetRoom: RoomState | null | undefined = roomId ? globalState.rooms[roomId] : null;
  if (!targetRoom && clientId) {
    targetRoom = Object.values(globalState.rooms).find((r) => r.participants[clientId]);
  }

  if (!targetRoom) {
    return NextResponse.json({
      success: false,
      notFound: true,
      message: 'Room not found or expired',
    });
  }

  // Update heartbeat for this client
  const now = Date.now();
  if (clientId && targetRoom.participants[clientId]) {
    targetRoom.participants[clientId].lastSeen = now;
  }

  const myParticipant = clientId ? targetRoom.participants[clientId] : null;
  const otherParticipants = Object.values(targetRoom.participants).filter(
    (p) => p.clientId !== clientId && now - p.lastSeen < 10000
  );

  const isPeerOnline = otherParticipants.length > 0;
  const peerParticipant = isPeerOnline ? otherParticipants[0] : null;

  return NextResponse.json({
    success: true,
    roomId: targetRoom.id,
    category: targetRoom.category,
    isPeerOnline,
    myAlias: myParticipant ? myParticipant.alias : undefined,
    peerAlias: peerParticipant ? peerParticipant.alias : (myParticipant?.alias === 'StarlitFern' ? 'CalmSeeker' : 'StarlitFern'),
    peerRole: peerParticipant ? peerParticipant.role : undefined,
    messages: targetRoom.messages,
  });
}

export async function POST(request: Request) {
  try {
    cleanupStaleRooms();
    const body = await request.json();
    const { type, roomId, clientId, category = 'general', isVolunteer, senderAlias, text } = body;
    const now = Date.now();

    // ACTION: JOIN
    if (type === 'JOIN') {
      // 1. If client is already inside an active room, return it
      let existingRoom = Object.values(globalState.rooms).find((r) => r.participants[clientId]);
      if (existingRoom) {
        existingRoom.participants[clientId].lastSeen = now;
        const others = Object.values(existingRoom.participants).filter(
          (p) => p.clientId !== clientId && now - p.lastSeen < 10000
        );
        const myAlias = existingRoom.participants[clientId].alias;
        return NextResponse.json({
          success: true,
          roomId: existingRoom.id,
          myAlias,
          peerAlias: others[0]?.alias || (myAlias === 'StarlitFern' ? 'CalmSeeker' : 'StarlitFern'),
          isPeerOnline: others.length > 0,
          messages: existingRoom.messages,
        });
      }

      // 2. Look for ANY active room that has exactly 1 active participant waiting
      const openRoom = Object.values(globalState.rooms).find((r) => {
        const activeUsers = Object.values(r.participants).filter((p) => now - p.lastSeen < 10000);
        return activeUsers.length === 1;
      });

      if (openRoom) {
        const existingParticipant = Object.values(openRoom.participants).find((p) => now - p.lastSeen < 10000)!;
        const assignedRole: 'seeker' | 'listener' = existingParticipant.role === 'seeker' ? 'listener' : 'seeker';
        const assignedAlias = isVolunteer 
          ? 'StarlitFern' 
          : (existingParticipant.alias === 'CalmSeeker' ? 'StarlitFern' : 'CalmSeeker');

        openRoom.participants[clientId] = {
          clientId,
          alias: assignedAlias,
          role: assignedRole,
          lastSeen: now,
        };

        // Notify room of live peer connection
        openRoom.messages.push({
          id: `sys-peer-joined-${now}`,
          senderId: 'system',
          senderAlias: 'Sanctuary Protocol',
          text: `🟢 Live Peer Connected. ${assignedAlias} has joined the chamber. Zero-log channel active.`,
          timestamp: now,
        });

        return NextResponse.json({
          success: true,
          roomId: openRoom.id,
          myAlias: assignedAlias,
          peerAlias: existingParticipant.alias,
          isPeerOnline: true,
          messages: openRoom.messages,
        });
      }

      // 3. No open room found: Create a new room waiting for peer
      const newRoomId = `chamber-${now}-${Math.random().toString(36).substring(2, 6)}`;
      const initialRole: 'seeker' | 'listener' = isVolunteer ? 'listener' : 'seeker';
      const initialAlias = isVolunteer ? 'StarlitFern' : 'CalmSeeker';

      const newRoom: RoomState = {
        id: newRoomId,
        category,
        createdAt: now,
        participants: {
          [clientId]: {
            clientId,
            alias: initialAlias,
            role: initialRole,
            lastSeen: now,
          },
        },
        messages: [
          {
            id: `sys-init-${now}`,
            senderId: 'system',
            senderAlias: 'Sanctuary Protocol',
            text: 'You have entered an encrypted, zero-trace empathy chamber. No logs are saved. Waiting for a live peer, or converse with autonomous sanctuary reflection.',
            timestamp: now,
          },
        ],
      };

      globalState.rooms[newRoomId] = newRoom;

      return NextResponse.json({
        success: true,
        roomId: newRoomId,
        myAlias: initialAlias,
        peerAlias: initialAlias === 'CalmSeeker' ? 'StarlitFern' : 'CalmSeeker',
        isPeerOnline: false,
        messages: newRoom.messages,
      });
    }

    // ACTION: MESSAGE
    if (type === 'MESSAGE' && text && text.trim()) {
      let room: RoomState | null | undefined = roomId ? globalState.rooms[roomId] : null;
      if (!room && clientId) {
        room = Object.values(globalState.rooms).find((r) => r.participants[clientId]);
      }

      if (!room) {
        return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
      }

      const newMsg: RoomMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderId: clientId,
        senderAlias: senderAlias || (room.participants[clientId]?.alias || 'Anonymous'),
        text: text.trim(),
        timestamp: Date.now(),
      };

      room.messages.push(newMsg);
      if (room.messages.length > 50) {
        room.messages.shift();
      }

      return NextResponse.json({ success: true, message: newMsg });
    }

    // ACTION: LEAVE
    if (type === 'LEAVE' && clientId) {
      for (const roomIdKey of Object.keys(globalState.rooms)) {
        const r = globalState.rooms[roomIdKey];
        if (r.participants[clientId]) {
          const departingAlias = r.participants[clientId].alias;
          delete r.participants[clientId];
          r.messages.push({
            id: `sys-leave-${Date.now()}`,
            senderId: 'system',
            senderAlias: 'Sanctuary Protocol',
            text: `Peer ${departingAlias} has exited the chamber.`,
            timestamp: Date.now(),
          });
          // If no one is left, delete room
          if (Object.keys(r.participants).length === 0) {
            delete globalState.rooms[roomIdKey];
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    // ACTION: RESET_ALL (for clean testing)
    if (type === 'RESET') {
      globalState.rooms = {};
      return NextResponse.json({ success: true, message: 'All rooms cleared' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
