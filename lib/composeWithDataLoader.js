'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeWithDataLoader = composeWithDataLoader;

var _graphqlCompose = require('graphql-compose');

function composeWithDataLoader(typeComposer) {

  if (!(typeComposer instanceof _graphqlCompose.TypeComposer)) {
    throw new Error('You should provide TypeComposer instance to composeWithDataLoader method');
  }

  /**
   * get resolvers to add DataLoader to
   */
  var count = typeComposer.get('$count');
  var findById = typeComposer.get('$findById');
  var findByIds = typeComposer.get('$findByIds');
  var findMany = typeComposer.get('$findMany');
  var findOne = typeComposer.get('$findOne');
  console.log(typeComposer.getTypeName());

  if (!findById) throw new Error('TypeComposer(' + typeComposer.getTypeName() + ') provided to composeWithRelay ' + 'should have findById resolver.');
  if (!findById) throw new Error('TypeComposer(' + typeComposer.getTypeName() + ') provided to composeWithRelay ' + 'should have findById resolver.');
  if (!findByIds) throw new Error('TypeComposer(' + typeComposer.getTypeName() + ') provided to composeWithRelay ' + 'should have findByIds resolver.');
  if (!findMany) throw new Error('TypeComposer(' + typeComposer.getTypeName() + ') provided to composeWithRelay ' + 'should have findMany resolver.');
  if (!findOne) throw new Error('TypeComposer(' + typeComposer.getTypeName() + ') provided to composeWithRelay ' + 'should have findOne resolver.');

  return typeComposer;
}