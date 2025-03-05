import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ["node_modules/", "dist/"], // Ignore unnecessary files
    languageOptions: {
      globals: globals.node, // Use Node.js globals instead of browser
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      js: pluginJs,
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  },
  pluginJs.configs.recommended,
];