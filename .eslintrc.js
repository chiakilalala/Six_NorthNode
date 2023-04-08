module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
    {
      files: ['**/*.test.js'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended']
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns: ['.env', 'node_modules/'],
  rules: {
    'no-unused-vars': 'off'
  }
}
