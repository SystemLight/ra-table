const ph = require("path");

const {CleanWebpackPlugin} = require('clean-webpack-plugin');


module.exports = (env, argv) => {
    let workEnv = argv.mode;

    return {
        mode: workEnv,
        target: "web",
        context: __dirname,
        resolve: {
            extensions: [".js", ".ts", ".jsx", ".tsx"]
        },
        entry: {
            "index": "./src/index.tsx",
            "formItem": "./src/formItem.tsx"
        },
        output: {
            filename: "[name].umd.js",
            path: ph.resolve(__dirname, "dist"),
            libraryTarget: 'umd2',
            globalObject: 'this'
        },
        externals: {
            "react": {
                root: "React",
                commonjs2: "react",
                commonjs: "react",
                amd: "react"
            },
            "react-highlight-words": {
                root: "Highlighter",
                commonjs2: "react-highlight-words",
                commonjs: "react-highlight-words",
                amd: "react-highlight-words"
            },
            "react-resizable": {
                root: "Resizable",
                commonjs2: "react-resizable",
                commonjs: "react-resizable",
                amd: "react-resizable"
            },
            "antd": {
                root: "antd",
                commonjs2: "antd",
                commonjs: "antd",
                amd: "antd"
            },
            "@ant-design/icons": {
                root: "@ant-design/icons",
                commonjs2: "@ant-design/icons",
                commonjs: "@ant-design/icons",
                amd: "@ant-design/icons"
            },
            "js-export-excel": {
                root: "ExportJsonExcell",
                commonjs2: "js-export-excel",
                commonjs: "js-export-excel",
                amd: "js-export-excel"
            }
        },
        module: {
            rules: [
                {
                    test: /\.less$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'style-loader!css-loader!less-loader'
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.tsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader!ts-loader'
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
        ]
    }
};
