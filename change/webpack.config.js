// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        'home': './src/index.js',
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
        alias: {
            vue: 'vue/dist/vue.js',
        },
        modules: [
            __dirname,
            'node_modules',
        ],
    },
    plugins: [
      
    ],
    devtool: 'source-map',
    externals: [],
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/motor/front_mis/*': {
                target: 'http://admin.bytedance.com',
                // target: 'http://10.11.40.72:9897',
                // target: 'http://10.11.40.72:9899',
                secure: false,
                changeOrigin: true
              },
              '/motor/tag/upload/*': {
                target: 'http://admin.bytedance.com',
                secure: false,
                changeOrigin: true
              }
        }
    }
};