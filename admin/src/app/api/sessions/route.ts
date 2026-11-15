import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/lib/database';
import { ObjectId } from 'mongodb';
import { jwtVerify } from 'jose';
import { chargeSessionTo } from '@/lib/session-billing';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.user_type !== 'administrator') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const sessionType = searchParams.get('type'); // call, chat, video
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const astrologer = searchParams.get('astrologer') || '';
    const fromDate = searchParams.get('fromDate') || '';
    const toDate = searchParams.get('toDate') || '';
    const minAmount = searchParams.get('minAmount') || '';
    const maxAmount = searchParams.get('maxAmount') || '';
    const rating = searchParams.get('rating') || '';
    
    // Calculate skip
    const skip = (page - 1) * limit;

    // Connect to MongoDB
    const sessionsCollection = await DatabaseService.getCollection('sessions');

    // Build MongoDB query
    const mongoQuery: Record<string, unknown> = {};
    
    if (sessionType) {
      mongoQuery.session_type = sessionType;
    }
    
    if (status) {
      mongoQuery.status = status;
    }
    
    if (search) {
      mongoQuery.$or = [
        { user_id: { $regex: search, $options: 'i' } },
        { astrologer_id: { $regex: search, $options: 'i' } },
        { _id: { $regex: search, $options: 'i' } }
      ];
    }

    // Additional filters
    if (astrologer) {
      mongoQuery.astrologer_id = { $regex: astrologer, $options: 'i' };
    }

    // Date range filter
    if (fromDate || toDate) {
      const dateQuery: Record<string, Date> = {};
      if (fromDate) {
        dateQuery.$gte = new Date(fromDate);
      }
      if (toDate) {
        // Add one day to include the entire toDate
        const endDate = new Date(toDate);
        endDate.setDate(endDate.getDate() + 1);
        dateQuery.$lt = endDate;
      }
      mongoQuery.created_at = dateQuery;
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      const amountQuery: Record<string, number> = {};
      if (minAmount) {
        amountQuery.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        amountQuery.$lte = parseFloat(maxAmount);
      }
      mongoQuery.total_amount = amountQuery;
    }

    // Rating filter (minimum rating)
    if (rating) {
      mongoQuery.customer_rating = { $gte: parseInt(rating) };
    }

    // Get total count for pagination
    const totalCount = await sessionsCollection.countDocuments(mongoQuery);

    // Fetch sessions with pagination
    const sessions = await sessionsCollection
      .find(mongoQuery)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    // Convert MongoDB documents to proper format
    const formattedSessions = sessions.map(session => ({
      ...session,
      _id: session._id.toString(),
      user_id: session.user_id ? session.user_id.toString() : session.user_id,
      astrologer_id: session.astrologer_id ? session.astrologer_id.toString() : session.astrologer_id,
      start_time: session.start_time ? session.start_time.toISOString() : session.start_time,
      end_time: session.end_time ? session.end_time.toISOString() : session.end_time,
      created_at: session.created_at ? session.created_at.toISOString() : session.created_at,
      updated_at: session.updated_at ? session.updated_at.toISOString() : session.updated_at
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        sessions: formattedSessions,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch(error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { sessionId, sessionType, astrologerId, userId } = body;

    if (!sessionId || !sessionType || !astrologerId || !userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: sessionId, sessionType, astrologerId, userId' 
      }, { status: 400 });
    }

    const me = (payload.userId || payload.user_id) as string;
    if (userId !== me && astrologerId !== me) {
      return NextResponse.json({ success: false, error: 'Forbidden', message: 'You can only create your own sessions' }, { status: 403 });
    }

    // Connect to MongoDB
    const sessionsCollection = await DatabaseService.getCollection('sessions');

    // Check if session already exists to prevent duplicates
    const existingSession = await sessionsCollection.findOne({ session_id: sessionId });
    if (existingSession) {
      return NextResponse.json({
        success: true,
        message: 'Session already exists',
        session: existingSession
      });
    }

    // Create session record
    
    const session = {
      session_id: sessionId,
      session_type: sessionType, // 'call', 'video', or 'chat'
      user_id: userId,
      astrologer_id: astrologerId,
      status: 'active',
      duration_minutes: 0,
      total_amount: 0.0,
      created_at: new Date(),
      updated_at: new Date(),
      billing_updated_at: null
    };

    const _result = await sessionsCollection.insertOne(session);
    return NextResponse.json({
      success: true,
      message: 'Session created successfully',
      sessionId
    });

  } catch(error) {
    console.error('Error creating session:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while creating the session'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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

    // Verify user is either a customer or astrologer (only they can update billing)
    const userType = payload.user_type;
    if (userType !== 'customer' && userType !== 'astrologer') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden',
        message: 'Access denied. Valid user account required.'
      }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { sessionId, sessionType, durationMinutes, totalAmount } = body;

    if (!sessionId || !sessionType || durationMinutes === undefined || totalAmount === undefined) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: sessionId, sessionType, durationMinutes, totalAmount' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const sessionsCollection = await DatabaseService.getCollection('sessions');

    // Get the session to find the user_id (customer who should be charged)
    // Try to find by _id first (mobile app sends _id), then by session_id
    let session = null;

    // Try finding by _id (ObjectId)
    try {
      const { ObjectId } = await import('mongodb');
      if (ObjectId.isValid(sessionId)) {
        session = await sessionsCollection.findOne({
          _id: new ObjectId(sessionId),
          session_type: sessionType
        });
      }
    } catch (_e) {
      // Not a valid ObjectId, try session_id
    }

    // If not found by _id, try session_id field
    if (!session) {
      session = await sessionsCollection.findOne({
        session_id: sessionId,
        session_type: sessionType
      });
    }

    if (!session) {
      console.log(`❌ [BILLING] Session not found: ${sessionId} with type ${sessionType}`);
      return NextResponse.json({
        success: false,
        error: `Session not found: ${sessionId} with type ${sessionType}`
      }, { status: 404 });
    }

    // Get user ID from JWT payload (handle both field naming conventions)
    const requestUserId = (payload.userId || payload.user_id) as string;
    console.log(`💰 [BILLING] Found session: ${session._id}, user_id: ${session.user_id}, request userId: ${requestUserId}`);

    // Billing runs on the customer's device only. Astrologers never bill sessions.
    if (userType !== 'customer' || session.user_id !== requestUserId) {
      return NextResponse.json({
        success: false,
        error: 'Forbidden',
        message: 'You can only update your own sessions'
      }, { status: 403 });
    }

    const charge = await chargeSessionTo(session, Number(totalAmount), Number(durationMinutes));
    if (!charge.ok) {
      return NextResponse.json({
        success: false,
        error: charge.reason === 'insufficient_balance' ? 'Insufficient balance' : charge.reason,
        error_code: charge.reason.toUpperCase(),
        message: charge.reason === 'insufficient_balance'
          ? `Insufficient wallet balance. Required: ₹${charge.required}, Current: ₹${charge.balance}`
          : 'Billing update rejected',
      }, { status: charge.reason === 'concurrent_update' ? 409 : 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Session billing updated successfully',
      sessionId,
      durationMinutes,
      totalAmount,
      amountDeducted: charge.amountDeducted
    });

  } catch(error) {
    console.error('Error updating session billing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.user_type !== 'administrator') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionIds, deleteAll } = body;

    // Connect to MongoDB
    const sessionsCollection = await DatabaseService.getCollection('sessions');

    let result;
    if (deleteAll) {
      // Delete all sessions (be careful with this!)
      result = await sessionsCollection.deleteMany({});
    } else if (sessionIds && Array.isArray(sessionIds)) {
      // Delete specific sessions
      result = await sessionsCollection.deleteMany({
        _id: { $in: sessionIds.map((id: string) => new ObjectId(id)) }
      });
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    return NextResponse.json({
      message: `Successfully deleted ${result.deletedCount} sessions`,
      deletedCount: result.deletedCount
    });

  } catch(error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}