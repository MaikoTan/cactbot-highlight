import js from '@eslint/js'
import globals from 'globals'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  {
    ignores: [
      'dist/**',
      'out/**',
      'node_modules/**',
      '3rdparty/**',
      'crowdin-i18n/**',
      'i18n/**',
      '*.config.ts',
      '*.config.mjs',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
        languageOptions: {
          ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      globals: {
              ...globals.node,
              ...globals.mocha,
            },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...importPlugin.flatConfigs.typescript.rules,

      // Formatting is fully owned by eslint-plugin-prettier / `yarn format`.
            '@typescript-eslint/naming-convention': 'warn',

            'prettier/prettier': 'error',

            curly: 'warn',
            eqeqeq: 'warn',
            'no-throw-literal': 'warn',
            'no-trailing-spaces': 'error',
    },
  },
  ]