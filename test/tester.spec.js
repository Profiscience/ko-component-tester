// 'use strict'
//
// const $ = require('jquery')
// const ko = require('knockout')
// const { expect } = require('chai')
// // const sinon = require('sinon')
// const { renderHtml } = require('../ko-component-tester.js')
//
// describe('waitForChildElement', () => {
//   let $el
//
//   before(() => {
//     ko.options.deferUpdates = true
//     $el = renderHtml({
//       template: `
//       <div>
//         <div data-test="foo" data-bind="text: foo"></div>
//       </div>`,
//       viewModel: { foo: '' }
//     })
//   })
//
//   after(() => {
//     ko.options.deferUpdates = false
//   })
//
//   it('should work', () => {
//     expect($el).to.exist
//     expect($el.html()).contains('Hello, Foo!')
//   })
//
//   // it('should eventually resolve', () => {
//   //   let condition = false
//   //   setTimeout(() => condition=true, 2)
//   //   return tester.waitFor(() => condition).should.eventually.be.true
//   // })
//   //
//   // it('should eventually have html descendants', () => {
//   //   const $el = $('<div></div>')
//   //   setTimeout(() => $el.append('<p></p>'), 2)
//   //   return tester.waitFor(() => $el.find('*')).should.eventually.have.length.above(0)
//   // })
// })
