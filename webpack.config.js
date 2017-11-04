const CopyWebpackPlugin = require('copy-webpack-plugin'),
    webpack = require('webpack'),
    path = require('path'),
    isProduction = process.argv.indexOf('-p') !== -1

module.exports = [
    {
        target: 'node',
        entry: [
            path.join(__dirname, 'src', 'server.js'),
        ],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'server.js'
        },
        module: {
            loaders: [{
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'stage-2']
                }
            }]
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'src/static',
                    to: 'public'
                }
            ]),
            new webpack.DefinePlugin({
                'NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
            })
        ]
    },
    {
        entry: [
            path.join(__dirname, 'src', 'app.js')
        ],
        output: {
            path: path.join(__dirname, 'dist', 'public', 'js'),
            filename: 'app.js'
        },
        module: {
            loaders: [{
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'stage-2']
                }
            }]
        },
        plugins: [
            new webpack.DefinePlugin({
                'NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
            })
        ]
    }
]