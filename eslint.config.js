import eienjs from '@eienjs/eslint-config';

export default eienjs({
  adonisjs: true,
  markdown: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
    erasableSyntaxOnly: {
      parameterProperties: false,
    },
  },
}).append({
  files: ['src/middleware/*.ts', 'src/define_config.ts', 'src/errors.ts'],
  rules: {
    '@typescript-eslint/require-await': 'off',
  },
});
