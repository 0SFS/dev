import js from "@eslint/js";
import tseslint from "typescript-eslint";
export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended,
  { files: ["tests/installed/*.mjs"], languageOptions: { globals: { process: "readonly", console: "readonly" } } });
