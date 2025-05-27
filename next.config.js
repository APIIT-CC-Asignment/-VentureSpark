/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    },
    // Enable React strict mode for better development experience
    reactStrictMode: true,
}

module.exports = nextConfig 