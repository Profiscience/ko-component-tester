'use strict'

const $ = require('jquery')
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.should()
chai.use(chaiAsPromised)

const ko = require('knockout')
require('knockout-punches')
ko.punches.enableAll()

// enable chai expressions
const chaiJquery = require('chai-jquery')
chaiJquery(chai, chai.util, $)

// extend jquery so events can be simulated
$.fn.simulate = function(eventName, value) {
  if (value) this.val(value)
  const event = global.document.createEvent('UIEvents')
  event.initEvent(eventName, true, true)
  this[0].dispatchEvent(event)
  ko.tasks.runEarly()
}

function renderComponent(component, params) {
  params = params || {}
  component.synchronous = true
  if (ko.components.isRegistered('component'))
    ko.components.unregister('component')
  ko.components.register('component', component)
  const $el = $(`<div data-bind="component: { name: 'component', params: params }"></div>`)
  $('body').html($el)
  ko.applyBindings({ params }, $el[0])
  ko.components.unregister('component')
  return $el
}

function renderHtml(opts) {
  opts.template = opts.template || ''
  opts.viewModel = opts.viewModel || {}
  let $el
  try { $el = $(opts.template) }
  catch (e) { $el = $(`<span>${opts.template}</span>`) }
  $('body').html($el)
  if (typeof opts.viewModel === 'function')
     ko.applyBindings(new opts.viewModel(), $el[0])
  else
     ko.applyBindings(opts.viewModel, $el[0])
  return $el
}

function waitFor(func, timeout) {
  if (typeof func !== 'function') throw new Error('first param of waitFor must be a function')

  function promise(resolve, reject) {
    let timeoutId = null, intervalId = null, resolved = false

    function onTimeout() {
      clearInterval(intervalId)
      if (resolved) return
      reject(new Error('waitFor timed out'))
    }

    function onInterval() {
      const result = ko.unwrap(func())
      if (typeof result !== 'undefined' && (!result.length || result.length > 0))
      {
        resolved = true
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        ko.tasks.runEarly()
        resolve(result)
      }
    }

    timeoutId = setTimeout(onTimeout, timeout || 2000)
    intervalId = setInterval(onInterval)
  }
  return new Promise(promise)
}

module.exports = { expect, $, ko, renderComponent, renderHtml, waitFor }
