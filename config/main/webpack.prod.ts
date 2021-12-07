const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "electron-main",
  entry: resolve(__dirname, "../../src/main/app.ts"),
  output: {
    path: resolve(__dirname, "../../dist/main"),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  mode: "production",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "@/*": resolve(__dirname, "../../src/renderer/src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
      {
        test: /preload\.ts$/i,
        loader: "file-loader",
        options: {
          name: "preload.js",
          output: resolve(__dirname, "../../dist/main"),
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: resolve(__dirname, "../../src/main/data"),
        to: resolve(__dirname, "../../dist/data"),
      },
      {
        from: resolve(__dirname, "../../src/main/preload.js"),
        to: resolve(__dirname, "../../dist/main/preload.js"),
      },
    ]),
  ],
};
