import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import DatabaseService from '../../../../lib/database';
import { getAuthUser, unauthorized } from '../../../../lib/security';
import { cancelOrderByCustomer } from '../../../../lib/orders';

// GET - Get order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) return unauthorized();
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    if (!orderId || !ObjectId.isValid(orderId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid order ID',
        message: 'Valid order ID is required'
      }, { status: 400 });
    }

    const ordersCollection = await DatabaseService.getCollection('orders');
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId), user_id: auth.userId });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
        message: 'Order not found'
      }, { status: 404 });
    }

    // Format order for response
    const formattedOrder = {
      _id: order._id.toString(),
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      total_amount: order.total_amount,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      tax_amount: order.tax_amount,
      items: order.items,
      shipping_address: order.shipping_address,
      tracking_number: order.tracking_number,
      notes: order.notes,
      razorpay_order_id: order.razorpay_order_id,
      payment_id: order.payment_id,
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipped_at: order.shipped_at,
      delivered_at: order.delivered_at
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder
    });

  } catch(error) {
    console.error('Order details GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while fetching order details'
    }, { status: 500 });
  }
}

// PUT - customer updates their own order: cancel it, or mark an unpaid checkout as failed.
// Everything else (shipping, tracking, payment status) is admin-only via /api/admin/orders.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) return unauthorized();
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid order ID', message: 'Valid order ID is required' }, { status: 400 });
    }
    const { status, reason, cancellation_reason } = await request.json();
    const ordersCollection = await DatabaseService.getCollection('orders');
    const order = await ordersCollection.findOne({ _id: new ObjectId(id), user_id: auth.userId });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found', message: 'Order not found' }, { status: 404 });
    }

    if (status === 'cancelled') {
      const r = await cancelOrderByCustomer(order, reason || cancellation_reason);
      if (!r.ok) return NextResponse.json({ success: false, error: 'Cannot cancel order', message: r.message }, { status: 400 });
      return NextResponse.json({ success: true, message: 'Order cancelled successfully', refunded_to_wallet: r.refundedToWallet });
    }

    if (status === 'payment_failed') {
      await ordersCollection.updateOne(
        { _id: order._id, payment_status: { $ne: 'paid' } },
        { $set: { status: 'payment_failed', payment_status: 'failed', updated_at: new Date() } },
      );
      return NextResponse.json({ success: true, message: 'Order updated successfully' });
    }

    return NextResponse.json({ success: false, error: 'Forbidden', message: 'Only cancellation is allowed' }, { status: 403 });
  } catch (error) {
    console.error('Order update PUT error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error', message: 'An error occurred while updating order' }, { status: 500 });
  }
}
