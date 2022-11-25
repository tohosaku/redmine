import { Application } from "@hotwired/stimulus"
import ClearController from 'controllers/clear_controller'
import { assert } from 'chai'

const html = `<div data-controller="clear">
  <input id="target" type="text" value="foo" data-clear-target="clear">
  <button data-action="clear#clear">test</button>
  </div>`

suite('clear controller', () => {

  let container;

  setup(async () => {
    container = document.getElementById('container')
    const app = Application.start(container);
    await app.register('clear', ClearController);

    container.insertAdjacentHTML('afterbegin', html)
  });

  teardown(() => {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  });

  suite('click', () => {
    test('The value of input element is cleard', async () => {
      const target = container.querySelector('#target');
      const button = container.querySelector('button');
      await button.click();

      assert.equal('', target.value);
    });
  });
});
