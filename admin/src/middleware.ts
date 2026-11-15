import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

// Admin-panel-only APIs. Route handlers may also check, but nothing here may ever be reachable without an admin token.
const adminApiPrefixes = [
  '/api/admin/', '/api/finance/', '/api/dashboard/', '/api/reports/summary', '/api/sessions/stats',
  '/api/payments/razorpay/refund', '/api/media/register-external', '/api/users/create', '/api/users/bulk-update',
];
const adminUserTypes = ['administrator', 'admin', 'manager'];
// Admin-only by path + method: user edit/delete by ObjectId, maintenance, monitoring reads, astrologer-option edits.
// The app may still POST error/performance reports and read astrologer options.
const isAdminOnly = (pathname: string, method: string) =>
  /^\/api\/users\/[0-9a-f]{24}(\/audit)?\/?$/i.test(pathname) ||
  pathname.startsWith('/api/database/') ||
  (/^\/api\/reports\/(errors|performance)\/?$/.test(pathname) && method !== 'POST') ||
  pathname.startsWith('/api/reports/realtime-stats') ||
  (pathname.startsWith('/api/astrologer-options') && method !== 'GET');

// Public routes that don't require authentication
const publicRoutes = ['/', '/login'];

// Admin routes that require authentication - all routes except public ones
const adminRoutes = ['/dashboard', '/accounts', '/sessions', '/products', '/orders', '/finance', '/notifications', '/reports', '/settings', '/maintenance'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Block POST requests probing for Server Actions (scanner/bot attacks)
  if (method === 'POST') {
    // Block all POST to root - this is an admin panel, no forms POST to root
    if (pathname === '/') {
      return new NextResponse(null, { status: 404 });
    }
    const serverActionProbes = [
      '/_next/data', '/_next/refresh', '/_next/redirect', '/_next/turbopack',
      '/_next/webpack-hmr', '/_next/server-actions', '/_next/flight',
      '/_next/static', '/_next/server', '/_react/flight', '/_react_server'
    ];
    if (serverActionProbes.some(path => pathname.startsWith(path))) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // Block common bot/scanner paths immediately (reduce log noise)
  const botPaths = ['/blogs', '/buy', '/cart', '/goods', '/information', '/mails', '/more', '/news', '/shoppings', '/shops', '/wp-admin', '/wp-login', '/admin.php', '/.env', '/phpinfo'];
  if (botPaths.some(path => pathname.startsWith(path))) {
    return new NextResponse(null, { status: 404 });
  }

  if (adminApiPrefixes.some(p => pathname.startsWith(p)) || isAdminOnly(pathname, method)) {
    const auth = request.headers.get('authorization');
    const apiToken = auth?.startsWith('Bearer ') ? auth.slice(7) : request.cookies.get('auth-token')?.value;
    try {
      if (!apiToken) throw new Error('no token');
      const { payload } = await jwtVerify(apiToken, JWT_SECRET);
      if (!adminUserTypes.includes(payload.user_type as string)) throw new Error('not admin');
    } catch {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED', message: 'Admin authentication required' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    // For root path, let client-side authentication handle the logic
    if (pathname === '/') {
      return NextResponse.next();
    }
    
    // For /login, redirect to dashboard if user is already logged in
    if (pathname === '/login' && token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
				console.error('JWT verification failed:', error);
        // Token is invalid, let them access login page
        const response = NextResponse.next();
        response.cookies.delete('auth-token');
        return response;
      }
    }
    return NextResponse.next();
  }

  // Check if it's an admin route
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Check if user is admin or manager
      const allowedTypes = ['administrator', 'admin', 'manager'];
      if (!allowedTypes.includes(payload.user_type as string)) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Restrict managers from accessing certain routes
      const adminOnlyRoutes = ['/settings/general', '/accounts/admins'];
      if (payload.user_type === 'manager') {
        if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      return NextResponse.next();
    } catch (error) {
			console.error('JWT verification failed:', error);
      // Token is invalid, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Allow root path and other frontend routes to pass through
  // Frontend routes should be handled by Next.js pages

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static assets; admin APIs are gated above, other APIs pass through
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};