import { assert } from 'chai';
import { makeActionQueue } from 'controllers/attachment_controller'

suite('action queue', () => {
  test('returns undefined if queue is empty', () => {
    const queue = makeActionQueue();
    assert.isUndefined(queue.dequeue())
    assert.isTrue(queue.isEmpty)
  });

  test('dequeue to return the result of function execution', () => {
    const queue = makeActionQueue();
    queue.enqueue(() => 'test')
    assert.equal(queue.dequeue(), 'test')
  });

  test('After all values are output, returns "undefined"', () => {
    const queue = makeActionQueue();
    queue.enqueue(() => 1)
    queue.enqueue(() => 2)
    queue.enqueue(() => 3)
    assert.equal(queue.dequeue(), 1)
    assert.equal(queue.dequeue(), 2)
    assert.equal(queue.dequeue(), 3)
    assert.isUndefined(queue.dequeue())
  });
})
