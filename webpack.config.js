const path = require('path');
// const indexHtml = path.join(__dirname, "index.html");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = env => {
    console.log("here is ENV " + JSON.stringify(env.NODE_ENV));
    return {
        // Webpack development server setup.
        devServer: {
            stats: "errors-only",
            contentBase: path.join(__dirname, 'dist'), // educate, Where to serve the file from. absolute path is prefered.
            compress: true, //enable the gzip.
            port: 5000, // Default to 8080.
            host: process.env.host, //defaault to localhost.
            clientLogLevel: "info", // manages log level: none, error, warning, info(default).
            open: true, //open the browser
            overlay: true, // to show the compilation error in browser.
        },

        // There are different devtool options. refer: https://survivejs.com/webpack/building/source-maps/
        // cheap-module-eval-source-map - This is recommmened option for development.
        devtool: "cheap-module-eval-source-map",

        entry: [
            "./src/js/index.js"
        ],

        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.[hash].js"
        },

        resolve: {
            modules: ['./', 'node_modules', 'src'],
            extensions: ['.js', '.html']
        },

        module: {
            loaders: [{
                    test: /\.html?$/,
                    use: [{
                        loader: "html-loader",
                        options: {
                            // attrs: ["script:src"],
                            interpolate: true
                        }
                    }]
                },
                {
                    test:/\.(png|jpeg|gif)?$/,
                    use:[{
                        loader:"file-loader",
                        options:{
                            name:'[name].[ext]',
                            outputPath:'img'
                        }
                    }]
                },
                // The below code works well with css file.
                // sass-loader - to resolve scss files to css.
                // css-loader - resolves css file imports to commonJs
                // style-loader - creates style node from CSS Js string.
                //To insall node-sass: sudo npm install --unsafe-perm -g node-sass
                {
                    test: /\.scss?$/,
                    use: ExtractTextPlugin.extract({
                        use: [{
                                loader: 'css-loader'
                            },
                            {
                                loader: 'sass-loader'
                            }
                        ],
                        fallback: "style-loader"
                    })
                },
                {
                    test: "/\.js?$/",
                    exclude: [
                        path.resolve(__dirname, "node_modules")
                    ],
                    loader: "babel-loader"
                }
            ]
        },

        plugins: [
            new CleanWebpackPlugin('dist'),
            new HtmlWebpackPlugin({
                hash: true,
                filename: 'index.html', // To give the custom file name
                template: './index.ejs', // This file will serve through our html loder. All the loader options (eg. minification) will be applied here.
                showErrors: true, // show the errors to console.
                environment: env.NODE_ENV || "test",
                inject: true // To inject the script tag.
            }),
            new ExtractTextPlugin('style.css')
        ]
    }
};