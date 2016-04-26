'use strict'

const tester = require('../ko-component-tester.js')
const expect = tester.expect
const $ = tester.$

describe('ko-component-tests', () => {
  describe('should', () => {
    it('is enabled', () => {
      Object.should.should.exist
    })
    it('handles should.equal', () => {
      'foo'.should.equal('foo')
    })
    it('handles should.not.equal', () => {
      'x'.should.not.equal('y')
    })
  })
  describe('expect', () => {
    it('is exported', () => {
      tester.expect.should.exist
    })
    it('handles to.equal', () => {
      expect('foo').to.equal('foo')
    })
    it('handles not.equal', () => {
      expect('x').not.equal('y')
    })
  })
  describe('chai-as-promised', () => {
    it('is enabled', () => {
      return Promise.resolve().should.be.fulfilled
    })
    it('handles should.eventually.equal', () => {
      return Promise.resolve('foo').should.eventually.equal('foo')
     })
    it('handles to.eventually.equal', () => {
      return expect(Promise.resolve('foo')).to.eventually.equal('foo')
    })
  })
  describe('chai-jquery', () => {
    it('is enabled', () => {
      $('<input checked />').should.be.checked.should.exist
    })
    it('handles should.have.class', () => {
      const $el = $('<div class="foo"></div>')
      $el.should.have.class('foo')
    })
    it('handles to.have.class', () => {
      const $el = $('<div class="foo"></div>')
      expect($el).to.have.class('foo')
    })
    it('handles \'then\' should.have.descendants', () => {
      function getHtml() {
        return new Promise( (resolve) => {
          setTimeout(() => {
            resolve($('<div><p></p></div>'))
          })
        })
      }
      return getHtml().then(($el) => $el.should.have.descendants('*'))
    })
  })
  describe('waitFor', () => {
    it('is exported', () => {
      expect(tester.waitFor).to.exist
    })
    it('requires a function', () => {
      (() => tester.waitFor('x')).should.throw(Error)
    })
    it('returns a promise', () => {
      tester.waitFor(() => true).then.should.exist
    })
    it('should timeout', () => {
      const timeout = 1 //ms
      tester.waitFor(() => false, timeout).should.be.rejected
    })
    it('should eventually resolve', () => {
      let condition = false
      setTimeout(() => condition=true, 2)
      return tester.waitFor(() => condition).should.eventually.be.true
    })
    it('should eventually have html descendants', () => {
      const $el = $('<div></div>')
      setTimeout(() => $el.append('<p></p>'), 2)
      return tester.waitFor(() => $el.find('*')).should.eventually.have.length.above(0)
    })
  })
})

module.exports = tester
