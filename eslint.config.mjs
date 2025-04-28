import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable the rule for unescaped entities in JSX
      "react/no-unescaped-entities": "off",
      // Make the exhaustive-deps rule a warning instead of error
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];

export default eslintConfig;
