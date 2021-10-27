/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require("path");
const { existsSync } = require("fs");
const tsNameof = require("ts-nameof");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

/** @type {import("webpack").Configuration} */
const Default = {
  context: __dirname,
  entry: "./src/index.ts",
  target: "node",
  resolve: {
    extensions: [".js", ".ts", ".json"],
  },
  externals: [nodeExternals()],
  devtool: "source-map",
  output: {
    path: join(__dirname, "dist"),
    chunkFilename: "[name].bundle.js",
    filename: "[name].js",
    assetModuleFilename: "resources/[name]-[hash][ext]",
    clean: true,
  },
  mode: process.env.NODE_ENV || "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({ before: [tsNameof] }),
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  watchOptions: {
    ignored: "**/node_modules",
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: "./src/**/*.ts",
      },
    }),
    new CopyWebpackPlugin({
      patterns: ["LICENSE", "package.json"].concat(existsSync("./.env") ? [".env"] : []),
    }),
  ],
};

module.exports = Default;
