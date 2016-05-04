'use strict'

const ko = require('knockout')
const { expect } = require('chai')
const sinon = require('sinon')
const { renderComponent } = require('../src')

class LoginComponent {
  constructor() {
    this.username = ko.observable()
    this.password = ko.observable()
  }
  submit() {}
}

describe('sample login component' , () => {
  let $el

  before(() => {
    $el = renderComponent({
      viewModel: LoginComponent,
      template: `
        <form data-bind="submit: submit">
          <input name="user" type="text" data-bind="value: username">
          <input name="pass" type="text" data-bind="value: password">
          <input type="submit">
        </form>`
    })
  })

  it('renders correctly', () => {
    expect($el).to.exist
    expect($el.find('form'), 'contains a form').to.exist
    expect($el.find('input[name="user"]', 'contains a username field')).to.exist
    expect($el.find('input[name="pass"]', 'contains a password field')).to.exist
    expect($el.find('input[type="submit"]', 'contains a submit button')).to.exist
  })

  it('updates the viewmodel when a value is changed', () => {
    $el.find('input[name=user]').simulate('change', 'john')
    expect($el.$data().username()).equals('john')
  })

  it('can submit the form', () => {
    const submitSpy = sinon.spy($el.$data().submit)
    $el.find('input[name=user]').simulate('change', 'john')
    $el.find('input[name=pass]').simulate('change', 'p455w0rd')
    $el.find('input[type="submit"]').simulate('click')

    expect(submitSpy).to.be.called
  })
})
