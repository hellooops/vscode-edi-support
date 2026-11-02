import eslint from "@eslint/js";
import prettier from "@vue/eslint-config-prettier/skip-formatting";
import { withVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import vue from "eslint-plugin-vue";
import globals from "globals";

export default withVueTs(
  {
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },
  eslint.configs.recommended,
  vue.configs["flat/essential"],
  vueTsConfigs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true }],
    },
  },
  prettier,
);
