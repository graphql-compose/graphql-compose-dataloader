/**
 * This class makes shure functions with params only run once
 */
export default new class SingleContinous{

  constructor(props) {
    this.store = new Map()
    this.counter = 1
  }

  getHashKey (key){
    let object = {}
    Object.assign(object, 
      { args: key.args }, 
      { projection: key.projection || {} }, 
      { rawQuery: JSON.stringify(key.rawQuery || {}) }, 
      { context: JSON.stringify(key.context || {}) })
    let hash = JSON.stringify(object).split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
    return hash
  }

  run(loader, key, id, opt){
    let hashKey = id+this.getHashKey(key)
    // console.log(loader)
    if (!this.store.has(hashKey)){
      this.store.set(hashKey, 'running')
      setTimeout(() => {
        let res = loader.clear(key)
        this.store.delete(hashKey)
      },opt.cacheExpiration)
    }
  }

  clearAll(){
    this.store.clear()
    return true
  }
} 