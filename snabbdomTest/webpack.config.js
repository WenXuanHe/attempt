var webpack = require('webpack');
var path = require("path");

module.exports = {
    entry: {
        index:path.resolve(__dirname, "src/index.js"),
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: "[name].js",
        sourceMapFilename: '[file].map',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, 'public/src/js')],
                exclude: /node_modules/,
                query: {
                    "presets":
                    [
                        "es2015",
                        "stage-0"
                    ],
                    plugins: ['transform-runtime']
                }
            }
        ]
    },
    devtool: 'source-map'
}
