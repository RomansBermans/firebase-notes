module.exports = {
  root: true,
  extends: 'airbnb-base',
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'function-paren-newline': 'off',
    'global-require': 'off',
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'max-len': [ 'error', 240 ],
  }
}
