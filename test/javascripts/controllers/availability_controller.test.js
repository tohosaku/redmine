import { Application } from "@hotwired/stimulus"
import AvailabilityController from 'controllers/availability_controller'
import { assert } from 'chai'

const html = `<div data-controller="availability">
  <input id="target" type="text" value="foo" data-availability-target="field" disabled="disabled">
  <input id="checkbox" type="checkbox" data-action="availability#enableIfChecked" >
  </div>`

suite('availability controller', () => {

  let container;

  setup(async () => {
    container = document.getElementById('container')
    const app = Application.start(container);
    await app.register('availability', AvailabilityController);

    container.insertAdjacentHTML('afterbegin', html)
  });

  teardown(() => {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  });

  suite('click', () => {
    test('The field target is enabled', async () => {
      const target = container.querySelector('#target');
      const checkbox = container.querySelector('#checkbox');
      await checkbox.click();

      assert.isFalse(target.disabled, 'field is enabled');
    });
  });
});
