const nextConfig = require('eslint-config-next/core-web-vitals')

module.exports = [
  ...nextConfig,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
]
