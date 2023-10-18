const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs.promises');
const mode = process.env.NODE_ENV || 'development'; 

const devMode = mode === 'development';

const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
    mode,
    target,
    devtool,
    devServer: {
        port: 3000,
        open: true,
    },
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
    output: {
       path: path.resolve(__dirname, 'dist'),
       clean: true,
       filename: '[name].[contenthash].js',
       assetModuleFilename: 'assets/[name][ext]'

    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.pug'),
        }),
        new MiniCssExtractPlugin({
           filename: '[name].[contenthash].css',
        }),
        new CopyPlugin({
          patterns: [
            { 
              from: 'src/assets',
              to: 'assets'
          },
    ],
  }),
],
    module: {
        rules: [
        {
        test: /\.pug$/,
        loader: 'pug-loader',
        },
        {
        test: /\.(c|sa|sc)ss$/i,
              use: [ 
               devMode ? "style-loader" : MiniCssExtractPlugin.loader,
               "css-loader",
               "sass-loader"
            ],
            },
            {
              test: /\.(jpe?g|png|webp|gif|svg)$/i,
              use: [
                {
                  loader: 'image-webpack-loader',
                  options: {
                    mozjpeg: {
                      progressive: true,
                    },
                    // optipng.enabled: false will disable optipng
                    optipng: {
                      enabled: false,
                    },
                    pngquant: {
                      quality: [0.65, 0.90],
                      speed: 4
                    },
                    gifsicle: {
                      interlaced: false,
                    },
                    // the webp option will enable WEBP
                    webp: {
                      quality: 75
                    }
                  }
                }
              ],
              type: 'asset/resource',
            },
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            }
           

        ]
    }
}