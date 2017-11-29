module.exports = {
  env: {
    browser: true,
    mocha: true,
  },
  rules: {
    'global-require': 'off',
    'no-unused-expressions': 'off',
  },
  globals: {
    chai: true,
    config: true,
    firebase: true,
    helper: true,
  },
};
