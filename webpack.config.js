const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");




module.exports = {
  entry: {
    Database: "./src/index/index.js",
    Space: "./src/space/index.js",
    Music: "./src/music/index.js",
    Shop: "./src/shop/index.js",
    Biologist: "./src/biologist/index.js",
    BiologistFire: "./src/biologistFire/index.js",   
    Lookbook: "./src/lookbook/index.js",
  },

  output: {
    // filename: "bundle.js",
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.(jpg|png|svg)$/i,
      //   loader: 'url-loader',
      //   options: {
      //     name: '[name].[ext]',
      //     outputPath: 'img/',
      //     publicPath: 'img/'
      //   }
      // },
      {
        test: /\.glsl$/,
        use: ["webpack-glsl-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(glb|gltf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "model/",
              publicPath: "model/",
            },
          },
        ],
      },

      {
        test: /\.(mp3|wav|wma|ogg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "asset/",
            publicPath: "asset/",
          },
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      // {
      //   test: /\.html$/i,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]'
      //       },
      //     },
      //   ],
      //   exclude: path.resolve(__dirname, 'src/index/preview.html')
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index/preview.html",
      chunks: ["Database"],
    }),
    new HtmlWebpackPlugin({
      filename: "space.html",
      template: "src/space/space.html",
      chunks: ["Video"],
    }),
    new HtmlWebpackPlugin({
      filename: "music.html",
      template: "src/music/music.html",
      chunks: ["Music"],
    }),
    new HtmlWebpackPlugin({
      filename: "shop.html",
      template: "src/shop/shop.html",
      chunks: ["Shop"],
    }),
    new HtmlWebpackPlugin({
      filename: "biologist.html",
      template: "src/biologist/biologist.html",
      chunks: ["Biologist"],
    }),
    new HtmlWebpackPlugin({
      filename: "biologistFire.html",
      template: "src/biologistFire/biologistFire.html",
      chunks: ["BiologistFire"],
    }),   
    new HtmlWebpackPlugin({
      filename: "lookbook.html",
      template: "src/lookbook/lookbook.html",
      chunks: ["Lookbook"],
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "src/img") }],
    }),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "src/videos") }],
    }),
  ],
};