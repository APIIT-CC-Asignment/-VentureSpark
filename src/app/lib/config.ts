// lib/config.ts - Vercel-Only Configuration
const getBaseUrl = () => {
    // For Vercel deployments (production & preview)
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Fallback for custom domains
    if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL;
    }

    // Production fallback
    return 'https://venture-spark.vercel.app';
};

export const config = {
    baseUrl: getBaseUrl(),
    google: {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: `${getBaseUrl()}/api/auth/callback/google`, // Always dynamic Vercel URL
        scopes: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/calendar.settings.readonly'
        ]
    },
    nextAuth: {
        url: getBaseUrl(),
        secret: process.env.NEXTAUTH_SECRET!,
    },
    database: {
        url: process.env.DATABASE_URL!,
    },
};

// Debug logging
console.log('Vercel OAuth Configuration:', {
    clientId: config.google.clientId,
    redirectUri: config.google.redirectUri,
    baseUrl: config.baseUrl,
    vercelUrl: process.env.VERCEL_URL || 'not set',
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
});