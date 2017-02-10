import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import { TypeComposer, Resolver } from 'graphql-compose';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    nickname: {
      type: GraphQLString,
    },
  },
});

export const userTypeComposer = new TypeComposer(UserType);
userTypeComposer.setRecordIdFn(obj => obj.id);

export const findByIdResolver = new Resolver({
  name: 'findById',
  kind: 'query',
  type: UserType,
  args: {},
  resolve: (resolveParams) => Promise.resolve(null),
})
export const findByIdsResolver = new Resolver({
  name: 'findByIds',
  kind: 'query',
  type: UserType,
  args: {},
  resolve: (resolveParams) => Promise.resolve(null),
})
export const countResolver = new Resolver({
  name: 'count',
  kind: 'query',
  type: UserType,
  args: {},
  resolve: (resolveParams) => Promise.resolve(null),
})
export const findOneResolver = new Resolver({
  name: 'findOne',
  kind: 'query',
  type: UserType,
  args: {},
  resolve: (resolveParams) => Promise.resolve(null),
})
export const findManyResolver = new Resolver({
  name: 'findMany',
  kind: 'query',
  type: UserType,
  args: {},
  resolve: (resolveParams) => Promise.resolve(null),
})
export const connectionResolver = new Resolver({
  name: 'connection',
  kind: 'query',
  type: UserType,
  args: {},
  resolve: (resolveParams) => Promise.resolve(null),
})

userTypeComposer.setResolver('findById', findByIdResolver);
userTypeComposer.setResolver('findByIds', findByIdResolver);
userTypeComposer.setResolver('count', countResolver);
userTypeComposer.setResolver('findOne', findOneResolver);
userTypeComposer.setResolver('findMany', findManyResolver);
userTypeComposer.setResolver('connection', connectionResolver);
