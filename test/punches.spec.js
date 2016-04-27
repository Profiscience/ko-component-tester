'use strict'

const tester = require('../ko-component-tester.js')
const expect = tester.expect
const ko = require('knockout')
require('knockout-punches')
ko.punches.enableAll()

describe('knockout punches' , () => {
  describe('html' , () => {
    let $el
    beforeEach(() => {
      $el = tester.renderHtml({
        template: `{{greeting}}`,
        viewModel: { greeting: tester.ko.observable('Hello Text Binding')}
      })
    })
    it('renders', () => {
      expect($el).to.exist
    })
    it('renders with interpolation', () => {
      expect($el.html()).contains('Hello Text Binding')
    })
  })

  describe('components' , () => {
    let $el
    beforeEach(() => {
      $el = tester.renderComponent({
        template: `<div>{{greeting}}`,
        viewModel: function() { this.greeting = tester.ko.observable('Hello Component') }
      })
    })
    it('renders', () => {
      expect($el).to.exist
    })
    it('renders with interpolation', () => {
      expect($el.html()).contains('Hello Component')
    })
  })
})
