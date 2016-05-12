'use strict'

const ko = require('knockout')
const { renderHtml } = require('../src')
const { expect } = require('chai')

describe('getComponentParams' , () => {
  afterEach(() => {
     ko.components.unregister('foo')
  })

  it('can access/update component params with a function viewModel', () => {
    ko.components.register('foo', {
      template: '<div data-bind="text: baz"></div>',
      viewModel(params) { this.baz = params.baz }
    })

    const $el = renderHtml({
      template: `
        <div>
          <foo params="bar: bar, baz: baz"></foo>
        </div>
      `,
      viewModel: {
        bar: 'bar',
        baz: ko.observable('baz')
      }
    })

    expect($el.find('foo')).to.exist
    expect($el.find('foo').getComponentParams().bar).to.equal('bar')
    expect($el.find('foo').getComponentParams().baz()).to.equal('baz')

    $el.find('foo').getComponentParams().baz('qux')
    expect($el.find('foo').getComponentParams().baz()).to.equal('qux')
    expect($el.find('foo').html()).contains('qux')

    ko.components.unregister('foo')
  })

  it('can access/update component params with a class viewModel', () => {
    ko.components.register('foo', {
      template: '<div data-bind="text: baz"></div>',
      viewModel: class ViewModel { constructor(params) { this.baz = params.baz } }
    })

    const $el = renderHtml({
      template: `
        <div>
          <foo params="bar: bar, baz: baz"></foo>
        </div>
      `,
      viewModel: {
        bar: 'bar',
        baz: ko.observable('baz')
      }
    })

    expect($el.find('foo')).to.exist
    expect($el.find('foo').getComponentParams().bar).to.equal('bar')
    expect($el.find('foo').getComponentParams().baz()).to.equal('baz')

    $el.find('foo').getComponentParams().baz('qux')
    expect($el.find('foo').getComponentParams().baz()).to.equal('qux')
    expect($el.find('foo').html()).contains('qux')

    ko.components.unregister('foo')
  })

  it('can access/update component params with a factory viewModel', () => {
    ko.components.register('foo', {
      template: '<div data-bind="text: baz"></div>',
      viewModel: {
        createViewModel(params) {
          class ViewModel { constructor(p) { this.baz = p.baz } }
          return new ViewModel(params)
        }
      }
    })

    const $el = renderHtml({
      template: `
        <div>
          <foo params="bar: bar, baz: baz"></foo>
        </div>
      `,
      viewModel: {
        bar: 'bar',
        baz: ko.observable('baz')
      }
    })

    expect($el.find('foo')).to.exist
    expect($el.find('foo').getComponentParams().bar).to.equal('bar')
    expect($el.find('foo').getComponentParams().baz()).to.equal('baz')

    $el.find('foo').getComponentParams().baz('qux')
    expect($el.find('foo').getComponentParams().baz()).to.equal('qux')
    expect($el.find('foo').html()).contains('qux')

    ko.components.unregister('foo')
  })

  it('can access/update component params with no viewModel', () => {
    ko.components.register('foo', {
      template: '<div data-bind="text: baz"></div>'
    })

    const $el = renderHtml({
      template: `
        <div>
          <foo params="bar: bar, baz: baz"></foo>
        </div>
      `,
      viewModel: {
        bar: 'bar',
        baz: ko.observable('baz')
      }
    })

    expect($el.find('foo')).to.exist
    expect($el.find('foo').getComponentParams().bar).to.equal('bar')
    expect($el.find('foo').getComponentParams().baz()).to.equal('baz')

    $el.find('foo').getComponentParams().baz('qux')
    expect($el.find('foo').getComponentParams().baz()).to.equal('qux')
    expect($el.find('foo').html()).contains('qux')

    ko.components.unregister('foo')
  })

  it('can\'t access/update component params with a shared instance', () => {
    ko.components.register('foo', {
      template: '<div></div>',
      viewModel: { instance: {} }
    })

    const $el = renderHtml({
      template: `
        <div>
          <foo params="bar: bar, baz: baz"></foo>
        </div>
      `,
      viewModel: {
        bar: 'bar',
        baz: ko.observable('baz')
      }
    })

    expect($el.find('foo')).to.exist
    expect($el.find('foo').getComponentParams()).to.be.undefined
  })
})
