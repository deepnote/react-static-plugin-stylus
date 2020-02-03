"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extractCssChunksWebpackPlugin = _interopRequireDefault(require("extract-css-chunks-webpack-plugin"));

var _autoprefixer = _interopRequireDefault(require("autoprefixer"));

var _postcssFlexbugsFixes = _interopRequireDefault(require("postcss-flexbugs-fixes"));

var _semver = _interopRequireDefault(require("semver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _default = function _default(_ref) {
  var _ref$cssLoaderOptions = _ref.cssLoaderOptions,
      cssLoaderOptions = _ref$cssLoaderOptions === void 0 ? {} : _ref$cssLoaderOptions,
      rest = _objectWithoutProperties(_ref, ["cssLoaderOptions"]);

  return {
    webpack: function webpack(config, _ref2) {
      var stage = _ref2.stage;
      var loaders = [];

      var stylusLoaderPath = require.resolve('stylus-loader');

      var stylusLoader = {
        loader: stylusLoaderPath,
        options: _objectSpread({
          use: [require('nib')()]
        }, rest)
      };
      var cssLoader = {
        loader: 'css-loader',
        options: _objectSpread({
          importLoaders: 1,
          sourceMap: false
        }, cssLoaderOptions)
      };
      var postCssLoader = {
        loader: 'postcss-loader',
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          sourceMap: true,
          ident: 'postcss',
          plugins: function plugins() {
            return [_postcssFlexbugsFixes["default"], (0, _autoprefixer["default"])({
              flexbox: 'no-2009'
            })];
          }
        }
      };

      if (stage === 'dev') {
        // Dev
        loaders = [_extractCssChunksWebpackPlugin["default"].loader, cssLoader, postCssLoader, stylusLoader];
      } else if (stage === 'node') {
        // Node
        // Don't extract css to file during node build process
        loaders = [cssLoader, postCssLoader, stylusLoader];
      } else {
        // Prod
        // for legacy css-loader version (<2.0) we need to add "minimize" to minify css code
        // for >2.0 it is handled with https://github.com/NMFR/optimize-css-assets-webpack-plugin
        var cssLoaderVersion = require('css-loader/package.json').version;

        if (_semver["default"].satisfies(cssLoaderVersion, '<2') === true) {
          cssLoader.options.minimize = true;
        }

        loaders = [_extractCssChunksWebpackPlugin["default"].loader, cssLoader, postCssLoader, stylusLoader];
      }

      config.module.rules[0].oneOf.unshift({
        test: /\.styl$/,
        use: loaders
      });
      return config;
    }
  };
};

exports["default"] = _default;