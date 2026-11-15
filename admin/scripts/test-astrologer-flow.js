// Live check of astrologer signup → approval → bookable, plus admin-only API gates. Dev server must be running
// with OTP_BYPASS_MODE=true. Creates and removes its own test data. Run from admin/: node scripts/test-astrologer-flow.js
require('dotenv').config({ path: '.env', quiet: true });
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const API = 'http://127.0.0.1:4001/api';
const PHONE = '+919990001234';
const tok = (userId, user_type) => jwt.sign({ userId, user_type }, process.env.JWT_SECRET, { issuer: 'astromate-api', audience: 'astromate-app', expiresIn: '1h' });
const call = async (method, path, token, body) => {
  const r = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }, body: body && JSON.stringify(body) });
  let j; try { j = await r.json(); } catch { j = null; }
  return { s: r.status, j };
};
const ok = (name, cond, extra) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`, cond ? '' : JSON.stringify(extra ?? '').slice(0, 300)); if (!cond) process.exitCode = 1; };

(async () => {
  const c = await MongoClient.connect('mongodb://127.0.0.1:27017');
  const db = c.db('astromateDB');
  const users = db.collection('users');
  const CUST = 'test_astroflow_cust', ADMIN = 'test_astroflow_admin';
  const cleanup = async () => {
    const a = await users.findOne({ phone_number: { $in: [PHONE, PHONE.slice(3)] } });
    await users.deleteMany({ $or: [{ user_id: { $in: [CUST, ADMIN] } }, { phone_number: { $in: [PHONE, PHONE.slice(3)] } }] });
    if (a) await db.collection('sessions').deleteMany({ astrologer_id: a.user_id });
    await db.collection('otp_verifications').deleteMany({ identifier: PHONE }).catch(() => {});
  };
  await cleanup();
  await users.insertMany([
    { user_id: CUST, user_type: 'customer', full_name: 'Flow Cust', account_status: 'active', wallet_balance: 5000, created_at: new Date() },
    { user_id: ADMIN, user_type: 'administrator', full_name: 'Flow Admin', account_status: 'active', created_at: new Date() },
  ]);
  const tC = tok(CUST, 'customer'), tAdm = tok(ADMIN, 'administrator');

  try {
    // --- signup exactly as the app does it: OTP (bypass 0000) → minimal register
    ok('send OTP', (await call('POST', '/auth/send-otp', null, { identifier: PHONE, auth_type: 'phone' })).s === 200);
    const v = await call('POST', '/auth/verify-otp', null, { identifier: PHONE, otp: '0000', auth_type: 'phone' });
    ok('verify OTP 0000 → new user', v.s === 200 && !v.j.user_exists, v.j);
    const reg = await call('POST', '/auth/register', null, { full_name: 'Flow Astro', phone_number: PHONE, user_type: 'astrologer', auth_type: 'phone' });
    ok('astrologer registered, pending', reg.s < 300 && (reg.j.data || reg.j).user?.account_status === 'pending_verification', reg.j);
    const astro = await users.findOne({ user_type: 'astrologer', full_name: 'Flow Astro' });
    const oid = astro._id.toString(), tA = (reg.j.data || reg.j).access_token || tok(astro.user_id, 'astrologer');

    // --- unapproved astrologer is invisible and unbookable, even if online
    await users.updateOne({ _id: astro._id }, { $set: { is_online: true, chat_rate: 10, call_rate: 10, video_rate: 10 } });
    const list1 = await call('GET', '/astrologers/available?limit=50&featured=false', tC);
    ok('unapproved astrologer not listed', !JSON.stringify(list1.j).includes(astro.user_id), list1.s);
    ok('chat with unapproved astrologer refused', (await call('POST', '/chat', tC, { astrologer_id: astro.user_id })).s >= 400);
    ok('call with unapproved astrologer refused', (await call('POST', '/calls', tC, { astrologer_id: astro.user_id, call_type: 'voice' })).s >= 400);

    // --- nobody but an admin can approve
    const approve = {
      full_name: 'Flow Astro', email_address: 'flow.astro@test.local', user_type: 'astrologer', phone_number: PHONE, gender: 'male',
      address: 'x', city: 'Delhi', state: 'DL', country: 'India', zip: '110001', qualifications: ['Jyotish'], skills: ['Vedic', 'Tarot'],
      languages: ['Hindi'], bio: 'bio', call_rate: 20, chat_rate: 20, video_rate: 20, account_status: 'pending_verification',
      verification_status: 'verified', bank_details: { account_holder_name: 'F', account_number: '1', bank_name: 'B', ifsc_code: 'I' },
    };
    ok('approve without login → 401', (await call('PUT', `/users/${oid}`, null, approve)).s === 401);
    ok('astrologer self-approve → 401', (await call('PUT', `/users/${oid}`, tA, approve)).s === 401);
    ok('customer self-promote to admin → 401', (await call('PUT', `/users/${oid}`, tC, { ...approve, user_type: 'administrator' })).s === 401);
    ok('read user by id without login → 401', (await call('GET', `/users/${oid}`)).s === 401);
    ok('delete user without login → 401', (await call('DELETE', `/users/${oid}`)).s === 401);
    const a1 = await call('PUT', `/users/${oid}`, tAdm, approve);
    const after = await users.findOne({ _id: astro._id });
    ok('admin approves → verified AND active in one step', a1.s === 200 && after.verification_status === 'verified' && after.account_status === 'active', { s: a1.s, j: a1.j, st: [after.verification_status, after.account_status] });

    // --- approved + online astrologer is listed and bookable
    await users.updateOne({ _id: astro._id }, { $set: { is_online: true } });
    const list2 = await call('GET', '/astrologers/available?limit=50&featured=false', tC);
    ok('approved astrologer listed', JSON.stringify(list2.j).includes(astro.user_id), list2.s);
    const ch = await call('POST', '/chat', tC, { astrologer_id: astro.user_id });
    ok('customer can start chat with approved astrologer', ch.s < 300 && ch.j?.success !== false, ch.j);
    const sid = ch.j?.session?._id || ch.j?.session?.id || ch.j?.session_id;
    if (sid) ok("another user can't read the chat", (await call('GET', `/chat/${sid}`, tok('someone_else', 'customer'))).s === 403);
    ok('chat session needs login', sid ? (await call('GET', `/chat/${sid}`)).s === 401 : false, ch.j);
    ok('call list needs login', (await call('GET', `/calls?userId=${CUST}`)).s === 401);

    // --- maintenance / monitoring are admin-only; the app can still report errors
    ok('fix-indexes needs admin', (await call('POST', '/database/fix-indexes', tC)).s === 401);
    ok('error log read needs admin', (await call('GET', '/reports/errors', tC)).s === 401);
    ok('realtime stats needs admin', (await call('GET', '/reports/realtime-stats', tC)).s === 401);
    ok('astrologer-option edit needs admin', (await call('POST', '/astrologer-options', tC, { category: 'skills', name: 'x' })).s === 401);
    ok('app can still read astrologer options', (await call('GET', '/astrologer-options')).s === 200);
    ok('app can still report errors', (await call('POST', '/reports/errors', null, { error_type: 'test', error_message: 'flow test' })).s !== 401);
  } finally {
    await db.collection('error_logs').deleteMany({ error_message: 'flow test' }).catch(() => {});
    await cleanup();
    await c.close();
  }
})();
