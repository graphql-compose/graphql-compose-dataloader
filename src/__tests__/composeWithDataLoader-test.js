import { expect } from 'chai'
import { TypeComposer } from 'graphql-compose'
import { composeWithDataLoader } from '../composeWithDataLoader'
import { userTypeComposer } from '../__mocks__/userTypeComposer'


describe('composeWithDataLoader', () => {

  const userComposer = composeWithDataLoader(userTypeComposer)

  describe('basic checks', () => {
    it('should return TypeComposer', () => {
      expect(userComposer).instanceof(TypeComposer)
    })
  })
})
