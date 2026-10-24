export default {
  displayName: 'server',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/server',
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 20,
      functions: 25,
      lines: 30,
    },
  },
};
