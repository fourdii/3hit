const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');




module.exports = {
  entry: {
    'Database': './src/index/index.js',
    'Video': './src/video/index.js',
    'Music': './src/music/index.js',
    'Shop': './src/shop/index.js',
    'Biologist': './src/biologist/index.js',
    'Biologist2': './src/biologist2/index.js',
    'Biologist3': './src/biologist3/index.js',
    'Biologist4': './src/biologist4/index.js',
    'Biologist5': './src/biologist5/index.js',
    'Biologist6': './src/biologist6/index.js',
    'Biologist7': './src/biologist7/index.js',
    'Lookbook': './src/lookbook/index.js',
  },

  output: {
    // filename: "bundle.js",
    filename: '[name].js',
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.(png|jpe?g|gif)$/i,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //     },
      //   ],
      // },
      {
        test: /\.glsl$/,
        use: ["webpack-glsl-loader"]
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
              name: '[name].[ext]',
              outputPath: 'model/',
              publicPath: 'model/'
            }
          },
        ],
      },

      {
        test: /\.(mp3|wav|wma|ogg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'asset/',
            publicPath: 'asset/'
          }
        }
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
      filename: 'index.html',
      template: 'src/index/preview.html',
      chunks: ['Database']      
    }),
    new HtmlWebpackPlugin({     
      filename: 'video.html',
      template: 'src/video/video.html',
      chunks: ['Video']         
    }),
    new HtmlWebpackPlugin({     
      filename: 'music.html',
      template: 'src/music/music.html',
      chunks: ['Music']               
    }),
    new HtmlWebpackPlugin({     
      filename: 'shop.html',
      template: 'src/shop/shop.html',
      chunks: ['Shop']                     
    }),
    new HtmlWebpackPlugin({     
      filename: 'biologist.html',
      template: 'src/biologist/biologist.html',
      chunks: ['Biologist']                           
    }),
    new HtmlWebpackPlugin({     
      filename: 'biologist2.html',
      template: 'src/biologist2/biologist2.html',
      chunks: ['Biologist2']                           
    }),
    new HtmlWebpackPlugin({     
      filename: 'biologist3.html',
      template: 'src/biologist3/biologist3.html',
      chunks: ['Biologist3']                           
    }),
    new HtmlWebpackPlugin({     
      filename: 'biologist4.html',
      template: 'src/biologist4/biologist4.html',
      chunks: ['Biologist4']                           
    }),
    new HtmlWebpackPlugin({     
      filename: 'biologist5.html',
      template: 'src/biologist5/biologist5.html',
      chunks: ['Biologist5']                           
    }),
    new HtmlWebpackPlugin({     
      filename: 'biologist6.html',
      template: 'src/biologist6/biologist6.html',
      chunks: ['Biologist6']                           
    }),
    new HtmlWebpackPlugin({     
      filename: 'biologist7.html',
      template: 'src/biologist7/biologist7.html',
      chunks: ['Biologist7']                           
    }),
    new HtmlWebpackPlugin({     
      filename: 'lookbook.html',
      template: 'src/lookbook/lookbook.html',
      chunks: ['Lookbook']                                 
    }),
    new CleanWebpackPlugin(),
  ],
 
};