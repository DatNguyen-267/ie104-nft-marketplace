const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let htmlPageNames = ["create", "explore", "connectWallet"];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/page/${name}/index.html`,
    filename: `${name}.html`,
    chunks: [`${name}`], // respective JS files
  });
});

let chunksRespective = () => {
  let entries = {};
  htmlPageNames.forEach((name) => {
    entries = {
      ...entries,
      [name]: path.resolve(__dirname, `src/page/${name}/script.js`),
    };
  });
  return entries;
};
module.exports = {
  entry: {
    app: path.resolve(__dirname, "src/app.js"),
    ...chunksRespective(),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "[name][ext]",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["app"],
    }),
    new MiniCssExtractPlugin(),
  ].concat(multipleHtmlPlugins),
  module: {
    rules: [
      {
        test: /\.tsx?$/, //includes .ts
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "imgs",
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
