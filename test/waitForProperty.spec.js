'use strict'

const ko = require('knockout')
const sinon = require('sinon')
const { renderComponent } = require('../src')
const { expect } = require('chai')

describe('waitForProperty' , function() { // eslint-disable-line
  let $el

  afterEach(() => {
    $el.dispose()
  })

  it('waits for property to be defined when no value specified', (done) => {
    $el = renderComponent({
      template: '<span></span>',
      viewModel() {
        this.greeting = ko.observable()
        setTimeout(() => this.greeting('Hello, World!'), 200)
      }
    })

    $el.waitForProperty('greeting').then((v) => {
      expect(v).to.equal('Hello, World!')
      expect($el.$data().greeting()).to.equal('Hello, World!')
      done()
    })
  })

  it('waits for property to be equal value specified', (done) => {
    $el = renderComponent({
      template: '<span></span>',
      viewModel() {
        this.greeting = ko.observable('Hello, World"')
        setTimeout(() => this.greeting('Good afternoon, World!'), 100)
        setTimeout(() => this.greeting('Goodbye, World!'), 200)
      }
    })

    $el.waitForProperty('greeting', 'Goodbye, World!').then((v) => {
      expect(v).to.equal('Goodbye, World!')
      expect($el.$data().greeting()).to.equal('Goodbye, World!')
      done()
    })
  })

  it('waits for property to match regex specified', (done) => {
    $el = renderComponent({
      template: '<span></span>',
      viewModel() {
        this.greeting = ko.observable('Hello, World"')
        setTimeout(() => this.greeting('Good afternoon, World!'), 100)
        setTimeout(() => this.greeting('Goodbye, World!'), 200)
      }
    })

    $el.waitForProperty('greeting', /bye/i).then((v) => {
      expect(v).to.equal('Goodbye, World!')
      expect($el.$data().greeting()).to.equal('Goodbye, World!')
      done()
    })
  })

  it('resolves immediately if not undefined and no value specified', (done) => {
    $el = renderComponent({
      template: '<span></span>',
      viewModel() {
        this.greeting = ko.observable('Hello, World!')
      }
    })

    $el.waitForProperty('greeting').then((v) => {
      expect(v).to.equal('Hello, World!')
      expect($el.$data().greeting()).to.equal('Hello, World!')
      done()
    })
  })

  it('resolves immediately if already equal to value specified', (done) => {
    $el = renderComponent({
      template: '<span></span>',
      viewModel() {
        this.greeting = ko.observable('Hello, World!')
      }
    })

    $el.waitForProperty('greeting', 'Hello, World!').then((v) => {
      expect(v).to.equal('Hello, World!')
      expect($el.$data().greeting()).to.equal('Hello, World!')
      done()
    })
  })

  it('resolves immediately if already matches regex specified', (done) => {
    $el = renderComponent({
      template: '<span></span>',
      viewModel() {
        this.greeting = ko.observable('Hello, World!')
      }
    })

    $el.waitForProperty('greeting', 'Hello, World!').then((v) => {
      expect(v).to.equal('Hello, World!')
      expect($el.$data().greeting()).to.equal('Hello, World!')
      done()
    })
  })

  it('times out after 2000ms by default', (done) => {
    const clock = sinon.useFakeTimers()

    $el = renderComponent({
      template: '<span></span>',
      viewModel() {
        this.greeting = ko.observable()
      }
    })

    $el.waitForProperty('greeting').catch((err) => {
      expect(err).to.contain('Timed out')
      clock.restore()
      done()
    })

    clock.tick(3000)
  })

  it('can set a custom timeout', (done) => {
    const clock = sinon.useFakeTimers()

    $el = renderComponent({
      template: '<span></span>',
      viewModel() {
        this.greeting = ko.observable()
      }
    })

    $el.waitForProperty('greeting', undefined, 500).catch((err) => {
      expect(err).to.contain('Timed out')
      clock.restore()
      done()
    })

    clock.tick(1000)
  })
})
