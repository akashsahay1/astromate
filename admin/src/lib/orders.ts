import type { Document, WithId } from 'mongodb';
import DatabaseService from '@/lib/database';

/**
 * Mark a shop order paid exactly once, then take the stock and clear the cart.
 * Stock and cart are only touched for paid orders, so abandoned/failed checkouts leave both alone.
 */
export async function markOrderPaid(order: WithId<Document>, paymentId: string): Promise<boolean> {
  const orders = await DatabaseService.getCollection('orders');
  const res = await orders.updateOne(
    { _id: order._id, payment_status: { $ne: 'paid' } },
    { $set: { payment_status: 'paid', payment_id: paymentId, status: 'confirmed', confirmed_at: new Date(), updated_at: new Date() } },
  );
  if (res.modifiedCount === 0) return false;

  const products = await DatabaseService.getCollection('products');
  for (const item of order.items || []) {
    // ponytail: paid orders are honoured even if this takes stock below zero; admin restocks/refunds
    await products.updateOne({ product_id: item.product_id }, { $inc: { stock_quantity: -Number(item.quantity) }, $set: { updated_at: new Date() } });
  }
  await (await DatabaseService.getCollection('cart_items')).deleteMany({ user_id: order.user_id });
  return true;
}

/**
 * Customer cancels their own order. Allowed until it ships. Wallet-paid orders are refunded to the
 * wallet; Razorpay-paid orders are flagged for an admin refund. Stock is returned for paid orders.
 */
export async function cancelOrderByCustomer(order: WithId<Document>, reason?: string):
  Promise<{ ok: true; refundedToWallet: number } | { ok: false; message: string }> {
  const orders = await DatabaseService.getCollection('orders');
  const res = await orders.updateOne(
    { _id: order._id, status: { $nin: ['shipped', 'delivered', 'cancelled'] } },
    { $set: {
      status: 'cancelled', cancelled_at: new Date(), updated_at: new Date(),
      ...(reason && { cancellation_reason: reason }),
      ...(order.payment_status === 'paid' && order.payment_method !== 'wallet' && { refund_status: 'pending' }),
    } },
  );
  if (res.modifiedCount === 0) return { ok: false, message: `Order cannot be cancelled as it is already ${order.status}` };

  let refundedToWallet = 0;
  if (order.payment_status === 'paid') {
    const products = await DatabaseService.getCollection('products');
    for (const item of order.items || []) {
      await products.updateOne({ product_id: item.product_id }, { $inc: { stock_quantity: Number(item.quantity) }, $set: { updated_at: new Date() } });
    }
    if (order.payment_method === 'wallet') {
      refundedToWallet = Number(order.total_amount);
      await (await DatabaseService.getCollection('users')).updateOne({ user_id: order.user_id }, { $inc: { wallet_balance: refundedToWallet }, $currentDate: { updated_at: true } });
      await orders.updateOne({ _id: order._id }, { $set: { payment_status: 'refunded', refund_status: 'completed' } });
      await (await DatabaseService.getCollection('transactions')).insertOne({
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        user_id: order.user_id, user_type: 'customer', transaction_type: 'refund', amount: refundedToWallet,
        description: `Refund for cancelled order ${order.order_number}`, order_id: String(order._id),
        payment_method: 'wallet', status: 'completed', created_at: new Date(), updated_at: new Date(),
      });
    }
  }
  return { ok: true, refundedToWallet };
}
