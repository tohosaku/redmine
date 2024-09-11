import { toBoolean, jsonContent, URLInfo } from 'helper';
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

suite('toBoolean', () => {
  test('cast string to true', () => {
    assert.isTrue(toBoolean('true'))
    assert.isTrue(toBoolean('TRUE'))
    assert.isTrue(toBoolean('True'))
  })

  test('cast string to false', () => {
    assert.isFalse(toBoolean('false'))
    assert.isFalse(toBoolean('FALSE'))
    assert.isFalse(toBoolean('False'))
  })

  test('cast string to undefined', () => {
    assert.isUndefined(toBoolean(123))
    assert.isUndefined(toBoolean('a'))
    assert.isUndefined(toBoolean(''))
    assert.isUndefined(toBoolean(undefined))
    assert.isUndefined(toBoolean(null))
  });
})

suite('URLInfo', () => {
  test('parse URL with query string', () => {
    const url = 'https://example.com/path?foo=bar&baz=qux';
    const info = new URLInfo(url);

    assert.equal(info.protocol, 'https');
    assert.equal(info.domain, 'example.com');
    assert.equal(info.url, 'https://example.com/path');
    assert.equal(info.query.get('foo'), 'bar');
    assert.equal(info.query.get('baz'), 'qux');
  });

  test('parse URL without domain', () => {
    const url = '/path?foo=bar&baz=qux';
    const info = new URLInfo(url);

    assert.equal(info.url, '/path');
    assert.equal(info.query.get('foo'), 'bar');
    assert.equal(info.query.get('baz'), 'qux');
  });

  test('parse URL without query string', () => {
    const url = 'https://example.com/path';
    const info = new URLInfo(url);

    assert.equal(info.protocol, 'https');
    assert.equal(info.domain, 'example.com');
    assert.equal(info.url, 'https://example.com/path');
    assert.equal(Array.from(info.query.entries()).length, 0);
  });

  test('append query params', () => {
    const url = 'https://example.com/path?foo=bar';
    const info = new URLInfo(url);

    info.appendParam('foo', 'baz');

    const values = info.query.getAll('foo')
    assert.equal(values.length, 2);
    assert.equal(info.toString(), 'https://example.com/path?foo=bar&foo=baz');
  });

  test('set query params', () => {
    const url = 'https://example.com/path?foo=bar';
    const info = new URLInfo(url);

    info.setParam('foo', 'new');
    info.setParam('baz', 'qux');

    assert.equal(info.query.get('foo'), 'new');
    assert.equal(info.query.get('baz'), 'qux');
    assert.equal(info.toString(), 'https://example.com/path?foo=new&baz=qux');
  });
});
