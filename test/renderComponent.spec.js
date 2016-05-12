'use strict'

const { renderComponent } = require('../src')
const { expect } = require('chai')
const sinon = require('sinon')

describe('renderComponent' , () => {
  let $el

  afterEach(() => {
    $el.dispose()
  })

  it('works with elements', () => {
    $el = renderComponent({
      template: '<span data-bind="text: greeting"></span>',
      viewModel() { this.greeting = 'Hello Component' }
    })

    expect($el).to.exist
    expect($el.html()).contains('Hello Component')
  })

  it('works with text nodes', () => {
    $el = renderComponent({
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

    $el = renderComponent({
      template: `
        Hello Component
      `
    })

    expect($el).to.exist
    expect($el.html()).contains('Hello Component')
  })
})

describe('renderComponent', () => {
  describe('#dispose', () => {
    const dispose = sinon.spy()

    it('calls the dispose callback', () => {
      const $el = renderComponent({
        template: '<span></span>',
        viewModel() { this.dispose = dispose }
      })

      $el.dispose()
      expect(dispose.called).to.be.true
    })

  })
})
