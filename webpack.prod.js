// const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin");
// var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  // optimization: {
  //   minimizer: [
  //     new OptimizeCssAssetsPlugin(),
  //     new TerserPlugin(),
  //     // new HtmlWebpackPlugin({
  //     //   template: "./src/index.html",
  //     //   minify: {
  //     //     removeAttributeQuotes: true,
  //     //     collapseWhitespace: true,
  //     //     removeComments: true,
  //     //   },
  //     // }),
  //   ],
  // },
});
