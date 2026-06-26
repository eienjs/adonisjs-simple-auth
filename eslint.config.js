import eienjs from '@eienjs/eslint-config';

export default eienjs({
  adonisjs: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
    erasableSyntaxOnly: {
      parameterProperties: false,
    },
  },
}).append({
  rules: {
    'unicorn/no-this-outside-of-class': 'off',
    '@typescript-eslint/require-await': 'off',
  },
});
