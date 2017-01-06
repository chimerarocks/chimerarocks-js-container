import Container from '../src/container'
var assert = require('chai').assert

describe('Build method tests', () => {
  describe('Can build services without dependencies', () => {
    it('assert it has 3 services at the end of build', () => {
      let container = new Container
      container.register('s1', '../test/stubs/s1')
      container.register('s2', '../test/stubs/s2')
      container.register('s3', '../test/stubs/s3')
      container.build()
      assert.lengthOf(container.services, 3, 'services length is equals 3')
      let services = [
        {name: 's1', service: {default: { name: 's1'}}},
        {name: 's2', service: {default: { name: 's2'}}},
        {name: 's3', service: {default: { name: 's3'}}}
      ]
      assert.deepEqual(container.services, services)
      let app = container.getter()
      assert.deepEqual(app('s1').default, {name: 's1'}, 'service s1 has name property s1')
      assert.deepEqual(app('s2').default, {name: 's2'}, 'service s2 has name property s2')
      assert.deepEqual(app('s3').default, {name: 's3'}, 'service s3 has name property s3')
    })
    it('assert it has 2 services at the end of build of 3, where one has not dependece resolved', () => {
      let container = new Container
      container.register('s1', '../test/stubs/s1')
      container.register('s2', '../test/stubs/s2')
      container.register('s3', '../test/stubs/s3', ['s4'])
      assert.throws(() => container.build(), Error, /The services: s3 has not resolution modules/)
    })
    it('assert it can resolve packages with dependencies', () => {
      let container = new Container
      container.register('s1', '../test/stubs/s1', ['s3'])
      container.register('s2', '../test/stubs/s2')
      container.register('s3', '../test/stubs/s3')
      container.build()
      assert.lengthOf(container.services, 3, 'services length is equals 3')
      let services = [
        {name: 's2', service: {default: { name: 's2'}}},
        {name: 's3', service: {default: { name: 's3'}}},
        {name: 's1', service: {default: { name: 's1'}}}
      ]
      assert.deepEqual(container.services, services)
    })
  })
})