'use strict'

const tester = require('./ko-component-tester')
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
