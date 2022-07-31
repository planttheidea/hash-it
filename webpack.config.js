/* eslint-disable @typescript-eslint/no-var-requires */

const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const ROOT = __dirname;
const PORT = 3000;

module.exports = {
  cache: true,

  devServer: {
    host: "localhost",
    port: PORT,
  },

  devtool: "source-map",

  entry: [path.resolve(ROOT, "DEV_ONLY", "index.tsx")],

  mode: "development",

  module: {
    rules: [
      {
        include: [path.resolve(ROOT, "src"), path.resolve(ROOT, "DEV_ONLY")],
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          presets: ["@babel/preset-react"],
        },
        test: /\.(js|ts|tsx)$/,
      },
    ],
  },

  output: {
    filename: "moize.js",
    library: "moize",
    libraryTarget: "umd",
    path: path.resolve(ROOT, "dist"),
    publicPath: `http://localhost:${PORT}/`,
    umdNamedDefine: true,
  },

  plugins: [
    new ESLintWebpackPlugin(),
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new HtmlWebpackPlugin(),
  ],

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
