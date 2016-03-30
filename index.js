const jsdom = require('jsdom')
const jquery = require('jquery')
const chai = require('chai')
const expect = chai.expect
const chaiJquery = require('chai-jquery')

// setup fake dom for jquery
global.document = jsdom.jsdom(`<html><head></head><body></body></html>`)
global.window = global.document.defaultView
// add knockout to fake dom
const ko = require('knockout')
// add jquery to fake dom
const $ = jquery(global.window)
// enable chai expressions
chaiJquery(chai, chai.util, $)
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
  const $el = $(opts.template)
  $('body').html($el)
  if (typeof opts.viewModel === 'function')
    ko.applyBindings(new opts.viewModel(), $el[0])
  else
    ko.applyBindings(opts.viewModel, $el[0])
  return $el
}

module.exports = { expect, $, renderComponent, renderHtml }
