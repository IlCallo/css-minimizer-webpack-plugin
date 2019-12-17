const CssnanoPlugin = require('../src/index');
const { createCompiler, compile } = require('./helpers');

describe('when applied with "test" option', () => {
  jest.setTimeout(30000);
  let compiler;

  beforeEach(() => {
    compiler = createCompiler({
      entry: {
        bar1: `${__dirname}/fixtures/test/bar1.css`,
        bar2: `${__dirname}/fixtures/test/bar2.css`,
        foo: `${__dirname}/fixtures/test/foo.css`
      }
    });
  });

  it('matches snapshot with empty value', () => {
    new CssnanoPlugin().apply(compiler);

    return compile(compiler).then(stats => {
      expect(stats.compilation.errors).toEqual([]);
      expect(stats.compilation.warnings).toEqual([]);

      for (const file in stats.compilation.assets) {
        if (/\.js$/.test(file)) continue;
        expect(stats.compilation.assets[file].source()).toMatchSnapshot(file);
      }
    });
  });

  it('matches snapshot for a single "test" value (RegExp)', () => {
    new CssnanoPlugin({
      test: /bar.*\.css$/
    }).apply(compiler);

    return compile(compiler).then(stats => {
      expect(stats.compilation.errors).toEqual([]);
      expect(stats.compilation.warnings).toEqual([]);

      for (const file in stats.compilation.assets) {
        if (/\.js$/.test(file)) continue;
        expect(stats.compilation.assets[file].source()).toMatchSnapshot(file);
      }
    });
  });

  it('matches snapshot for multiple "test" value (RegExp)', () => {
    new CssnanoPlugin({
      test: [/bar1.*\.css$/, /bar2.*\.css$/]
    }).apply(compiler);

    return compile(compiler).then(stats => {
      expect(stats.compilation.errors).toEqual([]);
      expect(stats.compilation.warnings).toEqual([]);

      for (const file in stats.compilation.assets) {
        if (/\.js$/.test(file)) continue;
        expect(stats.compilation.assets[file].source()).toMatchSnapshot(file);
      }
    });
  });
});