// Checks the astrologer profile rules the website and app rely on: email signup + password, server-checked email
// verification, bank details stored where admin reads them, rejected → resubmit goes back to review, CORS preflight.
// Needs the local dev server (OTP bypass 0000). Cleans up after itself. Run from admin/: node scripts/test-astrologer-web-profile.js
require('dotenv').config({ path: '.env', quiet: true });
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const API = 'http://127.0.0.1:4001/api';
const EMAIL = `astro.web.${Date.now()}@example.com`, OTHER = `other.${Date.now()}@example.com`;
const call = async (method, path, token, body) => {
  const r = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }, body: body && JSON.stringify(body) });
  let j; try { j = await r.json(); } catch { j = null; }
  return { s: r.status, j };
};
const ok = (name, cond, extra) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`, cond ? '' : JSON.stringify(extra ?? '').slice(0, 300)); if (!cond) process.exitCode = 1; };

(async () => {
  const c = await MongoClient.connect('mongodb://127.0.0.1:27017');
  const users = c.db('astromateDB').collection('users');
  const ADMIN = 'test_webprofile_admin';
  const cleanup = () => users.deleteMany({ $or: [{ email_address: { $in: [EMAIL, OTHER] } }, { user_id: ADMIN }] });
  await cleanup();
  await users.insertOne({ user_id: ADMIN, user_type: 'administrator', full_name: 'Admin', account_status: 'active', created_at: new Date() });
  const tAdm = jwt.sign({ userId: ADMIN, user_type: 'administrator' }, process.env.JWT_SECRET, { issuer: 'astromate-api', audience: 'astromate-app', expiresIn: '1h' });
  try {
    const reg = await call('POST', '/auth/register', null, { full_name: 'Web Astro', email_address: EMAIL, password: 'Test@12345', user_type: 'astrologer', auth_type: 'email' });
    ok('astrologer signs up with email + password', reg.s === 201, reg.j);
    const login = await call('POST', '/auth/login', null, { identifier: EMAIL, auth_type: 'email', password: 'Test@12345' });
    ok('and logs in with it', login.s === 200, login.j);
    const tA = login.j.data.access_token;

    // client can't just claim an email is verified
    const spoof = await call('PUT', '/users/profile', tA, { email_address: OTHER, email_verified: true });
    ok('unverified email change refused', spoof.s === 400 && spoof.j.error === 'EMAIL_NOT_VERIFIED', spoof.j);
    ok('…and the flag was not set', (await users.findOne({ email_address: EMAIL })).email_verified === false);

    // own email verified by OTP → accepted
    await call('POST', '/auth/send-otp', null, { identifier: EMAIL, auth_type: 'email' });
    const v = await call('POST', '/auth/verify-otp', null, { identifier: EMAIL, otp: '0000', auth_type: 'email' });
    ok('email OTP verifies', v.s === 200, v.j);

    const profile = {
      email_address: EMAIL, email_verified: true, phone_number: '+919876500777', gender: 'male', bio: 'x'.repeat(60), experience_years: 5,
      languages: 'Hindi,English', skills: 'Vedic Astrology,Tarot Reading', chat_rate: 20, call_rate: 30, video_rate: 40,
      address: '1 MG Road', city: 'Ranchi', state: 'Jharkhand', country: 'India', zip: '834001', qualifications: 'Jyotish Acharya',
      account_holder_name: 'Web Astro', account_number: '123456789012', bank_name: 'SBI', ifsc_code: 'SBIN0001234',
    };
    const put = await call('PUT', '/users/profile', tA, profile);
    ok('complete profile saves', put.s === 200, put.j);
    let u = await users.findOne({ email_address: EMAIL });
    ok('email verified after OTP', u.email_verified === true);
    ok('bank details stored in bank_details (admin reads these)', u.bank_details?.account_number === '123456789012' && u.bank_details?.ifsc_code === 'SBIN0001234' && !u.account_number, u.bank_details);
    ok('profile submitted for review', !!u.profile_submitted_at);
    const me = await call('GET', '/users/profile', tA);
    ok('GET returns bank details back', (me.j.user ?? me.j.data?.user)?.account_number === '123456789012', me.j);

    // admin rejects → astrologer fixes → back in review
    const rej = await call('PUT', `/users/${u._id}`, tAdm, { ...profile, qualifications: ['Jyotish Acharya'], skills: ['Vedic Astrology', 'Tarot Reading'], languages: ['Hindi', 'English'], full_name: 'Web Astro', user_type: 'astrologer', verification_status: 'rejected', verification_status_message: 'Bio too short', bank_details: u.bank_details });
    ok('admin rejects with reason', rej.s === 200 && (await users.findOne({ _id: u._id })).verification_status === 'rejected', rej.j);
    const fix = await call('PUT', '/users/profile', tA, { bio: 'y'.repeat(120) });
    u = await users.findOne({ _id: u._id });
    ok('resubmission after rejection goes back to pending review', fix.s === 200 && u.verification_status === 'pending' && !!u.resubmitted_at, { s: fix.s, st: u.verification_status });

    // browsers can preflight astrologer-options with auth headers
    const pre = await fetch(API + '/astrologer-options/active', { method: 'OPTIONS', headers: { Origin: 'https://astromate.online', 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'authorization,content-type' } });
    ok('CORS preflight on astrologer-options is not blocked', pre.status < 300, pre.status);
    ok('astrologer-option edits still admin-only', (await call('POST', '/astrologer-options', tA, { category: 'skills', name: 'x' })).s === 401);
  } finally {
    await cleanup();
    await c.close();
  }
})();
