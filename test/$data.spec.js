'use strict'

const ko = require('knockout')
const { renderComponent } = require('../src')
const { expect } = require('chai')

describe('$.fn.$data' , () => {
  it('should be able to access viewmodel', () => {
    const x = 'x'
    const $el = renderComponent({
      template: `<span data-bind="text: greeting"></span>`,
      viewModel: function() { this.greeting = ko.observable(x) }
    })

    expect($el.html()).contains(x)
    expect($el.$data().greeting()).equals(x)
  })

  it('should be able to update viewmodel', () => {
    const x = 'x'
    const $el = renderComponent({
      template: `<span data-bind="text: greeting"></span>`,
      viewModel: function() { this.greeting = ko.observable() }
    })

    $el.$data().greeting(x)
    expect($el.$data().greeting()).equals(x)
    expect($el.html()).contains(x)
  })

})
