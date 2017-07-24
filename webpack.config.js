const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'src', 'client.js'),
    output: {
        path: path.join(__dirname, 'src', 'static', 'js'),
        filename: 'client.js'
    },
    module: {
        loaders: [{
            test: path.join(__dirname, 'src'),
            loader: 'babel-loader',
            query: {
                cacheDirectory: 'babel_cache',
                presets: ['react', 'es2015']
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            sourcemap: false,
            mangle: true,
            beautify: false,
            dead_code: true
        })
    ]
};

