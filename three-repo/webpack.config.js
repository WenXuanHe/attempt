// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
    mode: 'development',
    entry: {
      // Set the single-spa config as the project entry point
        'index': 'src/index.js',
        'test': 'src/index.test.js',
        'hemisphereLight': 'src/hemisphereLight.js',
        'first': 'src/first.js',
    },
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
          {
            // Webpack style loader added so we can use materialize
              test: /\.css$/,
              use: ['style-loader', 'css-loader']
          },
          {
            test: /\.inflate\.min\.js$/,
            loader: 'script-loader'
          },
          {
            test: /\.js$/,
            exclude: [path.resolve(__dirname, 'node_modules')],
            loader: 'babel-loader',
          },
            {
              // This plugin will allow us to use html templates when we get to the angularJS app
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader',
            },
        ],
    },
    node: {
        fs: 'empty'
    },
    resolve: {
        modules: [
            __dirname,
            'node_modules',
        ],
    },
    plugins: [
      // A webpack plugin to remove/clean the build folder(s) before building
        new CleanWebpackPlugin(['dist']),
    ],
    devtool: 'source-map',
    externals: [],
    devServer: {
        historyApiFallback: true,
    }
})