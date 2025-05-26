import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { config } from '../../../config';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
            console.error('Google OAuth error:', error);
            return NextResponse.redirect('/pages/vendor-dashboard?error=auth_failed');
        }

        if (!code) {
            return NextResponse.redirect('/pages/vendor-dashboard?error=no_code');
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        );

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        // Store tokens in localStorage via client-side redirect
        const redirectUrl = new URL('/pages/vendor-dashboard', req.url);
        redirectUrl.searchParams.set('access_token', tokens.access_token!);
        if (tokens.refresh_token) {
            redirectUrl.searchParams.set('refresh_token', tokens.refresh_token);
        }

        return NextResponse.redirect(redirectUrl.toString());
    } catch (error) {
        console.error('Error in Google OAuth callback:', error);
        return NextResponse.redirect('/pages/vendor-dashboard?error=server_error');
    }
} 