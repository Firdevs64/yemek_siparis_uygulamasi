module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off'
  },
  env: {
    browser: true,
    es6: true,
    node: true
  }
};
