module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/build/'],
  moduleDirectories: ['node_modules', 'frontend/src', 'backend'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  setupFiles: [],
  testMatch: ['**/*.test.{ts,tsx}'],
  testURL: 'http://localhost/',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
