const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "../../src/main/app.ts"),
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "@/*": path.resolve(__dirname, '../../src/renderer/src')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
};
