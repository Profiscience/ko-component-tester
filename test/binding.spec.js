'use strict'

const { renderHtml } = require('../ko-component-tester.js')
const { expect } = require('chai')

describe('binding' , () => {
  let $el

  before(() => {
    $el = renderHtml({
      template: `<div data-bind="text: greeting"></div>`,
      viewModel: { greeting: 'Hello Text Binding'}
    })
  })

  it('renders correctly', () => {
    expect($el).to.exist
    expect($el.html()).equals('Hello Text Binding')
  })
})
