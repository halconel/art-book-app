module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/frontend/__tests__/setup.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/frontend/__tests__/**/*.test.js',
    '<rootDir>/frontend/__tests__/**/*.test.jsx',
  ],
  collectCoverageFrom: [
    'frontend/**/*.{js,jsx}',
    '!frontend/index.jsx',
    '!frontend/__tests__/**',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@mui/.*|recharts/.*|@testing-library/.*))',
  ],
};
