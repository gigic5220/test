module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    "indent": [
      "error",
      2
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-trailing-spaces": 0,
    "keyword-spacing": 0,
    "no-unused-vars": 1,
    "no-multiple-empty-lines": 0,
    "space-before-function-paren": 0,
    "eol-last": 0,
    "object-curly-spacing": 0
  }
}
