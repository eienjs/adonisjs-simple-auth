// @ts-check
import nodecfdiConfig from '@nodecfdi/eslint-config';

const { defineConfig } = nodecfdiConfig(import.meta.dirname, { adonisjs: true, sonarjs: true, n: true });

export default defineConfig({
  files: ['src/plugins/**/*.ts'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off',
    'unicorn/consistent-function-scoping': 'off',
  },
});
