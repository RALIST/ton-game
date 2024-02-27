/** @type {import('next').NextConfig} */
require('next-ws/server').verifyPatch();

const nextConfig = {
    experimental: {
        serverActions: true,
        instrumentationHook: true,
    },
    reactStrictMode: false,
}

module.exports = nextConfig
