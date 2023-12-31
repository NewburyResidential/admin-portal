const path = require('path');

module.exports = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  trailingSlash: true,
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.resolve.alias['@components'] = path.join(__dirname, 'src/components');

    return config;
  },
};
