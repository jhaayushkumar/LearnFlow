/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongoose'],
  images: {
    domains: ['lh3.googleusercontent.com']
  }
}

module.exports = nextConfig