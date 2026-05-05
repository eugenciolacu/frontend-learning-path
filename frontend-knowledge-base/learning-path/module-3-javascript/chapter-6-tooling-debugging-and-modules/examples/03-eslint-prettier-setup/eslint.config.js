// eslint.config.js — ESLint flat config (ESLint v9+)
//
// This is the modern configuration format. Each object in the array
// is a "config block" that applies rules to matched files.

import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  // 1. Apply ESLint's built-in recommended rules as a baseline
  js.configs.recommended,

  // 2. Disable any ESLint formatting rules that conflict with Prettier
  //    This MUST come after js.configs.recommended.
  prettier,

  // 3. Your custom rules
  {
    // Apply to all JS files
    files: ["**/*.js"],

    rules: {
      // ---- Possible Errors ----
      "no-console": "warn",           // Warn on console.log (remove in production)
      "no-debugger": "error",         // Never commit debugger statements

      // ---- Best Practices ----
      "eqeqeq": ["error", "always"],  // Always use === instead of ==
      "curly": "error",               // Always use braces for if/for/while
      "no-var": "error",              // Disallow var — use let/const
      "prefer-const": "warn",         // Prefer const when variable is not reassigned
      "no-unused-vars": [             // Warn about variables declared but never used
        "warn",
        { "argsIgnorePattern": "^_" } // Allow args prefixed with _ to be unused
      ],

      // ---- Imports ----
      "no-duplicate-imports": "error", // Disallow importing the same module twice

      // ---- Style (non-formatting, left to ESLint) ----
      "prefer-template": "warn",      // Prefer template literals over string concat
      "object-shorthand": "warn",     // Prefer { x } over { x: x }
      "arrow-body-style": [           // Prefer arrow functions without braces for single expressions
        "warn",
        "as-needed"
      ],
    },
  },

  // 4. Relax rules for test files
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    rules: {
      "no-console": "off", // Allow console in tests
    },
  },
];
