/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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