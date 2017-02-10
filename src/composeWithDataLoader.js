import { TypeComposer } from 'graphql-compose'
import DataLoader from 'dataloader'
import hash from 'object-hash'
import SingleContinous from './singleContinous'

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
  // 
  // 
  /**
   * Set defaults
   */
  options ={
    cacheExpiration: options.cacheExpiration || 300,
    removeProjection: options.removeProjection || true,
    debug: options.debug || false,
  } 

  /**
   * Add DataLoader to FindById
   */
  let findByIdResolver = typeComposer.getResolver('findById')
  let findByIdLoader = new DataLoader( (resolveParamsArray) => {
    if (options.debug) console.log('New db request (findById)')
    let params = resolveParamsArray[0]

    return findByIdResolver.resolve(params).then(res => [res])
  },
  { cacheKeyFn: key => key.args._id.toString() })

  typeComposer.setResolver( 'findById', 
    findByIdResolver.wrapResolve(fn => rp => {
      if (options.removeProjection) delete rp.projection
      SingleContinous.run(findByIdLoader, rp, options)
      return findByIdLoader.load(rp)
    })
  )



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
  let connectionResolver = typeComposer.getResolver('connection')
  let connectionFieldNames = typeComposer.getFieldNames()
  let connectionLoader = new DataLoader( (resolveParamsArray) => {
    if (options.debug) console.log('New db request (connection)')
    let params = resolveParamsArray[0]
    //response
    return connectionResolver.resolve(params).then(res => [res])
  },
  { cacheKeyFn: key => {
    let hashKey = hash(key.args)
    return hashKey
  } })

  typeComposer.setResolver( 'connection', 
    connectionResolver.wrapResolve(fn => rp => {
      if(options.removeProjection){
        let projection ={ edges: { node: {} } }
        connectionFieldNames.map( field => projection.edges.node[field] = true)
        rp.projection = projection
      }
      SingleContinous.run(connectionLoader, rp, options)
      return connectionLoader.load(rp)
    })
  )



  return typeComposer
}
