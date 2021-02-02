const webpack = require("webpack");
const path = require("path");
require("dotenv").config();
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "public"),
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(s*)css$/,
        use: [
          isDevelopment ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "./public"),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: [".js", ".scss", "jsx"],
  },
};
