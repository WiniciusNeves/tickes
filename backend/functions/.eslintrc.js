module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "arrow-parens": ["error", "always"],
    "new-cap": "off",
    "no-console": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "no-undef": "off",
    "no-unused-expressions": "off",
    "max-len": "off",
    "object-curly-spacing": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
