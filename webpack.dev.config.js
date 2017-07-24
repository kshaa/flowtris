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
                presets: ['react', 'es2015']
            }
        }]
    }
};

