/** @type {import('next').NextConfig} */
const nextConfig = {
    // uuid >= 12 is ESM-only; transpile it so Jest (CommonJS) can load it
    transpilePackages: ["uuid"],
};

module.exports = nextConfig;
