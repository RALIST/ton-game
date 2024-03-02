/** @type {import('next').NextConfig} */
require('next-ws/server').verifyPatch();

const nextConfig = {
    experimental: {
        instrumentationHook: true,
    },
    reactStrictMode: false,
    output: "standalone",
}

module.exports = nextConfig
