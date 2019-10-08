'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = function(context) {
  // console.log(context, 'context');
  context.plugins.push(new webpack.DefinePlugin({
    '$$dirname': '__dirname',
  }));

  // Add entrypoint for second renderer
  // context.entry.secondRenderer = ['./src/renderer/second-renderer.js'];
  // context.output.path = `${__dirname}/app/dist/main`;
  return context;
};
