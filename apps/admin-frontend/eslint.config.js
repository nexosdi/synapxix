import angular from '@angular-eslint/eslint-plugin';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '**/server.ts', // 👈 fix real
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@angular-eslint': angular,
    },
    rules: {},
  },
];