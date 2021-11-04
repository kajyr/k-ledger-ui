const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const pkg = require("./package.json");

const isProduction = process.env.NODE_ENV === "production";
const mode = isProduction ? "production" : "development";

const frontendSrc = path.resolve(__dirname, "src");

const plugins = [
  new webpack.DefinePlugin({
    APP_VERSION: JSON.stringify(pkg.version),
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(frontendSrc, "index.html"),
    publicPath: "/",
  }),
];

module.exports = {
  mode,
  plugins,
  entry: {
    app: path.join(frontendSrc, "index.tsx"),
  },
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "..", "public"),
  },
  devtool: isProduction ? false : "eval-source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: [frontendSrc, "node_modules"],
    fallback: {
      timers: require.resolve("timers-browserify"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: "ts-loader",
      },
      {
        test: /\.(png|eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        type: "asset/resource",
      },
    ],
  },
};
