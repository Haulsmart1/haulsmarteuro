const path = require("path");

module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}), // Ensure it doesn’t override other aliases
      "@components": path.join(__dirname, "src/components"),
      "@ui": path.join(__dirname, "src/components/ui"),
    };

    return config;
  },
};
