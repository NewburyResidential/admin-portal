import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import babelParser from '@babel/eslint-parser';
import globals from 'globals';

export default [
  {
    ignores: [
      'build/**/*',
      'dist/**/*',
      'public/**/*',
      '**/out/**/*',
      '**/node_modules/**/*',
      '**/.next/**/*',
      'next.config.js',
      'vite.config.js',
      'vite.config.ts',
      'src/reportWebVitals.js',
      'src/service-worker.js',
      'src/serviceWorkerRegistration.js',
      'src/setupTests.js',
      'src/reportWebVitals.ts',
      'src/service-worker.ts',
      'src/serviceWorkerRegistration.ts',
      'src/setupTests.ts',
    ],
  },
  js.configs.recommended,
  prettier,
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        ecmaFeatures: {
          jsx: true,
        },
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        alias: {
          map: [['src', './src']],
          extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // Essential React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // Your custom overrides (only the ones you really need)
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off',
      'react/display-name': 'off', // Turn off display name requirement
      'no-console': 'off',
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrors: 'none', // This ignores unused catch parameters
        },
      ],
      'jsx-a11y/anchor-is-valid': 'off',
      'react/jsx-filename-extension': 'off',
      'react/jsx-props-no-spreading': 'off',
      'import/prefer-default-export': 'off',
      'react/function-component-definition': 'off',
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'react/no-array-index-key': 'warn',
      'react/require-default-props': 'off',
    },
  },
];
