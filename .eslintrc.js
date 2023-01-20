module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'plugin:jest/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jest'],
  rules: {
    radix: 0,
    'no-prototype-builtins': 0,
    'no-plusplus': 0,
    'no-minusminus': 0,
    'import/prefer-default-export': 0,
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-shadow': 0,
    'no-restricted-syntax': 0,
    'no-break': 0,
    'guard-for-in': 0,
    'no-continue': 0,
    'no-param-reassign': 0,
    'max-len': 0,
    'react/function-component-definition': 0,
    'react/react-in-jsx-scope': 0,
    // allow jsx syntax in js files (for next.js project)
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }], // should add ".ts" if typescript project
    'react/no-unstable-nested-components': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
