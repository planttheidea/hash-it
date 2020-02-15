import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

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
      uglify(),
    ],
  },
];
