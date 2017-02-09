import objectHash from 'object-hash'
import stringHash from 'string-hash'

/**
 * This class makes shure functions with params only run once
 */
export default new class SingleContinous{

  constructor(props) {
    this.store = new Map()
    this.counter = 1
  }

  run(loader, rp, opt){
    let hashKey = stringHash(JSON.stringify(loader)+JSON.stringify(rp))
    
    if (!this.store.has(hashKey)){
      this.store.set(hashKey, 'running')
      setTimeout(() => {
        let res = loader.clear(rp)
        this.store.delete(hashKey)
      },opt.cacheExpiration)
    }
  }

  clearAll(){
    this.store.clear()
    return true
  }
}