'use strict'

const { renderHtml } = require('../src')
const { expect } = require('chai')

describe('renderHtml' , () => {
  it('works with elements', () => {
    const $el = renderHtml({ template: '<div>Hello World!</div>' })
    expect($el).to.exist
    expect($el.html()).equals('Hello World!')
  })

  it('works with text nodes', () => {
    const $el = renderHtml({ template: 'Hello World!' })
    expect($el).to.exist
    expect($el.html()).contains('Hello World!')
  })

  it('works with viewModel object', () => {
    const $el = renderHtml({
      template: '<div data-bind="text: greeting"></div>',
      viewModel: { greeting: 'Hello Text Binding' }
    })
    expect($el).to.exist
    expect($el.html()).equals('Hello Text Binding')
  })

  it('works with viewModel function', () => {
    const $el = renderHtml({
      template: '<div data-bind="text: greeting"></div>',
      viewModel() {
        this.greeting = 'Hello Text Binding'
      }
    })
    expect($el).to.exist
    expect($el.html()).equals('Hello Text Binding')
  })

  it('works with viewModel es6 class', () => {
    const $el = renderHtml({
      template: '<div data-bind="text: greeting"></div>',
      viewModel: class ViewModel {
        constructor() {
          this.greeting = 'Hello Text Binding'
        }
      }
    })
    expect($el).to.exist
    expect($el.html()).equals('Hello Text Binding')
  })
})
