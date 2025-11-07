module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
  moduleNameMapper: {
    '^chalk$': '<rootDir>/src/__tests__/__mocks__/chalk.ts',
    '^inquirer$': '<rootDir>/src/__tests__/__mocks__/inquirer.ts',
    '^figlet$': '<rootDir>/src/__tests__/__mocks__/figlet.ts',
  },
};
