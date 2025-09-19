/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // IMPORTANT: Enable static export for HostGator
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    domains: [
      'github.com',
      'raw.githubusercontent.com',
      'avatars.githubusercontent.com',
      'mcphubz.com'
    ],
  },
  // Remove trailing slashes for HostGator
  trailingSlash: false,
  // Base path if hosted in subdirectory (leave empty for root)
  basePath: '',
  env: {
    NEXT_PUBLIC_APP_URL: 'https://mcphubz.com',
    NEXT_PUBLIC_API_URL: 'https://mcphubz.com/api',
  },
};

module.exports = nextConfig;