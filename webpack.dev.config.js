const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

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
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
}
]

