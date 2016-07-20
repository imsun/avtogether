var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
	context: path.join(__dirname, 'src'),
	entry: [
		'./index.jsx'
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
	output: {
		path: 'dist',
		filename: 'bundle.js',
		publicPath: '/dist/'
	},
	resolve: {
		alias: {
			'react': path.join(__dirname, 'node_modules', 'react')
		},
		extensions: ['', '.js', '.jsx'],
		packageAlias: 'browser'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loaders: ['react-hot', 'babel']
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css!autoprefixer')
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!less')
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			},
			{
				test: /\.gif/,
				loader: "url-loader?limit=10000&mimetype=image/gif"
			},
			{
				test: /\.jpg/,
				loader: "url-loader?limit=10000&mimetype=image/jpg"
			},
			{
				test: /\.png/,
				loader: "url-loader?limit=10000&mimetype=image/png"
			}
		]
	},
	devServer: {
		port: '8080',
		contentBase: "./",
		hot: true,
		inline: true,
		historyApiFallback: {
			index: './index.html'
		}
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin("bundle.css", {allChunks: true})
	]
}
