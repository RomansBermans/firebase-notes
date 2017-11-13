module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'function-paren-newline': 'off',
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'max-len': [ 'error', 240 ],
    'no-undef': 'off',
    'no-unused-expressions': 'off',
  }
}
