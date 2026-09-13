module.exports = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/apps/gateway', '<rootDir>/services', '<rootDir>/packages'],
  testMatch: ['**/test/**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          isolatedModules: true,
          strict: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          esModuleInterop: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@ems/contracts$': '<rootDir>/packages/contracts/src/index.ts',
    '^@ems/shared$': '<rootDir>/packages/shared/src/index.ts',
  },
  collectCoverageFrom: [
    'apps/gateway/src/**/*.ts',
    'services/*/src/**/*.ts',
    '!**/generated/**',
    '!**/main.ts',
  ],
};
