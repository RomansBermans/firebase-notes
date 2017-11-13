module.exports = {
  root: true,
  env: {
    mocha: true,
  },
  extends: 'airbnb-base',
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': 'off',
    'function-paren-newline': 'off',
    'global-require': 'off',
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'max-len': [ 'error', 240 ],
    'no-undef': 'off',
    'no-unused-expressions': 'off',
  }
}
