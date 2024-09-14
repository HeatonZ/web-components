import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"

export default [
  {
    ignores: [
      "build/*",
      "config/*",
      "dist/*",
      "public/*",
      "src/assets/*",
      "src/external/*",
      ".vscode/*",
      ".idea/*",
      ".git/v",
    ],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    rules: {
      semi: ["error", "never"],
    },
  },
  {
    files: ["**/*.{ts,vue}"],
    rules: {
      'no-undef': 'off'
    },
  },
]
