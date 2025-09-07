var path = require('path');
var webpack = require('webpack');

var plugins = []; // if using any plugins for both dev and production
var devPlugins = []; // if using any plugins for development

var prodPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
];

plugins = plugins.concat(
  process.env.NODE_ENV === 'production' ? prodPlugins : devPlugins
);

module.exports = {
  context: __dirname,
  entry: './frontend/index.jsx',
  output: {
    path: path.resolve(__dirname, 'app', 'assets', 'javascripts'),
    filename: process.env.NODE_ENV === 'production' ? '[name].[contenthash].js' : '[name].bundle.js',
    chunkFilename: process.env.NODE_ENV === 'production' ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
    clean: true,
  },
  plugins: plugins,
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        admin: {
          test: /[\\/]components[\\/]admin[\\/]/,
          name: 'admin',
          chunks: 'all',
          priority: 5,
        },
        client: {
          test: /[\\/]components[\\/]client[\\/]/,
          name: 'client',
          chunks: 'all',
          priority: 5,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 1,
        },
      },
    },
    usedExports: true,
    sideEffects: false,
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                api: 'modern-compiler',
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
    ],
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss', '*'],
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};
