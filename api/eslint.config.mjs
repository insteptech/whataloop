import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Keep the existing browser globals
        ...globals.node, // Add Node.js globals like `process`
      },
    },
  },
  pluginJs.configs.recommended,
];
