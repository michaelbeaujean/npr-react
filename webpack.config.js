var HTMLWebpackPlugin = require('html-webpack-plugin'),
		HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
			template: __dirname + '/src/index.html',
			filename: 'index.html',
			inject: 'body'
		});

module.exports = {
	entry: __dirname + '/src/js/app.js',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node-modules/,
				loader: 'babel-loader'
			}
		]
	},
	output: {
		filename: 'app.js',
		path: __dirname + '/dist/js'
	},
	plugins: [HTMLWebpackPluginConfig]
};