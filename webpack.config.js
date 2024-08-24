const { join } = require('path');
const path = require('path');
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let mode = process.env.NODE_ENV || 'development';

const devMode = mode === 'development'

const target = devMode ? 'web' : 'browserslist'

const getPath = (dirname) => {
    const distPath = join(dirname, 'dist')
    const srcPath = join(dirname, 'src')

    return {
        entry: join(srcPath, 'index.tsx'),
        dist: distPath,
        template: join(srcPath, 'index.html')
    }
}

const { dist, entry, template } = getPath(__dirname)

module.exports = {
    mode,
    target,
    devServer: {
        port: 5050,
        open: true,
        // hot: true
    },
    entry,
    output: {
        path: dist,
        filename: '[name].[contenthash].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: template
        }),
        new webpack.ProgressPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    /** style --> css --> scss */
                    devMode ? 'style-loader' : MiniCssExtractPlugin,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: !!devMode
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: !!devMode
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".*", ".tsx", ".ts", '.scss']
    }
}