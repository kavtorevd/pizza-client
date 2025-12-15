module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'sort-destructure-keys',
    'sort-keys-fix',
    'simple-import-sort',
    'unused-imports',
    'no-relative-import-paths',
  ],
  ignorePatterns: ['.eslintrc.js', '.vscode/**', 'public/**'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'arrow-body-style': 'warn',
    'arrow-parens': ['warn', 'always'],
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg', '.webp', '.json'],
      },
    ],
    'import/extensions': [
      'error',
      'never',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        svg: 'always',
        webp: 'always',
        json: 'always',
      },
    ],
    'import/no-extraneous-dependencies': ['warn', { devDependencies: true }],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'jsx-quotes': [1, 'prefer-double'],
    'no-extra-semi': 'off',
    'no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1, -1],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
      },
    ],
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { allowSameFolder: true, rootDir: 'src' },
    ],
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': [2, 2],
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'warn',
    'react/self-closing-comp': ['warn', { component: true, html: true }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-destructure-keys/sort-destructure-keys': 'warn',
    'sort-keys-fix/sort-keys-fix': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'react/prop-types': 'off',
  },
};
