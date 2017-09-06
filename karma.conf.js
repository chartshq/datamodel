module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['mocha', 'chai'],
    files: [
      // 'dist/fusiontime.js',
      'test.webpack.js',
    ],
    webpack: {
      module: {
        loaders: [{
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015'],
          },
        }],
      },
    },

    preprocessors: {
      // add webpack as preprocessor
      // 'dist/fusiontime.js': ['webpack'],
      'test.webpack.js': ['webpack'],
    },
    exclude: [
      '**/*.swp',
    ],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
          { type: 'text' },
          { type: 'html', subdir: 'report-html', file: 'report.html' },
          { type: 'lcov', subdir: 'report-lcov', file: 'report.txt' },
      ],
    },
    reporters: ['spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity,
  });
};
