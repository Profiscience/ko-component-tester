const tester = require('../ko-component-tester.js')
const expect = tester.expect
//const $ = tester.expect
// const chai = require('chai')
// const chaiAsPromised = require('chai-as-promised')
// //console.log(chaiAsPromised)
// chai.use(chaiAsPromised)

describe('ko-component-tests', () => {
  describe('expect', () => {
    it('should be exported', () => {
        expect(tester.expect).to.exist
    })
    it('should handle chai assertions', () => {
        expect('foo').to.equal('foo')
    })
    it('should handle promises', (done) => {
      Promise.resolve('foo').then( (val) => {
        expect(val).to.equal('foo')
        done()
      })
    })
    // it('should handle chai-as-promised extentions', () => {
    //     return Promise.resolve('foo').to.eventually.equal('foo')
    // })
    // it('should include chai-jquery extensions', (done) => {
    //     return Promise.resolve('foo').to.eventually.equal('foo')
    // })
  })
  describe('waitFor', () => {
    it('should be exported', () => {
        expect(tester.waitFor).to.exist
    })
  })
})

module.exports = tester
