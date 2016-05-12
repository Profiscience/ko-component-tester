# ko-component-tester

[![NPM](https://img.shields.io/npm/v/ko-component-tester.svg)](https://www.npmjs.com/package/ko-component-tester)
![WTFPL](https://img.shields.io/npm/l/ko-component-tester.svg)
[![Travis](https://img.shields.io/travis/Profiscience/ko-component-tester.svg)](https://travis-ci.org/Profiscience/ko-component-tester)
[![Coverage Status](https://coveralls.io/repos/github/Profiscience/ko-component-tester/badge.svg?branch=nix-codeclimate)](https://coveralls.io/github/Profiscience/ko-component-tester?branch=nix-codeclimate)
[![Dependency Status](https://img.shields.io/david/Profiscience/ko-component-tester.svg)](https://david-dm.org/Profiscience/ko-component-tester)
[![Peer Dependency Status](https://img.shields.io/david/peer/Profiscience/ko-component-tester.svg?maxAge=2592000)](https://david-dm.org/Profiscience/ko-component-tester#info=peerDependencies&view=table)
[![NPM Downloads](https://img.shields.io/npm/dt/ko-component-tester.svg?maxAge=2592000)](http://npm-stat.com/charts.html?package=ko-component-tester&author=&from=&to=)

_TDD Helpers for Knockout components and bindings_

#### Sample tests for a Knockout binding

```javascript
'use strict'

const { renderHtml } = require('ko-component-tester')
const { expect } = require('chai')

describe ('Hello World text-binding', () => {
  let $el
  beforeEach(() => {
    $el = renderHtml({
      template: `<div data-bind="text: greeting"></div>`,
      viewModel: { greeting: 'Hello World'}
      })
  })
  it('renders', () => {
    expect($el).to.exist
  })
  it('renders correct text', () => {
    expect($el.html()).equals('Hello World')
  })
})
```

#### Sample tests for a Knockout component

```javascript
'use strict'

const { renderComponent } = require('ko-component-tester')
const { expect } = require('chai')

describe('Hello World Component' , () => {
  let $el
  beforeEach(() => {
    $el = renderComponent({
      template: `<span data-bind="text: greeting"></span>`,
      viewModel: function() { this.greeting = 'Hello World' }
    })
  })
  afterEach(() => {
    $el.dispose()
  })
  it('renders', () => {
    expect($el).to.exist
  })
  it('renders correct content', () => {
    expect($el.html()).contains('Hello World')
  })
})
```

#### Sample Login test

```javascript
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

  after(() => {
    $el.dispose()
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

```

#### renderHtml(options)

returns a jQuery element containing the rendered html output

- `options.template` - a string of html to be rendered
- `options.viewModel` - an object, function, or class

Example with viewModel function:

```javascript
const options = {
  template: `<div data-bind="text: greeting"></div>`,
  viewModel: function() { this.greeting = 'Hello Text Binding' }
}
const $el = renderHtml(options)
```

Example with viewModel class:

```javascript
const options = {
  template: `<div data-bind="text: greeting"></div>`,
  viewModel: class ViewModel {
    constructor() {
      this.greeting = 'Hello Text Binding'
    }
  }
}
const $el = renderHtml(options)
```

Example with viewModel object:

```javascript
const options = {
  template: `<div data-bind="text: greeting"></div>`,
  viewModel: { greeting: 'Hello Text Binding' }
}
const $el = renderHtml(options)
```
[See spec for more examples of renderHtml().](test/renderHtml.spec.js)


#### renderComponent(component, params, bindingContext)

returns a jQuery element containing the rendered html output

- `component.template` - a string of html to be rendered
- `component.viewModel` - a function, class, or instance
- `params` - optional params to be passed into the viewModel's constructor
- `bindingContext` - optional bindingContext to inject (useful for stubbing `$parent` or `$index`)

Example with viewModel function:

```javascript
const component = {
  template: `<div data-bind="text: greeting"></div>`,
  viewModel: function() { this.greeting = 'Hello Text Binding' }
}
const $el = renderComponent(component)
// $el.dispose()
```

Example with viewModel class:

```javascript
const component = {
  template: `<div data-bind="text: greeting"></div>`,
  viewModel: class ViewModel {
    constructor(params) {
      this.greeting = params.greeting
    }
  }
}
const params = {
  greeting: 'Hello Text Binding'
}
const $el = renderComponent(component, params)
// $el.dispose()
```

Example with viewModel instance:

```javascript
class ViewModel {
  constructor(params) {
    this.greeting = params.greeting
  }
}
const component = {
  template: `<div data-bind="text: greeting"></div>`,
  viewModel: { instance: new ViewModel(params) }
}
const $el = renderComponent(component)
// $el.dispose()
```

[See spec for more examples of renderComponent().](test/renderComponent.spec.js)

#### $el.getComponentParams()

[see spec for examples](test/getComponentParams.spec.js)

#### $el.waitForBinding()

[see spec for examples](test/waitForBinding.spec.js)

#### $el.waitForProperty()

[see spec for examples](test/waitForProperty.spec.js)

#### $el.simulate(event, value)

- `event` - the event to simulate, eg `'click', or 'change'`
- `value` - if provided this value will be assigned.  It's handy for assigning a value to a textbox and triggering a `change` event like this.

```javascript
// simulate changing the value of a textbox
$input.simulate('change', 'new value')
// simulate clicking a button
$submit.simulate('click')
```

#### Attribution

https://github.com/jeremija/kotest
