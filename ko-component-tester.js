'use strict'

const ko = require('knockout')
const $ = require('jquery')

$.fn.simulate = function(eventName, value) {
  if (value) {
    this.val(value)
  }
  const event = global.document.createEvent('UIEvents')
  event.initEvent(eventName, true, true)
  this.get(0).dispatchEvent(event)
  ko.tasks.runEarly()
}

$.fn.waitForBindings = function(timeout = 2000) {
  return new Promise((resolve, reject) => {
    const $el = this
    const intervalId = setInterval(checkForBindings)
    const timeoutId = setTimeout(abort, timeout)

    function abort() {
      clearInterval(intervalId)
      reject('Timed out waiting for bindings')
    }

    function checkForBindings() {
      ko.tasks.runEarly()
      if (ko.contextFor($el.get(0))) {
        clearTimeout(timeoutId)
        clearInterval(intervalId)
        resolve($el)
      }
    }
  })
}

$.fn.waitForProperty = function(prop, val, timeout = 2000) {
  return new Promise((resolve, reject) => {
    if (typeof val !== 'undefined' && this.$data[prop]() === val) {
      resolve(val)
    }

    const timeoutId = setTimeout(() => {
      killMe.dispose()
      reject(`Timed out waiting for property ${prop}`)
    }, timeout)

    const killMe = this.$data[prop].subscribe((v) => {
      if ((val && v !== val) || typeof v === 'undefined') {
        return
      }

      clearTimeout(timeoutId)
      killMe.dispose()
      ko.tasks.runEarly()
      resolve(v)
    })
  })
}

$.fn.getComponentParams = function() {
  return ko.contextFor(ko.virtualElements.firstChild(this.get(0))).$component.params
}

function renderComponent(component, params = {}) {
  const $el = $(`<div data-bind="component: { name: 'SUT', params: params }"></div>`)
  component.synchronous = true

  if (ko.components.isRegistered('SUT')) { ko.components.unregister('SUT') }
  ko.components.register('SUT', component)

  $('body').html($el)
  ko.applyBindings({ params }, $el.get(0))
  ko.tasks.runEarly()

  ko.components.unregister('SUT')

  $el.$data = ko.dataFor(ko.virtualElements.firstChild($el.get(0)))
  return $el
}

function renderHtml(opts) {
  opts.template = opts.template || ''
  opts.viewModel = opts.viewModel || {}
  let $el
  try { $el = $(opts.template) }
  catch (e) { $el = $(`<span>${opts.template}</span>`) }
  $('body').html($el)

  if (typeof opts.viewModel === 'function') {
     ko.applyBindings(new opts.viewModel(), $el.get(0))
  } else {
     ko.applyBindings(opts.viewModel, $el.get(0))
  }

  ko.tasks.runEarly()
  $el.$data = ko.dataFor($el.get(0))
  return $el
}

module.exports = { renderComponent, renderHtml }
