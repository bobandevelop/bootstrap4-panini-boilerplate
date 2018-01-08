var path = require('path')
var MinifyPlugin = require('babel-minify-webpack-plugin')

module.exports = {
	entry: "./src/scripts/App.js",
	output: {
		path: path.resolve(__dirname, "./dist/js"),
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				},
				test: /\.js$/,
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new MinifyPlugin()
	]
}