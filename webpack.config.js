const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');




module.exports = {
  entry: {
    Index: "./src/index/index.js",
    Database: "./src/database/index.js",
    Space: "./src/space/index.js",
    Music: "./src/music/index.js",
    Shop: "./src/shop/index.js",
    // Biologist: "./src/biologist/index.js",
    // BiologistFire: "./src/biologistFire/index.js",
    // BiologistGold: "./src/biologistGold/index.js",
    // BiologistWood: "./src/biologistWood/index.js",
    // BiologistAqua: "./src/biologistAqua/index.js",
    // BiologistDirt: "./src/biologistDirt/index.js",
    Lookbook: "./src/lookbook/js/index.js",
    // Biologist14: "./src/biologist14/index.js",
    Biologist15: "./src/biologist15/app/index.js",
    // Biologist16: "./src/biologist16/index.js",

  },

  output: {
    // filename: "bundle.js",
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      // {
      //   test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|fnt)$/i,
      //   exclude: /node_modules/,
      //   loader: 'file-loader',
      // },

      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|png|svg)$/i,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'img/',
          publicPath: 'img/'
        }
      },
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
      {
        test: /\.(vert|frag)$/i,
        use: "raw-loader",
      },

      //   {
      //     test: /\.ttf$/,
      //     use: [
      //       {
      //         loader: 'ttf-loader',
      //         options: {
      //           name: './font/[name].[ext]',
      //         },
      //       },
      //     ]
      // }
      // {
      //   test: /\.(woff|woff2|eot|ttf)$/,
      //   loader: "url-loader"
      // }

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
      template: "src/index/index.html",
      chunks: ["Index"],
    }),
    new HtmlWebpackPlugin({
      filename: "database.html",
      template: "src/database/database.html",
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
    // new HtmlWebpackPlugin({
    //   filename: "biologist.html",
    //   template: "src/biologist/biologist.html",
    //   chunks: ["Biologist"],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "biologistFire.html",
    //   template: "src/biologistFire/biologistFire.html",
    //   chunks: ["BiologistFire"],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "biologistGold.html",
    //   template: "src/biologistGold/biologistGold.html",
    //   chunks: ["BiologistGold"],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "biologistWood.html",
    //   template: "src/biologistWood/biologistWood.html",
    //   chunks: ["BiologistWood"],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "biologistAqua.html",
    //   template: "src/biologistAqua/biologistAqua.html",
    //   chunks: ["BiologistAqua"],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "biologistDirt.html",
    //   template: "src/biologistDirt/biologistDirt.html",
    //   chunks: ["BiologistDirt"],
    // }),
    new HtmlWebpackPlugin({
      filename: "lookbook.html",
      template: "src/lookbook/lookbook.html",
      chunks: ["Lookbook"],
    }),
    // new HtmlWebpackPlugin({
    //   filename: "biologist14.html",
    //   template: "src/biologist14/biologist14.html",
    //   chunks: ["Biologist14"],
    // }),
    new HtmlWebpackPlugin({
      filename: "biologist15.html",
      template: "src/biologist15/biologist15.html",
      chunks: ["Biologist15"],
    }),
    // new HtmlWebpackPlugin({
    //   filename: "biologist16.html",
    //   template: "src/biologist16/biologist16.html",
    //   chunks: ["Biologist16"],
    // }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "src/img") }],
    }),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "src/videos") }],
    }),
    new MiniCssExtractPlugin(),
  ],
};