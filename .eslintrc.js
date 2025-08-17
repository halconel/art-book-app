module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true, // Add Jest globals
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'jsx-a11y', 'prettier'],
  rules: {
    // Prettier
    'prettier/prettier': 'error',

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function' },
    ],

    // Import
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],

    // Общие правила
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-regex-literals': 'off', // Disable to avoid version compatibility issues

    // Global variables
    'no-undef': 'error',
    'no-shadow': 'error',

    // React specific
    'react/destructuring-assignment': 'off', // Allow non-destructuring assignments
    'react/no-deprecated': 'warn', // Warn about deprecated React methods

    // Import/Export
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/no-unresolved': 'off', // Disable for missing packages

    // Code style
    'default-param-last': 'off', // Allow default parameters anywhere
    'no-case-declarations': 'off', // Allow declarations in case blocks
    'global-require': 'off', // Allow require() anywhere
    'prefer-destructuring': 'off', // Allow non-destructuring assignments
    radix: 'off', // Allow parseInt without radix
    'arrow-body-style': 'off', // Allow arrow function bodies
    'one-var': 'off', // Allow multiple variable declarations
    'prefer-object-spread': 'off', // Allow Object.assign
    'no-redeclare': 'off', // Allow redeclaration of globals

    // React specific
    'react/no-unescaped-entities': 'off', // Allow unescaped quotes and apostrophes
    'react/button-has-type': 'off', // Allow buttons without explicit type
    'react/no-array-index-key': 'off', // Allow array index as key
    'react-hooks/exhaustive-deps': 'off', // Allow missing dependencies in useEffect
    'react/sort-comp': 'off', // Allow any order of class methods
    'class-methods-use-this': 'off', // Allow class methods that don't use 'this'
    'consistent-return': 'off', // Allow inconsistent return statements
    'no-restricted-globals': 'off', // Allow use of 'event' global
    camelcase: 'off', // Allow snake_case variables
    'no-else-return': 'off', // Allow else after return

    // Accessibility
    'jsx-a11y/click-events-have-key-events': 'off', // Allow click without keyboard events
    'jsx-a11y/no-static-element-interactions': 'off', // Allow static elements with interactions
    'jsx-a11y/alt-text': 'off', // Allow images without alt text
    'jsx-a11y/img-redundant-alt': 'off', // Allow redundant alt text

    // JSX
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
  },
  globals: {
    $: 'readonly', // jQuery
    analytics: 'readonly', // Analytics
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
