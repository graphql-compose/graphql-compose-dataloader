import { TypeComposer } from 'graphql-compose'
import DataLoader from 'dataloader'
import {
  wrapFindById,
  wrapFindByIds,
  wrapConnection,
  wrapFindMany,
} from './resolvers'

import {
  dataloaderOptions
} from './definitions'

export function composeWithDataLoader(
  typeComposer: TypeComposer,
  options: dataloaderOptions = {}
): TypeComposer {


  // if (!(typeComposer instanceof TypeComposer)) {
  //   throw new Error('You should provide TypeComposer instance to composeWithDataLoader method');
  // }

  /**
   * get resolvers to add DataLoader to
   */
  typeComposer = wrapFindById(typeComposer, options)
  typeComposer = wrapFindByIds(typeComposer, options)
  typeComposer = wrapFindMany(typeComposer, options)
  typeComposer = wrapConnection(typeComposer, options)

  return typeComposer
}
