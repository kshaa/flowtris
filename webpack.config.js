var path = require('path');

module.exports = {
    entry: './src/engine.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
