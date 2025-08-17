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
    '<rootDir>/frontend/__tests__/**/*.js',
    '<rootDir>/frontend/__tests__/**/*.jsx',
  ],
  collectCoverageFrom: [
    'frontend/**/*.{js,jsx}',
    '!frontend/index.jsx',
    '!frontend/__tests__/**',
  ],
};
