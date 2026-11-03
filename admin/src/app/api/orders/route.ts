import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import DatabaseService from '../../../lib/database';
import { getAuthUser, unauthorized } from '../../../lib/security';
import { generateOrderId } from '../../../lib/custom-id';
import { markOrderPaid } from '../../../lib/orders';

// Type definitions
interface OrderItem {
  product_id: string;
  quantity: number;
  price_at_time?: number; // Price at time of order (for historical accuracy)
  price?: number; // Legacy field for backwards compatibility
  total_price: number;
}

// Helper function to resolve media URL from media collection
async function resolveMediaUrl(request: NextRequest, mediaId: string | ObjectId | null | undefined): Promise<string | null> {
  if (!mediaId) return null;
  
  try {
    const mediaCollection = await DatabaseService.getCollection('media');
    let mediaFile;
    
    // Check if it's our custom media ID format (media_timestamp_random)
    if (typeof mediaId === 'string' && mediaId.startsWith('media_')) {
      mediaFile = await mediaCollection.findOne({ media_id: mediaId });
    } else if (typeof mediaId === 'string' && mediaId.length === 24) {
      // Try as ObjectId for backward compatibility
      try {
        mediaFile = await mediaCollection.findOne({ _id: new ObjectId(mediaId) });
        // If not found by _id, try by media_id
        if (!mediaFile) {
          mediaFile = await mediaCollection.findOne({ media_id: mediaId });
        }
      } catch {
        // If ObjectId conversion fails, try as media_id
        mediaFile = await mediaCollection.findOne({ media_id: mediaId });
      }
    } else if (mediaId instanceof ObjectId) {
      mediaFile = await mediaCollection.findOne({ _id: mediaId });
    }

    if (mediaFile && mediaFile.file_path) {
      // Get the actual host from the request headers
      const host = request.headers.get('host') || 'api.astromate.online';
      const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      const baseUrl = `${protocol}://${host}`;
      
      return `${baseUrl}${mediaFile.file_path}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error resolving media URL:', error);
    return null;
  }
}

// Generate secure order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `TA-${timestamp.slice(-6)}-${randomChars}-${random}`;
}

// GET - Get orders (user-specific or admin view)
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) return unauthorized();
    const { searchParams } = new URL(request.url);
    const userId = auth.userId; // own orders only; admin panel uses /api/admin/orders
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('payment_status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const ordersCollection = await DatabaseService.getCollection('orders');
    const query: Record<string, unknown> = { user_id: userId };

    // Status filters
    if (status && status !== 'all') {
      query.status = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query.payment_status = paymentStatus;
    }

    // Get orders with pagination
    const orders = await ordersCollection
      .find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalOrders = await ordersCollection.countDocuments(query);

    const formattedOrders = await Promise.all(orders.map(async order => {
      // Always resolve product details and images dynamically from product_id
      const itemsWithDetails = await Promise.all((order.items || []).map(async (item: OrderItem) => {
        try {
          const productsCollection = await DatabaseService.getCollection('products');
          // Look up product by custom product_id, not MongoDB ObjectId
          const product = await productsCollection.findOne({ product_id: item.product_id });
          
          if (product) {
            // Resolve product image
            let productImageUrl = null;
            if (product.image_id) {
              productImageUrl = await resolveMediaUrl(request, product.image_id);
            }
            
            // Return item with current product details but historical pricing
            return { 
              product_id: item.product_id,
              product_name: product.name, // Current product name
              price: item.price_at_time, // Price at time of order
              quantity: item.quantity,
              total_price: item.total_price,
              category: product.category, // Current category
              product_image: productImageUrl,
              is_available: product.is_active || false // Current availability
            };
          } else {
            // Product no longer exists, return with stored data only
            return {
              product_id: item.product_id,
              product_name: `Product ${item.product_id} (discontinued)`,
              price: item.price_at_time,
              quantity: item.quantity,
              total_price: item.total_price,
              category: 'Unknown',
              product_image: null,
              is_available: false
            };
          }
        } catch (error) {
          console.error(`Failed to resolve details for product ${item.product_id}:`, error);
          return { 
            product_id: item.product_id,
            product_name: `Product ${item.product_id} (error)`,
            price: item.price_at_time,
            quantity: item.quantity,
            total_price: item.total_price,
            category: 'Unknown',
            product_image: null,
            is_available: false
          };
        }
      }));

      const baseOrder = {
        _id: order._id.toString(),
        order_number: order.order_number,
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        total_amount: order.total_amount,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        tax_amount: order.tax_amount,
        items: itemsWithDetails,
        shipping_address: order.shipping_address,
        tracking_number: order.tracking_number,
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
        shipped_at: order.shipped_at,
        delivered_at: order.delivered_at,
        order_date: order.created_at // Always provide order_date as created_at
      };

      return baseOrder;
    }));


    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit)
      }
    });

  } catch(error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while fetching orders'
    }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) return unauthorized();
    const body = await request.json();
    const user_id = auth.userId;
    const {
      items,
      shipping_address, 
      payment_method = 'cod',
      payment_details = {},
      notes = '',
      apply_shipping = true
    } = body;

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'User ID and items are required'
      }, { status: 400 });
    }

    if (!shipping_address || !shipping_address.full_name || !shipping_address.address_line_1) {
      return NextResponse.json({
        success: false,
        error: 'Invalid shipping address',
        message: 'Complete shipping address is required'
      }, { status: 400 });
    }

    const ordersCollection = await DatabaseService.getCollection('orders');
    const productsCollection = await DatabaseService.getCollection('products');

    // Validate items and calculate totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      // Look up product by custom product_id, not MongoDB ObjectId
      const product = await productsCollection.findOne({ 
        product_id: item.product_id,
        is_active: true 
      });

      if (!product) {
        return NextResponse.json({
          success: false,
          error: 'Product not found',
          message: `Product ${item.product_id} not found or not available`
        }, { status: 400 });
      }

      // Check stock availability
      if (Number(product.stock_quantity) < Number(item.quantity)) {
            return NextResponse.json({
          success: false,
          error: 'Insufficient stock',
          message: `Only ${product.stock_quantity} items available for ${product.name}`
        }, { status: 400 });
      }

      const itemTotal = Number(product.price) * Number(item.quantity);
      subtotal += itemTotal;
      
      // Only store essential order item data - product details will be resolved dynamically
      validatedItems.push({
        product_id: item.product_id, // This should be custom product_id like 'product_1756540783734_wxtlznqe'
        quantity: Number(item.quantity),
        price_at_time: Number(product.price), // Store price at time of order for historical accuracy
        total_price: itemTotal
      });
    }

    // Calculate shipping and tax
    const shippingCost = apply_shipping && subtotal < 500 ? 50 : 0; // Free shipping above ₹500
    const settings = await (await DatabaseService.getCollection('app_settings')).findOne({ type: 'general' });
    const taxRate = Number(settings?.commission?.gstRate ?? 18) / 100; // same source the app shows (/app-config)
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + shippingCost + taxAmount;

    if (!['wallet', 'razorpay'].includes(payment_method)) {
      return NextResponse.json({ success: false, error: 'Invalid payment method', message: 'Payment method must be wallet or razorpay' }, { status: 400 });
    }
    // Razorpay orders become paid only via /payments/razorpay/verify or the webhook
    const paymentStatus = 'awaiting_payment';
    const roundedTotal = Math.round(totalAmount * 100) / 100;
    const usersCollection = await DatabaseService.getCollection('users');

    // Generate order
    const orderData = {
      order_id: generateOrderId(),
      user_id: user_id,
      order_number: generateOrderNumber(),
      status: 'pending',
      payment_status: paymentStatus,
      payment_method: payment_method,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping_cost: shippingCost,
      tax_amount: Math.round(taxAmount * 100) / 100,
      total_amount: roundedTotal,
      items: validatedItems,
      shipping_address: {
        full_name: shipping_address.full_name,
        phone_number: shipping_address.phone_number,
        address_line_1: shipping_address.address_line_1,
        address_line_2: shipping_address.address_line_2 || '',
        city: shipping_address.city,
        state: shipping_address.state,
        postal_code: shipping_address.pincode,
        country: shipping_address.country || 'India'
      },
      notes: payment_details.notes || notes,
      tracking_number: null,
      created_at: new Date(),
      updated_at: new Date(),
      shipped_at: null,
      delivered_at: null
    };

    // Wallet: take the money first (atomic, can't overdraw), then the order is paid on creation
    if (payment_method === 'wallet') {
      const debited = await usersCollection.updateOne(
        { user_id, wallet_balance: { $gte: roundedTotal } },
        { $inc: { wallet_balance: -roundedTotal }, $currentDate: { updated_at: true } },
      );
      if (debited.modifiedCount === 0) {
        return NextResponse.json({ success: false, error: 'INSUFFICIENT_BALANCE', message: `Wallet balance is less than ₹${roundedTotal}` }, { status: 400 });
      }
    }

    let result;
    try {
      result = await ordersCollection.insertOne(orderData);
    } catch (e) {
      if (payment_method === 'wallet') {
        await usersCollection.updateOne({ user_id }, { $inc: { wallet_balance: roundedTotal } });
      }
      throw e;
    }
    const orderId = result.insertedId.toString();

    if (payment_method === 'wallet') {
      const walletPaymentId = `wallet_${orderId}`;
      await (await DatabaseService.getCollection('transactions')).insertOne({
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        user_id, user_type: 'customer', transaction_type: 'debit', amount: roundedTotal,
        description: `Payment for order ${orderData.order_number}`, order_id: orderId, purpose: 'product_purchase',
        payment_method: 'wallet', payment_id: walletPaymentId, status: 'completed', created_at: new Date(), updated_at: new Date(),
      });
      await markOrderPaid({ _id: result.insertedId, ...orderData }, walletPaymentId);
      Object.assign(orderData, { payment_status: 'paid', status: 'confirmed', payment_id: walletPaymentId });
    }


    // Return the complete order object for the frontend
    const completeOrder = {
      _id: orderId,
      ...orderData,
      // Convert Date objects to ISO strings for frontend compatibility
      created_at: (orderData.created_at as Date).toISOString(),
      updated_at: (orderData.updated_at as Date).toISOString(),
      shipped_at: orderData.shipped_at ? (orderData.shipped_at as Date).toISOString() : null,
      delivered_at: orderData.delivered_at ? (orderData.delivered_at as Date).toISOString() : null
    };

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: completeOrder,
      order_id: orderId
    }, { status: 201 });

  } catch(error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while creating order'
    }, { status: 500 });
  }
}
