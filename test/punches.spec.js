'use strict'

const ko = require('knockout')
const { expect } = require('chai')
const { renderComponent, renderHtml } = require('../ko-component-tester.js')

require('knockout-punches')
ko.punches.enableAll()

describe('punches' , () => {
  describe('html' , () => {
    let $el

    before(() => {
      $el = renderHtml({
        template: `{{greeting}}`,
        viewModel: { greeting: ko.observable('Hello Text Binding')}
      })
    })

    it('renders correctly', () => {
      expect($el).to.exist
      expect($el.html()).contains('Hello Text Binding')
    })
  })

  describe('components' , () => {
    let $el

    before(() => {
      $el = renderComponent({
        template: `<div>{{greeting}}`,
        viewModel: function() { this.greeting = ko.observable('Hello Component') }
      })
    })

    it('renders correctly', () => {
      expect($el).to.exist
      expect($el.html()).contains('Hello Component')
    })
  })
})
