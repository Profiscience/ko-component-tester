'use strict'

const ko = require('knockout')
const $ = require('jquery')

$.fn.simulate = function(eventName, value) {
  if (value) {
    this.val(value)
  }
  const event = window.document.createEvent('UIEvents')
  event.initEvent(eventName, true, true)
  this.get(0).dispatchEvent(event)
  ko.tasks.runEarly()
}

$.fn.waitForBinding = function(bindingName) {
  const $el = this
  const binding = ko.bindingHandlers[bindingName].init
    ? ko.bindingHandlers[bindingName].init.bind(ko.bindingHandlers[bindingName].init)
    : function() {}

  return new Promise((resolve) => {
    ko.bindingHandlers[bindingName].init = (el) => {
      if ($el.get(0) === el) {
        binding(...arguments)
        ko.tasks.schedule(() => {
          ko.bindingHandlers[bindingName].init = binding
          resolve($el)
        })
      } else {
        binding(...arguments)
      }
    }
  })
}

$.fn.waitForProperty = function(prop, val, timeout = 2000) {
  return new Promise((resolve, reject) => {
    if (matches(this.$data[prop]())) {
      return resolve(this.$data[prop]())
    }

    const timeoutId = setTimeout(() => {
      killMe.dispose()
      reject(`Timed out waiting for property ${prop}`)
    }, timeout)

    const killMe = this.$data[prop].subscribe((v) => {
      if (!matches(v)) {
        return
      }

      clearTimeout(timeoutId)
      killMe.dispose()
      ko.tasks.runEarly()
      resolve(v)
    })
  })

  function matches(v) {
    return typeof v !== 'undefined' && (typeof val === 'undefined' || (val instanceof RegExp
      ? val.test(v)
      : v === val))
  }
}

ko.components.loaders.unshift({
  loadComponent(name, component, done) {
    if (!component.viewModel) {
      class ViewModel { constructor(params) { ko.utils.extend(this, params) } }
      component.viewModel = ViewModel
    }
    done(null)
  },
  loadViewModel(name, config, done) {
    if (typeof config === 'function') {
      done((params) => {
        const viewModel = new config(params)
        viewModel._calledWith = params
        return viewModel
      }, done)
    } else if (config.createViewModel) {
      done((params, componentInfo) => {
        const viewModel = config.createViewModel(params, componentInfo)
        viewModel._calledWith = params
        return viewModel
      }, done)
    } else {
      done(null)
    }
  }
})

$.fn.getComponentParams = function() {
  return ko.contextFor(ko.virtualElements.firstChild(this.get(0))).$component._calledWith
}

function renderComponent(component, params = {}, parentCtx = {}) {
  const $el = $(`<div data-bind="component: { name: 'SUT', params: params }"></div>`)
  component.synchronous = true

  ko.components.register('SUT', component)

  $('body').html($el)
  parentCtx.params = params
  ko.applyBindings(parentCtx, $el.get(0))
  ko.tasks.runEarly()

  ko.components.unregister('SUT')

  $el.$data = $el.children().length > 0
    ? ko.dataFor($el.children().get(0))
    : ko.dataFor(ko.virtualElements.firstChild($el.get(0)))

  $el.$context = $el.children().length > 0
    ? ko.contextFor($el.children().get(0))
    : ko.contextFor(ko.virtualElements.firstChild($el.get(0)))

  return $el
}

function renderHtml({ template, viewModel = {} }) {
  let $el
  try { $el = $(template) }
  catch (e) { $el = $('<span />').text(template) }

  $('body').html($el)

  if (typeof viewModel === 'function') {
     ko.applyBindings(new viewModel(), $el.get(0))
  } else {
     ko.applyBindings(viewModel, $el.get(0))
  }

  ko.tasks.runEarly()

  $el.$data = ko.dataFor(ko.virtualElements.firstChild($el.get(0)))

  return $el
}

module.exports = { renderComponent, renderHtml }
