import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The name is in scope but declared further down, so reading it throws
    // ReferenceError at runtime (temporal dead zone). This took the web app
    // down twice in October and neither `next build` nor tsc reports it.
    // The TypeScript-aware variant is used because the base rule mis-reports
    // type and enum references. `variables: false` keeps the dangerous
    // same-scope case while ignoring references from nested functions, which
    // only run after initialisation.
    rules: {
      '@typescript-eslint/no-use-before-define': ['error', { variables: false, functions: false, classes: false, enums: false, typedefs: false, ignoreTypeReferences: true }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
