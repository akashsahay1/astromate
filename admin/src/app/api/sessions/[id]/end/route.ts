import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/lib/database';
import { ObjectId } from 'mongodb';
import { jwtVerify } from 'jose';
import { chargeSessionTo } from '@/lib/session-billing';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

/**
 * PATCH /api/sessions/[id]/end
 * End a session and finalize billing
 * Called by mobile app when a call/chat session ends
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'No authentication token provided'
      }, { status: 401 });
    }

    let payload;
    try {
      const result = await jwtVerify(token, JWT_SECRET);
      payload = result.payload;
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid token',
        message: 'Authentication token is invalid or expired'
      }, { status: 401 });
    }

    // Verify user is either a customer or astrologer
    if (payload.user_type !== 'customer' && payload.user_type !== 'astrologer') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden',
        message: 'Access denied. Valid user account required.'
      }, { status: 403 });
    }

    const { id: sessionId } = await params;

    // Parse request body
    const body = await request.json();
    const { durationMinutes, totalAmount } = body;

    if (durationMinutes === undefined || totalAmount === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: durationMinutes, totalAmount'
      }, { status: 400 });
    }

    // Connect to MongoDB
    const sessionsCollection = await DatabaseService.getCollection('sessions');
    const usersCollection = await DatabaseService.getCollection('users');

    // Find the session - try by _id first, then by session_id
    let session = null;

    // Try finding by ObjectId if valid
    if (ObjectId.isValid(sessionId)) {
      session = await sessionsCollection.findOne({ _id: new ObjectId(sessionId) });
    }

    // If not found, try by session_id field
    if (!session) {
      session = await sessionsCollection.findOne({ session_id: sessionId });
    }

    if (!session) {
      console.error(`Session not found: ${sessionId}`);
      return NextResponse.json({
        success: false,
        error: `Session not found: ${sessionId}`
      }, { status: 404 });
    }

    const requestUserId = (payload.userId || payload.user_id) as string;
    const isOwnerCustomer = payload.user_type === 'customer' && session.user_id === requestUserId;
    const isOwnerAstrologer = payload.user_type === 'astrologer' && session.astrologer_id === requestUserId;
    if (!isOwnerCustomer && !isOwnerAstrologer) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Only the customer's final total can add charges; ending never charges twice and never
    // credits the astrologer for money that was not debited (see chargeSessionTo).
    let amountDeducted = 0;
    if (isOwnerCustomer && session.status !== 'completed') {
      const charge = await chargeSessionTo(session, Number(totalAmount), Number(durationMinutes));
      if (charge.ok) amountDeducted = charge.amountDeducted;
      else console.warn(`⚠️ [SESSION END] final charge skipped for ${sessionId}: ${charge.reason}`);
    }

    await sessionsCollection.updateOne(
      { _id: session._id },
      { $set: { status: 'completed', ended_at: new Date() } }
    );

    console.log(`✅ [SESSION END] Session ${sessionId} marked as completed`);

    return NextResponse.json({
      success: true,
      message: 'Session ended successfully',
      sessionId,
      durationMinutes,
      totalAmount,
      amountDeducted
    });

  } catch(error) {
    console.error('Error ending session:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
