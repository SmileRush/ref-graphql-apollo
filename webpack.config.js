/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { IgnorePlugin } = require('webpack')

module.exports = {
  entry: './src/index.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },

  // entry에 명시된 파일과 연관된 모든 파일을,
  // output에서 path 위치에, filename으로 만들어준다.

  module: {
    rules: [
      {
        test: /\.ts$/, // regex.test : 일치하느냐~
        use: 'ts-loader', // use : 외부 loader를 사용하겠다
        exclude: /.yarn/,
      },
      {
        test: /\.txt/,
        type: 'asset/source', // type : 내장 loader를~
      },
      {
        test: /\.graphql/,
        type: 'asset/source', // type : 내장 loader를~
      },
    ],
  },
  plugins: [new IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
  resolve: {
    extensions: ['.ts', '.mjs', '.js'], // .mjs 옛날 버전과 호환성
  },

  mode: process.env.NODE_ENV,

  target: 'node',
  watch: process.env.NODE_ENV === 'development',
  watchOptions: {
    ignored: /.yarn/,
  },
}
