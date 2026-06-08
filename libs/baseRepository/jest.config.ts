export default {
  displayName: 'baseRepository',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  // Required: this library has no test files yet. Without this flag,
  // Jest fails with "no tests found" and breaks the CI pipeline.
  passWithNoTests: true,
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/baseRepository',
};
