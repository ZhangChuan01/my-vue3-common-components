module.exports = {
  'env': {
    'node': true,
    'browser': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    // 'plugin:vue/vue3-essential',
    // 'stylelint-config-standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ],
  'overrides': [
  ],
  'parser': 'vue-eslint-parser',
  'parserOptions': {
    'parser': '@typescript-eslint/parser',
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'jsx': true,
    'extraFileExtensions': [ '.vue' ],
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'plugins': [
    'vue',
    '@typescript-eslint'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'semi': [
      'error',
      'never'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 1
      }
    ],
    'eqeqeq': [
      'error',
      'always'
    ],
    'space-infix-ops': [
      'error',
      {
        'int32Hint': true
      }
    ],
    'array-bracket-spacing': [
      'error',
      'always'
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'comma-dangle': [
      'error',
      'never'
    ],
    'key-spacing': [
      'error',
      {
        'afterColon': true
      }
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        'extendDefaults': true,
        'types': {
          '{}': false
        }
      }
    ],
    '@typescript-eslint/no-explicit-any': [ 'off' ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [ 'off' ],
    'no-undef': 0,
    'no-debugger': 'off',
    'vue/jsx-uses-vars': 'error', // 防止 JSX 变量被误判为未使用
    'react/jsx-uses-react': 'off', // 如果不需要 React 相关规则，直接关闭
    'react/jsx-uses-vars': 'off'
  }
}
