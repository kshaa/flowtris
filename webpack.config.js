const CopyWebpackPlugin = require('copy-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack'),
    path = require('path'),
    isProduction = process.argv.indexOf('-p') !== -1

module.exports = [
    { // Server
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
                    from: 'src/index.html',
                    to: 'public'
                }
            ]),
            new webpack.DefinePlugin({
                'NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
            })
        ]
    },
    { // Application
        entry: [
            path.join(__dirname, 'src', 'app.js'),
            path.join(__dirname, 'src', 'styles', 'main.scss')
        ],
        output: {
            path: path.join(__dirname, 'dist', 'public', 'js'),
            filename: 'app.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'stage-2']
                        }
                    }
                },
                {
                    test: /\.(sass|scss)$/,
                    loader: ExtractTextPlugin.extract([
                        'css-loader',
                        'sass-loader'
                    ])
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
            }),
            new ExtractTextPlugin({
                filename: '..//styles/[name].css',
                allChunks: true
            })
        ]
    }
]