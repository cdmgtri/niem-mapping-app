
module.exports = {
  "presets": [
    '@vue/app',
    [
      "@babel/env",
      {
        "useBuiltIns": "entry",
        corejs: 2
      }
    ]
  ],
};
