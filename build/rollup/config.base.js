import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import tsc from 'typescript';
import { fileURLToPath } from 'url';
import pkg from '../packageJson.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];
const globals = external.reduce((globals, name) => {
  globals[name] = name;

  return globals;
}, {});

export default {
  external,
  input: path.resolve(ROOT, 'src', 'index.ts'),
  output: {
    exports: 'named',
    globals,
    name: 'hash-it',
    sourcemap: true,
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    nodeResolve({
      mainFields: ['module', 'browser', 'main'],
    }),
    commonjs({ include: /use-sync-external-store/ }),
    typescript({
      tsconfig: path.resolve(ROOT, 'build', 'tsconfig', 'base.json'),
      typescript: tsc,
    }),
  ],
};
