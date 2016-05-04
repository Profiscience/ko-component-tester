'use strict'

const { renderComponent } = require('../src')
const { expect } = require('chai')

describe('renderComponent' , () => {
  it('works with elements', () => {
    const $el = renderComponent({
      template: `<span data-bind="text: greeting"></span>`,
      viewModel: function() { this.greeting = 'Hello Component' }
    })

    expect($el).to.exist
    expect($el.html()).contains('Hello Component')
  })

  it('works with text nodes', () => {
    const $el = renderComponent({
      template: `
        Hello Component
      `
    })

    expect($el).to.exist
    expect($el.html()).contains('Hello Component')
  })

})
