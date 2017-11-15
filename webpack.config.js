var HTMLWebpackPlugin = require('html-webpack-plugin'),
		ExtractTextPlugin = require('extract-text-webpack-plugin'),
		HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
			title: 'Trending Audio React',
			template: __dirname + '/src/index.html',
			filename: 'index.html',
			inject: 'body'
		}),
		ExtractTextPluginConfig  = new ExtractTextPlugin({
			filename: 'style.css',
			disable: false,
			allChunks: true
		});


module.exports = {
	entry: __dirname + '/src/js/index.js',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node-modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				})
			}
		]
	},
	output: {
		filename: 'app/index.js',
		path: __dirname + '/dist'
	},
	plugins: [HTMLWebpackPluginConfig, ExtractTextPluginConfig]
};