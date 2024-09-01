import { toBoolean } from 'dom';
import { assert } from 'chai';

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
