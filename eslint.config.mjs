import next from '@next/eslint-plugin-next';

export default [
  {
    plugins: {
      '@next/next': next,
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
