"use strict";
var webpack = require("webpack");

var isProduction = process.env.NODE_ENV === "production";
console.log( isProduction ? "Production Mode" : "Development Mode");

var config = {};

config.output = {
    path: __dirname + "/dist/",
    filename: "bundle.js",
    publicPath: isProduction ? "http://localhost:8080/" : "http://localhost:8080/"
}

config.resolve = {
    extensions: ["", ".js", ".jsx"],
    root : __dirname,
    /*
     * We need to alias React because of how react-hot-loader
     * transforms modules to require react and react/lib/ReactMount
     */
    // alias: {
    //     react: __dirname + "/node_modules/react"
    // },
}

var cssLoader = isProduction ? "css-loader?module" : "css-loader?module&localIdentName=[path][name]---[local]---[hash:base64:5]"; 

config.module = { loaders: [
    { test: /\.scss$/, loaders: ["style", cssLoader, "sass"]},
    { test: /\.css$/, loaders: ["style", cssLoader ]},
    { test: /\.md$/, loaders:  ["html", "remarkable"]},
    { test: /\.html$/, loaders:  ["html"]},
    { test: /\.json$/, loaders: ["json"]},
    { test: /\.jsx?$/, loaders: isProduction ? ["babel?stage=0"] : ["react-hot", "babel?stage=0"] , exclude: /node_modules/},
    { test: /\.(png|jpg|jpeg|gif|svg)$/, loaders: ["url?limit=10000"]},
    { test: /\.(woff|woff2)$/, loaders: ["url?limit=100000"]},
    { test: /\.(ttf|eot)$/, loaders: ["file"]},
    { test: /\.(mp3|wav)$/, loaders: ["file"]}
]};

config.remarkable = {
    breaks: true,
    html: true
};


config.entry = isProduction
    ?
    "./app/entry.jsx"
    : 
    [ 
        "webpack-dev-server/client?http://localhost:8080",
        "webpack/hot/only-dev-server",
        "./app/entry.jsx"
    ];




config.plugins = isProduction
    ?
    [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin()
    ]
    : 
    [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ];

config.devtools = isProduction ? undefined : "source-map"


module.exports = config;
