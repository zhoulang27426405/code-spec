module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'standard', 'plugin:prettier/recommended'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    eqeqeq: 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
