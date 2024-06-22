module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', 'simple-import-sort', 'prettier', 'import'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off', // Disable prefix requirement for interfaces
    '@typescript-eslint/explicit-function-return-type': 'off', // Disable explicit return type requirement for functions
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable explicit return types for public functions and methods
    '@typescript-eslint/no-explicit-any': 'off', // Allow the use of 'any' type (use sparingly)
    'simple-import-sort/imports': 'error', // Enforce import sorting with `eslint-plugin-simple-import-sort`
    'simple-import-sort/exports': 'error', // Enforce export sorting with `eslint-plugin-simple-import-sort`
    'import/order': 'off', // Disable conflicting rule with `eslint-plugin-simple-import-sort`
    'prettier/prettier': 'error', // Enforce Prettier's formatting rules
    'unused-imports/no-unused-imports': 'error', // Enforce no unused imports
    'unused-imports/no-unused-vars': [
      // Enforce no unused variables, with exceptions for variables starting with '_'
      'error',
      {
        argsIgnorePattern: '^_', // Ignore variables starting with '_'
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      // Warn about inconsistent usage of type imports
      'warn',
      {
        disallowTypeAnnotations: false, // Allow type annotations
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true, // Ignore unused variables when rest siblings are present
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'warn', // Warn about non-null assertions
    '@typescript-eslint/prefer-readonly': 'error', // Enforce readonly modifier for variables wherever possible
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array-simple', // Use array shorthand
      },
    ],
    '@typescript-eslint/consistent-type-definitions': [
      'error',
      'interface', // Enforce consistent use of interface over type
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts', // Allow dev dependencies in test files
          '**/*.spec.ts',
          'test/*.ts',
        ],
      },
    ],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'], // Allow console.warn and console.error
      },
    ],
  },
};
