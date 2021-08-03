const path = require('path');

module.exports = {
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [/*{
                    loader: 'expose-loader',
                    options: 'Library'
                }, */{
                    loader: 'ts-loader'
                }],
                //use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'wbv.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
