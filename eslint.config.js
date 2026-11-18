const eslint = require('@eslint/js');
const angular = require('angular-eslint');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    {
        ignores: ['projects/**/*'],
    },
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...angular.configs.tsRecommended,
            prettierRecommended,
        ],
        processor: angular.createProcessor(),
        rules: {
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'arig', style: 'camelCase' }],
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'arig', style: 'kebab-case' }],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@angular-eslint/prefer-inject': 'off',
        },
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended, prettierRecommended],
        rules: {
            '@angular-eslint/template/prefer-control-flow': 'off',
        },
    },
);
