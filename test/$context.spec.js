'use strict'

const ko = require('knockout')
const { renderComponent } = require('../src')
const { expect } = require('chai')

describe('$context' , () => {

  it('should be able to access the parent bindingContext', () => {
    const x = 'x'
    ko.bindingHandlers.checkContext = {
      init(el, valueAccessor, allBindings, viewModel, bindingContext) {
        expect(bindingContext.$parentContext.greeting()).to.equal(x)
      }
    }
    const $el = renderComponent({
      template: `<span data-bind="text: $parent.greeting, checkContext"></span>`
    },
    {},
    {
      greeting: ko.observable(x)
    })

    expect($el.html()).contains(x)
    expect($el.$context().$parent.greeting()).to.equal(x)
  })

  it('should be able to update the parent bindingContext', () => {
    const x = 'x', y = 'y'
    ko.bindingHandlers.checkContext = {
      init(el, valueAccessor, allBindings, viewModel, bindingContext) {
        expect(bindingContext.$parentContext.greeting()).to.equal(x)
      }
    }
    const $el = renderComponent({
      template: `<span data-bind="text: $parent.greeting, checkContext"></span>`
    },
    {},
    {
      greeting: ko.observable(x)
    })

    $el.$context().$parent.greeting(y)
    expect($el.$context().$parent.greeting()).equals(y)
    expect($el.html()).contains(y)

  })

})
