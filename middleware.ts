import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to intercept requests and handle redirects
export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const path = url.pathname;

    console.log(`[middleware] Processing request for path: ${path}`);

    // Redirect vendordetails to vendor-dashboard
    if (path === '/pages/vendordetails' || path.startsWith('/pages/vendordetails/')) {
        console.log('[middleware] Redirecting from vendordetails to vendor-dashboard');
        url.pathname = '/pages/vendor-dashboard';
        return NextResponse.redirect(url);
    }

    // Handle other paths if needed

    return NextResponse.next();
}

// Define which paths this middleware will run on
export const config = {
    matcher: [
        '/pages/vendordetails',
        '/pages/vendordetails/:path*',
        // Add other paths that need middleware processing here
    ],
};
