import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended"), {
    plugins: {},

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
            ...globals.browser,
        },

        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
                modules: true,
                spread: true,
                restParams: true,
            },
        },
    },

    rules: {
        "no-trailing-spaces": ["error", {
            skipBlankLines: true,
        }],

        "no-unused-vars": ["error", {
            args: "none",
        }],

        "comma-spacing": ["error", {
            before: false,
            after: true,
        }],

        "no-console": 0,

        "key-spacing": ["error", {
            beforeColon: false,
        }],
    },
}];