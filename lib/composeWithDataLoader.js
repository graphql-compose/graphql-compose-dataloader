'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeWithDataLoader = composeWithDataLoader;

var _graphqlCompose = require('graphql-compose');

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _singleContinous = require('./singleContinous');

var _singleContinous2 = _interopRequireDefault(_singleContinous);

var _definitions = require('./definitions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function composeWithDataLoader(typeComposer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  // if (!(typeComposer instanceof TypeComposer)) {
  //   throw new Error('You should provide TypeComposer instance to composeWithDataLoader method');
  // }
  // 
  // 
  /**
   * Set defaults
   */
  options = {
    cacheExpiration: options.cacheExpiration || 300,
    removeProjection: options.removeProjection || true,
    debug: options.debug || false
  };

  /**
   * Add DataLoader to FindById
   */
  var findByIdResolver = typeComposer.getResolver('findById');
  var findByIdLoader = new _dataloader2.default(function (resolveParamsArray) {
    if (options.debug) console.log('New db request (findById)');
    var params = resolveParamsArray[0];

    return findByIdResolver.resolve(params).then(function (res) {
      return [res];
    });
  }, { cacheKeyFn: function cacheKeyFn(key) {
      return key.args._id.toString();
    } });

  typeComposer.setResolver('findById', findByIdResolver.wrapResolve(function (fn) {
    return function (rp) {
      if (options.removeProjection) delete rp.projection;
      _singleContinous2.default.run(findByIdLoader, rp, options);
      return findByIdLoader.load(rp);
    };
  }));

  /**
   * Add DataLoader to FindByIds
   */
  // let findByIdsResolver = typeComposer.getResolver('findByIds')
  // let findByIdsLoader = new DataLoader( (resolveParamsArray) => {
  //   if (options.debug) console.log('New db request (findByIds)')
  //   return findByIdResolver.resolve(resolveParamsArray[0]).then(res => [res])
  // },
  // { cacheKeyFn: key => {
  //   let hashKey = hash(key.args)
  //   return hashKey
  // } })

  // typeComposer.setResolver(
  //   'findByIds', 
  //   findByIdsResolver.wrapResolve(fn => rp => {
  //     SingleContinous.run(findByIdsLoader, rp, opt)
  //     return findByIdsLoader.load(rp)
  //   })
  // )


  /**
   * Add DataLoader to FindMany
   */
  // let findManyResolver = typeComposer.getResolver('findMany')
  // let findManyLoader = new DataLoader( (resolveParamsArray) => {
  //   if (options.debug) console.log('New db request (findMany)')
  //   console.log(resolveParamsArray[0])
  //   //response
  //   return findManyResolver.resolve(resolveParamsArray[0]).then(res => [res])
  // },
  // { cacheKeyFn: key => {
  //   let hashKey = hash(key.args)
  //   return hashKey
  // } })

  // typeComposer.setResolver(
  //   'findMany', 
  //   findManyResolver.wrapResolve(fn => rp => {
  //     if (options.removeProjection) delete rp.projection
  //     SingleContinous.run(findManyLoader, rp, options)
  //     return findManyLoader.load(rp)
  //   })
  // )


  /**
   * Add DataLoader to Connection
   */
  var connectionResolver = typeComposer.getResolver('connection');
  var connectionFieldNames = typeComposer.getFieldNames();
  var connectionLoader = new _dataloader2.default(function (resolveParamsArray) {
    if (options.debug) console.log('New db request (connection)');
    var params = resolveParamsArray[0];
    //response
    return connectionResolver.resolve(params).then(function (res) {
      return [res];
    });
  }, { cacheKeyFn: function cacheKeyFn(key) {
      var hashKey = (0, _objectHash2.default)(key.args);
      return hashKey;
    } });

  typeComposer.setResolver('connection', connectionResolver.wrapResolve(function (fn) {
    return function (rp) {
      if (options.removeProjection) {
        (function () {
          var projection = { edges: { node: {} } };
          connectionFieldNames.map(function (field) {
            return projection.edges.node[field] = true;
          });
          rp.projection = projection;
        })();
      }
      _singleContinous2.default.run(connectionLoader, rp, options);
      return connectionLoader.load(rp);
    };
  }));

  return typeComposer;
}