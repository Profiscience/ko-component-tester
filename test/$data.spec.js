'use strict'

const ko = require('knockout')
const { renderComponent } = require('../src')
const { expect } = require('chai')

describe('$.fn.$data' , () => {
  let $el

  afterEach(() => {
    $el.dispose()
  })

  it('should be able to access viewmodel', () => {
    const x = 'x'

    $el = renderComponent({
      template: '<span data-bind="text: greeting"></span>',
      viewModel() { this.greeting = ko.observable(x) }
    })

    expect($el.html()).to.contain(x)
    expect($el.$data().greeting()).to.equal(x)
  })

  it('should be able to update viewmodel', () => {
    const x = 'x'

    $el = renderComponent({
      template: '<span data-bind="text: greeting"></span>',
      viewModel() { this.greeting = ko.observable() }
    })

    $el.$data().greeting(x)
    expect($el.$data().greeting()).to.equal(x)
    expect($el.html()).to.contain(x)
  })

})
