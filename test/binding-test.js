'use strict'

const tester = require('./ko-component-tester')
const expect = tester.expect

describe('text-binding' , () => {
  let $el

  beforeEach(() => {
    $el = tester.renderHtml({
      template: `<div data-bind="text: greeting"></div>`,
      viewModel: { greeting: 'Hello Text Binding'}
      //viewModel: function() { this.greeting = 'hello world' }
      //viewModel: class vm { constructor() { this.greeting = 'Hello World' } }
    })
  })

  it('renders', () => {
    expect($el).to.exist
  })

  it('renders text', () => {
    expect($el.html()).equals('Hello Text Binding')
  })
})
