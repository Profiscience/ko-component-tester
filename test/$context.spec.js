'use strict'

const ko = require('knockout')
const { renderComponent } = require('../src')
const { expect } = require('chai')

describe('$context' , () => {

  it('should be able to access the bindingContext', () => {
    const foo = 'foo'
    ko.bindingHandlers.checkContext = {
      init(el, valueAccessor, allBindings, viewModel, bindingContext) {
        expect(bindingContext.greeting()).to.equal(foo)
      }
    }
    const $el = renderComponent({
      template: '<span data-bind="text: greeting, checkContext"></span>'
    },
    {},
    {
      greeting: ko.observable(foo)
    })

    expect($el.html()).to.contain(foo)
    expect($el.$context().greeting()).to.equal(foo)
  })

  it('should be able to update the bindingContext', () => {
    let v = 'foo'
    ko.bindingHandlers.checkContext = {
      update(el, valueAccessor, allBindings, viewModel, bindingContext) {
        expect(bindingContext.greeting()).to.equal(v)
      }
    }
    const $el = renderComponent({
      template: '<span data-bind="text: greeting, checkContext"></span>'
    },
    {},
    {
      greeting: ko.observable(v)
    })

    v = 'bar'

    $el.$context().greeting(v)
    ko.tasks.runEarly()
    expect($el.html()).to.contain(v)
  })
})
