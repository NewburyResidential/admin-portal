const path = require('path');

module.exports = {
  headers: () => [
    {
      source: '/dashboard/credit-cards/*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
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