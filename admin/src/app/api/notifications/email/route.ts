import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/lib/database';
import { getAuthUser, unauthorized } from '@/lib/security';

import * as sgMail from '@sendgrid/mail';

// SendGrid configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@astromate.online';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('⚠️ SENDGRID_API_KEY not configured - emails will fail');
}

// Email templates
const getEmailTemplate = (type: string, data: Record<string, unknown>) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://astromate.online';
  
  switch (type) {
    case 'order_confirmation':
      return {
        subject: `Order Confirmation - ${data.order_number}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Order Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1877F2; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .order-details { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; }
              .item { border-bottom: 1px solid #eee; padding: 10px 0; }
              .total { font-weight: bold; font-size: 18px; color: #1877F2; }
              .footer { text-align: center; padding: 20px; color: #666; }
              .btn { background: #1877F2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Order Confirmed!</h1>
              </div>
              <div class="content">
                <p>Dear ${data.user_name},</p>
                <p>Thank you for your order! We're pleased to confirm your order has been received and is being processed.</p>
                
                <div class="order-details">
                  <h3>Order Details</h3>
                  <p><strong>Order Number:</strong> ${data.order_number}</p>
                  <p><strong>Order Date:</strong> ${new Date(data.order_date as string).toLocaleDateString()}</p>
                  <p><strong>Payment Method:</strong> ${data.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                  
                  <h4>Items Ordered:</h4>
                  ${(data.items as Array<Record<string, unknown>>).map((item) => `
                    <div class="item">
                      <strong>${item.product_name}</strong><br>
                      Quantity: ${item.quantity} × ₹${item.price_at_time} = ₹${item.total_price}
                    </div>
                  `).join('')}
                  
                  <div style="margin-top: 15px;">
                    <p>Subtotal: ₹${data.subtotal}</p>
                    <p>Shipping: ₹${data.shipping_cost}</p>
                    <p>Tax (GST): ₹${data.tax_amount}</p>
                    <p class="total">Total: ₹${data.total_amount}</p>
                  </div>
                </div>
                
                <div class="order-details">
                  <h4>Shipping Address:</h4>
                  <p>
                    ${(data.shipping_address as Record<string, unknown>).full_name}<br>
                    ${(data.shipping_address as Record<string, unknown>).phone_number}<br>
                    ${(data.shipping_address as Record<string, unknown>).address_line_1}<br>
                    ${(data.shipping_address as Record<string, unknown>).address_line_2 ? (data.shipping_address as Record<string, unknown>).address_line_2 + '<br>' : ''}
                    ${(data.shipping_address as Record<string, unknown>).city}, ${(data.shipping_address as Record<string, unknown>).state} - ${(data.shipping_address as Record<string, unknown>).postal_code}
                  </p>
                </div>
                
                <p>We'll send you another email with tracking information once your order has been shipped.</p>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/orders/${data.order_id}" class="btn">Track Your Order</a>
                </p>
              </div>
              <div class="footer">
                <p>Need help? Contact us at <a href="mailto:support@astromate.online">support@astromate.online</a></p>
                <p>&copy; 2024 Astromate. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

    case 'order_status_update':
      return {
        subject: `Order Update - ${data.order_number}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Order Status Update</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1877F2; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .status-update { background: #e8f5e8; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #28a745; }
              .footer { text-align: center; padding: 20px; color: #666; }
              .btn { background: #1877F2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Order Status Update</h1>
              </div>
              <div class="content">
                <p>Dear ${data.user_name},</p>
                <p>We have an update on your order <strong>${data.order_number}</strong>.</p>
                
                <div class="status-update">
                  <h3>Status: ${(data.status as string).charAt(0).toUpperCase() + (data.status as string).slice(1)}</h3>
                  ${data.tracking_number ? `<p><strong>Tracking Number:</strong> ${data.tracking_number}</p>` : ''}
                  ${data.status === 'shipped' ? '<p>Your order is on its way! You should receive it within 3-5 business days.</p>' : ''}
                  ${data.status === 'delivered' ? '<p>Your order has been delivered! We hope you enjoy your purchase.</p>' : ''}
                </div>
                
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/orders/${data.order_id}" class="btn">View Order Details</a>
                </p>
              </div>
              <div class="footer">
                <p>Need help? Contact us at <a href="mailto:support@astromate.online">support@astromate.online</a></p>
                <p>&copy; 2024 Astromate. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

    default:
      return {
        subject: 'Notification from Astromate',
        html: `
          <p>Hello,</p>
          <p>This is a notification from Astromate.</p>
          <p>Best regards,<br>Astromate Team</p>
        `
      };
  }
};

// POST - Send email notification
interface EmailNotificationBody {
  subject: string;
  message: string;
  recipient_type: 'all' | 'customers' | 'astrologers' | 'specific';
  user_ids?: string[];
  send_now?: boolean;
  scheduled_time?: string;
  template_type?: string;
  type?: string;
  data?: Record<string, unknown>;
  recipient_email?: string;
  recipient_name?: string;
}

export async function POST(request: NextRequest) {
  let body: EmailNotificationBody | undefined;
  try {
    const auth = await getAuthUser(request);
    if (!auth) return unauthorized();
    body = await request.json() as EmailNotificationBody;
    const { type, recipient_name, data } = body;
    // Only ever email the signed-in user themselves — this must never become an open mail relay
    const me = await (await DatabaseService.getCollection('users')).findOne({ user_id: auth.userId }, { projection: { email_address: 1 } });
    const recipient_email = me?.email_address as string | undefined;

    if (!type || !recipient_email) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Email type and recipient email are required'
      }, { status: 400 });
    }

    // Get email template
    const emailContent = getEmailTemplate(type, {
      user_name: recipient_name || 'Customer',
      ...data
    });

    // Check if SendGrid is configured
    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    // Send email via SendGrid
    const mailOptions = {
      from: `"Astromate" <${FROM_EMAIL}>`,
      to: recipient_email,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await sgMail.send(mailOptions);

    // Log email to database
    const emailLogsCollection = await DatabaseService.getCollection('email_logs');

    const emailLog = {
      type: type,
      recipient_email: recipient_email,
      recipient_name: recipient_name,
      subject: emailContent.subject,
      status: 'sent',
      message_id: Array.isArray(info) && info[0] ? info[0].headers?.['x-message-id'] || 'sendgrid-sent' : 'sendgrid-sent',
      data: data,
      sent_at: new Date()
    };

    await emailLogsCollection.insertOne(emailLog);
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully via SendGrid',
      message_id: Array.isArray(info) && info[0] ? info[0].headers?.['x-message-id'] || 'sendgrid-sent' : 'sendgrid-sent'
    });

  } catch (error) {
    console.error('Email send error:', error);
    
    // Log failed email to database
    try {
      const emailLogsCollection = await DatabaseService.getCollection('email_logs');

      const emailLog = {
        type: body?.type || 'unknown',
        recipient_email: body?.recipient_email || 'unknown',
        recipient_name: body?.recipient_name || 'unknown',
        subject: `Failed: ${body?.type || 'unknown'}`,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: body?.data || {},
        sent_at: new Date()
      };

      await emailLogsCollection.insertOne(emailLog);
    } catch (logError) {
      console.error('Error logging email failure:', logError);
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to send email',
      message: error instanceof Error ? error.message : 'An error occurred while sending email'
    }, { status: 500 });
  }
}
