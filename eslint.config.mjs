import nx from "@nx/eslint-plugin";
import stylistic from "@stylistic/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import unicorn from "eslint-plugin-unicorn";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  ...nx.configs["flat/react"],
  {
    ignores: [
      "**/dist",
      "**/vite.config.*.timestamp*",
      "**/vitest.config.*.timestamp*",
      "**/test-output",
    ],
  },
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.js",
      "**/*.jsx",
    ],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [
            String.raw`^.*/eslint(\.base)?\.config\.[cm]?js$`,
          ],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: [
                "*",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
    ],
    // Override or add rules here
    rules: {},
  },
  unicorn.configs.recommended,
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "no-console": "warn",
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "unicorn/prevent-abbreviations": "off",
      "perfectionist/sort-imports": [
        "error",
      ],
      "unicorn/no-null": "off",
      "unicorn/prefer-module": "off",
    },
    ignores: ["README.md", "CHANGELOG.md", "LICENSE", ".vscode", "dist", "build"],
  },
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: true,
    jsx: true,
  }),
];
