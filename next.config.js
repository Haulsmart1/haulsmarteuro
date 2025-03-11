const path = require("path");

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    appDir: true, // Ensures compatibility with "src/" as root
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@components": path.join(__dirname, "src/components"),
      "@ui": path.join(__dirname, "src/components/ui"),
    };
    return config;
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"], // Ensures Next.js detects pages in src/
};
