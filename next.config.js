/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    // Handle Tauri API modules
    config.externals = [...(config.externals || []), {
      '@tauri-apps/api': '@tauri-apps/api'
    }];
    
    return config;
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;