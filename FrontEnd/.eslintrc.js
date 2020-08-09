module.exports =  {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:compat/recommended',
    'plugin:react/recommended'
  ],
  env: {
    browser: true
  }
};
