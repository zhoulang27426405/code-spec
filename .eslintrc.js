module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'prettier', 'eslint:recommended'],
  plugins: ['prettier', 'vue'],
  rules: {
    'no-console': 0,
    eqeqeq: 2,
    'prettier/prettier': 1
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
