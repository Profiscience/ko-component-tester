'use strict'

const ko = require('knockout')
const { expect } = require('chai')
const { renderHtml } = require('../ko-component-tester.js')

describe('waitForChildElement', () => {
  let $el

  before(() => {
    ko.options.deferUpdates = true
    $el = renderHtml({
      template: `
      <div>
        <div data-test="foo" data-bind="text: foo"></div>
      </div>`,
      viewModel: { foo: '' }
    })
  })

  after(() => {
    ko.options.deferUpdates = false
  })

  it('should work', () => {
    expect($el).to.exist
    expect($el.html()).contains('Hello, Foo!')
  })
})
