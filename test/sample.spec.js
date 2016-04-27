'use strict'

const tester = require('../ko-component-tester.js')
const expect = tester.expect
const ko = require('knockout')

class LoginComponent {
  constructor(params) {
    params = params || {}
    this.username = ko.observable()
    this.password = ko.observable()
    this.onSubmit = params.onSubmit || function() {}
  }
  submit() {
    this.onSubmit({
        username: this.username(),
        password: this.password()
    })
  }
}
let credentials
const params = {
  onSubmit : (creds) => {
    credentials = creds
  }
}
const viewModel = new LoginComponent(params)

describe('sample login component' , () => {
  let $el

  before(() => {
    $el = tester.renderComponent({
      viewModel: { instance: viewModel },
      template: `
        <form data-bind="submit: submit">
          <input name="user" type="text" data-bind="value: username">
          <input name="pass" type="text" data-bind="value: password">
          <input type="submit">
        </form>`
    })
  })

  it('renders', () => {
    expect($el).to.exist
  })
  it('has a form', () => {
    expect($el.find('form')).to.exist
  })
  it('has a username field', () => {
    expect($el.find('input[name="user"]')).to.exist
  })
  it('has a password field', () => {
    expect($el.find('input[name="pass"]')).to.exist
  })
  it('has a submit button', () => {
    expect($el.find('input[type="submit"]')).to.exist
  })

  describe('entering a username', () => {
    before(() => {
      $el.find('input[name=user]').simulate('change', 'john')
    })
    it('updates viewModel', () => {
      expect(viewModel.username()).equals('john')
    })
  })

  describe('submitting form', () => {
    before( () => {
      $el.find('input[name=user]').simulate('change', 'john')
      $el.find('input[name=pass]').simulate('change', 'p455w0rd')
      $el.find('input[type="submit"]').simulate('click')
    })
    it('calls params.onSubmit() with credentials', () => {
      expect(credentials).to.eql({
          username: 'john',
          password: 'p455w0rd'
      })
    })
  })
})
