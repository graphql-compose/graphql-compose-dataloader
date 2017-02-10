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
    activate: true,
    cacheExpiration: options.cacheExpiration || 300,
    removeProjection: options.removeProjection || true,
    seperatedFindByIds: options.seperatedFindByIds || false,
    debug: options.debug || false,
  } 


  if(options.activate){

  /**
   * Add DataLoader to FindById
   */
  let findByIdResolver = typeComposer.getResolver('findById')
  let findByIdLoader = new DataLoader( (resolveParamsArray) => {
    if (options.debug) console.log('New db request (findById)')
    //response
    return findByIdResolver.resolve(resolveParamsArray[0]).then(res => [res])
  },
  { cacheKeyFn: key => {
    let newKey = getHashKey(key)
    return newKey
  } })

  typeComposer.setResolver( 'findById', 
    findByIdResolver.wrapResolve(next => rp => {
      if (options.removeProjection) delete rp.projection
      SingleContinous.run(findByIdLoader, rp, 'findById', options)
      return findByIdLoader.load(rp)
    })
  )


  /**
   * Add DataLoader to FindByIds
   */
  let findByIdsResolver = typeComposer.getResolver('findByIds')
  let findByIdsLoader = new DataLoader( (resolveParamsArray) => {
    if (options.debug) console.log('New db request (findByIds)')

    if (options.seperatedFindByIds){

    }else{
      return findByIdResolver.resolve(resolveParamsArray[0]).then(res => [res])
    }
  },
  { cacheKeyFn: key => getHashKey(key) })

  typeComposer.setResolver(
    'findByIds', 
    findByIdsResolver.wrapResolve(fn => rp => {
      SingleContinous.run(findByIdsLoader, rp, 'findByIds', options)
      return findByIdsLoader.load(rp)
    })
  )
  
  
  /**
   * Add DataLoader to Count
   */
  let countResolver = typeComposer.getResolver('count')
  let countLoader = new DataLoader( (resolveParamsArray) => {
    if (options.debug) console.log('New db request (count)')
    return countResolver.resolve(resolveParamsArray[0]).then(res => [res])
  },
  { cacheKeyFn: key => getHashKey(key) })

  typeComposer.setResolver(
    'count', 
    findByIdsResolver.wrapResolve(fn => rp => {
      SingleContinous.run(countLoader, rp, 'count', options)
      return countLoader.load(rp)
    })
  )
  
  
  /**
   * Add DataLoader to FindOne
   */
  let findOneResolver = typeComposer.getResolver('findOne')
  let findOneLoader = new DataLoader( (resolveParamsArray) => {
    if (options.debug) console.log('New db request (findOne)')
    return findOneResolver.resolve(resolveParamsArray[0]).then(res => [res])
  },
  { cacheKeyFn: key => getHashKey(key) })

  typeComposer.setResolver(
    'findOne', 
    findByIdsResolver.wrapResolve(fn => rp => {
      SingleContinous.run(findOneLoader, rp, 'findOne', options)
      return findOneLoader.load(rp)
    })
  )

  /**
   * Add DataLoader to FindMany
   */
  let findManyResolver = typeComposer.getResolver('findMany')
  let findManyLoader = new DataLoader( (resolveParamsArray) => {
    if (options.debug) console.log('New db request (findMany)')
    //response
    return findManyResolver.resolve(resolveParamsArray[0]).then(res => [res])
  },
  { cacheKeyFn: key => getHashKey(key)})

  typeComposer.setResolver(
    'findMany', 
    findManyResolver.wrapResolve(next => rp => {
      if (options.removeProjection) delete rp.projection
      SingleContinous.run(findManyLoader, rp, 'findMany', options)
      return findManyLoader.load(rp)
    })
  )


  /**
   * Add DataLoader to Connection
   */
  let connectionResolver = typeComposer.getResolver('connection')
  let connectionFieldNames = typeComposer.getFieldNames()
  let connectionLoader = new DataLoader( (resolveParamsArray) => {
    if (options.debug) console.log('New db request (connection)')
    //response
    return connectionResolver.resolve(resolveParamsArray[0]).then(res => [res])
  },
  { cacheKeyFn: key => getHashKey(key) })

  typeComposer.setResolver( 'connection', 
    connectionResolver.wrapResolve(next => rp => {
      if(options.removeProjection){
        let projection ={ edges: { node: {} } }
        connectionFieldNames.map( field => projection.edges.node[field] = true)
        rp.projection = projection
      }
      SingleContinous.run(connectionLoader, rp, 'connection', options)
      return connectionLoader.load(rp)
    })
  )
    
  }

  const getHashKey = key =>{
    let object = {}
    Object.assign(object, 
      { args: key.args }, 
      { projection: key.projection || {} }, 
      { rawQuery: JSON.stringify(key.rawQuery || {}) }, 
      { context: JSON.stringify(key.context || {}) })
    let hash = JSON.stringify(object).split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
    return hash
  }

  return typeComposer
}
