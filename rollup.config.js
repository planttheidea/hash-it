import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/hash-it.js',
      format: 'umd',
      name: 'hashIt',
      sourcemap: true,
    },
    plugins: [
      resolve({
        mainFields: ['module', 'main'],
      }),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/hash-it.min.js',
      format: 'umd',
      name: 'hashIt',
    },
    plugins: [
      resolve({
        mainFields: ['module', 'main'],
      }),
      babel({
        exclude: 'node_modules/**',
      }),
      terser(),
    ],
  },
];
