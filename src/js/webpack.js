import backgroundImage from './assets/images/index-bg.jpg';

const backgroundStyle = {
  backgroundImage: `url(${backgroundImage})`,
};
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
