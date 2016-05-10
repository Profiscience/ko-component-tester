'use strict'

const ko = require('knockout')
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

  it('should clean up after itself in the case of failure', () => {
    try {
      renderComponent({ template: '<div data-bind="text: iDontExist">' })
    } catch (e) {
      // do nothing
    }

    const $el = renderComponent({
      template: `
        Hello Component
      `
    })

    expect($el).to.exist
    expect($el.html()).contains('Hello Component')
  })
})
