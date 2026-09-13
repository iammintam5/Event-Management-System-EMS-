import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/src/generated/**',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals.map((config) => ({
    ...config,
    files: ['apps/web/**/*.{ts,tsx,js,mjs}'],
    settings: { ...config.settings, next: { rootDir: 'apps/web/' } },
  })),
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        AbortSignal: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    settings: { next: { rootDir: 'apps/web/' } },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@ems/contracts',
            '@nestjs/*',
            '@prisma/*',
            'nats',
            '@nats-io/*',
            '**/services/*/src/**',
            '**/*-service/**',
            '@ems/*-service',
          ],
        },
      ],
    },
  },
  {
    files: ['apps/gateway/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['@prisma/*', '**/services/*/src/**', '**/*-service/**', '@ems/*-service'] },
      ],
    },
  },
  {
    files: ['services/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['@ems/*-service', '**/*-service/**', '**/services/*/src/**', '**/apps/**'] },
      ],
    },
  },
  prettier,
];
