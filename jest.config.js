module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__tests__/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__tests__/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/$1'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '<rootDir>/__tests__/unit/**/*.test.{js,jsx}'
  ],
  collectCoverageFrom: [
    'app/_components/**/*.{js,jsx}',
    'app/_utils/**/*.{js,jsx}',
    'app/_config/**/*.{js,jsx}',
    '!app/_components/PropertyPanel.old.jsx'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
