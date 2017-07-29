const path = require('path')
const webpack = require('webpack')

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development'
const PROD_ENV = NODE_ENV == 'production'

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './engine',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: PROD_ENV ? 'engine.min.js' : 'engine.js'
    },
    module: {
        rules: [{
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }
        }]
    },
    plugins: PROD_ENV ? [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV)
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin() 
    ] : []
}
