import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const copyClassicCss = {
  name: 'copy-classic-css',
  writeBundle() {
    mkdirSync('lib/templates', { recursive: true });
    writeFileSync('lib/templates/classic.css', readFileSync('src/templates/classic.css'));
  },
};

const createConfig = (input, file) => ({
  input,
  output: {
    file,
    format: 'cjs',
    exports: 'named',
  },
  plugins: [
    resolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
    }),
    commonjs(),
    terser(),
    copyClassicCss,
  ],
});

export default [
  createConfig('src/index.js', 'lib/index.js'),
  createConfig('src/headless/index.js', 'lib/headless.js'),
  createConfig('src/vanilla/index.js', 'lib/vanilla.js'),
  createConfig('src/alpine/index.js', 'lib/alpine.js'),
  createConfig('src/templates/tailwind.js', 'lib/templates/tailwind.js'),
];
