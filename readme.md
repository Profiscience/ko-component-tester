# ko-component-tester

- Automated testing of Knockout components and bindings
- Uses jsdom instead of a headless browser (better performance)
- Uses chai expect

#### Simple text binding tests

```javascript
'use strict'

const tester = require('ko-component-tester')
const expect = tester.expect

describe('text-binding' , () => {
  let $el
  beforeEach(() => {
    $el = tester.renderHtml({
      template: `<div data-bind="text: greeting"></div>`,
      viewModel: { greeting: 'Hello Text Binding'}
      })
  })
  it('renders', () => {
    expect($el).to.exist
  })
  it('renders text', () => {
    expect($el.html()).equals('Hello Text Binding')
  })
})
```

### Simple component tests

```javascript
'use strict'

const tester = require('ko-component-tester')
const expect = tester.expect

describe('component binding' , () => {
  let $el
  beforeEach(() => {
    $el = tester.renderComponent({
      template: `<span data-bind="text: greeting"></span>`,
      viewModel: function() { this.greeting = 'Hello Component' }
      //viewModel: class vm { constructor() { this.greeting = 'Hello World' } }
    })
  })
  it('renders', () => {
    expect($el).to.exist
  })
  it('renders content', () => {
    expect($el.html()).contains('Hello Component')
  })
})
```

### Advanced component tests

```javascript
'use strict'

const tester = require('ko-component-tester')
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

#### renderComponent(options, params)

returns a jQuery element containing the rendered html output

- `options.template` - a string of html to be rendered
- `options.viewModel` - a function, class, or instance
- `params` - optional params to be passed into the viewModel's constructor

Example with viewModel function:

```javascript
const options = {
  template: `<div data-bind="text: greeting"></div>`,
  viewModel: function() { this.greeting = 'Hello Text Binding' }
}
const $el = renderComponent(options)
```

Example with viewModel class:

```javascript
const options = {
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
const $el = renderComponent(options, params)
```

Example with viewModel instance:

```javascript
class ViewModel {
  constructor(params) {
    this.greeting = params.greeting
  }
}
const options = {
  template: `<div data-bind="text: greeting"></div>`,
  viewModel: { instance: new ViewModel(params) }
}
const $el = renderComponent(options)
```


- tester.expect
- $el.simulate
- $el.chai

#### Attribution

https://github.com/jeremija/kotest
