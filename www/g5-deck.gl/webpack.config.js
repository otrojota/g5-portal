const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'g5-deck.gl.js',
        path: path.resolve(__dirname, 'dist')
    },    
    devtool: 'source-map',
    resolve: {
        fallback: {
            "path": require.resolve("path-browserify"),
            "fs": false
        }
    },
};