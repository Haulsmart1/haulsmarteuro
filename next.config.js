const path = require("path");

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"], // Ensures Next.js detects pages
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@components": path.join(__dirname, "src/components"),
      "@ui": path.join(__dirname, "src/components/ui"),
    };
    return config;
  },
};
