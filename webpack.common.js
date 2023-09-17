const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let htmlPageNames = ["create", "explore", "connectWallet"];
let htmlLayouts = ["header"];

let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/page/${name}/index.html`,
    filename: `${name}.html`,
    chunks: [`${name}`], // respective JS files
  });
});
let multipleHtmlLayoutPlugins = htmlLayouts.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/layout/${name}/index.html`,
    filename: `${name}.html`,
    chunks: [`${name}`], // respective JS files
  });
});

let chunksRespective = () => {
  let entries = {};
  htmlPageNames.forEach((name) => {
    entries = {
      ...entries,
      [name]: path.resolve(__dirname, `src/page/${name}/main.ts`),
    };
  });
  return entries;
};
let chunksRespectiveLayout = () => {
  let entries = {};
  htmlLayouts.forEach((name) => {
    entries = {
      ...entries,
      [name]: path.resolve(__dirname, `src/layout/${name}/main.ts`),
    };
  });
  return entries;
};
module.exports = {
  entry: {
    app: path.resolve(__dirname, "src/page/app.ts"),
    ...chunksRespective(),
    // ...chunksRespectiveLayout(),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "[name][ext]",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/page/index.html",
      filename: "index.html",
      chunks: ["app"],
    }),
    new MiniCssExtractPlugin(),
  ].concat(multipleHtmlPlugins),
  // .concat(multipleHtmlLayoutPlugins),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
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
        test: /\.json$/,
        loader: "json-loader",
      },
    ],
  },
};
