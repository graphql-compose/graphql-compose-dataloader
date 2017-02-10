'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; (0, _defineProperty2.default)(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _stringHash = require('string-hash');

var _stringHash2 = _interopRequireDefault(_stringHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class makes shure functions with params only run once
 */
exports.default = new (function () {
  function SingleContinous(props) {
    _classCallCheck(this, SingleContinous);

    this.store = new _map2.default();
    this.counter = 1;
  }

  _createClass(SingleContinous, [{
    key: 'run',
    value: function run(loader, rp, opt) {
      var _this = this;

      var hashKey = (0, _stringHash2.default)((0, _stringify2.default)(loader) + (0, _stringify2.default)(rp));

      if (!this.store.has(hashKey)) {
        this.store.set(hashKey, 'running');
        setTimeout(function () {
          var res = loader.clear(rp);
          _this.store.delete(hashKey);
        }, opt.cacheExpiration);
      }
    }
  }, {
    key: 'clearAll',
    value: function clearAll() {
      this.store.clear();
      return true;
    }
  }]);

  return SingleContinous;
}())();