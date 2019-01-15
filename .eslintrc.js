module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'prettier', 'eslint:recommended'],
  plugins: ['prettier', 'vue'],
  rules: {
    'no-console': 'off',
    'prettier/prettier': 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
