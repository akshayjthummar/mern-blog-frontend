module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "18.2",
    },
  },
  plugins: ["react-refresh"],
  rules: {
    "react/prop-types": "off",
    "no-unused-vars": "warn",
    // "no-useless-escape": "off",
    // "no-undef": "off",
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      {
        allowConstantExport: true,
      },
    ],
    "no-console": "off",
    "react/jsx-uses-react": "error", // Enable automatic import of React
    "react/jsx-uses-vars": "error", // Enable automatic import of variables used in JSX
  },
};
