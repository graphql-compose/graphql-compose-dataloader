import DataLoader from 'dataloader'
import hash from 'object-hash'
import SingleContinous from './singleContinous'


export const wrapFindById = function (tc, opt){
  let resolver = tc.getResolver('findById')
  let loader = new DataLoader( (resolveParamsArray) => 
    new Promise( (resolve, reject) => {
      if (opt.debug) console.log('New db request (findById)')
      let params = resolveParamsArray[0]
      delete params.projection;
      let res = resolver.resolve(params)
      resolve([res])
    }),
  { cacheKeyFn: key => key.args._id.toString() })

  tc.setResolver(
    'findById', 
    resolver.wrapResolve(fn => rp => {
      SingleContinous.run(loader, rp, opt)
      return loader.load(rp)
    })
  )
  return tc
}

// export const wrapFindByIds = function (tc, opt){
//   let resolver = tc.getResolver('findByIds')
//   let loader = new DataLoader( (resolveParamsArray) => 
//     new Promise( (resolve, reject) => {
//       if (opt.debug) console.log('New db request (findByIds)')
//       let params = resolveParamsArray[0]
//       params.args._ids = resolveParamsArray.map(params => params.args._id)
//       delete params.projection;
//       let res = resolver.resolve(params)
//       resolve([res])
//     }),
//   { cacheKeyFn: key => key.args._id.toString() })

//   tc.setResolver(
//     'findByIds', 
//     resolver.wrapResolve(fn => rp => {
//       SingleContinous.run(loader, rp, opt)
//       return loader.load(rp)
//     })
//   )
//   return tc
// }

// export const wrapConnection = function (tc, opt){
//   let resolver = tc.getResolver('connection')
//   let loader = new DataLoader( (resolveParamsArray) => 
//     new Promise( async (resolve, reject) => {
//       console.log('resolveParamsArray')
//       console.log(resolveParamsArray[0].rawQuery._id)
//       if (opt.debug) console.log('New db request (connection)')
//       let params = resolveParamsArray[0]
//       delete params.projection;
//       let res = await resolver.resolve(params)
//       console.log(res)
//       console.log(res.edges[0].node)
//       resolve([res])
//     }),
//   { cacheKeyFn: key => {
//     let hashKey = hash(key.args)
//     return hashKey
//   } })

//   tc.setResolver(
//     'connection', 
//     resolver.wrapResolve(fn => rp => {
//       SingleContinous.run(loader, rp, opt)
//       return loader.load(rp)
//     })
//   )
//   return tc
// }

// export const wrapFindMany = function (tc, opt){
//   let resolver = tc.getResolver('findMany')
//   let loader = new DataLoader( (resolveParamsArray) => 
//     new Promise( (resolve, reject) => {
//       if (opt.debug) console.log('New db request (findMany)')
//       let params = resolveParamsArray[0]
//       delete params.projection;
//       let res = resolver.resolve(params)
//       resolve(res)
//     }),
//   { cacheKeyFn: key => {
//     let hashKey = hash(key.args)
//     return hashKey
//   } })

//   tc.setResolver(
//     'findMany', 
//     resolver.wrapResolve(fn => rp => {
//       SingleContinous.run(loader, rp, opt)
//       return loader.load(rp)
//     })
//   )
//   return tc
// }
