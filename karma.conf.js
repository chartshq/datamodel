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
        rules: [
          // instrument only testing sources with Istanbul
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              query: {
                presets: ['es2015'],
              },
            },
            exclude: /node_modules/,
          },
          {
            test: /\.js$|\.jsx$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
            enforce: 'post',
            exclude: /node_modules|\.spec\.js$/,
          }
        ],
        // loaders: [{
        //   loader: 'babel-loader',
        //   query: {
        //     presets: ['es2015'],
        //   },
        // }],
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

    coverageIstanbulReporter: {
      dir: 'coverage/',

      reports: [ 'text-summary' ],
      fixWebpackSourcePaths: true,
      reporters: [
        { type: 'text' },
        { type: 'html', subdir: 'report-html', file: 'report.html' },
        { type: 'lcov', subdir: 'report-lcov', file: 'report.txt' },
      ],
    },

    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity,
  });
};
