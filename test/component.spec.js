'use strict'

const { renderComponent } = require('../ko-component-tester.js')
const { expect } = require('chai')

describe('component' , () => {
  let $el

  before(() => {
    $el = renderComponent({
      template: `<span data-bind="text: greeting"></span>`,
      viewModel: function() { this.greeting = 'Hello Component' }
    })
  })

  it('renders correctly', () => {
    expect($el).to.exist
    expect($el.html()).contains('Hello Component')
  })
})
