let webpack = require('webpack');
let path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "src/client/index.js"),
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: "[name].js",
        //配置按需加载[chunkhash:5]
        chunkFilename: '[name].trunk.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "es2015",
                            "stage-0",
                        ],
                        plugins: ['transform-runtime']
                    }
                }],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
}
