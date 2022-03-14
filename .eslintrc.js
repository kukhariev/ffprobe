module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true
  },

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'node',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './test/tsconfig.json'],
    warnOnUnsupportedTypeScriptVersion: false
  },
  plugins: ['@typescript-eslint']
};
