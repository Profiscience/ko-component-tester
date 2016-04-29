'use strict'

const ko = require('knockout')
const { renderComponent } = require('../src')
const { expect } = require('chai')

describe('waitForBinding' , () => {
  before(() => {
    ko.bindingHandlers.asyncText = {
      init(el, valueAccessor) {
        setTimeout(() => {
          ko.applyBindingsToNode(el, {
            text: valueAccessor()
          })
        }, 200)
        return { controlsDescendantBindings: true }
      }
    }

    ko.bindingHandlers.asyncVisible = {
      init(el, valueAccessor) {
        setTimeout(() => {
          ko.applyBindingsToNode(el, {
            visible: valueAccessor()
          })
        }, 200)
        return { controlsDescendantBindings: true }
      }
    }
  })

  after(() => {
    ko.options.deferUpdates = false
    ko.bindingHandlers.asyncText = (void 0)
  })

  it('works with bindings that have init funcs', (done) => {
    const $el = renderComponent({
      template: `
        <span class="ignore-me" data-bind="asyncText: greeting"></span>
        <span class="test-me" data-bind="asyncText: greeting"></span>
      `,
      viewModel: function() { this.greeting = 'Hello Component' }
    })

    const $$el = $el.find('.test-me')
    $$el.waitForBinding('text').then(() => {
      expect($$el.html()).to.contain('Hello Component')
      done()
    })
  })

  it('works with bindings that DON\'T have init funcs', (done) => {
    const $el = renderComponent({
      template: `
        <span class="test-me" data-bind="asyncVisible: visible"></span>
      `,
      viewModel: function() { this.visible = false }
    })

    const $$el = $el.find('.test-me')
    $$el.waitForBinding('visible').then(() => {
      expect($$el).to.not.be.visible
      done()
    })
  })
})
