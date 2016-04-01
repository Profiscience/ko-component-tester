'use strict'

const jsdom = require('jsdom')
const jquery = require('jquery')
const chai = require('chai')
const expect = chai.expect
//const chaiAsPromised = require('chai-as-promised')
//chai.use(chaiAsPromised)
//const chaiJquery = require('chai-jquery')

// setup fake dom for jquery
global.document = jsdom.jsdom(`<html><head></head><body></body></html>`)
global.window = global.document.defaultView
// add knockout to fake dom
const ko = global.window.ko = require('knockout')
require('knockout-punches')

// add jquery to fake dom
const $ = jquery(global.window)
// enable chai expressions
//chaiJquery(chai, chai.util, $)


// extend jquery so events can be simulated
$.fn.simulate = function(eventName, value) {
  if (value) this.val(value)
  const event = global.document.createEvent('UIEvents')
  event.initEvent(eventName, true, true)
  this[0].dispatchEvent(event)
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

function waitFor(condition, timeout) {
  function promise(resolve) {
    let resolved = false
    const interval = setInterval(() => {
        const result = (typeof condition === 'function')
          ? ko.unwrap(condition())
          : ko.unwrap(condition)
        if (result) {
          clearInterval(interval)
          ko.tasks.runEarly()
          resolved = true
          resolve()
        return
        }
    })
    setTimeout(() => {
      if (resolved) return
      clearInterval(interval)
      ko.tasks.runEarly()
      //console.log('waitfor timed out')
      resolve()
    }, timeout || 2000)

  }
  return new Promise(promise)
}

module.exports = { expect, $, ko, renderComponent, renderHtml, waitFor }
