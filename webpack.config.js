//@ts-check

"use strict";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/**@type {import('webpack').Configuration}*/
const config = {
  target: "node",
  mode: "production",

  entry: "./src/extension.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader",
        options: {
          plugins: [
            ["module-resolver", {
              "root": ["./src"],
              "alias": {
                "cactbot": "./3rdparty/cactbot",
              },
            }],
          ],
          presets: [
            ["@babel/preset-typescript"],
          ],
        },
      }],
    }],
  },
};

module.exports = config;
