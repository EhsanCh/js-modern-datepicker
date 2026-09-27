module.exports = {
  verbose: true,
  testMatch: ['<rootDir>/test/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
