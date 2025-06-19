/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Disable Webpack filesystem cache (can help avoid memory allocation errors)
  webpack: (config) => {
    config.cache = false;

    // Optional: add rule for large assets like PDFs
    config.module.rules.push({
      test: /\.(pdf|mp4|mov|zip|png|jpg|jpeg)$/,
      type: 'asset/resource',
    });

    return config;
  },

  // Optional: enable production source maps for debugging
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
