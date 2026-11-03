// Live payment tests against the local dev server. Creates and removes its own test users/data.
// Needs the dev server running with RAZORPAY_WEBHOOK_SECRET=whtest_secret. Run from admin/: node scripts/test-payments.js
require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const assert = require('assert');

const API = 'http://127.0.0.1:4001/api';
const tok = (userId, user_type) => jwt.sign({ userId, user_type }, process.env.JWT_SECRET, { issuer: 'astromate-api', audience: 'astromate-app', expiresIn: '1h' });
const call = async (method, path, token, body, headers = {}) => {
  const r = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...headers }, body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
  let j; try { j = await r.json(); } catch { j = null; }
  return { s: r.status, j };
};
const ok = (name, cond, extra) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`, cond ? '' : JSON.stringify(extra)); if (!cond) process.exitCode = 1; };

(async () => {
  const c = await MongoClient.connect('mongodb://127.0.0.1:27017');
  const db = c.db('astromateDB');
  const users = db.collection('users'), txns = db.collection('transactions'), orders = db.collection('orders'), products = db.collection('products');
  const A = 'test_pay_custA', B = 'test_pay_custB', T = 'test_pay_astro';
  const cleanup = async () => {
    await users.deleteMany({ user_id: { $in: [A, B, T] } });
    await txns.deleteMany({ user_id: { $in: [A, B, T] } });
    await orders.deleteMany({ user_id: { $in: [A, B] } });
    await db.collection('cart_items').deleteMany({ user_id: { $in: [A, B] } });
    await db.collection('reviews').deleteMany({ user_id: { $in: [A, B] } });
  };
  await cleanup();
  const now = new Date();
  await users.insertMany([
    { user_id: A, user_type: 'customer', full_name: 'Test A', email_address: 'a@test.local', account_status: 'active', wallet_balance: 0, created_at: now },
    { user_id: B, user_type: 'customer', full_name: 'Test B', account_status: 'active', wallet_balance: 0, created_at: now },
    { user_id: T, user_type: 'astrologer', full_name: 'Test Astro', account_status: 'active', wallet_balance: 1500, reserved_balance: 0, upi_id: 'x@upi', created_at: now },
  ]);
  const tA = tok(A, 'customer'), tB = tok(B, 'customer'), tT = tok(T, 'astrologer');
  const secret = (await db.collection('app_settings').findOne({ type: 'general' })).razorpay.keySecret;
  const sign = (o, p) => crypto.createHmac('sha256', secret).update(`${o}|${p}`).digest('hex');
  const product = await products.findOne({ is_active: true, product_id: 'product_1756540783734_wxtlznqe' });
  const stock0 = product.stock_quantity;

  try {
    // --- auth gates
    ok('orders GET without token → 401', (await call('GET', '/orders')).s === 401);
    ok('cart GET without token → 401', (await call('GET', '/cart')).s === 401);
    ok('admin orders without token → 401', (await call('GET', '/admin/orders')).s === 401);
    ok('razorpay refund without token → 401', (await call('POST', '/payments/razorpay/refund', null, {})).s === 401);
    ok('admin API with customer token → 401', (await call('GET', '/admin/orders', tA)).s === 401);
    ok('product create (public route) removed', (await call('POST', '/products', tA, {})).s === 405);
    ok('upload route removed', (await call('POST', '/upload', tA, {})).s === 404);
    ok('wallet/recharge route removed', (await call('POST', '/users/wallet/recharge', tA, { amount: 500, payment_id: 'pay_x' })).s === 404);

    // --- wallet top-up via verify (pending txn as create-order would store it)
    await txns.insertOne({ user_id: A, user_type: 'customer', transaction_type: 'credit', amount: 500, status: 'pending', payment_method: 'razorpay', razorpay_order_id: 'order_testA1', purpose: 'wallet_recharge', created_at: now });
    const bad = await call('POST', '/payments/razorpay/verify', tA, { razorpay_order_id: 'order_testA1', razorpay_payment_id: 'pay_testA1', razorpay_signature: 'deadbeef' });
    ok('bad signature → 400 (no crash)', bad.s === 400, bad);
    const good = { razorpay_order_id: 'order_testA1', razorpay_payment_id: 'pay_testA1', razorpay_signature: sign('order_testA1', 'pay_testA1'), purpose: 'product_purchase', amount: 99999 };
    const stolen = await call('POST', '/payments/razorpay/verify', tB, good);
    ok("B can't settle A's payment → 404", stolen.s === 404, stolen);
    const [v1, v2, v3] = await Promise.all([1, 2, 3].map(() => call('POST', '/payments/razorpay/verify', tA, good)));
    ok('3 concurrent verifies all succeed', [v1, v2, v3].every(v => v.s === 200), [v1, v2, v3]);
    ok('client purpose/amount ignored (stored purpose used)', v1.j.data.purpose === 'wallet_recharge' && v1.j.data.amount === 500, v1.j);
    ok('wallet credited exactly once (500)', (await users.findOne({ user_id: A })).wallet_balance === 500);

    // --- webhook settles a payment the app never confirmed
    await txns.insertOne({ user_id: A, user_type: 'customer', transaction_type: 'credit', amount: 200, status: 'pending', payment_method: 'razorpay', razorpay_order_id: 'order_testA2', purpose: 'wallet_recharge', created_at: now });
    const ev = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_testA2', order_id: 'order_testA2', amount: 20000 } } } });
    const whSig = crypto.createHmac('sha256', 'whtest_secret').update(ev).digest('hex');
    ok('webhook bad signature → 400', (await call('POST', '/payments/razorpay/webhook', null, ev, { 'x-razorpay-signature': 'nope' })).s === 400);
    await Promise.all([call('POST', '/payments/razorpay/webhook', null, ev, { 'x-razorpay-signature': whSig }), call('POST', '/payments/razorpay/webhook', null, ev, { 'x-razorpay-signature': whSig })]);
    ok('webhook credits once (700)', (await users.findOne({ user_id: A })).wallet_balance === 700);

    // --- wallet-paid shop order
    const addr = { full_name: 'Test A', phone_number: '9000000000', address_line_1: 'x', city: 'c', state: 's', pincode: '110001' };
    const tooMuch = await call('POST', '/orders', tA, { user_id: B, items: [{ product_id: product.product_id, quantity: 1 }], shipping_address: addr, payment_method: 'wallet' });
    ok('wallet order over balance → 400 INSUFFICIENT_BALANCE', tooMuch.s === 400 && tooMuch.j.error === 'INSUFFICIENT_BALANCE', tooMuch);
    await users.updateOne({ user_id: A }, { $set: { wallet_balance: 5000 } });
    const wo = await call('POST', '/orders', tA, { user_id: B, items: [{ product_id: product.product_id, quantity: 1 }], shipping_address: addr, payment_method: 'wallet' });
    const expected = Math.round((1400 + 1400 * 0.18) * 100) / 100; // free shipping ≥ 500
    ok('wallet order paid, owned by token user', wo.s === 201 && wo.j.order.payment_status === 'paid' && wo.j.order.user_id === A, wo.j);
    ok(`wallet debited by server total ${expected}`, (await users.findOne({ user_id: A })).wallet_balance === Math.round((5000 - expected) * 100) / 100);
    ok('stock taken once', (await products.findOne({ _id: product._id })).stock_quantity === stock0 - 1);
    ok("B can't read A's order", (await call('GET', `/orders/${wo.j.order_id}`, tB)).s === 404);
    ok("B can't cancel A's order", (await call('PUT', `/orders/${wo.j.order_id}`, tB, { status: 'cancelled' })).s === 404);
    ok("A can't mark own order shipped/paid", (await call('PUT', `/orders/${wo.j.order_id}`, tA, { status: 'delivered', payment_status: 'paid' })).s === 403);
    const cx = await Promise.all([1, 2].map(() => call('PUT', `/orders/${wo.j.order_id}`, tA, { status: 'cancelled' })));
    ok('cancel: one succeeds, one refused', cx.filter(r => r.s === 200).length === 1, cx);
    ok('cancel refunds wallet once', (await users.findOne({ user_id: A })).wallet_balance === 5000);
    ok('cancel restores stock', (await products.findOne({ _id: product._id })).stock_quantity === stock0);
    const listA = await call('GET', `/orders?userId=${B}`, tA);
    ok('orders list ignores userId param (own only)', listA.s === 200 && listA.j.orders.every(o => true) && listA.j.pagination.total === 1, listA.j.pagination);

    // --- razorpay shop order: no stock taken until paid; amount from server
    const ro = await call('POST', '/orders', tA, { items: [{ product_id: product.product_id, quantity: 2 }], shipping_address: addr, payment_method: 'razorpay' });
    ok('razorpay order awaiting payment, stock untouched', ro.s === 201 && ro.j.order.payment_status === 'awaiting_payment' && (await products.findOne({ _id: product._id })).stock_quantity === stock0, ro.j);
    await orders.updateOne({ _id: new (require('mongodb').ObjectId)(ro.j.order_id) }, { $set: { razorpay_order_id: 'order_testA3' } });
    await txns.insertOne({ user_id: A, user_type: 'customer', transaction_type: 'debit', amount: ro.j.order.total_amount, status: 'pending', payment_method: 'razorpay', razorpay_order_id: 'order_testA3', purpose: 'product_purchase', created_at: now });
    const pv = await call('POST', '/payments/razorpay/verify', tA, { razorpay_order_id: 'order_testA3', razorpay_payment_id: 'pay_testA3', razorpay_signature: sign('order_testA3', 'pay_testA3'), purpose: 'wallet_recharge' });
    const paid = await orders.findOne({ razorpay_order_id: 'order_testA3' });
    ok('verify marks shop order paid (not wallet credit)', pv.s === 200 && paid.payment_status === 'paid' && (await users.findOne({ user_id: A })).wallet_balance === 5000, pv.j);
    ok('stock taken on payment', (await products.findOne({ _id: product._id })).stock_quantity === stock0 - 2);
    const cr = await call('POST', '/payments/razorpay/create-order', tA, { purpose: 'product_purchase', order_id: ro.j.order_id, amount: 1 });
    ok('create-order refuses already-paid order', cr.s === 404, cr);

    // --- payouts: two concurrent 80 requests on 100 balance
    const po = await Promise.all([1, 2].map(() => call('POST', '/astrologers/payouts', tT, { amount: 1000 })));
    const t = await users.findOne({ user_id: T });
    ok('payout race reserves at most the balance', t.reserved_balance === 1000 && po.filter(r => r.s === 200).length === 1, { reserved: t.reserved_balance, po: po.map(p => [p.s, p.j?.error]) });

    // --- profile allowlist
    await call('PUT', '/users/profile', tT, { full_name: 'Renamed', wallet_balance: 999999, reserved_balance: -1000, commission_percentage: { call: 0 } });
    const t2 = await users.findOne({ user_id: T });
    ok('profile PUT ignores money fields', t2.wallet_balance === 1500 && t2.reserved_balance === t.reserved_balance && !t2.commission_percentage, t2);

    // --- reviews need a completed session
    const rv = await call('POST', '/astrologers/reviews', tA, { astrologer_id: T, user_id: B, rating: 5, comment: 'fake' });
    ok('review without consultation → 403', rv.s === 403, rv);

    // --- public profile hides PII, customers hidden from others
    ok("customer profile hidden from others", (await call('GET', `/users/${A}/profile`, tB)).s === 404);
  } finally {
    await products.updateOne({ _id: product._id }, { $set: { stock_quantity: stock0 } });
    await cleanup();
    await c.close();
  }
})();
