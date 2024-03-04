/** @type {import('next').NextConfig} */
require('next-ws/server').verifyPatch();

const nextConfig = {
    experimental: {
        instrumentationHook: true,
    },
    reactStrictMode: false,
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
