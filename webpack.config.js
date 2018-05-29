const libraryName = 'DataTable';
const outFile = 'datatable.js';

module.exports = {
    entry: './src/index.js',
    output: {
        path: `${__dirname}/dist`,
        filename: outFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
            },
        }],
    },
    devServer: {
        inline: true,
        contentBase: './example',
    },
};
