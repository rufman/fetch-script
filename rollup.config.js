import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const env = process.env.NODE_ENV;

const config = {
  input: 'src/index.js',
  plugins: [],
};

if (env === 'es' || env === 'cjs') {
  config.output = {
    exports: 'named',
    format: env,
    indent: false,
  };
  config.plugins.push(babel(), commonjs());
}

if (env === 'development' || env === 'production') {
  config.output = {
    exports: 'named',
    format: 'umd',
    indent: false,
    name: 'FetchScript',
  };
  config.plugins.push(
    nodeResolve({
      jsnext: true,
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
  );
}

if (env === 'production') {
  config.plugins.push(terser());
}

export default config;
