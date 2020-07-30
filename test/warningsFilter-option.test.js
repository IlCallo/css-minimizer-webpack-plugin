import postcss from 'postcss';

import CssnanoPlugin from '../src/index';

import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readAssets,
  removeCache,
} from './helpers';

describe('warningsFilter option', () => {
  beforeEach(() => Promise.all([removeCache()]));

  afterEach(() => Promise.all([removeCache()]));

  it('should match snapshot for a "function" value', async () => {
    const plugin = postcss.plugin('warning-plugin', () => (css, result) => {
      result.warn(`Warning from ${result.opts.from}`, {
        plugin: 'warning-plugin',
      });
    });

    const compiler = getCompiler({
      entry: {
        foo: `${__dirname}/fixtures/test/foo.css`,
        bar1: `${__dirname}/fixtures/test/bar1.css`,
        bar2: `${__dirname}/fixtures/test/bar2.css`,
      },
    });

    new CssnanoPlugin({
      parallel: false,
      minify: (data) => {
        return postcss([plugin])
          .process(data.input, data.postcssOptions)
          .then((result) => {
            return {
              css: result.css,
              map: result.map,
              error: result.error,
              warnings: result.warnings(),
            };
          });
      },
      warningsFilter(warning) {
        if (/foo/.test(warning.text)) {
          return false;
        }

        return true;
      },
    }).apply(compiler);

    const stats = await compile(compiler);

    expect(readAssets(compiler, stats, '.css')).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });
});