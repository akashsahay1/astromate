// Live socket security/flow checks against the local dev server. Creates and removes its own test data.
// Needs socket.io-client resolvable: NODE_PATH=<dir with socket.io-client>:./node_modules node scripts/test-socket.js (run from admin/, dev server up).
require('dotenv').config({ path: '.env', quiet: true });
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { io } = require('socket.io-client');

const URL = 'http://127.0.0.1:4001';
const tok = (userId, user_type) => jwt.sign({ userId, user_type }, process.env.JWT_SECRET, { issuer: 'astromate-api', audience: 'astromate-app', expiresIn: '1h' });
const ok = (name, cond, extra) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`, cond ? '' : JSON.stringify(extra ?? '')); if (!cond) process.exitCode = 1; };
const connect = (token) => new Promise((resolve) => {
  const s = io(URL, { transports: ['websocket'], auth: { token }, reconnection: false, forceNew: true });
  s.on('connect', () => resolve(s));
  s.on('connect_error', (e) => resolve({ error: e.message, close() {} }));
});
const waitFor = (s, ev, ms = 1500) => new Promise((r) => { const t = setTimeout(() => r(null), ms); s.once(ev, (d) => { clearTimeout(t); r(d); }); });

(async () => {
  const c = await MongoClient.connect('mongodb://127.0.0.1:27017');
  const db = c.db('astromateDB');
  const C = 'test_sock_cust', A = 'test_sock_astro', X = 'test_sock_attacker', A2 = 'test_sock_astro2';
  const ids = [C, A, X, A2];
  const sessions = db.collection('sessions');
  const cleanup = async () => {
    await db.collection('users').deleteMany({ user_id: { $in: ids } });
    await sessions.deleteMany({ user_id: { $in: ids } });
    await db.collection('chat_messages').deleteMany({ sender_id: { $in: ids } });
  };
  await cleanup();
  await db.collection('users').insertMany([
    { user_id: C, user_type: 'customer', full_name: 'Sock Cust', account_status: 'active' },
    { user_id: X, user_type: 'customer', full_name: 'Attacker', account_status: 'active' },
    { user_id: A, user_type: 'astrologer', full_name: 'Sock Astro', account_status: 'active', is_online: true, call_rate: 10 },
    { user_id: A2, user_type: 'astrologer', full_name: 'Sock Astro 2', account_status: 'active', is_online: true, call_rate: 10 },
  ]);
  const chat = (await sessions.insertOne({ session_type: 'chat', user_id: C, astrologer_id: A, status: 'active', rate_per_minute: 10, created_at: new Date() })).insertedId.toString();
  const call = (await sessions.insertOne({ session_type: 'voice_call', user_id: C, astrologer_id: A, status: 'initiated', rate_per_minute: 10, created_at: new Date() })).insertedId.toString();
  const socks = [];
  try {
    const noTok = await connect(undefined);
    ok('no token → connection refused', !!noTok.error, noTok);
    const forged = await connect(jwt.sign({ userId: A, user_type: 'astrologer' }, 'wrong-secret'));
    ok('forged token → connection refused', !!forged.error, forged);

    const sc = await connect(tok(C, 'customer')); const sa = await connect(tok(A, 'astrologer')); const sx = await connect(tok(X, 'customer'));
    socks.push(sc, sa, sx);
    ok('valid tokens connect', sc.connected && sa.connected && sx.connected);

    // attacker claims to be the astrologer — must not get the astrologer's events
    sx.emit('authenticate', { userId: A, userType: 'astrologer' });
    sx.emit('join_user', { userId: A, userType: 'astrologer' });
    const auth = await waitFor(sx, 'authenticated');
    ok('authenticate ignores claimed userId', auth?.userId === X, auth);

    // attacker can't join or post into someone else's chat
    sx.emit('join_chat_session', { sessionId: chat });
    ok("attacker can't join others' chat room", (await waitFor(sx, 'chat_error'))?.error?.includes('not found'));
    const leakToAttacker = waitFor(sx, 'new_message', 1200);
    sc.emit('join_chat_session', { sessionId: chat }); sa.emit('join_chat_session', { sessionId: chat });
    await Promise.all([waitFor(sc, 'joined_chat_session'), waitFor(sa, 'joined_chat_session')]);
    const gotByAstro = waitFor(sa, 'new_message');
    sc.emit('send_message', { sessionId: chat, content: 'hello', senderId: A });
    const m = await gotByAstro;
    ok('participant message delivered, sender from token', m?.sender_id === C && m?.content === 'hello', m);
    ok('attacker never sees the message', (await leakToAttacker) === null);
    sx.emit('send_message', { sessionId: chat, content: 'spoof', senderId: C });
    ok("attacker can't post into others' chat", (await waitFor(sx, 'chat_error'))?.error?.includes('not found'));
    await new Promise((r) => setTimeout(r, 200));
    const s1 = await sessions.findOne({ _id: new ObjectId(chat) });
    ok('customer message bumps astrologer unread (not customer)', s1.astrologer_unread_count === 1 && !s1.user_unread_count, s1);

    // calls: attacker can't ring, answer, end or relay into someone else's call
    const leakCall = waitFor(sx, 'incoming_call', 1200);
    sx.emit('initiate_call', { session_id: call, caller_id: C, caller_type: 'customer', call_type: 'voice' });
    ok("attacker can't initiate others' call", (await waitFor(sx, 'call_error'))?.error === 'Call session not found');
    const ring = waitFor(sa, 'incoming_call');
    sc.emit('initiate_call', { session_id: call, call_type: 'voice', caller_type: 'astrologer' });
    const inc = await ring;
    ok('real call rings astrologer, caller from token', inc?.caller_id === C && inc?.caller_type === 'customer', inc);
    ok('attacker gets no incoming_call', (await leakCall) === null);
    sx.emit('answer_call', { session_id: call }); sx.emit('end_call', { session_id: call });
    await new Promise((r) => setTimeout(r, 300));
    ok("attacker can't answer/end others' call", (await sessions.findOne({ _id: new ObjectId(call) })).status === 'ringing');
    const offerToAstro = waitFor(sa, 'webrtc_offer', 1200);
    sx.emit('webrtc_offer', { sessionId: call, targetUserId: A, offer: { sdp: 'evil' } });
    ok("attacker can't inject WebRTC offers", (await offerToAstro) === null);
    const answered = waitFor(sc, 'call_answered');
    sa.emit('answer_call', { session_id: call });
    ok('astrologer answers → customer notified', !!(await answered));
    const realOffer = waitFor(sa, 'webrtc_offer');
    sc.emit('webrtc_offer', { sessionId: call, targetUserId: A, offer: { sdp: 'ok' } });
    ok('participant WebRTC offer relayed', (await realOffer)?.fromUserId === C);

    // a second caller can't hijack the astrologer's live call
    const call2 = (await sessions.insertOne({ session_type: 'voice_call', user_id: X, astrologer_id: A, status: 'initiated', rate_per_minute: 10, created_at: new Date() })).insertedId.toString();
    const ring2 = waitFor(sa, 'incoming_call', 1200);
    sx.emit('initiate_call', { session_id: call2, call_type: 'voice' });
    ok('second call while busy → rejected busy', (await waitFor(sx, 'call_rejected'))?.reason === 'busy');
    ok('busy astrologer not rung again', (await ring2) === null);
  } finally {
    socks.forEach((s) => s.close());
    await cleanup();
    await c.close();
  }
})();
