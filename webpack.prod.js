// const path = require("path");
const common = require('./webpack.common')
const { merge } = require('webpack-merge')

// const CleanWebpackPlugin = require("clean-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'node_vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
        styles: {
          name: false,
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
})
