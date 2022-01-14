
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProd = process.env.NODE_ENV = 'production';

const universalPlugins = [
    new MiniCssExtractPlugin({
        filename: !isProd ? '[name].css' : '[name].[hash].css',
    }),
    new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
    }),
];

const pluginsForProduction = [
    new CleanWebpackPlugin(),
    new CopyPlugin({
        patterns: [
            {
                from: "./static/images/public",
                to: "./static/images/public",
            },
            {
                from: "./static/images/icons",
                to: "./static/images/icons",
                filter: async (resourcePath) => {
                    return !/favicon\.ico/.test(resourcePath)
                },
            },
            {
                from: "./static/images/icons/favicon.ico",
                to: "./",
            },
            {
                from: "./browserconfig.xml",
                to: "./",
            },
            {
                from: "./manifest.json",
                to: "./",
            },
        ],
    }),
];

const pluginsForDevelopment = [
    new webpack.HotModuleReplacementPlugin()
]

const PATHS = {
    entry: ['./src/js/index.js', './src/scss/index.scss'],
    build: 'build/',
}

const config = {
    entry: PATHS.entry,
    output: {
        path: path.resolve(__dirname, PATHS.build),
        filename: !isProd ? '[name].js' : '[name].[hash].js',
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        compress: true,
        overlay: true,
        hot: true,
        historyApiFallback: true,
        port: 8080,
        open: 'chrome',
        watchContentBase: true,
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.scss$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'postcss-loader',
                            'sass-loader',
                        ],
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ["@babel/preset-env"],
                                plugins: ["@babel/plugin-proposal-class-properties"]
                            }
                        }
                    },
                    {
                        test: /\.(svg|jpe?g|png|woff|woff2|ttf)$/i,
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[contenthash].[ext]',
                            outputPath: (fileName) => {

                                if (/\.(svg|jpe?g|png)/.test(fileName)) {
                                    return `static/images/${fileName}`;
                                }

                                if (/\.(woff|woff2|ttf)/.test(fileName)) {
                                    return `static/fonts/${fileName}`;
                                }

                                return `./${fileName}`
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.scss'],
        alias: {
            Scss: path.resolve(__dirname, 'src/scss/'),
            Images: path.resolve(__dirname, 'static/images'),
            Fonts: path.resolve(__dirname, 'static/fonts/')
        },
    },
    stats: {
        builtAt: false,
        children: false,
        colors: true,
        hash: false,
        publicPath: false,
    },
    plugins: universalPlugins.concat(isProd ? pluginsForProduction : pluginsForDevelopment)
};

module.exports = config;
