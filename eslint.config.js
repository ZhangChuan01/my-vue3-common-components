// eslint.config.js
import eslint_js from '@eslint/js'
import eslint_ts from 'typescript-eslint'
import eslint_vue from 'eslint-plugin-vue'
import vue_parser from 'vue-eslint-parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
export default eslint_ts.config(
  {
    ignores: [
      'node_modules',
      'dist',
      'public'
    ]
  },
  eslint_js.configs.recommended,
  ...eslint_ts.configs.recommended,
  ...eslint_vue.configs['flat/recommended'],

  // 为使用ts的vue指定parser
  {
    files: [ '**/*.vue' ],
    languageOptions: {
      parser: vue_parser,
      parserOptions: {
        sourceType: 'module',
        parser: eslint_ts.parser,
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    rules: {
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
      '@typescript-eslint/no-explicit-any': [ 'off' ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [ 'off' ],
      'no-undef': 0,
      'no-debugger': 'off',
      '@typescript-eslint/no-this-alias': [ 'off' ]
    }
  }
)
