/** @type {import('next').NextConfig} */
require('next-ws/server').verifyPatch();

const nextConfig = {
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig
