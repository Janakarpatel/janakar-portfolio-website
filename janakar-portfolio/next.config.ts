/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // or configure specific rules
    // You can also fine-tune rules here if needed
    // For example, if you want to only warn for this specific rule:
    // rules: {
    //   "react/no-unescaped-entities": "warn",
    // },
  },
}

module.exports = nextConfig