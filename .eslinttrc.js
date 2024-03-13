module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    rules: {
      // Additional rules or overrides
    },
  };