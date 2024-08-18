import { toBoolean, jsonContent } from 'helper';
import { assert } from 'chai';

suite('jsonContent', () => {

  let container;
  let html;

  setup(() => {
    html = '<template id="template1">{"a": "apple"}</template><script id="json1" type="application/json">{"b": "banana"}</script>'
    container = document.getElementById('container')
    container.insertAdjacentHTML('afterbegin', html)
  })

  teardown(() => {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  })

  test('element is not found', () => {
    assert.throws(() => jsonContent('notfound'), /Element #notfound is not found/)
  })

  test('tagname of element is not "SCRIPT"', () => {
    assert.throws(() => jsonContent('template1'), /Element #template1 should be script element/)
  })

  test('element has json content', () => {
    const obj = jsonContent('json1')
    assert.equal(obj['b'], 'banana')
  })
})
