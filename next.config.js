/** @type {import('next').NextConfig} */
const nextConfig = {
    // ESM-only packages; transpile them so Jest (CommonJS) can load them
    transpilePackages: ["uuid", "@faker-js/faker"],
};

module.exports = nextConfig;
