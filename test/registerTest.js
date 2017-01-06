import Container from '../src/container'
var assert = require('chai').assert

describe('Register method tests', () => {
  describe('Can register two services', () => {
    it('assert it has two services registereds', () => {
      let container = new Container
      container.register('s1', 's1')
      container.register('s2', 's2')
      assert.lengthOf(container.registeredServices, 2)
    })
    it('assert it throws an Error when they have a same name', () => {
      let container = new Container
      container.register('s1', 's2')
      assert.throws(() => container.register('s1', 'appservice'), Error)
    })
  })
})